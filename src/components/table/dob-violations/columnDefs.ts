import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobViolationRow } from './types';

/**
 * Format date string to readable format
 */
function formatDate(value: string | null | undefined): string {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value; // Return original if invalid
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return value;
  }
}

/**
 * Truncate long text with ellipsis
 */
function truncateText(value: string | null | undefined, maxLength: number = 50): string {
  if (!value) return 'N/A';
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength) + '...';
}

export const dobViolationColumnDefs: ColDef<DobViolationRow>[] = [
  {
    field: 'violation_number',
    headerName: 'Violation #',
    width: 140,
    pinned: 'left',
    sortable: true,
    filter: true,
  },
  {
    field: 'issue_date',
    headerName: 'Issue Date',
    width: 130,
    sortable: true,
    filter: true,
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) => formatDate(p.value),
    comparator: (valueA: string, valueB: string) => {
      // Sort by date
      const dateA = new Date(valueA || '1900-01-01').getTime();
      const dateB = new Date(valueB || '1900-01-01').getTime();
      return dateB - dateA; // Most recent first
    },
  },
  {
    field: 'violation_type',
    headerName: 'Violation Type',
    width: 200,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
  },
  {
    field: 'violation_category',
    headerName: 'Category',
    width: 150,
    sortable: true,
    filter: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'description',
  },
  {
    field: 'disposition_date',
    headerName: 'Disposition Date',
    width: 140,
    sortable: true,
    filter: true,
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) => formatDate(p.value),
  },
  {
    field: 'disposition_comments',
    headerName: 'Disposition',
    width: 250,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'disposition_comments',
  },
  {
    field: 'ecb_number',
    headerName: 'ECB #',
    width: 120,
    sortable: true,
    filter: true,
  },
  {
    field: 'house_number',
    headerName: 'House #',
    width: 100,
    sortable: true,
    filter: true,
  },
  {
    field: 'street',
    headerName: 'Street',
    width: 180,
    sortable: true,
    filter: true,
  },
  {
    field: 'bin',
    headerName: 'BIN',
    width: 110,
    sortable: true,
    filter: true,
  },
  {
    field: 'device_number',
    headerName: 'Device #',
    width: 120,
    sortable: true,
    filter: true,
  },
  {
    field: 'violation_type_code',
    headerName: 'Type Code',
    width: 110,
    sortable: true,
    filter: true,
  },
  {
    field: 'isn_dob_bis_viol',
    headerName: 'ISN',
    width: 140,
    sortable: true,
    filter: true,
  },
];

