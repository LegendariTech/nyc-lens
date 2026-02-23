import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Search',
  description:
    'Search NYC properties by address, owner name, or BBL (Borough-Block-Lot). Find property records, ownership information, transaction history, and building details from ACRIS, PLUTO, DOB, and HPD databases. Instant access to comprehensive New York City real estate data.',
  openGraph: {
    title: 'Property Search | BBL Club',
    description:
      'Search NYC properties by address, owner, or BBL. Access property records, ownership, transactions, and building details.',
    type: 'website',
    url: '/search',
    siteName: 'BBL Club',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property Search | BBL Club',
    description:
      'Search NYC properties by address, owner, or BBL. Access comprehensive property records and building data.',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
