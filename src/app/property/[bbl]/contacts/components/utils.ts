import type { OwnerContact } from '@/types/contacts';
import type { FormattedOwnerContact } from '@/data/contacts/utils';
import type { ContactCategory, CategoryMetadata, ContactWithCategory } from './types';

/**
 * Contact with agency and source fields (minimum required for categorization)
 */
type ContactWithAgencySource = {
  agency: string | null;
  source: string | null;
};

/**
 * Category metadata for different contact sources
 * Reusing colors from transactions for Sale (amber) and Mortgage (blue)
 */
export const CATEGORY_METADATA: Record<ContactCategory, CategoryMetadata> = {
  'assessment-roll': {
    key: 'assessment-roll',
    label: 'Assessment Roll',
    pluralLabel: 'Assessment Roll',
    abbreviation: 'AR',
    color: 'purple-500',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    darkTextColor: 'dark:text-purple-400',
    filterBgActive: 'bg-purple-500/10',
    filterTextActive: 'text-purple-600 dark:text-purple-400',
    filterBorderActive: 'border-purple-500/50',
    defaultVisible: true,
  },
  'hpd-registration': {
    key: 'hpd-registration',
    label: 'HPD Registration',
    pluralLabel: 'HPD Registration',
    abbreviation: 'HPD',
    color: 'green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500',
    textColor: 'text-green-600',
    darkTextColor: 'dark:text-green-400',
    filterBgActive: 'bg-green-500/10',
    filterTextActive: 'text-green-600 dark:text-green-400',
    filterBorderActive: 'border-green-500/50',
    defaultVisible: true,
  },
  permits: {
    key: 'permits',
    label: 'Permit',
    pluralLabel: 'Permits',
    abbreviation: 'P',
    color: 'orange-500',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600',
    darkTextColor: 'dark:text-orange-400',
    filterBgActive: 'bg-orange-500/10',
    filterTextActive: 'text-orange-600 dark:text-orange-400',
    filterBorderActive: 'border-orange-500/50',
    defaultVisible: true,
  },
  sale: {
    key: 'sale',
    label: 'Sale',
    pluralLabel: 'Sale',
    abbreviation: 'S',
    color: 'amber-500',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    darkTextColor: 'dark:text-amber-400',
    filterBgActive: 'bg-amber-500/10',
    filterTextActive: 'text-amber-600 dark:text-amber-400',
    filterBorderActive: 'border-amber-500/50',
    defaultVisible: true,
  },
  mortgage: {
    key: 'mortgage',
    label: 'Mortgage',
    pluralLabel: 'Mortgage',
    abbreviation: 'M',
    color: 'blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    darkTextColor: 'dark:text-blue-400',
    filterBgActive: 'bg-blue-500/10',
    filterTextActive: 'text-blue-600 dark:text-blue-400',
    filterBorderActive: 'border-blue-500/50',
    defaultVisible: true,
  },
  'prior-sale': {
    key: 'prior-sale',
    label: 'Prior Sale',
    pluralLabel: 'Prior Sale',
    abbreviation: 'PS',
    color: 'amber-700',
    borderColor: 'border-amber-700',
    bgColor: 'bg-amber-700',
    textColor: 'text-amber-800',
    darkTextColor: 'dark:text-amber-300',
    filterBgActive: 'bg-amber-700/10',
    filterTextActive: 'text-amber-800 dark:text-amber-300',
    filterBorderActive: 'border-amber-700/50',
    defaultVisible: false,
  },
  'prior-mortgage': {
    key: 'prior-mortgage',
    label: 'Prior Mortgage',
    pluralLabel: 'Prior Mortgage',
    abbreviation: 'PM',
    color: 'blue-700',
    borderColor: 'border-blue-700',
    bgColor: 'bg-blue-700',
    textColor: 'text-blue-800',
    darkTextColor: 'dark:text-blue-300',
    filterBgActive: 'bg-blue-700/10',
    filterTextActive: 'text-blue-800 dark:text-blue-300',
    filterBorderActive: 'border-blue-700/50',
    defaultVisible: false,
  },
};

/**
 * Category display order for filters and UI
 */
export const CATEGORY_ORDER: readonly ContactCategory[] = [
  'assessment-roll',
  'hpd-registration',
  'permits',
  'sale',
  'mortgage',
  'prior-sale',
  'prior-mortgage',
] as const;

/**
 * Get the category of a contact based on agency and source
 *
 * Category mappings:
 * - Assessment Roll: DOF property valuations (tax assessor records)
 * - HPD Registration: Housing Preservation & Development registrations
 * - Permits: All Department of Buildings records
 * - Sale: Most recent property sale from DOF
 * - Mortgage: Most recent mortgage from DOF
 * - Prior Sale: Prior property sales (disabled by default for decluttering)
 * - Prior Mortgage: Prior mortgages (disabled by default for decluttering)
 *
 * @see Database schema: gold.owner_contact table
 */
export function getContactCategory(contact: ContactWithAgencySource): ContactCategory {
  const agency = contact.agency?.toLowerCase() || '';
  const source = contact.source?.toLowerCase() || '';

  // Assessment Roll - dof + property_valuation
  if (agency === 'dof' && source === 'property_valuation') {
    return 'assessment-roll';
  }

  // HPD Registration - hpd + multiple_dwelling_registrations
  if (agency === 'hpd' && source === 'multiple_dwelling_registrations') {
    return 'hpd-registration';
  }

  // Permits - all records where agency is dob
  if (agency === 'dob') {
    return 'permits';
  }

  // Sale - dof + latest_sale
  if (agency === 'dof' && source === 'latest_sale') {
    return 'sale';
  }

  // Mortgage - dof + latest_mortgage
  if (agency === 'dof' && source === 'latest_mortgage') {
    return 'mortgage';
  }

  // Prior Sale - dof + prior_sale
  if (agency === 'dof' && source === 'prior_sale') {
    return 'prior-sale';
  }

  // Prior Mortgage - dof + prior_mortgage
  if (agency === 'dof' && source === 'prior_mortgage') {
    return 'prior-mortgage';
  }

  // Log warning for unmatched categories in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `No category match for contact: agency="${contact.agency}", source="${contact.source}". Defaulting to assessment-roll.`
    );
  }

  // Default to assessment-roll if no match (shouldn't happen with valid data)
  return 'assessment-roll';
}

/**
 * Get category metadata for a contact
 */
export function getCategoryMetadata(contact: ContactWithAgencySource): CategoryMetadata {
  const category = getContactCategory(contact);
  return CATEGORY_METADATA[category];
}

/**
 * Add category to each contact
 */
export function enrichContactsWithCategory(contacts: OwnerContact[]): ContactWithCategory[] {
  return contacts.map(contact => ({
    ...contact,
    category: getContactCategory(contact),
  }));
}

/**
 * Get default visible categories (all except past-sale and prior-mortgage)
 */
export function getDefaultVisibleCategories(): Set<ContactCategory> {
  return new Set(
    (Object.keys(CATEGORY_METADATA) as ContactCategory[]).filter(
      category => CATEGORY_METADATA[category].defaultVisible
    )
  );
}
