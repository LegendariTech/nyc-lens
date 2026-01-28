'use client';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { ExpandableList } from './ExpandableList';
import type { OwnerContact } from '@/types/contacts';
import {
  SOURCE_TO_CATEGORY,
  CATEGORY_LABELS,
  CATEGORY_CHIP_STYLES,
  type SourceCategory,
} from '../../constants/sourceCategories';

interface ContactCardProps {
  contact: OwnerContact;
  visibleSources?: Set<SourceCategory>;
}

export function ContactCard({ contact, visibleSources }: ContactCardProps) {
  // Arrays from Elasticsearch
  const phones = contact.owner_phone || [];
  const businessNames = contact.owner_business_name || [];
  const addresses = contact.owner_full_address || [];
  const titles = contact.owner_title || [];
  const sources = contact.source || [];

  // Get contact name (master name or first business name)
  const contactName = contact.owner_master_full_name || businessNames[0] || 'Unknown';

  // Get unique categories for this contact's sources
  const allCategories = Array.from(
    new Set(
      sources
        .map(src => SOURCE_TO_CATEGORY[src])
        .filter(cat => cat !== undefined)
    )
  );

  // Filter to only show visible categories
  const visibleCategories = visibleSources
    ? allCategories.filter(cat => visibleSources.has(cat))
    : allCategories;

  return (
    <div
      className={cn(
        'relative rounded-lg border border-foreground/20 bg-foreground/5 p-3 shadow-md',
        'hover:shadow-lg hover:border-foreground/30 transition-all'
      )}
    >
      <div className="space-y-2">
        {/* Header: Source chips and date */}
        <div className="flex items-start justify-between gap-2">
          {/* Source chips */}
          <div className="flex flex-wrap gap-1.5">
            {visibleCategories.map(category => (
              <span
                key={category}
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                  CATEGORY_CHIP_STYLES[category]
                )}
              >
                {CATEGORY_LABELS[category]}
              </span>
            ))}
          </div>

          {/* Date */}
          {contact.date && (
            <span className="text-xs font-semibold text-foreground/70 whitespace-nowrap">
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
