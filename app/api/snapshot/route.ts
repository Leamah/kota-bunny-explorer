import { NextResponse } from 'next/server';
import { serverListDocuments, serverCreateDocument, serverUpdateDocument, Query } from '../../../lib/appwrite';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

// Search queries for South African street food spots
const SEARCH_QUERIES = [
  'Kota spot Johannesburg',
  'Kota spot Soweto',
  'Kota spot Soshanguve',
  'Kota spot Pretoria',
  'Kota street food Gauteng',
  'Bunny Chow Durban',
  'Bunny Chow Johannesburg',
  'Bunny Chow Cape Town',
  'Bunny Chow restaurant KwaZulu-Natal',
];

interface GooglePlace {
  id: string;
  displayName: { text: string };
  rating: number;
  userRatingCount: number;
  location: { latitude: number; longitude: number };
  formattedAddress: string;
}

interface GooglePlacesResponse {
  places?: GooglePlace[];
}

export async function POST(request: Request) {
  // Auth check
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
      // Google Places Text Search (New) with field masking for cost savings
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.location,places.formattedAddress',
        },
        body: JSON.stringify({ textQuery: query }),
      });

      const data: GooglePlacesResponse = await res.json();
      const places = data.places || [];

      for (const place of places) {
        // Double-Gate Filter: 4+ stars AND 10+ reviews
        if (!place.rating || place.rating < 4.0 || !place.userRatingCount || place.userRatingCount < 10) {
          filtered++;
          continue;
        }

        // Determine category from the search query
        const category = query.toLowerCase().includes('bunny') ? 'bunny-chow' : 'kota';

        // Check if google_id already exists (upsert logic)
        const existing = await serverListDocuments(APPWRITE_API_KEY, 'vendors', [
          Query.equal('google_id', place.id),
        ]);

        if (existing.documents && existing.documents.length > 0) {
          // Update existing: refresh rating and review count
          await serverUpdateDocument(APPWRITE_API_KEY, 'vendors', existing.documents[0].$id, {
            rating: place.rating,
            review_count: place.userRatingCount,
            last_synced: new Date().toISOString(),
          });
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
            is_vetted: true, // Google 4+ star spots are auto-vetted
            upvote_count: 0,
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
    summary: { created, updated, filtered },
    timestamp: new Date().toISOString(),
  });
}
