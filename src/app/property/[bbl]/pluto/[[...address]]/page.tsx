import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { fetchPlutoData } from '@/data/pluto';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

interface PlutoPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export async function generateMetadata({ params }: PlutoPageProps): Promise<Metadata> {
  const { bbl } = await params;
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  return {
    title: `${fullFormattedAddress} - Building Information`,
    description: `View PLUTO building data for ${fullFormattedAddress}. Property characteristics, lot size, zoning, building class, units, square footage, and construction details from NYC Department of City Planning.`,
    openGraph: {
      title: `${fullFormattedAddress} - Building Information`,
      description: `PLUTO property data for ${fullFormattedAddress}`,
    },
  };
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

