import { ImageResponse } from 'next/og';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../../lib/appwrite';

export const runtime = 'edge';
export const alt = 'Street food vendor on Kota & Bunny Explorer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let name = 'Street Food Spot';
  let address = 'South Africa';
  let rating = 0;
  let category = 'kota';
  let photoUrl: string | null = null;

  try {
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents/${id}`,
      {
        headers: {
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY ?? '',
        },
      }
    );
    if (res.ok) {
      const v = await res.json();
      name = v.name ?? name;
      address = v.address ?? address;
      rating = v.rating ?? 0;
      category = v.category ?? 'kota';
      if (v.photos) {
        try {
          const photos = JSON.parse(v.photos);
          if (photos.length > 0) photoUrl = photos[0];
        } catch { /* ignore */ }
      }
    }
  } catch { /* fallback values */ }

  const categoryLabel = category === 'kota' ? '🥪 Kota' : '🍞 Bunny Chow';
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  const city = address.split(',').slice(-2, -1)[0]?.trim() ?? 'South Africa';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        {photoUrl && (
          <img
            src={photoUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)',
        }} />

        {/* Bottom stripe */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 16, display: 'flex' }}>
          {['#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080'].map(
            (color, i) => <div key={i} style={{ flex: 1, background: color }} />
          )}
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '48px 60px',
          width: '100%',
        }}>
          <div style={{ fontSize: 20, color: '#F5C518', fontWeight: 700, marginBottom: 12 }}>
            {categoryLabel} · {city}
          </div>
          <div style={{ fontSize: 58, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
            {name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 28, color: '#F5C518' }}>{stars}</div>
            <div style={{ fontSize: 22, color: '#ccc' }}>{rating.toFixed(1)}/5</div>
            <div style={{ fontSize: 18, color: '#888', marginLeft: 'auto' }}>kotabunny.co.za</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
