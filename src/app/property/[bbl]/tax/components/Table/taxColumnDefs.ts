import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { TaxRow } from '../taxTypes';
import { formatCurrency } from '@/utils/formatters';

/**
 * Format percentage value
 * Removes trailing zeros after decimal point
 */
function formatPercentage(value: number | null | undefined, digits: number = 2): string {
  if (value == null) return 'N/A';
  const formatted = value.toFixed(digits);
  // Remove trailing zeros after decimal point
  const trimmed = formatted.replace(/\.?0+$/, '');
  return `${trimmed}%`;
}

/**
 * Format year over year change with sign
 */
function formatYoyChange(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  const percentage = value * 100;
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

export const taxColumnDefs: ColDef<TaxRow>[] = [
  {
    field: 'year',
    headerName: 'Year',
    width: 120,
    pinned: 'left',
    sortable: true,
    comparator: (valueA: string, valueB: string, nodeA, nodeB) => {
      // Sort by raw year in descending order (most recent first)
      const yearA = nodeA?.data?.rawYear || '';
      const yearB = nodeB?.data?.rawYear || '';
      return yearB.localeCompare(yearA);
    },
  },
  {
    field: 'marketValue',
    headerName: 'Market Value',
    width: 150,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatCurrency(p.value),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'assessedValue',
    headerName: 'Assessed Value',
    width: 160,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatCurrency(p.value),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'taxable',
    headerName: 'Taxable',
    width: 140,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatCurrency(p.value),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'taxRate',
    headerName: 'Tax Rate %',
    width: 130,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatPercentage(p.value, 4),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'propertyTax',
    headerName: 'Property Tax',
    width: 150,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatCurrency(p.value),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'yoyChange',
    headerName: 'Year Over Year Change',
    width: 200,
    sortable: true,
    valueFormatter: (p: ValueFormatterParams<TaxRow, number>) => formatYoyChange(p.value),
    cellClass: 'ag-right-aligned-cell',
    cellStyle: (params) => {
      if (params.value == null) return undefined;
      return {
        color: params.value >= 0 ? '#4ade80' : '#f87171', // green for positive, red for negative
      };
    },
  },
];

