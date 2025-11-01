/**
 * Datasource Display Utilities
 * 
 * Generic utilities for displaying structured data from NYC Open Data datasources.
 * This module provides:
 * - Type definitions for datasource metadata (columns, descriptions, attribution)
 * - Section builder utilities to transform data + definitions into UI sections
 * - Field metadata lookup helpers
 * 
 * These utilities are datasource-agnostic and can be used with any structured data
 * (PLUTO, DOB permits, HPD violations, etc.)
 */

import { type DatasourceColumnMetadata } from '@/utils/formatters';

export type { DatasourceColumnMetadata };

export interface DatasourceAttachment {
  filename: string;
  assetId: string;
  name: string;
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
  metadata?: {
    attachments?: DatasourceAttachment[];
  };
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


