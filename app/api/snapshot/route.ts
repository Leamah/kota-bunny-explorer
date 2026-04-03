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
  'ChIJw5sXinsOlR4Rn3XUe5j-e7I', // Kota Zone (not a food place)
  'ChIJ-Rz1KtBllR4RQMhVIss_lJw', // Kota Zone (Pretoria duplicate)
  'ChIJg1uLgaoOlR4RVBhDdmrNs20', // Bay Leaf Restaurant
  'ChIJJcctUaoOlR4R1zV-O4TT1pg', // Dosa Hut
  'ChIJURl--qoOlR4RrtKXFUOSxSg', // World of Samoosas
  'ChIJZ9wgozINlR4Rh2bpvjdlr5s', // Ozzy's Kitchen
  'ChIJAzB5VpMNlR4RWiysADMMJM8', // Chowz Rosebank
  'ChIJ845oJAMNlR4RMRTPZO3nCnE', // MY Diners Rosebank
  'ChIJ6xtFIWQLlR4RChCOo8m-oDA', // Spiceburg
  'ChIJ-zMEA6sOlR4RSdXy2bstzaM', // Bismillah Restaurant-B1
  'ChIJNa_uZWNnzB0RVv-g5Wj6Xo4', // Eastern Food Bazaar
  'ChIJrdkWnWVnzB0RuMcoY0WJfYU', // Food Inn India Long Street
  'ChIJ6Ymq5B5dzB0RCSiWWsfhq8w', // Sunrise Chip N Ranch
  'ChIJ45x7iW9nzB0RISAfgVl5Blk', // Maharajah Indian Restaurant
  'ChIJoQyUgCldzB0RPT4WAqeyWYI', // Shamani Indian Cuisine
  'ChIJQyvixWZnzB0RXB9053Z-jFc', // The Village Idiot
  'ChIJr1rgXlZDzB0Rl4sAU2qbLX8', // The Chilli Bar
  'ChIJ610K8tJCzB0R5gqlFshWR8E', // Bihari
  'ChIJpXE6LhdpzB0RxEVLB4-7WzA', // Indian Oven
  'ChIJ-WD7IjEH9x4RyrGW825DcPY', // Glamwich
  'ChIJFc1bMUQNlR4RKNvAsTdhZqQ', // Modern Tailors
  'ChIJ_a6VcmomaAERQc6kG7fToLc', // Al-Hamra Restaurants
  'ChIJBwwwkE3ytAERbCDFuRnioOA', // Vintage India
  'ChIJUWGkBINnzB0Rjb6oo_xifjQ', // Curry Club
  'ChIJs1p8CpS79h4RYDfrtnLH68o', // AGNI Indian Cuisine
  'ChIJxfeQKPW89h4RuPIJiaso2Js', // Tandoor Clay Oven
  'ChIJZcyOdYm89h4RU-_GGU_aIgw', // Coconut Grove Restaurant
  'ChIJLSLGN1G89h4RHD1LUzr0X5Y', // Kara Nicchas Scottsville
  'ChIJS6yGf9S99h4RAbrF-hcKj0k', // Willowton Palace
  'ChIJx314kEi79h4RGVm16o603Fg', // Roshnies Diner
  'ChIJJV9rPbS99h4R-SL-kJ6wiVs', // THE CURRY POT
  'ChIJb_-v9pG79h4RkBEZXqLQ-Oc', // Kara Nicchas Raisethorpe
  'ChIJ0Uw5lJe89h4RdVKqKsbL0R8', // Kara Nicchas Victoria Rd
  'ChIJ8T6riIG99h4RgAPH48A_3eI', // Budz & Bunnies
]);

// Auto-reject: names containing these keywords are not food spots
const REJECT_KEYWORDS = [
  'memorial', 'museum', 'library', 'church', 'school', 'college',
  'university', 'hospital', 'clinic', 'police', 'court', 'mall',
  'shopping centre', 'shopping center', 'petrol', 'garage', 'hotel',
  'guest house', 'lodge', 'resort', 'park', 'garden', 'village',
  'tower', 'stadium', 'gym', 'fitness',
  'hollywoodbets', 'betting', 'casino', 'samoosa', 'dosa',
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
  'places.priceLevel',
].join(',');

// Google price levels to display strings
function mapPriceLevel(level?: string): string {
  switch (level) {
    case 'PRICE_LEVEL_FREE': return 'Free';
    case 'PRICE_LEVEL_INEXPENSIVE': return 'R';
    case 'PRICE_LEVEL_MODERATE': return 'RR';
    case 'PRICE_LEVEL_EXPENSIVE': return 'RRR';
    case 'PRICE_LEVEL_VERY_EXPENSIVE': return 'RRRR';
    default: return '';
  }
}

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
  priceLevel?: string;
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
  let hidden = 0;

  // Track which google_ids we saw this sync (for demotion check)
  const seenGoogleIds = new Set<string>();

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

        // Track all Google IDs we encounter (even filtered ones for demotion)
        seenGoogleIds.add(place.id);

        // Double-Gate Filter: 4+ stars AND 10+ reviews
        if (!place.rating || place.rating < 4.0 || !place.userRatingCount || place.userRatingCount < 10) {
          // Check if this place was previously in our DB - if so, hide it
          const existing = await serverListDocuments(APPWRITE_API_KEY, 'vendors', [
            Query.equal('google_id', place.id),
          ]);
          if (existing.documents && existing.documents.length > 0 && existing.documents[0].is_vetted) {
            await serverUpdateDocument(APPWRITE_API_KEY, 'vendors', existing.documents[0].$id, {
              is_vetted: false,
              last_synced: new Date().toISOString(),
            });
            hidden++;
          }
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

        // Check if google_id already exists (upsert)
        const existing = await serverListDocuments(APPWRITE_API_KEY, 'vendors', [
          Query.equal('google_id', place.id),
        ]);

        if (existing.documents && existing.documents.length > 0) {
          const doc = existing.documents[0];

          // Build update data - always refresh these fields
          const updateData: Record<string, unknown> = {
            name: place.displayName.text,
            address: place.formattedAddress,
            category,
            rating: place.rating,
            review_count: place.userRatingCount,
            is_vetted: true,
            phone: place.nationalPhoneNumber || '',
            hours: JSON.stringify(hours),
            price_range: mapPriceLevel(place.priceLevel),
            latitude: place.location?.latitude || 0,
            longitude: place.location?.longitude || 0,
            last_synced: new Date().toISOString(),
          };

          // Only update photos if images_locked is NOT true
          if (!doc.images_locked) {
            updateData.photos = JSON.stringify(photos);
          }

          await serverUpdateDocument(APPWRITE_API_KEY, 'vendors', doc.$id, updateData);
          updated++;
        } else {
          // Create new vendor
          await serverCreateDocument(APPWRITE_API_KEY, 'vendors', {
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
            price_range: mapPriceLevel(place.priceLevel),
            latitude: place.location?.latitude || 0,
            longitude: place.location?.longitude || 0,
            images_locked: false,
            last_synced: new Date().toISOString(),
          });
          created++;
        }
      }
    } catch (err) {
      console.error(`Snapshot error for query "${query}":`, err);
    }
  }

  return NextResponse.json({
    success: true,
    summary: { created, updated, filtered, hidden },
    timestamp: new Date().toISOString(),
  });
}
