import Link from 'next/link';
import type { ColDef, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
import { DEFAULT_TEXT_FILTER_PARAMS } from '@/components/table/constants/filters';
import { formatDate, formatCurrency } from '@/utils/formatters';
import type { CondoUnitSummary } from '../utils';
import { getCondoClassLabel } from './condoUtils';

function UnitCell(params: ICellRendererParams<CondoUnitSummary>) {
  const { data, value, context } = params;
  if (!data || !value) return <span>{value || ''}</span>;

  const onUnitClick = context?.onUnitClick as ((unit: CondoUnitSummary) => void) | undefined;
  const addressSegment = context?.addressSegment as string | undefined;

  return (
    <Link
      href={`/property/${data.bbl}/overview${addressSegment ? `/${addressSegment}` : ''}`}
      className="text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
      onClick={() => onUnitClick?.(data)}
    >
      {value}
    </Link>
  );
}

function BlurredCell(params: ICellRendererParams<CondoUnitSummary>) {
  const displayValue = params.valueFormatted ?? params.value ?? '';
  if (!displayValue) return null;

  return (
    <span className="blur-[5px] select-none">{displayValue}</span>
  );
}

export function getCondoUnitColumnDefs(isSignedIn: boolean): ColDef<CondoUnitSummary>[] {
  const blurredCellRenderer = !isSignedIn ? BlurredCell : undefined;

  return [
    {
      field: 'unit',
      headerName: 'Unit',
      width: 120,
      pinned: 'left',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        ...DEFAULT_TEXT_FILTER_PARAMS,
      },
      cellRenderer: UnitCell,
    },
    {
      field: 'buildingClass',
      headerName: 'Type',
      width: 170,
      valueFormatter: (params: ValueFormatterParams<CondoUnitSummary, string>) =>
        getCondoClassLabel(params.value),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 220,
      cellRenderer: blurredCellRenderer,
    },
    {
      field: 'saleAmount',
      headerName: 'Sale Price',
      width: 140,
      valueFormatter: (params: ValueFormatterParams<CondoUnitSummary, number>) =>
        params.value ? formatCurrency(params.value) : '',
      cellRenderer: blurredCellRenderer,
    },
    {
      field: 'saleDate',
      headerName: 'Sale Date',
      width: 130,
      valueFormatter: (params: ValueFormatterParams<CondoUnitSummary, string>) =>
        formatDate(params.value),
      cellRenderer: blurredCellRenderer,
    },
    {
      field: 'mortgageAmount',
      headerName: 'Mortgage',
      width: 140,
      valueFormatter: (params: ValueFormatterParams<CondoUnitSummary, number>) =>
        params.value ? formatCurrency(params.value) : '',
      cellRenderer: blurredCellRenderer,
    },
    {
      field: 'lender',
      headerName: 'Lender',
      width: 200,
      cellRenderer: blurredCellRenderer,
    },
    {
      field: 'bbl',
      headerName: 'BBL',
      width: 140,
      hide: true,
    },
  ];
}
