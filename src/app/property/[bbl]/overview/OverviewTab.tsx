'use client';

import { DataFieldCard, DatasetInfoCard } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';
import { getBoroughName } from '@/constants/nyc';
import { getBuildingClassCategory } from '@/constants/building';
import { formatTimestamp } from '@/utils/formatters';

interface OverviewTabProps {
  data: any; // TODO: Add proper typing
  metadata: any; // TODO: Add proper typing
  error?: string;
  bbl?: string;
}

export function OverviewTab({ data, metadata, error, bbl }: OverviewTabProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <p className="text-sm text-foreground/70">No data available for this property.</p>
      </div>
    );
  }

  // Generate sections for "On This Page" sidebar
  const sidebarSections = [
    { id: 'property-summary', title: 'Property Summary', level: 1 },
    { id: 'building-info', title: 'Building Information', level: 1 },
    { id: 'data-source', title: 'Data Source', level: 1 }
  ];

  // Extract key property information for overview
  const propertySummaryFields = [
    { label: 'Address', value: data.address || 'N/A' },
    { label: 'Borough', value: getBoroughName(data.borough) || 'N/A' },
    { label: 'Block', value: data.block || 'N/A' },
    { label: 'Lot', value: data.lot || 'N/A' }
  ];

  const buildingInfoFields = [
    { label: 'Building Class', value: getBuildingClassCategory(data.bldgclass) || 'N/A' },
    { label: 'Land Use', value: data.landuse || 'N/A' },
    { label: 'Residential Units', value: data.unitsres || 'N/A' },
    { label: 'Year Built', value: data.yearbuilt || 'N/A' }
  ];

  const dataSourceFields = [
    { label: 'Dataset', value: metadata?.name || 'N/A' },
    { label: 'Last Updated', value: formatTimestamp(data.lastmodified) || 'N/A' }
  ];

  return (
    <DataTabLayout sections={sidebarSections}>
      {/* AI Services Controls */}
      <TabControlsBar showEmptyFieldsToggle={false} />

      {/* Property Summary */}
      <DataFieldCard
        title="Property Summary"
        fields={propertySummaryFields}
        id="property-summary"
      />

      {/* Building Information */}
      <DataFieldCard
        title="Building Information"
        fields={buildingInfoFields}
        id="building-info"
      />

      {/* Data Source Information */}
      <DataFieldCard
        title="Data Source"
        fields={dataSourceFields}
        id="data-source"
      />
    </DataTabLayout>
  );
}
