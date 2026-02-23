import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { getPropertyData } from '../../utils/getPropertyData';
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

  // Get shared property data from cache (warmed by layout)
  const { plutoData, propertyData } = await getPropertyData(bbl);

  // Fetch PLUTO data with metadata (returns instantly from cache)
  const { data, metadata, error } = await fetchPlutoData(bbl);

  // Extract street address from shared data
  const streetAddress = propertyData?.address_with_unit || plutoData?.address;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="pluto" address={streetAddress || undefined}>
      <PlutoTabDisplay data={data} metadata={metadata} error={error} bbl={bbl} />
    </PropertyPageLayout>
  );
}

