import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { getPropertyData } from '../../utils/getPropertyData';
import { fetchPlutoData } from '@/data/pluto';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

interface PlutoPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
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

export default async function PlutoPage({ params }: PlutoPageProps) {
  const { bbl } = await params;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch PLUTO data with metadata (returns instantly from cache warmed by layout)
  const { data, metadata, error } = await fetchPlutoData(bbl);

  // Get propertyData for address extraction (returns instantly from cache)
  const { propertyData } = await getPropertyData(bbl);

  // Extract street address from shared data
  const streetAddress = propertyData?.address_with_unit || data?.address;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="pluto" address={streetAddress || undefined}>
      <PlutoTabDisplay data={data} metadata={metadata} error={error} bbl={bbl} />
    </PropertyPageLayout>
  );
}

