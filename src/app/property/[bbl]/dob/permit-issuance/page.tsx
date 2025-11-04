import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { PermitIssuanceDisplay } from '../components/PermitIssuanceDisplay';

interface DobPermitIssuancePageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobPermitIssuancePage({ params, searchParams }: DobPermitIssuancePageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

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

