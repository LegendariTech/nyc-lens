import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { OverviewTab } from './OverviewTab';

interface OverviewPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="overview" address={address}>
      <OverviewTab data={null} metadata={null} bbl={bbl} />
    </PropertyPageLayout>
  );
}

