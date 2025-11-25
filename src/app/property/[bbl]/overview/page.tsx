import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { OverviewTab } from './OverviewTab';
import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL, fetchTransactionsWithParties, DocumentWithParties } from '@/data/acris';

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

  // Fetch PLUTO data, Elasticsearch property data, and transactions with error handling
  let plutoData = null;
  let propertyData = null;
  let transactions: DocumentWithParties[] = [];
  let error: string | undefined;

  try {
    const [plutoResult, acrisResult, transactionsResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
      fetchTransactionsWithParties(bbl),
    ]);
    plutoData = plutoResult.data;
    propertyData = acrisResult;
    transactions = transactionsResult;
  } catch (e) {
    console.error('Error fetching property data:', e);
    error = e instanceof Error ? e.message : 'Failed to load property data';
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="overview" address={address}>
      <OverviewTab
        plutoData={plutoData}
        propertyData={propertyData}
        transactions={transactions}
        error={error}
        bbl={bbl}
      />
    </PropertyPageLayout>
  );
}

