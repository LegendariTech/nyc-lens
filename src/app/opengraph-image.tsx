import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BBL Club - NYC Real Estate Data Explorer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          BBL Club
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            textAlign: 'center',
            opacity: 0.95,
          }}
        >
          NYC Real Estate Data Explorer
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 40,
            opacity: 0.9,
            textAlign: 'center',
          }}
        >
          Property Transactions • Building Data • Owner Records
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
