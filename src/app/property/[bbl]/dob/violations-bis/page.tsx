import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { DobBISViolationsDisplay } from './components/DobBISViolationsDisplay';
import { fetchDobViolationsBIS } from '@/data/dobViolations';

interface DobBISViolationsPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobBISViolationsPage({ params, searchParams }: DobBISViolationsPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch DOB BIS violations data
  const bisViolationsResult = await fetchDobViolationsBIS(bbl);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="violations-bis" />
      <DobBISViolationsDisplay
        bbl={bbl}
        bisViolations={bisViolationsResult}
      />
    </PropertyPageLayout>
  );
}

