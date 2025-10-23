import { use } from 'react';
import {
  usePropertyData,
  groupPlutoData,
  formatValue,
  getFieldMetadata,
  getLandUseDescription,
  getBoroughName,
  getBuildingClassCategory,
  formatTimestamp,
} from '@/services/propertyData';

interface PlutoTabProps {
  bbl: string;
}

export function PlutoTab({ bbl }: PlutoTabProps) {
  // Note: Currently using static sample data for testing.
  // The bbl parameter is passed but not yet used to fetch property-specific data.
  // All properties will show the same sample data (1 Broadway, Manhattan).
  const propertyDataPromise = usePropertyData(bbl, 'pluto');
  const { data, metadata, error } = use(propertyDataPromise);

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

  return (
    <div className="space-y-6">
      {/* Dataset Attribution */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">{metadata.name}</h3>

        {/* Custom PLUTO Description */}
        <div className="mb-6">
          <p className="text-sm text-foreground/80 leading-relaxed">
            PLUTO (Primary Land Use Tax Lot Output) is a comprehensive dataset containing detailed land use and geographic information for every tax lot in New York City. This dataset includes over 70 fields derived from data maintained by various city agencies, providing essential information for urban planning, real estate analysis, and policy development.
          </p>
        </div>

        {/* Dataset Metadata Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Update Frequency</dt>
            <dd className="mt-1 text-sm text-foreground">Quarterly</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Attachments</dt>
            <dd className="mt-1 text-sm text-foreground">CSV, Shapefile, MapInfo</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Source Link</dt>
            <dd className="mt-1">
              <a
                href={metadata.attributionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground underline hover:text-foreground/80"
              >
                View on NYC Open Data
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Data Provided by</dt>
            <dd className="mt-1 text-sm text-foreground">{metadata.attribution}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Dataset Owner</dt>
            <dd className="mt-1 text-sm text-foreground">NYC Department of City Planning</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Agency</dt>
            <dd className="mt-1 text-sm text-foreground">Department of City Planning (DCP)</dd>
          </div>

          {metadata.rowsUpdatedAt && (
            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Data Last Updated</dt>
              <dd className="mt-1 text-sm text-foreground">{formatTimestamp(metadata.rowsUpdatedAt)}</dd>
            </div>
          )}

          {metadata.viewLastModified && (
            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Metadata Last Updated</dt>
              <dd className="mt-1 text-sm text-foreground">{formatTimestamp(metadata.viewLastModified)}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Data Sections - 2 columns layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          // Filter out fields with no value
          const fieldsWithValues = section.fields.filter(
            (field) => field.value !== null && field.value !== '' && field.value !== undefined
          );

          if (fieldsWithValues.length === 0) {
            return null;
          }

          return (
            <div
              key={section.title}
              className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">{section.title}</h3>
              <dl className="space-y-3">
                {fieldsWithValues.map((field) => {
                  const columnMetadata = getFieldMetadata(metadata, field.fieldName);
                  let formattedValue = formatValue(field.value, columnMetadata);
                  let additionalInfo = '';

                  // Add human-readable descriptions for coded fields
                  if (field.fieldName === 'landuse' && typeof field.value === 'number') {
                    additionalInfo = getLandUseDescription(field.value);
                    formattedValue = `${formattedValue} - ${additionalInfo}`;
                  } else if (field.fieldName === 'borough' && typeof field.value === 'string') {
                    additionalInfo = getBoroughName(field.value);
                    formattedValue = `${field.value} (${additionalInfo})`;
                  } else if (field.fieldName === 'bldgclass' && typeof field.value === 'string') {
                    additionalInfo = getBuildingClassCategory(field.value);
                    formattedValue = `${formattedValue} - ${additionalInfo}`;
                  }

                  return (
                    <div
                      key={field.fieldName}
                      className="flex items-start gap-4 border-b border-foreground/5 py-2 last:border-b-0"
                    >
                      <dt className="group relative flex min-w-[140px] items-center text-sm font-medium text-foreground/70">
                        {field.label}
                        {field.description && (
                          <div
                            className="prose prose-xs absolute left-0 bottom-full z-10 mb-2 hidden w-96 rounded-md border border-gray-600 bg-black p-4 text-xs text-white shadow-lg group-hover:block [&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1"
                            dangerouslySetInnerHTML={{ __html: field.description }}
                          />
                        )}
                      </dt>
                      <dd className="flex-1 text-right text-sm text-foreground">{formattedValue}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

