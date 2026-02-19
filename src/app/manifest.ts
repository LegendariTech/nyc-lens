import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BBL Club - NYC Real Estate Data Explorer',
    short_name: 'BBL Club',
    description: 'Search and explore NYC property transactions, mortgages, deeds, violations, and building data.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'finance', 'productivity'],
    orientation: 'any',
  };
}
