import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobViolationRow } from './types';
import { formatDate } from '@/utils/formatters';

export const dobViolationColumnDefs: ColDef<DobViolationRow>[] = [
  {
    field: 'violation_number',
    headerName: 'Violation #',
    width: 220,
    pinned: 'left',
    sortable: true,
    filter: true,
  },
  {
    field: 'violation_issue_date',
    headerName: 'Issue Date',
    width: 150,
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
    headerName: 'Type Code',
    width: 200,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
  },
  {
    field: 'violation_status',
    headerName: 'Status',
    width: 130,
    sortable: true,
    filter: true,
  },
  {
    field: 'device_type',
    headerName: 'Device Type',
    width: 160,
    sortable: true,
    filter: true,
  },
  {
    field: 'violation_remarks',
    headerName: 'Remarks',
    width: 600,
    sortable: true,
    filter: true,
    wrapText: true,
    autoHeight: true,
    cellClass: 'multiline-cell',
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'violation_remarks',
  },
  {
    field: 'device_number',
    headerName: 'Device #',
    width: 150,
    sortable: true,
    filter: true,
  },
  {
    field: 'cycle_end_date',
    headerName: 'Cycle End Date',
    width: 150,
    sortable: true,
    filter: true,
    valueFormatter: (p: ValueFormatterParams<DobViolationRow, string>) => formatDate(p.value),
  },
];

