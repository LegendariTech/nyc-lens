import { fetchPlutoData } from './pluto';

export interface DatasourceColumnMetadata {
  id: number;
  name: string;
  dataTypeName: string;
  description: string;
  fieldName: string;
  position: number;
  renderTypeName: string;
  tableColumnId: number;
  format?: Record<string, string | undefined>;
}

export interface DatasourceMetadata {
  id: string;
  name: string;
  description: string;
  attribution: string;
  attributionLink: string;
  rowsUpdatedAt?: number; // Unix timestamp
  viewLastModified?: number; // Unix timestamp
  columns: DatasourceColumnMetadata[];
}

export interface PropertyDataResult<TData = Record<string, string | number | boolean | null>> {
  data: TData | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Get metadata for a specific field
 */
export function getFieldMetadata(
  metadata: DatasourceMetadata | null,
  fieldName: string
): DatasourceColumnMetadata | undefined {
  return metadata?.columns.find((col) => col.fieldName === fieldName);
}

/**
 * Format a value based on its metadata and field format
 */
export function formatValue(
  value: string | number | boolean | null | undefined,
  column?: DatasourceColumnMetadata,
  fieldFormat?: 'currency' | 'number' | 'percentage'
): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle numeric values with formatting
  if (typeof value === 'number') {
    // Check for currency formatting first
    if (fieldFormat === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // Check for number formatting
    if (fieldFormat === 'number') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Check if the column has a format specification
    if (column?.format?.noCommas === 'true') {
      return value.toString();
    }
    return value.toLocaleString();
  }

  // Handle string values that should be formatted as currency
  if (typeof value === 'string' && fieldFormat === 'currency') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
  }

  // Handle string values that should be formatted as numbers
  if (typeof value === 'string' && fieldFormat === 'number') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numericValue);
    }
  }

  return String(value);
}

type SectionFieldFormat = 'currency' | 'number' | 'percentage';

/**
 * Generic section structure for data display
 */
export interface DataSectionField<TData extends Record<string, unknown> = Record<string, unknown>> {
  label: string;
  fieldName: keyof TData & string;
  value: TData[keyof TData] | null;
  description?: string;
  format?: SectionFieldFormat;
  link?: string;
}

export interface DataSection<TData extends Record<string, unknown> = Record<string, unknown>> {
  title: string;
  fields: Array<DataSectionField<TData>>;
}

export interface SectionFieldDefinition<TData extends Record<string, unknown> = Record<string, unknown>> {
  label: string;
  fieldName: keyof TData & string;
  format?: SectionFieldFormat;
  link?: string | ((data: TData) => string | undefined);
}

/**
 * Section definition for configuring data sections
 */
export interface SectionDefinition<TData extends Record<string, unknown> = Record<string, unknown>> {
  title: string;
  fields: Array<SectionFieldDefinition<TData>>;
}

/**
 * Generic function to create sections from data based on section definitions
 */
export function getSections<TData extends Record<string, unknown>, TMetadata extends DatasourceMetadata>(
  sections: SectionDefinition<TData>[],
  data: TData | null,
  metadata: TMetadata | null
): DataSection<TData>[] {
  if (!data) return [];

  const metadataColumns = metadata?.columns ?? [];

  const result = sections.map((sectionDef) => {
    const fields = sectionDef.fields.map((fieldDef) => {
      const value = data[fieldDef.fieldName];

      // Handle link generation
      let link: string | undefined;
      if (fieldDef.link) {
        if (typeof fieldDef.link === 'function') {
          link = fieldDef.link(data);
        } else {
          link = fieldDef.link;
        }
      }

      const field: DataSectionField<TData> = {
        label: fieldDef.label,
        fieldName: fieldDef.fieldName,
        value: (value ?? null) as TData[keyof TData] | null,
        format: fieldDef.format,
        link,
      };

      if (metadataColumns) {
        const columnMetadata = metadataColumns.find((col) => col.fieldName === field.fieldName);
        if (columnMetadata?.description) {
          field.description = columnMetadata.description;
        }
      }

      return field;
    });

    return {
      title: sectionDef.title,
      fields,
    };
  });

  return result;
}


