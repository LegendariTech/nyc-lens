import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { fetchPlutoData } from '@/data/pluto';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { fetchPropertyByBBL } from '@/data/acris';
import { BOROUGH_NAMES } from '@/constants/nyc';

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
  const boroughCode = bbl.split('-')[0];
  const borough = BOROUGH_NAMES[boroughCode] || 'NYC';

  let address = `BBL ${bbl}`;
  try {
    const propertyData = await fetchPropertyByBBL(bbl);
    if (propertyData?.address) {
      address = propertyData.address;
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: `Building Information - ${address}`,
    description: `View PLUTO building data for ${address} in ${borough}. Property characteristics, lot size, zoning, building class, units, square footage, and construction details from NYC Department of City Planning.`,
    openGraph: {
      title: `Building Information - ${address}`,
      description: `PLUTO property data for ${address}`,
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

