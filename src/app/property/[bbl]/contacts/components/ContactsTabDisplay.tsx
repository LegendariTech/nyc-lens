'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { TabControlsBar } from '@/components/layout/TabControlsBar';
import { ContactsTable } from './Table';
import { FilterLegend } from '@/components/FilterLegend';
import type { OwnerContact } from '@/types/contacts';
import type { ContactCategory } from './types';
import { enrichContactsWithCategory, getDefaultVisibleCategories, CATEGORY_ORDER, CATEGORY_METADATA } from './utils';
import { formatContacts, deduplicateContacts } from '@/data/contacts/utils';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
}

export function ContactsTabDisplay({ contactsData, bbl }: ContactsTabDisplayProps) {
    // Normalized toggle state - enabled by default
    const [normalized, setNormalized] = useState(true);

    // Apply normalization if enabled
    const processedContacts = useMemo(() => {
        // Format contacts (cleanup + address/phone/business arrays)
        const formatted = formatContacts(contactsData);

        // Deduplicate if normalized is enabled
        const contactsToDisplay = normalized
            ? deduplicateContacts(formatted, 0.65)
            : formatted;

        // Convert back to OwnerContact format for the table
        // Combine arrays into single fields for display
        return contactsToDisplay.map(contact => {
            // Combine all addresses with newlines for multi-line display
            const combinedAddress = contact.owner_address
                .filter(addr => addr && addr.trim())
                .join('\n') || null;

            // Combine all phones with newlines for multi-line display
            const combinedPhone = contact.owner_phone
                .filter(phone => phone && phone.trim())
                .join('\n') || null;

            // Combine all business names with newlines for multi-line display
            const combinedBusinessName = Array.isArray(contact.owner_business_name)
                ? contact.owner_business_name
                    .filter(name => name && name.trim())
                    .join('\n') || null
                : null;

            return {
                ...contact,
                // Combine all addresses into owner_address field
                owner_address: combinedAddress,
                owner_address_2: null, // Not needed in normalized view
                owner_phone: combinedPhone,
                owner_phone_2: null, // Not needed in normalized view
                owner_business_name: combinedBusinessName,
                // Add back the removed fields as null for type compatibility
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
    }, [contactsData, normalized]);

    // Add categories to contacts with error handling
    const contactsWithCategory = useMemo(() => {
        try {
            return enrichContactsWithCategory(processedContacts);
        } catch (error) {
            console.error('Error enriching contacts with categories:', error);
            return [];
        }
    }, [processedContacts]);

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
        // Count contacts by category
        const categoryCounts = contactsWithCategory.reduce(
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
    }, [contactsWithCategory, visibleCategories]);

    // Filter contacts by visible categories
    const filteredContacts = useMemo(
        () => contactsWithCategory.filter(contact => visibleCategories.has(contact.category)),
        [contactsWithCategory, visibleCategories]
    );

    return (
        <div className="space-y-4">
            {/* Controls Bar with Normalized Toggle */}
            <TabControlsBar
                showNormalizedToggle={true}
                normalized={normalized}
                onNormalizedChange={setNormalized}
            />

            <Card>
                <CardContent>
                    {/* Legend with filters */}
                    <FilterLegend
                        filters={filters}
                        categoryMetadata={CATEGORY_METADATA}
                        onToggleCategory={toggleCategory}
                    />

                    {/* Contacts Table */}
                    {filteredContacts.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                            <p className="text-sm text-foreground/70">
                                No contacts match the selected filters.
                            </p>
                            <p className="text-xs text-foreground/50">
                                Try enabling more categories above to see additional contacts.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <ContactsTable data={filteredContacts} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
