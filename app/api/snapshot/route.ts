import { NextResponse } from 'next/server';
import { serverListDocuments, serverCreateDocument, serverUpdateDocument, Query } from '../../../lib/appwrite';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const GOOGLE_BROWSER_KEY = process.env.GOOGLE_PLACES_BROWSER_KEY || GOOGLE_API_KEY;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

const SEARCH_QUERIES = [
  'Kota spot Johannesburg',
  'Kota spot Soweto',
  'Kota spot Soshanguve',
  'Kota spot Pretoria',
  'Kota street food Gauteng',
  'Sphatlo spot Pretoria',
  'Spatlo food Soshanguve',
  'Sphatlo Mamelodi',
  'Kota spot Tembisa',
  'Kota spot Alexandra Johannesburg',
  'Kota spot Vosloorus',
  'Kota spot Katlehong',
  'Bunny Chow Durban',
  'Bunny Chow Johannesburg',
  'Bunny Chow Cape Town',
  'Bunny Chow restaurant KwaZulu-Natal',
  'Bunny Chow Pietermaritzburg',
];

// Blocklist: Google Place IDs for non-food places that matched our queries
const BLOCKED_PLACE_IDS = new Set([
  'ChIJHbey9tYJlR4R6f85miEssiM', // SOWETO TOWERS
  'ChIJ46Fx206nlR4RyE6JsVNiNOg', // Hector Pieterson Memorial
  'ChIJtw3EHtGmlR4RNmGYqk8QMUQ', // Credo Mutwa Cultural Village
]);

// Auto-reject: names containing these keywords are not food spots
const REJECT_KEYWORDS = [
  'memorial', 'museum', 'library', 'church', 'school', 'college',
  'university', 'hospital', 'clinic', 'police', 'court', 'mall',
  'shopping centre', 'shopping center', 'petrol', 'garage', 'hotel',
  'guest house', 'lodge', 'resort', 'park', 'garden', 'village',
  'tower', 'stadium', 'gym', 'fitness',
];

function isBlockedPlace(placeId: string, placeName: string): boolean {
  if (BLOCKED_PLACE_IDS.has(placeId)) return true;
  const lower = placeName.toLowerCase();
  return REJECT_KEYWORDS.some((kw) => lower.includes(kw));
}

// Only request the fields we actually store - keeps costs low
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.location',
  'places.nationalPhoneNumber',
  'places.currentOpeningHours',
  'places.photos',
].join(',');

interface GooglePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

interface GooglePlace {
  id: string;
  displayName: { text: string };
  rating: number;
  userRatingCount: number;
  location: { latitude: number; longitude: number };
  formattedAddress: string;
  nationalPhoneNumber?: string;
  currentOpeningHours?: {
    weekdayDescriptions?: string[];
  };
  photos?: GooglePhoto[];
}

interface GooglePlacesResponse {
  places?: GooglePlace[];
}

function buildPhotoUrl(photoName: string, maxWidth = 800): string {
  // Use browser key in photo URLs since these are loaded client-side
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_BROWSER_KEY}`;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not set' }, { status: 500 });
  }
  if (!APPWRITE_API_KEY) {
    return NextResponse.json({ error: 'APPWRITE_API_KEY not set' }, { status: 500 });
  }

  let created = 0;
  let updated = 0;
  let filtered = 0;

  for (const query of SEARCH_QUERIES) {
    try {
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify({ textQuery: query }),
      });

      const data: GooglePlacesResponse = await res.json();
      const places = data.places || [];

      for (const place of places) {
        // Auto-reject non-food places
        if (isBlockedPlace(place.id, place.displayName.text)) {
          filtered++;
          continue;
        }

        // Double-Gate Filter: 4+ stars AND 10+ reviews
        if (!place.rating || place.rating < 4.0 || !place.userRatingCount || place.userRatingCount < 10) {
          filtered++;
          continue;
        }

        const category = query.toLowerCase().includes('bunny') ? 'bunny-chow' : 'kota';

        // Build photo URLs (max 5)
        const photos = (place.photos || [])
          .slice(0, 5)
          .map((p) => buildPhotoUrl(p.name));

        // Opening hours as JSON string
        const hours = place.currentOpeningHours?.weekdayDescriptions || [];

        const vendorData = {
          name: place.displayName.text,
          address: place.formattedAddress,
          category,
          source: 'google',
          google_id: place.id,
          rating: place.rating,
          review_count: place.userRatingCount,
          is_vetted: true,
          upvote_count: 0,
          phone: place.nationalPhoneNumber || '',
          hours: JSON.stringify(hours),
          photos: JSON.stringify(photos),
          latitude: place.location?.latitude || 0,
          longitude: place.location?.longitude || 0,
          last_synced: new Date().toISOString(),
        };

        // Check if google_id already exists (upsert)
        const existing = await serverListDocuments(APPWRITE_API_KEY, 'vendors', [
          Query.equal('google_id', place.id),
        ]);

        if (existing.documents && existing.documents.length > 0) {
          // Update: refresh rating, review count, photos, hours, phone
          const { source, google_id, upvote_count, ...updateData } = vendorData;
          void source; void google_id; void upvote_count;
          await serverUpdateDocument(APPWRITE_API_KEY, 'vendors', existing.documents[0].$id, updateData);
          updated++;
        } else {
          await serverCreateDocument(APPWRITE_API_KEY, 'vendors', vendorData);
          created++;
        }
      }
    } catch (err) {
      console.error(`Snapshot error for query "${query}":`, err);
    }
  }

  return NextResponse.json({
    success: true,
    summary: { created, updated, filtered },
    timestamp: new Date().toISOString(),
  });
}
