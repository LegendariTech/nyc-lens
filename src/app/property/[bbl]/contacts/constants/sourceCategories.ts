/**
 * Source category mappings and metadata for contacts
 */

// Source category type for filtering
export type SourceCategory = 'dob_permits' | 'recorded_owner' | 'recorded_borrower' | 'hpd' | 'unmasked_owner' | 'tax_owner';

// Mapping of individual sources to categories
export const SOURCE_TO_CATEGORY: Record<string, SourceCategory> = {
    'dob_electrical_permit_applications': 'dob_permits',
    'dob_elevator_permit_applications_now': 'dob_permits',
    'dob_permit_issuance_historical': 'dob_permits',
    'dob_job_application_filling': 'dob_permits',
    'dob_job_application_filling_now': 'dob_permits',
    'dob_permit_approved': 'dob_permits',
    'dob_permit_issuance': 'dob_permits',
    'latest_sale': 'recorded_owner',
    'latest_mortgage': 'recorded_borrower',
    'multiple_dwelling_registrations': 'hpd',
    'signator': 'unmasked_owner',
    'property_valuation': 'tax_owner',
};

// Category display names
export const CATEGORY_LABELS: Record<SourceCategory, string> = {
    'dob_permits': 'DOB Permits',
    'recorded_owner': 'Recorded Owner',
    'recorded_borrower': 'Recorded Borrower',
    'hpd': 'HPD',
    'unmasked_owner': 'Unmasked Owner',
    'tax_owner': 'Tax Owner',
};

// Category styles for chips
export const CATEGORY_CHIP_STYLES: Record<SourceCategory, string> = {
    'dob_permits': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    'recorded_owner': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    'recorded_borrower': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    'hpd': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    'unmasked_owner': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    'tax_owner': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
};

// Source category metadata for FilterLegend
export const SOURCE_METADATA: Record<SourceCategory, {
    pluralLabel: string;
    filterBorderActive: string;
    filterBgActive: string;
    filterTextActive: string;
    borderColor: string;
    bgColor: string;
}> = {
    'dob_permits': {
        pluralLabel: 'DOB Permits',
        filterBorderActive: 'border-blue-500/50',
        filterBgActive: 'bg-blue-500/10',
        filterTextActive: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-500',
    },
    'recorded_owner': {
        pluralLabel: 'Recorded Owner',
        filterBorderActive: 'border-purple-500/50',
        filterBgActive: 'bg-purple-500/10',
        filterTextActive: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-500',
    },
    'recorded_borrower': {
        pluralLabel: 'Recorded Borrower',
        filterBorderActive: 'border-indigo-500/50',
        filterBgActive: 'bg-indigo-500/10',
        filterTextActive: 'text-indigo-600 dark:text-indigo-400',
        borderColor: 'border-indigo-500',
        bgColor: 'bg-indigo-500',
    },
    'hpd': {
        pluralLabel: 'HPD',
        filterBorderActive: 'border-orange-500/50',
        filterBgActive: 'bg-orange-500/10',
        filterTextActive: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-500',
    },
    'unmasked_owner': {
        pluralLabel: 'Unmasked Owner',
        filterBorderActive: 'border-teal-500/50',
        filterBgActive: 'bg-teal-500/10',
        filterTextActive: 'text-teal-600 dark:text-teal-400',
        borderColor: 'border-teal-500',
        bgColor: 'bg-teal-500',
    },
    'tax_owner': {
        pluralLabel: 'Tax Owner',
        filterBorderActive: 'border-amber-500/50',
        filterBgActive: 'bg-amber-500/10',
        filterTextActive: 'text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-500',
    },
};
