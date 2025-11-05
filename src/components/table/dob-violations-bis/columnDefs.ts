import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobViolationBISRow } from './types';
import { ViolationNumberCell } from './ViolationNumberCell';

/**
 * Format date string to readable format
 * Handles both ISO dates and YYYYMMDD format (e.g., "20240222")
 */
function formatDate(value: string | null | undefined): string {
  if (!value) return 'N/A';
  try {
    let date: Date;

    // Check if it's in YYYYMMDD format (8 digits)
    if (/^\d{8}$/.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      date = new Date(`${year}-${month}-${day}`);
    } else {
      date = new Date(value);
    }

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

export const dobViolationBISColumnDefs: ColDef<DobViolationBISRow>[] = [
  {
    field: 'number',
    headerName: 'Violation #',
    width: 200,
    pinned: 'left',
    sortable: true,
    filter: true,
    cellRenderer: ViolationNumberCell,
  },
  {
    field: 'issue_date',
    headerName: 'Issue Date',
    width: 150,
    sortable: true,
    filter: true,
    valueFormatter: (p: ValueFormatterParams<DobViolationBISRow, string>) => formatDate(p.value),
    comparator: (valueA: string, valueB: string) => {
      // Parse dates handling YYYYMMDD format
      const parseDateString = (value: string): Date => {
        if (!value) return new Date('1900-01-01');
        if (/^\d{8}$/.test(value)) {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          const day = value.substring(6, 8);
          return new Date(`${year}-${month}-${day}`);
        }
        return new Date(value);
      };

      const dateA = parseDateString(valueA).getTime();
      const dateB = parseDateString(valueB).getTime();
      return dateB - dateA; // Most recent first
    },
  },
  {
    field: 'violation_type_code',
    headerName: 'Type Code',
    width: 150,
    sortable: true,
    filter: true,
  },
  {
    field: 'violation_category',
    headerName: 'Status',
    width: 300,
    sortable: true,
    filter: true,
  },
  {
    field: 'violation_type',
    headerName: 'Violation Type',
    width: 400,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 400,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
    valueFormatter: (p: ValueFormatterParams<DobViolationBISRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'description',
  },
  {
    field: 'disposition_date',
    headerName: 'Disposition Date',
    width: 140,
    sortable: true,
    filter: true,
    valueFormatter: (p: ValueFormatterParams<DobViolationBISRow, string>) => formatDate(p.value),
    comparator: (valueA: string, valueB: string) => {
      // Parse dates handling YYYYMMDD format
      const parseDateString = (value: string): Date => {
        if (!value) return new Date('1900-01-01');
        if (/^\d{8}$/.test(value)) {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          const day = value.substring(6, 8);
          return new Date(`${year}-${month}-${day}`);
        }
        return new Date(value);
      };

      const dateA = parseDateString(valueA).getTime();
      const dateB = parseDateString(valueB).getTime();
      return dateB - dateA; // Most recent first
    },
  },
  {
    field: 'disposition_comments',
    headerName: 'Disposition',
    width: 400,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
    valueFormatter: (p: ValueFormatterParams<DobViolationBISRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'disposition_comments',
  },
  {
    field: 'ecb_number',
    headerName: 'ECB #',
    width: 120,
    sortable: true,
    filter: true,
    hide: true,
  },
  {
    field: 'house_number',
    headerName: 'House #',
    width: 100,
    sortable: true,
    filter: true,
    hide: true,
  },
  {
    field: 'street',
    headerName: 'Street',
    width: 180,
    sortable: true,
    filter: true,
    hide: true,
  },
  {
    field: 'bin',
    headerName: 'BIN',
    width: 110,
    sortable: true,
    filter: true,
    hide: true,
  },
  {
    field: 'device_number',
    headerName: 'Device #',
    width: 120,
    sortable: true,
    filter: true,
    hide: true,
  },
  {
    field: 'isn_dob_bis_viol',
    headerName: 'ISN',
    width: 140,
    sortable: true,
    filter: true,
    hide: true,
  },
];

