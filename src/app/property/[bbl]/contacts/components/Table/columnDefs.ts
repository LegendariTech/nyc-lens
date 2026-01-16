import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { OwnerContactRow } from './types';
import { formatDate, formatUSPhone } from '@/utils/formatters';

export const ownerContactsColumnDefs: ColDef<OwnerContactRow>[] = [
    {
        field: 'date',
        headerName: 'Date',
        width: 140,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, Date | string>) => {
            if (!p.value) return '';
            return formatDate(p.value);
        },
        filterValueGetter: (params) => formatDate(params.data?.date),
        comparator: (valueA: Date | string, valueB: Date | string) => {
            const dateA = valueA ? new Date(valueA).getTime() : 0;
            const dateB = valueB ? new Date(valueB).getTime() : 0;
            return dateA - dateB;
        },
    },
    {
        field: 'owner_master_full_name',
        headerName: 'Master Name',
        width: 280,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_phone',
        headerName: 'Phone',
        width: 160,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => {
            const phone = p.value;
            if (!phone || phone === '') return '';

            // Handle multiple phones separated by newlines
            if (phone.includes('\n')) {
                return phone
                    .split('\n')
                    .map(p => formatUSPhone(p.trim()))
                    .filter(p => p)
                    .join('\n');
            }

            return formatUSPhone(phone);
        },
        cellClass: 'multiline-cell',
    },
    {
        field: 'agency',
        headerName: 'Agency',
        width: 150,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string[]>) => {
            if (!p.value) return '';
            if (Array.isArray(p.value)) {
                return p.value.filter(item => item && item.trim()).join(', ');
            }
            return '';
        },
    },
    {
        field: 'owner_full_name',
        headerName: 'All Names',
        width: 290,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string | string[]>) => {
            // Handle array or string (already joined with \n in tableContacts)
            if (Array.isArray(p.value)) {
                return p.value.filter(name => name && name.trim()).join('\n');
            }
            return p.value || '';
        },
        cellClass: 'multiline-cell',
    },
    {
        field: 'owner_business_name',
        headerName: 'Business Name',
        width: 280,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
        cellClass: 'multiline-cell',
    },
    {
        field: 'owner_full_address',
        headerName: 'Address',
        width: 600,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string | string[]>) => {
            // Handle array or string
            if (Array.isArray(p.value)) {
                return p.value.filter(addr => addr && addr.trim()).join('\n');
            }
            return p.value || '';
        },
        cellClass: 'multiline-cell',
    },
    {
        field: 'owner_title',
        headerName: 'Title',
        width: 160,
        hide: false,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string | string[]>) => {
            // Handle array or string
            if (Array.isArray(p.value)) {
                return p.value.filter(title => title && title.trim()).join('\n');
            }
            return p.value || '';
        },
        cellClass: 'multiline-cell',
    },
    // Hidden columns - available via column menu
    {
        field: 'bucket_name',
        headerName: 'Bucket',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'merged_count',
        headerName: 'Merged Count',
        width: 140,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, number>) => {
            return p.value != null ? p.value.toString() : '';
        },
    },
    {
        field: 'bbl',
        headerName: 'BBL',
        width: 140,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'source',
        headerName: 'Source',
        width: 180,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string[]>) => {
            if (!p.value) return '';
            if (Array.isArray(p.value)) {
                return p.value.filter(item => item && item.trim()).join(', ');
            }
            return '';
        },
    },
];
