'use client';

import { useMemo, useState } from 'react';
import { ContactsTable } from './Table';
import { ContactCardList } from './ContactCardList';
import { FilterLegend } from '@/components/FilterLegend';
import type { OwnerContact } from '@/types/contacts';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
}

// Status type for filtering
type ContactStatus = 'current' | 'past';

// Status metadata for FilterLegend
const STATUS_METADATA: Record<ContactStatus, {
    pluralLabel: string;
    filterBorderActive: string;
    filterBgActive: string;
    filterTextActive: string;
    borderColor: string;
    bgColor: string;
}> = {
    'current': {
        pluralLabel: 'Current',
        filterBorderActive: 'border-green-500/50',
        filterBgActive: 'bg-green-500/10',
        filterTextActive: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-500',
    },
    'past': {
        pluralLabel: 'Past',
        filterBorderActive: 'border-gray-500/50',
        filterBgActive: 'bg-gray-500/10',
        filterTextActive: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-500',
    },
};

export function ContactsTabDisplay({ contactsData, bbl }: ContactsTabDisplayProps) {

    // Convert to table format (join arrays to strings) for desktop table
    const tableContacts = useMemo(() => {
        return contactsData.map(contact => {
            // Combine all business names with newlines for multi-line display
            const combinedBusinessName = contact.owner_business_name
                ?.filter(name => name && name.trim())
                .join('\n') || null;

            // Combine all full names with newlines for multi-line display
            const combinedFullName = contact.owner_full_name
                ?.filter(name => name && name.trim())
                .join('\n') || null;

            // Combine all phones with newlines for multi-line display
            const combinedPhone = contact.owner_phone
                ?.filter(phone => phone && phone.trim())
                .join('\n') || null;

            // Combine all addresses with newlines for multi-line display
            const combinedAddress = contact.owner_full_address
                ?.filter(addr => addr && addr.trim())
                .join('\n') || null;

            return {
                ...contact,
                // Override array fields with string versions for table display
                owner_business_name: combinedBusinessName as any,
                owner_full_name: combinedFullName as any,
                owner_phone: combinedPhone as any,
                owner_full_address: combinedAddress as any,
            };
        });
    }, [contactsData]);

    // Filter state - by default show only 'current' status
    const [visibleStatuses, setVisibleStatuses] = useState<Set<ContactStatus>>(
        new Set(['current'])
    );

    // Toggle status visibility
    const toggleStatus = (status: ContactStatus) => {
        setVisibleStatuses(prev => {
            const next = new Set(prev);
            if (next.has(status)) {
                next.delete(status);
            } else {
                next.add(status);
            }
            return next;
        });
    };

    // Count contacts by status and generate filters
    const filters = useMemo(() => {
        // Count contacts by status
        const statusCounts = contactsData.reduce(
            (acc, contact) => {
                const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            },
            {} as Record<ContactStatus, number>
        );

        // Create filter data for Legend component
        const statusOrder: ContactStatus[] = ['current', 'past'];
        return statusOrder.map(status => ({
            category: status,
            isVisible: visibleStatuses.has(status),
            count: statusCounts[status] || 0,
        }));
    }, [contactsData, visibleStatuses]);

    // Filter contacts by status
    const filteredTableContacts = useMemo(
        () => tableContacts.filter(contact => {
            const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
            return visibleStatuses.has(status);
        }),
        [tableContacts, visibleStatuses]
    );

    const filteredCardContacts = useMemo(
        () => contactsData.filter(contact => {
            const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
            return visibleStatuses.has(status);
        }),
        [contactsData, visibleStatuses]
    );

    return (
        <div className="space-y-4">
            {/* Legend with status filters */}
            <FilterLegend
                filters={filters}
                categoryMetadata={STATUS_METADATA}
                onToggleCategory={toggleStatus}
            />

            {/* Contacts Table - desktop only */}
            <div className="hidden md:block">
                {filteredTableContacts.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                        <p className="text-sm text-foreground/70">
                            No contacts match the selected filters.
                        </p>
                        <p className="text-xs text-foreground/50">
                            Try enabling the "Past" filter above to see additional contacts.
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
