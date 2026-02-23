import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { AcrisRecord } from '@/types/acris';
import { BOROUGH_NAMES, BOROUGH_FILTER_VALUES, getBoroughDisplayName } from '@/constants/nyc';
import Link from 'next/link';
import { buildPropertyUrl } from '@/utils/urlSlug';
import {
  DEFAULT_TEXT_FILTER_PARAMS,
  DEFAULT_MATCH_TEXT_FILTER_PARAMS,
  DEFAULT_DATE_FILTER_PARAMS,
  DEFAULT_NUMBER_FILTER_PARAMS,
} from '../constants/filters';
import {
  BUILDING_CLASS_FILTER_VALUES,
  BUILDING_CLASS_CODE_MAP,
} from '@/constants/building';
import { formatCurrency, formatDateMMDDYYYY } from '@/utils/formatters';
import { AkaCell } from './AkaCell';

export const colDefs: ColDef<AcrisRecord>[] = [
  {
    headerName: '',
    cellRenderer: 'agGroupCellRenderer',
    width: 50,
    minWidth: 50,
    maxWidth: 50,
    lockPosition: 'left',
    lockVisible: true,
    suppressColumnsToolPanel: true,
    suppressHeaderMenuButton: true,
    sortable: false,
    filter: false,
    resizable: false,
    pinned: 'left',
  },
  {
    headerName: '#',
    width: 70,
    minWidth: 70,
    maxWidth: 70,
    lockPosition: 'left',
    lockVisible: true,
    suppressColumnsToolPanel: true,
    suppressHeaderMenuButton: true,
    sortable: false,
    filter: false,
    resizable: false,
    pinned: 'left',
    cellRenderer: (params: ValueFormatterParams) => {
      // Display the row number (node.rowIndex is 0-based, so add 1)
      return params.node?.rowIndex != null ? params.node.rowIndex + 1 : '';
    },
  },
  {
    field: 'borough',
    // hide: true,
    // cellRenderer: 'agGroupCellRenderer',
    headerName: 'Borough',
    filter: 'agSetColumnFilter',
    width: 150,
    valueFormatter: (params: ValueFormatterParams<AcrisRecord, string>) => {
      return (params.value || '') + ' - ' + BOROUGH_NAMES[params.value || ''];
    },
    filterParams: {
      values: BOROUGH_FILTER_VALUES,
      defaultToNothingSelected: true,
      valueFormatter: (params: ValueFormatterParams<AcrisRecord, string>) => {
        return (params.value || '') + ' - ' + BOROUGH_NAMES[params.value || ''];
      },
    },
    floatingFilter: true,

  },
  {
    field: 'block',
    // hide: true,
    headerName: 'Block',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    width: 125,
    filterParams: {
      ...DEFAULT_TEXT_FILTER_PARAMS,
    }
  },
  {
    field: 'lot',
    headerName: 'Lot',
    // hide: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    width: 115,
    filterParams: {
      ...DEFAULT_TEXT_FILTER_PARAMS,
    }
  },
  {
    field: 'address',
    headerName: 'Address',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    width: 300,
    cellRenderer: (params: ValueFormatterParams<AcrisRecord, string>) => {
      const bbl = `${params?.data?.borough}-${params?.data?.block}-${params?.data?.lot}`;
      // Use getBoroughDisplayName to convert Manhattan → "New York" for addresses
      const boroughName = params?.data?.borough ? getBoroughDisplayName(params.data.borough) : '';

      const url = buildPropertyUrl(bbl, 'overview', {
        street: params.value || '',
        borough: boroughName,
        state: 'NY',
        zip: params?.data?.zip_code
      });

      return (
        <Link
          href={url}
          className="text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
        >
          {params.value}
        </Link>
      );
    },
    filterParams: {
      ...DEFAULT_TEXT_FILTER_PARAMS,
    }
  },
  {
    // unit
    field: 'unit',
    hide: true,
    headerName: 'Unit',
    filter: 'agTextColumnFilter',
    width: 100,
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_TEXT_FILTER_PARAMS,
      filterOptions: [
        ...DEFAULT_TEXT_FILTER_PARAMS.filterOptions,
        'blank',
        'notBlank',
      ],
    }
  },
  {
    field: 'aka',
    hide: true,
    width: 100,
    headerName: 'AKA',
    sortable: false,
    filter: false,
    cellRenderer: AkaCell,
  },
  {
    field: 'avroll_building_class',
    // hide: true,
    headerName: 'Building Class',
    filter: 'agSetColumnFilter',
    width: 350,
    valueFormatter: (params: ValueFormatterParams<AcrisRecord, string>) => {
      const code = params.value || '';
      const desc = BUILDING_CLASS_CODE_MAP[code] || '';
      return desc ? `${code} - ${desc}` : code;
    },
    filterParams: {
      values: BUILDING_CLASS_FILTER_VALUES,
      treeList: true,
      treeListPathGetter: (value: string | null) => {
        if (!value) return null;
        const code = value as string;
        if (!code) return null;
        return [code[0], code];
      },
      treeListFormatter: (pathKey: string | null) => {
        if (pathKey == null) return '';
        const description = BUILDING_CLASS_CODE_MAP[pathKey] || '';
        return `${pathKey} - ${description}`.trim();
      },
      defaultToNothingSelected: false,
      // valueFormatter not needed when using tree list
    },
    floatingFilter: true,
  },
  // {
  //   field: 'avroll_units',
  //   hide: true,
  //   headerName: 'Units',
  //   filter: 'agNumberColumnFilter',
  //   width: 100,
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_NUMBER_FILTER_PARAMS,
  //   }
  // },
  {
    field: 'avroll_building_story',
    hide: true,
    headerName: 'Story',
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    width: 100,
    filterParams: {
      ...DEFAULT_NUMBER_FILTER_PARAMS,
    }
  },
  {
    field: 'mortgage_document_date',
    headerName: 'Mortgage Date',
    valueFormatter: ({ value }) => formatDateMMDDYYYY(value),
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_DATE_FILTER_PARAMS
    }
  },
  {
    field: 'mortgage_document_amount',
    headerName: 'Mortgage Amount',
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    valueFormatter: ({ value }) => formatCurrency(value),
    filterParams: {
      ...DEFAULT_NUMBER_FILTER_PARAMS
    }
  },
  {
    field: 'borrower_name',
    headerName: 'Borrower',
    width: 250,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
    }
  },
  {
    field: 'lender_name',
    headerName: 'Lender',
    width: 250,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
    }
  },
  {
    field: 'mortgage_recorded_date',
    hide: true,
    headerName: 'Mortgage Recorded Date',
    valueFormatter: ({ value }) => formatDateMMDDYYYY(value),
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_DATE_FILTER_PARAMS
    }
  },
  {
    field: 'sale_document_date',
    headerName: 'Sale Date',
    width: 200,
    valueFormatter: ({ value }) => formatDateMMDDYYYY(value),
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_DATE_FILTER_PARAMS
    }
  },
  {
    field: 'sale_document_amount',
    headerName: 'Sale Amount',
    width: 150,
    valueFormatter: ({ value }) => formatCurrency(value),
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_NUMBER_FILTER_PARAMS
    }
  },
  {
    field: 'buyer_name',
    headerName: 'Recorded Owner',
    width: 250,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
    }
  },
  {
    field: 'sale_recorded_date',
    hide: true,
    headerName: 'Sale Recorded Date',
    valueFormatter: ({ value }) => formatDateMMDDYYYY(value),
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_DATE_FILTER_PARAMS
    }
  },
  // {
  //   hide: true,
  //   field: 'prior_mortgage_document_date',
  //   headerName: 'Prior Mortgage Date',
  //   valueFormatter: ({ value }) => formatDateMMDDYYYY(value),
  //   filter: 'agDateColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_DATE_FILTER_PARAMS
  //   }
  // },
  // {
  //   hide: true,
  //   field: 'prior_mortgage_document_amount',
  //   headerName: 'Prior Mortgage Amount',
  //   valueFormatter: ({ value }) => formatCurrency(value),
  //   filter: 'agNumberColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_NUMBER_FILTER_PARAMS
  //   }
  // },
  // {
  //   field: 'prior_lender',
  //   hide: true,
  //   headerName: 'Prior Lender',
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
  //   }
  // },
  // {
  //   field: 'prior_lendee',
  //   hide: true,
  //   headerName: 'Prior Lendee',
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
  //   }
  // },
  // {
  //   field: 'hpd_name',
  //   hide: true,
  //   headerName: 'HPD Name',
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_MATCH_TEXT_FILTER_PARAMS
  //   }
  // },
  // {
  //   field: 'hpd_phone',
  //   hide: true,
  //   headerName: 'HPD Phone',
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true,
  //   filterParams: {
  //     ...DEFAULT_TEXT_FILTER_PARAMS
  //   }
  // },
  {
    field: 'purchase_refinance',
    hide: true,
    headerName: 'Purchase Refinance',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    filterParams: {
      ...DEFAULT_TEXT_FILTER_PARAMS
    }
  }];


