'use client';

import { DatasetInfoCard, Card, CardContent } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetadataType = any; // TODO: Add proper typing for Socrata metadata

interface CertificateOfOccupancyDisplayProps {
  bbl: string;
  data: unknown; // TODO: Add proper typing
  metadata: MetadataType; // TODO: Add proper typing
  error?: string;
}

export function CertificateOfOccupancyDisplay({ bbl, data, metadata, error }: CertificateOfOccupancyDisplayProps) {
  // Generate sections for "On This Page" sidebar
  const sidebarSections = [
    { id: 'dataset-info', title: 'Dataset Information', level: 1 },
    { id: 'certificate-data', title: 'Certificate of Occupancy', level: 1 }
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Certificate of Occupancy Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <DataTabLayout sections={sidebarSections}>
        {/* Dataset Attribution - Placeholder */}
        <DatasetInfoCard
          metadata={{
            name: 'Data Source Information',
            attributionLink: 'https://data.cityofnewyork.us/',
            agency: 'Department of Buildings',
          }}
          id="dataset-info"
          description={
            <p className="text-sm text-foreground/80 leading-relaxed">
              Certificate of Occupancy information will be displayed here.
            </p>
          }
        />

        {/* Controls Row */}
        <TabControlsBar
          showEmptyFieldsToggle={false}
        />

        {/* Placeholder Content */}
        <Card id="certificate-data">
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Certificate of Occupancy
            </h3>
            <p className="text-sm text-foreground/70">
              Certificate of Occupancy information for BBL {bbl} will be displayed here.
            </p>
          </CardContent>
        </Card>
      </DataTabLayout>
    );
  }

  // TODO: Implement actual data display when data is available
  return (
    <DataTabLayout sections={sidebarSections}>
      {/* Dataset Attribution */}
      {metadata && (
        <DatasetInfoCard
          metadata={{
            name: 'Data Source Information',
            attributionLink: metadata.attributionLink,
            rowsUpdatedAt: metadata.rowsUpdatedAt?.toString(),
            agency: metadata.attribution,
            attachments: metadata.metadata?.attachments,
            sourceId: metadata.id,
          }}
          id="dataset-info"
          description={
            <p className="text-sm text-foreground/80 leading-relaxed">
              {metadata.description}
            </p>
          }
        />
      )}

      {/* Controls Row */}
      <TabControlsBar
        showEmptyFieldsToggle={true}
      />

      {/* Data Display */}
      <div id="certificate-data">
        {/* TODO: Add actual certificate data display */}
      </div>
    </DataTabLayout>
  );
}

