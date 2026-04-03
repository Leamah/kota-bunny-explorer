import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kota & Bunny Explorer — South Africa\'s Street Food Directory';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ndebele-inspired top stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, display: 'flex' }}>
          {['#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080', '#F5C518', '#C8102E', '#008080'].map(
            (color, i) => (
              <div key={i} style={{ flex: 1, background: color }} />
            )
          )}
        </div>
        {/* Ndebele-inspired bottom stripe */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, display: 'flex' }}>
          {['#008080', '#C8102E', '#F5C518', '#008080', '#C8102E', '#F5C518', '#008080', '#C8102E', '#F5C518', '#008080', '#C8102E', '#F5C518'].map(
            (color, i) => (
              <div key={i} style={{ flex: 1, background: color }} />
            )
          )}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: '#F5C518', letterSpacing: '-1px', textAlign: 'center' }}>
            Kota & Bunny Explorer
          </div>
          <div style={{ fontSize: 28, color: '#e5e5e5', textAlign: 'center', fontWeight: 400 }}>
            South Africa&apos;s Street Food Directory
          </div>
          <div style={{ fontSize: 18, color: '#888', textAlign: 'center', marginTop: 8 }}>
            Best Kota • Best Bunny Chow • Community Rated
          </div>
          <div style={{
            marginTop: 24,
            background: '#C8102E',
            color: 'white',
            fontSize: 20,
            fontWeight: 700,
            padding: '12px 32px',
            borderRadius: 40,
          }}>
            www.kotabunny.co.za
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
