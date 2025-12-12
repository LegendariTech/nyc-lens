'use client';

import { ContactCard } from './ContactCard';
import type { ContactWithCategory } from './types';

interface ContactCardListProps {
  contacts: ContactWithCategory[];
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
    <div className="mt-4 space-y-3">
      {contacts.map((contact, index) => (
        <ContactCard key={`${contact.agency}-${contact.source}-${index}`} contact={contact} />
      ))}
    </div>
  );
}
