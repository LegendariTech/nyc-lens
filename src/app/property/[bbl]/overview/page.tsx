import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { OverviewTab } from './OverviewTab';
import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';

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

  // Fetch PLUTO data and Elasticsearch property data with error handling
  let plutoData = null;
  let propertyData = null;
  let error: string | undefined;

  try {
    const [plutoResult, acrisResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
    ]);
    plutoData = plutoResult.data;
    propertyData = acrisResult;
  } catch (e) {
    console.error('Error fetching property data:', e);
    error = e instanceof Error ? e.message : 'Failed to load property data';
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="overview" address={address}>
      <OverviewTab
        plutoData={plutoData}
        propertyData={propertyData}
        error={error}
        bbl={bbl}
      />
    </PropertyPageLayout>
  );
}

