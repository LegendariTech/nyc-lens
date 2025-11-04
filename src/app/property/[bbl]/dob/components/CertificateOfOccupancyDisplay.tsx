'use client';

import { DatasetInfoCard } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';

interface CertificateOfOccupancyDisplayProps {
  bbl: string;
  data: any; // TODO: Add proper typing
  metadata: any; // TODO: Add proper typing
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
            name: 'DOB Certificate of Occupancy',
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
        <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm" id="certificate-data">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Certificate of Occupancy
          </h3>
          <p className="text-sm text-foreground/70">
            Certificate of Occupancy information for BBL {bbl} will be displayed here.
          </p>
        </div>
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
            name: metadata.name,
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

