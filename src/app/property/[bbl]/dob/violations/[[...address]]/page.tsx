import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../../PropertyPageLayout';
import { DobTabNav } from '../../components';
import { DobViolationsDisplay } from '../components/DobViolationsDisplay';
import { fetchDobSafetyViolations, fetchDobViolationsBIS } from '@/data/dobViolations';
import { parseAddressFromUrl } from '@/utils/urlSlug';

interface DobViolationsPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobViolationsPage({ params, searchParams }: DobViolationsPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch both violations datasets in parallel
  const [safetyViolationsResult, bisViolationsResult] = await Promise.all([
    fetchDobSafetyViolations(bbl),
    fetchDobViolationsBIS(bbl),
  ]);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="violations" />
      <DobViolationsDisplay
        bbl={bbl}
        safetyViolations={safetyViolationsResult}
        bisViolations={bisViolationsResult}
      />
    </PropertyPageLayout>
  );
}

