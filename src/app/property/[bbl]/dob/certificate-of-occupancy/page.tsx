import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { CertificateOfOccupancyDisplay } from '../components/CertificateOfOccupancyDisplay';

interface DobCertificatePageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobCertificatePage({ params, searchParams }: DobCertificatePageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // TODO: Fetch DOB certificate data
  const data = null;
  const metadata = null;
  const error = undefined;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="certificate-of-occupancy" />
      <CertificateOfOccupancyDisplay bbl={bbl} data={data} metadata={metadata} error={error} />
    </PropertyPageLayout>
  );
}

