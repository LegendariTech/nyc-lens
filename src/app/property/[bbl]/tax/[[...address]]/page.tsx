import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { TaxTabDisplay } from '../components/TaxTabDisplay';
import { DatasetInfoCard, Card, CardContent } from '@/components/ui';
import { getPropertyData } from '../../utils/getPropertyData';
import { fetchPropertyValuation } from '@/data/valuation';
import type { DatasourceMetadata } from '../../utils/datasourceDisplay';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

interface TaxPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
}

export async function generateMetadata({ params }: TaxPageProps): Promise<Metadata> {
  const { bbl } = await params;
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  return {
    title: `${fullFormattedAddress} - Tax Assessment & Valuation`,
    description: `View property tax assessment history for ${fullFormattedAddress}. Market value, assessed value, exemptions, and annual property tax from NYC Department of Finance records.`,
    openGraph: {
      title: `${fullFormattedAddress} - Tax Assessment & Valuation`,
      description: `Property tax and valuation history for ${fullFormattedAddress}`,
    },
  };
}

export default async function TaxPage({ params }: TaxPageProps) {
  const { bbl } = await params;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Get shared property data from cache (warmed by layout)
  const { plutoData, propertyData } = await getPropertyData(bbl);

  // Extract street address from shared data
  const streetAddress = propertyData?.address_with_unit || plutoData?.address;

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
    <PropertyPageLayout bbl={bbl} activeTab="tax" address={streetAddress || undefined} maxWidth="xl">
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

