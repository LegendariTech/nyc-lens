import type { OwnerContact } from '@/types/contacts';
import type { FormattedOwnerContact } from '@/data/contacts/utils';

/**
 * Contact category types for filtering
 */
export type ContactCategory =
  | 'assessment-roll'
  | 'hpd-registration'
  | 'permits'
  | 'sale'
  | 'mortgage'
  | 'prior-sale'
  | 'prior-mortgage';

/**
 * Category metadata for styling and display
 */
export interface CategoryMetadata {
  key: ContactCategory;
  label: string;
  pluralLabel: string;
  abbreviation: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  darkTextColor: string;
  filterBgActive: string;
  filterTextActive: string;
  filterBorderActive: string;
  defaultVisible: boolean;
}

/**
 * Contact with additional computed fields
 */
export interface ContactWithCategory extends OwnerContact {
  category: ContactCategory;
}

/**
 * Formatted contact with arrays and category (for mobile card view)
 */
export interface FormattedContactWithCategory extends FormattedOwnerContact {
  category: ContactCategory;
}
