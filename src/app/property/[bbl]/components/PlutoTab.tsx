'use client';

import { useState } from 'react';
import {
  groupPlutoData,
  formatValue,
  getFieldMetadata,
  getLandUseDescription,
  getBoroughName,
  getBuildingClassCategory,
  getCommunityDistrictName,
  type PlutoData,
  type PlutoMetadata,
} from '@/services/propertyData';
import { DataFieldCard, DatasetInfoCard, type DataField } from '@/components/ui';
import { TabControlsBar, DataTabLayout } from '@/components/layout';

interface PlutoTabProps {
  data: PlutoData | null;
  metadata: PlutoMetadata | null;
  error?: string;
  showEmptyFields?: boolean;
  bbl?: string; // Add BBL prop for ChatGPT URL
}

export function PlutoTab({ data, metadata, error, showEmptyFields = true }: PlutoTabProps) {
  // State for controlling empty field display
  const [hideEmptyFields, setHideEmptyFields] = useState(!showEmptyFields);

  // Generate sections for "On This Page" sidebar based on actual data sections
  const dataSections = groupPlutoData(data, metadata);
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

  const sections = groupPlutoData(data, metadata);

  // Custom formatter for PLUTO-specific field formatting
  const formatPlutoField = (field: DataField) => {
    if (!metadata) return String(field.value || 'N/A');

    // Format BBL to remove decimal places
    if (field.fieldName === 'bbl' && typeof field.value === 'string') {
      return parseFloat(field.value).toFixed(0);
    }

    const columnMetadata = getFieldMetadata(metadata, field.fieldName || '');
    let formattedValue = formatValue(field.value as string | number | boolean | null, columnMetadata, field.format as "number" | "currency" | "percentage" | undefined);
    let additionalInfo = '';

    // Add human-readable descriptions for coded fields
    if (field.fieldName === 'cd' && typeof field.value === 'number') {
      additionalInfo = getCommunityDistrictName(field.value);
      formattedValue = `${formattedValue} - ${additionalInfo}`;
    } else if (field.fieldName === 'council' && typeof field.value === 'number') {
      formattedValue = `${formattedValue} - Council District ${field.value}`;
    } else if (field.fieldName === 'landuse' && typeof field.value === 'number') {
      additionalInfo = getLandUseDescription(field.value);
      formattedValue = `${formattedValue} - ${additionalInfo}`;
    } else if (field.fieldName === 'borough' && typeof field.value === 'string') {
      additionalInfo = getBoroughName(field.value);
      formattedValue = `${field.value} (${additionalInfo})`;
    } else if (field.fieldName === 'bldgclass' && typeof field.value === 'string') {
      additionalInfo = getBuildingClassCategory(field.value);
      formattedValue = `${formattedValue} - ${additionalInfo}`;
    }

    return formattedValue;
  };

  return (
    <DataTabLayout sections={sidebarSections}>
      {/* Dataset Attribution */}
      {metadata && (
        <DatasetInfoCard
          metadata={{
            name: metadata.name,
            attributionLink: metadata.attributionLink,
            rowsUpdatedAt: metadata.rowsUpdatedAt?.toString()
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
        showAIServices={true}
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
            customFormatter={formatPlutoField}
          />
        ))}
      </div>
    </DataTabLayout>
  );
}

