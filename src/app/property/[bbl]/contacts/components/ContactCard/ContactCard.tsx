'use client';

import { useClerk } from '@clerk/nextjs';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatters';
import { ExpandableList } from './ExpandableList';
import { trackEvent } from '@/utils/trackEvent';
import { EventType } from '@/types/events';
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
  isSignedIn?: boolean;
  bbl?: string;
}

function LockIcon() {
  return (
    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-foreground/10 group-hover/lock:bg-foreground/20 transition-colors">
      <svg
        className="w-6 h-6 text-foreground/40 group-hover/lock:text-foreground/70 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Sign in to view"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </span>
  );
}

// Module-level cooldown to prevent re-opening sign-in when dismissing modal
let lastSignInTime = 0;

export function ContactCard({ contact, visibleSources, isSignedIn, bbl }: ContactCardProps) {
  const { openSignUp } = useClerk();

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

  const handleUnlock = () => {
    const now = Date.now();
    if (now - lastSignInTime < 1000) return;
    lastSignInTime = now;
    trackEvent(EventType.SIGN_IN_PROMPT_CLICK, {
      location: 'contacts_card',
      bbl: bbl || contact.bbl || '',
    });
    openSignUp();
  };

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
        {!isSignedIn ? (
          <div
            className="relative cursor-pointer group/lock pt-1 border-t border-foreground/10"
            onClick={() => handleUnlock()}
          >
            <div className="blur-[5px] select-none pointer-events-none space-y-2 text-sm" aria-hidden="true">
              {titles.length > 0 && (
                <ExpandableList items={titles} label={titles.length > 1 ? 'Titles' : 'Title'} />
              )}
              {phones.length > 0 && (
                <ExpandableList items={phones} label={phones.length > 1 ? 'Phones' : 'Phone'} />
              )}
              {businessNames.length > 0 && (
                <ExpandableList items={businessNames} label={businessNames.length > 1 ? 'Business Names' : 'Business Name'} />
              )}
              {addresses.length > 0 && (
                <ExpandableList items={addresses} label={addresses.length > 1 ? 'Addresses' : 'Address'} />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <LockIcon />
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm pt-1 border-t border-foreground/10">
            {titles.length > 0 && (
              <ExpandableList items={titles} label={titles.length > 1 ? 'Titles' : 'Title'} />
            )}
            {phones.length > 0 && (
              <ExpandableList items={phones} label={phones.length > 1 ? 'Phones' : 'Phone'} />
            )}
            {businessNames.length > 0 && (
              <ExpandableList items={businessNames} label={businessNames.length > 1 ? 'Business Names' : 'Business Name'} />
            )}
            {addresses.length > 0 && (
              <ExpandableList items={addresses} label={addresses.length > 1 ? 'Addresses' : 'Address'} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
