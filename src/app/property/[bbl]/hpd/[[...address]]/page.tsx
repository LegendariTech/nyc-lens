import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { HpdTab } from '../HpdTab';
import { parseAddressFromUrl } from '@/utils/urlSlug';

interface HpdPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function HpdPage({ params, searchParams }: HpdPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="hpd" address={address}>
      <HpdTab bbl={bbl} />
    </PropertyPageLayout>
  );
}

