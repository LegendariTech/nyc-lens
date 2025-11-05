import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { DobSafetyViolationsDisplay } from './components/DobSafetyViolationsDisplay';
import { fetchDobSafetyViolations } from '@/data/dobViolations';

interface DobSafetyViolationsPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobSafetyViolationsPage({ params, searchParams }: DobSafetyViolationsPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch DOB safety violations data
  const safetyViolationsResult = await fetchDobSafetyViolations(bbl);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="violations-dob-now" />
      <DobSafetyViolationsDisplay 
        bbl={bbl} 
        safetyViolations={safetyViolationsResult}
      />
    </PropertyPageLayout>
  );
}

