import { fetchPropertyValuation } from '@/data/valuation';
import { DatasetInfoCard } from '@/components/ui';
import { TaxTabDisplay } from './TaxTabDisplay';
import type { DatasourceMetadata } from '../../utils/datasourceDisplay';

/**
 * Tax Tab Component
 * Fetches and displays property valuation and tax history data
 */
interface TaxTabProps {
  bbl: string;
}

export async function TaxTab({ bbl }: TaxTabProps) {
  // Fetch property valuation data
  const { data: valuationData, error: valuationError, metadata } = await fetchPropertyValuation(bbl);

  // Load metadata and construct DatasourceMetadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMetadata = metadata as any;
  const datasetMetadata: DatasourceMetadata = {
    ...rawMetadata,
    attributionLink: `https://data.cityofnewyork.us/d/${rawMetadata.id}`,
  };

  // Handle error state
  if (valuationError) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Valuation Data</h3>
        <p className="text-sm text-red-600/80">{valuationError}</p>
      </div>
    );
  }

  // Handle no data state
  if (!valuationData || valuationData.length === 0) {
    return (
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-foreground">No Valuation Data</h3>
        <p className="text-sm text-foreground/70">
          No valuation data available for BBL {bbl}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
  );
}

