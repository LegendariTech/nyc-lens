import { notFound } from 'next/navigation';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { PropertyPageLayout } from '@/app/property/[bbl]/PropertyPageLayout';
import { DobTabNav, PermitIssuanceDisplay } from '@/app/property/[bbl]/dob/components';

interface DobPermitIssuancePageProps {
  params: Promise<{
    address?: string[];
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobPermitIssuancePage({ params, searchParams }: DobPermitIssuancePageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // TODO: Fetch DOB permit issuance data
  const data = null;
  const metadata = null;
  const error = undefined;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="permit-issuance" />
      <PermitIssuanceDisplay bbl={bbl} data={data} metadata={metadata} error={error} />
    </PropertyPageLayout>
  );
}

