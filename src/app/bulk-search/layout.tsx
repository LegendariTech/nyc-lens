import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk Property Search',
  description:
    'Search and filter thousands of NYC properties with advanced bulk search tools. Filter by borough, block, lot, owner, document type, sale price, mortgage amount, and more. Explore comprehensive ACRIS property records with powerful sorting and filtering capabilities.',
  openGraph: {
    title: 'Bulk Property Search | BBL Club',
    description:
      'Search and filter thousands of NYC properties. Advanced filtering by borough, owner, sale price, mortgage, and more.',
    type: 'website',
    url: '/bulk-search',
    siteName: 'BBL Club',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Property Search | BBL Club',
    description:
      'Advanced bulk search for NYC properties with powerful filtering and sorting capabilities.',
  },
};

export default function BulkSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
