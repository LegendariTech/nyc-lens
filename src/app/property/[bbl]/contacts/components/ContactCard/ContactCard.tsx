'use client';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { ExpandableList } from './ExpandableList';
import type { OwnerContact } from '@/types/contacts';

interface ContactCardProps {
  contact: OwnerContact;
}

// Status metadata for styling
const STATUS_METADATA = {
  'current': {
    label: 'Current',
    filterBorderActive: 'border-green-500/50',
    filterBgActive: 'bg-green-500/10',
    filterTextActive: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-600',
    darkTextColor: 'dark:text-green-400',
  },
  'past': {
    label: 'Past',
    filterBorderActive: 'border-gray-500/50',
    filterBgActive: 'bg-gray-500/10',
    filterTextActive: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-600',
    darkTextColor: 'dark:text-gray-400',
  },
};

export function ContactCard({ contact }: ContactCardProps) {
  // Use status from contact, default to 'current'
  const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
  const metadata = STATUS_METADATA[status];

  // Arrays from Elasticsearch
  const phones = contact.owner_phone || [];
  const businessNames = contact.owner_business_name || [];
  const addresses = contact.owner_full_address || [];
  const titles = contact.owner_title || [];

  // Get contact name (master name or first business name)
  const contactName = contact.owner_master_full_name || businessNames[0] || 'Unknown';

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

        {/* Contact details */}
        <div className="space-y-2 text-sm pt-1 border-t border-foreground/10">
          {/* Titles */}
          {titles.length > 0 && (
            <ExpandableList items={titles} label={titles.length > 1 ? 'Titles' : 'Title'} />
          )}

          {/* Phones */}
          {phones.length > 0 && (
            <ExpandableList items={phones} label={phones.length > 1 ? 'Phones' : 'Phone'} />
          )}

          {/* Business Names */}
          {businessNames.length > 0 && (
            <ExpandableList items={businessNames} label={businessNames.length > 1 ? 'Business Names' : 'Business Name'} />
          )}

          {/* Addresses */}
          {addresses.length > 0 && (
            <ExpandableList items={addresses} label={addresses.length > 1 ? 'Addresses' : 'Address'} />
          )}
        </div>
      </div>
    </div>
  );
}
