'use client';

import { useMemo, useState } from 'react';
import { ContactsTable } from './Table';
import { ContactCardList } from './ContactCardList';
import { FilterLegend } from '@/components/FilterLegend';
import { TabControlsBar } from '@/components/layout/TabControlsBar';
import type { OwnerContact } from '@/types/contacts';
import {
    SOURCE_TO_CATEGORY,
    SOURCE_METADATA,
    type SourceCategory,
} from '../constants/sourceCategories';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
    tableView: boolean;
    onTableViewChange: (value: boolean) => void;
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

export function ContactsTabDisplay({ contactsData, tableView, onTableViewChange }: ContactsTabDisplayProps) {
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
                owner_business_name: combinedBusinessName as unknown as string[] | null,
                owner_full_name: combinedFullName as unknown as string[] | null,
                owner_phone: combinedPhone as unknown as string[] | null,
                owner_full_address: combinedAddress as unknown as string[] | null,
            };
        });
    }, [contactsData]);

    // Filter state - by default show only 'current' status
    const [visibleStatuses, setVisibleStatuses] = useState<Set<ContactStatus>>(
        new Set(['current'])
    );

    // Source filter state - by default show all source categories
    const [visibleSources, setVisibleSources] = useState<Set<SourceCategory>>(
        new Set(['dob_permits', 'recorded_owner', 'recorded_borrower', 'hpd', 'unmasked_owner', 'tax_owner'])
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

    // Toggle source category visibility
    const toggleSourceCategory = (category: SourceCategory) => {
        setVisibleSources(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    // Count contacts by status and generate status filters
    const statusFilters = useMemo(() => {
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

    // Count contacts by source category and generate source filters
    // Only count contacts that match the currently selected status filters
    const sourceFilters = useMemo(() => {
        // Filter contacts by status first
        const statusFilteredContacts = contactsData.filter(contact => {
            const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
            return visibleStatuses.has(status);
        });

        // Count contacts by source category (only from status-filtered contacts)
        const sourceCounts = statusFilteredContacts.reduce(
            (acc, contact) => {
                // Check each source in the contact and map to category
                const sources = contact.source || [];
                const categories = new Set(
                    sources
                        .map(src => SOURCE_TO_CATEGORY[src])
                        .filter(cat => cat !== undefined)
                );

                // Increment count for each category this contact belongs to
                categories.forEach(category => {
                    acc[category] = (acc[category] || 0) + 1;
                });

                return acc;
            },
            {} as Record<SourceCategory, number>
        );

        // Create filter data for Legend component - ordered as requested
        const sourceOrder: SourceCategory[] = [
            'unmasked_owner',
            'hpd',
            'recorded_owner',
            'recorded_borrower',
            'tax_owner',
            'dob_permits',
        ];
        return sourceOrder.map(category => ({
            category,
            isVisible: visibleSources.has(category),
            count: sourceCounts[category] || 0,
        }));
    }, [contactsData, visibleSources, visibleStatuses]);

    // Filter contacts by status and source category
    const filteredTableContacts = useMemo(
        () => tableContacts.filter(contact => {
            // Filter by status
            const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
            if (!visibleStatuses.has(status)) return false;

            // Filter by source category - contact must have at least one source in visible categories
            const sources = contact.source || [];
            const hasVisibleSource = sources.some(src => {
                const category = SOURCE_TO_CATEGORY[src];
                return category && visibleSources.has(category);
            });

            return hasVisibleSource;
        }),
        [tableContacts, visibleStatuses, visibleSources]
    );

    const filteredCardContacts = useMemo(
        () => contactsData.filter(contact => {
            // Filter by status
            const status = contact.status?.toLowerCase() === 'past' ? 'past' : 'current';
            if (!visibleStatuses.has(status)) return false;

            // Filter by source category - contact must have at least one source in visible categories
            const sources = contact.source || [];
            const hasVisibleSource = sources.some(src => {
                const category = SOURCE_TO_CATEGORY[src];
                return category && visibleSources.has(category);
            });

            return hasVisibleSource;
        }),
        [contactsData, visibleStatuses, visibleSources]
    );

    return (
        <div className="space-y-4">
            {/* Filter Legends - Status filters first, then source filters below */}
            <div className="pb-4 border-b border-foreground/10 space-y-4">
                {/* Status filters row */}
                <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
                    {statusFilters.map(({ category, isVisible, count }) => {
                        const metadata = STATUS_METADATA[category];
                        return (
                            <button
                                key={category}
                                onClick={() => toggleStatus(category)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all border hover:shadow-sm cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                    isVisible
                                        ? `${metadata.filterBorderActive} ${metadata.filterBgActive} ${metadata.filterTextActive} hover:opacity-80 hover:shadow-md`
                                        : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/70 hover:bg-foreground/10 hover:shadow-md'
                                }`}
                                aria-pressed={isVisible}
                                aria-label={`${isVisible ? 'Hide' : 'Show'} ${metadata.pluralLabel.toLowerCase()}`}
                            >
                                <span
                                    className={`w-3 h-3 rounded-full border-2 ${
                                        isVisible
                                            ? `${metadata.borderColor} ${metadata.bgColor}`
                                            : 'border-foreground/30 bg-transparent'
                                    }`}
                                    aria-hidden="true"
                                />
                                <span>{metadata.pluralLabel}</span>
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                        isVisible ? metadata.filterBgActive : 'bg-foreground/10'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Source filters row - scrollable with hidden scrollbar */}
                <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
                    {sourceFilters.map(({ category, isVisible, count }) => {
                        const metadata = SOURCE_METADATA[category];
                        return (
                            <button
                                key={category}
                                onClick={() => toggleSourceCategory(category)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all border hover:shadow-sm cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                    isVisible
                                        ? `${metadata.filterBorderActive} ${metadata.filterBgActive} ${metadata.filterTextActive} hover:opacity-80 hover:shadow-md`
                                        : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/70 hover:bg-foreground/10 hover:shadow-md'
                                }`}
                                aria-pressed={isVisible}
                                aria-label={`${isVisible ? 'Hide' : 'Show'} ${metadata.pluralLabel.toLowerCase()}`}
                            >
                                <span
                                    className={`w-3 h-3 rounded-full border-2 ${
                                        isVisible
                                            ? `${metadata.borderColor} ${metadata.bgColor}`
                                            : 'border-foreground/30 bg-transparent'
                                    }`}
                                    aria-hidden="true"
                                />
                                <span>{metadata.pluralLabel}</span>
                                <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                        isVisible ? metadata.filterBgActive : 'bg-foreground/10'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Controls Bar - hidden on mobile via CSS (no JS flash) */}
            <div className="hidden md:block">
                <TabControlsBar
                    showTableViewToggle={true}
                    tableView={tableView}
                    onTableViewChange={onTableViewChange}
                />
            </div>

            {/* Table View - only on desktop when enabled */}
            {tableView && (
                <div className="hidden md:block">
                    {filteredTableContacts.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                            <p className="text-sm text-foreground/70">
                                No contacts match the selected filters.
                            </p>
                            <p className="text-xs text-foreground/50">
                                Try enabling the &quot;Past&quot; filter above to see additional contacts.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-foreground/10 bg-card">
                            <ContactsTable data={filteredTableContacts} visibleSources={visibleSources} />
                        </div>
                    )}
                </div>
            )}

            {/* Contact Cards - always on mobile, conditional on desktop */}
            <div className={tableView ? 'md:hidden' : undefined}>
                {filteredCardContacts.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                        <p className="text-sm text-foreground/70">
                            No contacts match the selected filters.
                        </p>
                        <p className="text-xs text-foreground/50">
                            Try enabling the &quot;Past&quot; filter above to see additional contacts.
                        </p>
                    </div>
                ) : (
                    <ContactCardList contacts={filteredCardContacts} visibleSources={visibleSources} />
                )}
            </div>
        </div>
    );
}
