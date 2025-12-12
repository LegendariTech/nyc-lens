'use client';

import { cn } from '@/utils/cn';
import { ExpandableList } from './ExpandableList';
import { CATEGORY_METADATA } from '../utils';
import type { ContactWithCategory } from '../types';

interface ContactCardProps {
  contact: ContactWithCategory;
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

/**
 * Parse newline-separated string into array
 */
function parseNewlineString(value: string | null): string[] {
  if (!value) return [];
  return value.split('\n').filter(item => item && item.trim());
}

export function ContactCard({ contact }: ContactCardProps) {
  const metadata = CATEGORY_METADATA[contact.category];

  // Parse the newline-separated fields into arrays
  const phones = parseNewlineString(contact.owner_phone);
  const addresses = parseNewlineString(contact.owner_address);
  const businessNames = parseNewlineString(contact.owner_business_name);

  // Get contact name (full name or business name)
  const contactName = contact.owner_full_name || businessNames[0] || 'Unknown';

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-card p-3 shadow-sm',
        'hover:shadow-md transition-shadow',
        metadata.filterBorderActive
      )}
    >
      <div className="space-y-2">
        {/* Header: Category chip and date */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            title={metadata.label}
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase border',
              metadata.filterBorderActive,
              metadata.filterBgActive,
              metadata.filterTextActive
            )}
          >
            {metadata.abbreviation}
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
          <ExpandableList items={phones} label="Phone" />

          {/* Business Names (only if different from contact name) */}
          {businessNames.length > 0 && contact.owner_full_name && (
            <ExpandableList items={businessNames} label="Business" />
          )}

          {/* Addresses */}
          <ExpandableList items={addresses} label="Address" />
        </div>
      </div>
    </div>
  );
}
