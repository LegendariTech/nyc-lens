import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { OwnerContactRow } from './types';
import { formatDate } from '@/utils/formatters';

/**
 * Get the best available full name: prefer owner_full_name, then compile from first/middle/last
 */
function getFullName(row: OwnerContactRow): string {
    if (row.owner_full_name) {
        return row.owner_full_name;
    }

    const nameParts = [
        row.owner_first_name,
        row.owner_middle_name,
        row.owner_last_name,
    ].filter(Boolean);

    return nameParts.length > 0 ? nameParts.join(' ') : '';
}

/**
 * Get the best available address: primary first, then secondary
 */
function getBestAddress(row: OwnerContactRow): string {
    // Try primary address first
    const primaryParts = [
        row.owner_address,
        row.owner_city,
        row.owner_state,
        row.owner_zip,
    ].filter(Boolean);

    if (primaryParts.length > 0) {
        return primaryParts.join(', ');
    }

    // Fall back to secondary address
    const secondaryParts = [
        row.owner_address_2,
        row.owner_city_2,
        row.owner_state_2,
        row.owner_zip_2,
    ].filter(Boolean);

    return secondaryParts.length > 0 ? secondaryParts.join(', ') : '';
}

/**
 * Get the best available phone: primary first, then secondary
 */
function getBestPhone(row: OwnerContactRow): string {
    return row.owner_phone || row.owner_phone_2 || '';
}

/**
 * Format phone number as US format: (123) 456-7890
 */
function formatUSPhone(phone: string): string {
    if (!phone || phone === '') return phone;

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Format as US phone number if it has 10 digits
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // If it has 11 digits and starts with 1, format as US number with country code
    if (digits.length === 11 && digits.startsWith('1')) {
        const number = digits.slice(1);
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }

    // Return original if it doesn't match expected formats
    return phone;
}

export const ownerContactsColumnDefs: ColDef<OwnerContactRow>[] = [
    {
        field: 'date',
        headerName: 'Date',
        width: 140,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, Date>) => formatDate(p.value),
        filterValueGetter: (params) => formatDate(params.data?.date),
        comparator: (valueA: Date, valueB: Date) => {
            const dateA = valueA ? new Date(valueA).getTime() : 0;
            const dateB = valueB ? new Date(valueB).getTime() : 0;
            return dateA - dateB;
        },
    },
    {
        field: 'owner_full_name',
        headerName: 'Owner Name',
        width: 250,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => getFullName(p.data!),
        cellClass: 'multiline-cell',
    },
    {
        field: 'owner_business_name',
        headerName: 'Business Name',
        width: 220,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_phone',
        headerName: 'Phone',
        width: 160,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => {
            const phone = getBestPhone(p.data!);
            return phone !== '' ? formatUSPhone(phone) : phone;
        },
    },
    {
        field: 'owner_address',
        headerName: 'Address',
        width: 380,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => getBestAddress(p.data!),
        cellClass: 'multiline-cell',
    },
    {
        field: 'agency',
        headerName: 'Agency',
        width: 200,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'source',
        headerName: 'Source',
        width: 250,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    // Hidden columns - available via column menu
    {
        field: 'owner_type',
        headerName: 'Owner Type',
        width: 160,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_title',
        headerName: 'Title',
        width: 160,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_first_name',
        headerName: 'First Name',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_middle_name',
        headerName: 'Middle Name',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_last_name',
        headerName: 'Last Name',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_phone_2',
        headerName: 'Secondary Phone',
        width: 160,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => {
            const phone = p.value;
            return phone ? formatUSPhone(phone) : '';
        },
    },
    {
        field: 'owner_address_2',
        headerName: 'Secondary Address',
        width: 200,
        hide: true,
        cellClass: 'multiline-cell',
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => {
            if (!p.value) return '';

            // Combine secondary address components
            const secondaryParts = [
                p.value,
                p.data?.owner_city_2,
                p.data?.owner_state_2,
                p.data?.owner_zip_2,
            ].filter(Boolean);

            return secondaryParts.length > 0 ? secondaryParts.join(', ') : '';
        },
    },
    {
        field: 'owner_city_2',
        headerName: 'Secondary City',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_state_2',
        headerName: 'Secondary State',
        width: 150,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
    {
        field: 'owner_zip_2',
        headerName: 'Secondary ZIP',
        width: 120,
        hide: true,
        valueFormatter: (p: ValueFormatterParams<OwnerContactRow, string>) => p.value || '',
    },
];
