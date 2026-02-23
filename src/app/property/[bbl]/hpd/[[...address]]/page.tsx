import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { HpdTab } from '../HpdTab';
import { getPropertyData } from '../../utils/getPropertyData';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

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
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  return {
    title: `${fullFormattedAddress} - HPD Violations & Registration`,
    description: `View NYC Housing Preservation & Development records for ${fullFormattedAddress}. Housing violations, registrations, complaints, and responsible parties from HPD database.`,
    openGraph: {
      title: `${fullFormattedAddress} - HPD Violations & Registration`,
      description: `HPD violations and housing data for ${fullFormattedAddress}`,
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

  // Get shared property data from cache (warmed by layout)
  const { plutoData, propertyData } = await getPropertyData(bbl);

  // Extract street address from shared data
  const streetAddress = propertyData?.address_with_unit || plutoData?.address;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="hpd" address={streetAddress || undefined}>
      <HpdTab bbl={bbl} />
    </PropertyPageLayout>
  );
}

