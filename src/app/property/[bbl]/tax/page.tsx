import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { TaxTabDisplay } from './components/TaxTabDisplay';
import { DatasetInfoCard } from '@/components/ui';
import { fetchPropertyValuation } from '@/data/valuation';
import type { DatasourceMetadata } from '../utils/datasourceDisplay';

interface TaxPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function TaxPage({ params, searchParams }: TaxPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch property valuation data
  const { data: valuationData, error: valuationError, metadata } = await fetchPropertyValuation(bbl);

  // Load metadata and construct DatasourceMetadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMetadata = metadata as any;
  const datasetMetadata: DatasourceMetadata | null = rawMetadata ? {
    ...rawMetadata,
    attributionLink: `https://data.cityofnewyork.us/d/${rawMetadata.id}`,
  } : null;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="tax" address={address} maxWidth="xl">
      {/* Handle error state */}
      {valuationError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Valuation Data</h3>
          <p className="text-sm text-red-600/80">{valuationError}</p>
        </div>
      )}

      {/* Handle no data state */}
      {!valuationError && (!valuationData || valuationData.length === 0) && (
        <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Valuation Data</h3>
          <p className="text-sm text-foreground/70">
            No valuation data available for BBL {bbl}.
          </p>
        </div>
      )}

      {/* Display data */}
      {!valuationError && valuationData && valuationData.length > 0 && datasetMetadata && (
        <div className="space-y-4">
          {/* Dataset Information */}
          <DatasetInfoCard
            metadata={{
              name: datasetMetadata.name,
              attributionLink: datasetMetadata.attributionLink,
              rowsUpdatedAt: datasetMetadata.rowsUpdatedAt?.toString(),
              agency: datasetMetadata.attribution,
              attachments: rawMetadata.metadata?.attachments,
              sourceId: datasetMetadata.id,
            }}
            id="dataset-info"
            description={
              <p className="text-sm text-foreground/80 leading-relaxed">
                {datasetMetadata.description}
              </p>
            }
          />

          {/* Tax Table and Assessment Detail */}
          <TaxTabDisplay valuationData={valuationData} bbl={bbl} />
        </div>
      )}
    </PropertyPageLayout>
  );
}

