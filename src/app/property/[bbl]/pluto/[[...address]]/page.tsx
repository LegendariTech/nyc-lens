import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { fetchPlutoData } from '@/data/pluto';
import { parseAddressFromUrl } from '@/utils/urlSlug';

interface PlutoPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function PlutoPage({ params, searchParams }: PlutoPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch PLUTO data
  const { data, metadata, error } = await fetchPlutoData(bbl);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="pluto" address={address}>
      <PlutoTabDisplay data={data} metadata={metadata} error={error} bbl={bbl} />
    </PropertyPageLayout>
  );
}

