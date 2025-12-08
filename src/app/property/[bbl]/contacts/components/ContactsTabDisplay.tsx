'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { ContactsTable } from './Table';
import { FilterLegend } from '@/components/FilterLegend';
import type { OwnerContact } from '@/types/contacts';
import type { ContactCategory } from './types';
import { enrichContactsWithCategory, getDefaultVisibleCategories, CATEGORY_ORDER, CATEGORY_METADATA } from './utils';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
}

export function ContactsTabDisplay({ contactsData, bbl }: ContactsTabDisplayProps) {
    // Add categories to contacts with error handling
    const contactsWithCategory = useMemo(() => {
        try {
            return enrichContactsWithCategory(contactsData);
        } catch (error) {
            console.error('Error enriching contacts with categories:', error);
            return [];
        }
    }, [contactsData]);

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
