'use client';

import { cn } from '@/utils/cn';
import { ExpandableList } from './ExpandableList';
import { CATEGORY_METADATA } from '../utils';
import type { FormattedContactWithCategory } from '../types';

interface ContactCardProps {
  contact: FormattedContactWithCategory;
}

/**
 * Format date for display
 */
function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ContactCard({ contact }: ContactCardProps) {
  const metadata = CATEGORY_METADATA[contact.category];

  // Arrays are already provided by FormattedOwnerContact
  const phones = contact.owner_phone;
  const addresses = contact.owner_address;
  const businessNames = contact.owner_business_name;

  // Get contact name (full name or first business name)
  const contactName = contact.owner_full_name || businessNames[0] || 'Unknown';

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-foreground/5 p-3 shadow-md',
        'hover:shadow-lg hover:border-foreground/20 transition-all',
        metadata.filterBorderActive
      )}
    >
      <div className="space-y-2">
        {/* Header: Category chip and date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border',
              metadata.filterBorderActive,
              metadata.filterBgActive,
              metadata.filterTextActive
            )}
          >
            {metadata.label}
          </span>
          {contact.date && (
            <span
              className={cn(
                'text-xs font-semibold',
                metadata.textColor,
                metadata.darkTextColor
              )}
            >
              {formatDate(contact.date)}
            </span>
          )}
        </div>

        {/* Contact Name */}
        <div className="text-base font-bold text-foreground">
          {contactName}
        </div>

        {/* Title if present */}
        {contact.owner_title && (
          <div className="text-sm text-foreground/70">
            {contact.owner_title}
          </div>
        )}

        {/* Contact details */}
        <div className="space-y-2 text-sm pt-1 border-t border-foreground/10">
          {/* Phones */}
          <ExpandableList items={phones} label={phones.length > 1 ? 'Phones' : 'Phone'} />

          {/* Business Names (only if different from contact name) */}
          {businessNames.length > 0 && contact.owner_full_name && (
            <ExpandableList items={businessNames} label="Business Names" />
          )}

          {/* Addresses */}
          <ExpandableList items={addresses} label={addresses.length > 1 ? 'Addresses' : 'Address'} />
        </div>
      </div>
    </div>
  );
}
