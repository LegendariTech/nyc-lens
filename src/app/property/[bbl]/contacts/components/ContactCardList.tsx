'use client';

import { ContactCard } from './ContactCard';
import type { OwnerContact } from '@/types/contacts';

interface ContactCardListProps {
  contacts: OwnerContact[];
}

/**
 * Mobile-friendly list of contact cards
 */
export function ContactCardList({ contacts }: ContactCardListProps) {
  if (contacts.length === 0) {
    return (
      <div className="py-8 text-center space-y-2">
        <p className="text-sm text-foreground/70">
          No contacts match the selected filters.
        </p>
        <p className="text-xs text-foreground/50">
          Try enabling more categories above to see additional contacts.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {contacts.map((contact, index) => (
        <ContactCard key={`${contact.bucket_name}-${contact.status}-${index}`} contact={contact} />
      ))}
    </div>
  );
}
