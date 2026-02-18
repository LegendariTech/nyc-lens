import { notFound } from 'next/navigation';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { ComplaintsDisplay } from '../components/ComplaintsDisplay';

interface DobComplaintsPageProps {
  params: Promise<{
    address?: string[];
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobComplaintsPage({ params, searchParams }: DobComplaintsPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // TODO: Fetch DOB complaints data
  const data = null;
  const metadata = null;
  const error = undefined;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="complaints" />
      <ComplaintsDisplay bbl={bbl} data={data} metadata={metadata} error={error} />
    </PropertyPageLayout>
  );
}

