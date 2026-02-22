import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { HpdTab } from '../HpdTab';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { fetchPropertyByBBL } from '@/data/acris';
import { BOROUGH_NAMES } from '@/constants/nyc';

interface HpdPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export async function generateMetadata({ params }: HpdPageProps): Promise<Metadata> {
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
    title: `HPD Violations & Registration - ${address}`,
    description: `View NYC Housing Preservation & Development records for ${address} in ${borough}. Housing violations, registrations, complaints, and responsible parties from HPD database.`,
    openGraph: {
      title: `HPD Data - ${address}`,
      description: `HPD violations and housing data for ${address}`,
    },
  };
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

