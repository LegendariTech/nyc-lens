'use client';

import { DatasetInfoCard } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';

interface PermitIssuanceDisplayProps {
  bbl: string;
  data: any; // TODO: Add proper typing
  metadata: any; // TODO: Add proper typing
  error?: string;
}

export function PermitIssuanceDisplay({ bbl, data, metadata, error }: PermitIssuanceDisplayProps) {
  // Generate sections for "On This Page" sidebar
  const sidebarSections = [
    { id: 'dataset-info', title: 'Dataset Information', level: 1 },
    { id: 'permits-data', title: 'Permit Issuance', level: 1 }
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Permit Issuance Data</h3>
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
            name: 'DOB Permit Issuance',
            attributionLink: 'https://data.cityofnewyork.us/',
            agency: 'Department of Buildings',
          }}
          id="dataset-info"
          description={
            <p className="text-sm text-foreground/80 leading-relaxed">
              Department of Buildings permit issuance data will be displayed here.
            </p>
          }
        />

        {/* Controls Row */}
        <TabControlsBar
          showEmptyFieldsToggle={false}
        />

        {/* Placeholder Content */}
        <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm" id="permits-data">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            DOB Permit Issuance
          </h3>
          <p className="text-sm text-foreground/70">
            Department of Buildings permit issuance information for BBL {bbl} will be displayed here.
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
      <div id="permits-data">
        {/* TODO: Add actual permit issuance data display */}
      </div>
    </DataTabLayout>
  );
}

