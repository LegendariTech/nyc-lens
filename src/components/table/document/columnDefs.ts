import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { AcrisDoc } from '@/types/acris';
import { formatCurrency, formatDateMMDDYYYY } from '@/utils/formatters';
import {
  DEFAULT_DATE_FILTER_PARAMS,
  DEFAULT_NUMBER_FILTER_PARAMS,
} from '../constants/filters';
import { LinkCell } from './LinkCell';
import { ACRIS_CONTROL_CODES as CONTROL_CODES } from '@/constants/acris';

// Build lookup maps and the full values list for the Set Filter tree list
type ControlRow = { [k: string]: string | null };
const DOC_TYPE_KEY = 'DOC. TYPE';
const DOC_TYPE_DESC_KEY = 'DOC. TYPE DESCRIPTION';
const CLASS_DESC_KEY = 'CLASS CODE DESCRIPTION';

const docTypeToDesc: Record<string, string> = {};
const docTypeToClass: Record<string, string> = {};
const docTypeValues: string[] = [];
const classDescriptions = new Set<string>();

(CONTROL_CODES as unknown as ControlRow[]).forEach((row) => {
  const code = (row[DOC_TYPE_KEY] || '').trim();
  const desc = (row[DOC_TYPE_DESC_KEY] || '').trim();
  const cls = (row[CLASS_DESC_KEY] || '').trim();
  if (!code) return;
  if (!(code in docTypeToDesc)) docTypeToDesc[code] = desc;
  if (!(code in docTypeToClass)) docTypeToClass[code] = cls;
  if (!docTypeValues.includes(code)) docTypeValues.push(code);
  if (cls) classDescriptions.add(cls);
})

export const detailColDefs: ColDef<AcrisDoc>[] = [
  {
    field: 'document_type',
    headerName: 'Type',
    width: 140,
    cellRenderer: 'agGroupCellRenderer',
    filter: 'agSetColumnFilter',
    floatingFilter: true,
    filterParams: {
      values: docTypeValues,
      defaultToNothingSelected: true,
      treeList: true,
      comparator: (a: string | null, b: string | null) => {
        const A = a || '';
        const B = b || '';
        return A.localeCompare(B);
      },
      treeListPathGetter: (value: string | null) => {
        if (!value) return null;
        const code = value as string;
        const cls = docTypeToClass[code] || '';
        return cls ? [cls, code] : [code];
      },
      treeListFormatter: (pathKey: string | null, level: number) => {
        if (pathKey == null) return '';
        if (level === 0) return pathKey; // Class group
        const code = pathKey;
        const desc = docTypeToDesc[code] || '';
        return desc ? `${code} - ${desc}` : code;
      },
    },
  },
  {
    field: 'document_amount',
    headerName: 'Amount',
    width: 150,
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    filterParams: { ...DEFAULT_NUMBER_FILTER_PARAMS },
    valueFormatter: (
      p: ValueFormatterParams<AcrisDoc, number>
    ) => formatCurrency(p.value),
    cellClass: 'ag-right-aligned-cell',
  },
  {
    field: 'document_date',
    headerName: 'Date',
    width: 200,
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: { ...DEFAULT_DATE_FILTER_PARAMS },
    valueFormatter: (
      p: ValueFormatterParams<AcrisDoc, string>
    ) => formatDateMMDDYYYY(p.value),
  },
  {
    field: 'recorded_date',
    headerName: 'Recorded Date',
    width: 200,
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: { ...DEFAULT_DATE_FILTER_PARAMS },
    valueFormatter: (
      p: ValueFormatterParams<AcrisDoc, string>
    ) => formatDateMMDDYYYY(p.value),
  },
  { field: 'doc_type_description', headerName: 'Description', width: 280 },
  { field: 'class_code_description', headerName: 'Class', width: 280, hide: true },
  {
    field: 'master_document_id',
    headerName: 'Link',
    width: 200,
    filter: false,
    cellRenderer: LinkCell,
  },
];


