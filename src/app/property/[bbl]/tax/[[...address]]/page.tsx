import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { TaxTabDisplay } from '../components/TaxTabDisplay';
import { DatasetInfoCard, Card, CardContent } from '@/components/ui';
import { fetchPropertyValuation } from '@/data/valuation';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import type { DatasourceMetadata } from '../../utils/datasourceDisplay';

interface TaxPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function TaxPage({ params, searchParams }: TaxPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

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
        <Card>
          <CardContent>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No Valuation Data</h3>
            <p className="text-sm text-foreground/70">
              No valuation data available for BBL {bbl}.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Display data */}
      {!valuationError && valuationData && valuationData.length > 0 && datasetMetadata && (
        <div className="space-y-4">
          {/* Dataset Information */}
          <DatasetInfoCard
            metadata={{
              name: 'Data Source Information',
              attributionLink: datasetMetadata.attributionLink,
              rowsUpdatedAt: datasetMetadata.rowsUpdatedAt?.toString(),
              agency: datasetMetadata.attribution,
              attachments: rawMetadata.metadata?.attachments,
              sourceId: datasetMetadata.id,
              updateFrequency: rawMetadata.metadata?.custom_fields?.Update?.['Update Frequency'],
            }}
            id="dataset-info"
            description={
              <p className="text-sm text-foreground/80 leading-relaxed">
                This dataset presents detailed information on how every property in New York City—including residential, commercial, industrial and utility ­properties—is valued and assessed for tax purposes. It covers properties classified under the four major tax classes (Tax Classes 1, 2, 3 and 4) used by the city.
                <br />
                Essentially, the DOF uses this data to calculate property taxes, determine exemptions or abatements (tax breaks) and maintain the city’s official records of assessed values.
                <br />
                <strong>Note:</strong> For more information about how property taxes are calculated, visit{' '}
                <a
                  href="http://nyc.gov/assessments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  nyc.gov/assessments
                </a>
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

