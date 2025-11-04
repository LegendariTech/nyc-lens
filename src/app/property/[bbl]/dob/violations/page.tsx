import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { DobTabNav } from '../components/DobTabNav';
import { ViolationsDisplay } from '../components/ViolationsDisplay';
import { fetchDobViolations } from '@/data/dobViolations';

interface DobViolationsPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function DobViolationsPage({ params, searchParams }: DobViolationsPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch DOB violations data
  const { data, metadata, error } = await fetchDobViolations(bbl);

  return (
    <PropertyPageLayout bbl={bbl} activeTab="dob" address={address} maxWidth="full">
      <DobTabNav bbl={bbl} activeSubTab="violations" />
      <ViolationsDisplay bbl={bbl} data={data} metadata={metadata} error={error} />
    </PropertyPageLayout>
  );
}

