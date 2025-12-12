'use client';

import { useMemo, useState } from 'react';
import { TabControlsBar } from '@/components/layout/TabControlsBar';
import { ContactsTable } from './Table';
import { ContactCardList } from './ContactCardList';
import { FilterLegend } from '@/components/FilterLegend';
import type { OwnerContact } from '@/types/contacts';
import type { ContactCategory, FormattedContactWithCategory } from './types';
import { enrichContactsWithCategory, getDefaultVisibleCategories, CATEGORY_ORDER, CATEGORY_METADATA, getContactCategory } from './utils';
import { formatContacts, deduplicateContacts } from '@/data/contacts/utils';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
}

export function ContactsTabDisplay({ contactsData, bbl }: ContactsTabDisplayProps) {
    // Normalized toggle state - enabled by default
    const [normalized, setNormalized] = useState(true);

    // Format and optionally deduplicate contacts - keeps arrays for mobile cards
    const formattedContacts = useMemo(() => {
        // Format contacts (cleanup + address/phone/business arrays)
        const formatted = formatContacts(contactsData);

        // Deduplicate if normalized is enabled
        return normalized
            ? deduplicateContacts(formatted, 0.65)
            : formatted;
    }, [contactsData, normalized]);

    // Add categories to formatted contacts (for mobile card view - keeps arrays)
    const formattedContactsWithCategory = useMemo((): FormattedContactWithCategory[] => {
        try {
            return formattedContacts.map(contact => ({
                ...contact,
                category: getContactCategory(contact),
            }));
        } catch (error) {
            console.error('Error enriching contacts with categories:', error);
            return [];
        }
    }, [formattedContacts]);

    // Convert to table format (join arrays to strings) for desktop table
    const tableContacts = useMemo(() => {
        return formattedContacts.map(contact => {
            // Combine all addresses with newlines for multi-line display
            const combinedAddress = contact.owner_address
                .filter(addr => addr && addr.trim())
                .join('\n') || null;

            // Combine all phones with newlines for multi-line display
            const combinedPhone = contact.owner_phone
                .filter(phone => phone && phone.trim())
                .join('\n') || null;

            // Combine all business names with newlines for multi-line display
            const combinedBusinessName = contact.owner_business_name
                .filter(name => name && name.trim())
                .join('\n') || null;

            return {
                ...contact,
                owner_address: combinedAddress,
                owner_address_2: null,
                owner_phone: combinedPhone,
                owner_phone_2: null,
                owner_business_name: combinedBusinessName,
                owner_city: null,
                owner_state: null,
                owner_zip: null,
                owner_city_2: null,
                owner_state_2: null,
                owner_zip_2: null,
                owner_first_name: null,
                owner_last_name: null,
            };
        }) as OwnerContact[];
    }, [formattedContacts]);

    // Add categories to table contacts (for desktop table view)
    const tableContactsWithCategory = useMemo(() => {
        try {
            return enrichContactsWithCategory(tableContacts);
        } catch (error) {
            console.error('Error enriching contacts with categories:', error);
            return [];
        }
    }, [tableContacts]);

    // Filter state - by default show all except past-sale and prior-mortgage
    const [visibleCategories, setVisibleCategories] = useState<Set<ContactCategory>>(
        getDefaultVisibleCategories()
    );

    // Toggle category visibility
    const toggleCategory = (category: ContactCategory) => {
        setVisibleCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    // Combine category counts and filter generation for better performance
    const filters = useMemo(() => {
        // Count contacts by category (use formatted contacts as source of truth)
        const categoryCounts = formattedContactsWithCategory.reduce(
            (acc, contact) => {
                acc[contact.category] = (acc[contact.category] || 0) + 1;
                return acc;
            },
            {} as Record<ContactCategory, number>
        );

        // Create filter data for Legend component using defined order
        return CATEGORY_ORDER.map(category => ({
            category,
            isVisible: visibleCategories.has(category),
            count: categoryCounts[category] || 0,
        }));
    }, [formattedContactsWithCategory, visibleCategories]);

    // Filter contacts for table view (desktop)
    const filteredTableContacts = useMemo(
        () => tableContactsWithCategory.filter(contact => visibleCategories.has(contact.category)),
        [tableContactsWithCategory, visibleCategories]
    );

    // Filter contacts for card view (mobile) - keeps arrays
    const filteredCardContacts = useMemo(
        () => formattedContactsWithCategory.filter(contact => visibleCategories.has(contact.category)),
        [formattedContactsWithCategory, visibleCategories]
    );

    return (
        <div className="space-y-4">
            {/* Controls Bar with Normalized Toggle - hidden on mobile via CSS (no JS flash) */}
            <div className="hidden md:block">
                <TabControlsBar
                    showNormalizedToggle={true}
                    normalized={normalized}
                    onNormalizedChange={setNormalized}
                />
            </div>

            {/* Legend with filters */}
            <FilterLegend
                filters={filters}
                categoryMetadata={CATEGORY_METADATA}
                onToggleCategory={toggleCategory}
            />

            {/* Contacts Table - desktop only */}
            <div className="hidden md:block">
                {filteredTableContacts.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                        <p className="text-sm text-foreground/70">
                            No contacts match the selected filters.
                        </p>
                        <p className="text-xs text-foreground/50">
                            Try enabling more categories above to see additional contacts.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-foreground/10 bg-card">
                        <ContactsTable data={filteredTableContacts} />
                    </div>
                )}
            </div>

            {/* Contact Cards - mobile only */}
            <div className="md:hidden">
                <ContactCardList contacts={filteredCardContacts} />
            </div>
        </div>
    );
}
