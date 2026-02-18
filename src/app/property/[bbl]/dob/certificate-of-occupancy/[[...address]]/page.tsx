import { notFound } from 'next/navigation';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav, CertificateOfOccupancyDisplay } from '../../components';

interface DobCertificatePageProps {
  params: Promise<{
    address?: string[];
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobCertificatePage({ params, searchParams }: DobCertificatePageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

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

