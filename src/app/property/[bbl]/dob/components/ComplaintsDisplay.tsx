'use client';

import { DatasetInfoCard, Card, CardContent } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';

interface ComplaintsDisplayProps {
  bbl: string;
  data: any; // TODO: Add proper typing
  metadata: any; // TODO: Add proper typing
  error?: string;
}

export function ComplaintsDisplay({ bbl, data, metadata, error }: ComplaintsDisplayProps) {
  // Generate sections for "On This Page" sidebar
  const sidebarSections = [
    { id: 'dataset-info', title: 'Dataset Information', level: 1 },
    { id: 'complaints-data', title: 'Complaints', level: 1 }
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Complaints Data</h3>
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
              Department of Buildings complaints data will be displayed here.
            </p>
          }
        />

        {/* Controls Row */}
        <TabControlsBar
          showEmptyFieldsToggle={false}
        />

        {/* Placeholder Content */}
        <Card id="complaints-data">
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              DOB Complaints
            </h3>
            <p className="text-sm text-foreground/70">
              Department of Buildings complaints for BBL {bbl} will be displayed here.
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
      <div id="complaints-data">
        {/* TODO: Add actual complaints data display */}
      </div>
    </DataTabLayout>
  );
}

