'use client';

import { useState } from 'react';
import { getSections, type DatasourceMetadata } from '../../utils/datasourceDisplay';
import { type PlutoData } from '@/data/pluto';
import { DataFieldCard, DatasetInfoCard } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';
import { plutoSections } from './plutoSections';
import { formatPlutoField, isPlutoFieldEmpty } from './plutoFieldUtils';

interface PlutoTabDisplayProps {
  data: PlutoData | null;
  metadata: DatasourceMetadata | null;
  error?: string;
  showEmptyFields?: boolean;
  bbl?: string;
}

export function PlutoTabDisplay({ data, metadata, error, showEmptyFields = true }: PlutoTabDisplayProps) {
  // State for controlling empty field display
  const [hideEmptyFields, setHideEmptyFields] = useState(!showEmptyFields);

  // Generate sections for "On This Page" sidebar based on actual data sections
  const dataSections = getSections(plutoSections, data, metadata);
  const sidebarSections = [
    { id: 'dataset-info', title: 'Dataset Information', level: 1 },
    ...dataSections.map((section, index) => ({
      id: `section-${index}`,
      title: section.title,
      level: 1
    }))
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading PLUTO Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  if (!data || !metadata) {
    return (
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <p className="text-sm text-foreground/70">No PLUTO data available for this property.</p>
      </div>
    );
  }

  const sections = getSections(plutoSections, data, metadata);

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
              PLUTO (Primary Land Use Tax Lot Output) is a comprehensive dataset containing detailed land use and geographic information for every tax lot in New York City. This dataset includes over 70 fields derived from data maintained by various city agencies, providing essential information for urban planning, real estate analysis, and policy development.
            </p>
          }
        />
      )}

      {/* Controls Row */}
      <TabControlsBar
        showEmptyFieldsToggle={true}
        hideEmptyFields={hideEmptyFields}
        onEmptyFieldsChange={setHideEmptyFields}
      />

      {/* Data Sections - 2 columns layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sections.map((section, index) => (
          <DataFieldCard
            key={section.title}
            title={section.title}
            fields={section.fields}
            hideEmptyFields={hideEmptyFields}
            id={`section-${index}`}
            customFormatter={(field) => formatPlutoField(field, metadata)}
            customEmptyCheck={isPlutoFieldEmpty}
          />
        ))}
      </div>
    </DataTabLayout>
  );
}

