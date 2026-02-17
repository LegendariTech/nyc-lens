'use client';

import { useState } from 'react';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { ContactsTabDisplay } from './ContactsTabDisplay';
import { AgGridProvider } from '@/components/table/AgGridProvider';
import { Card, CardContent } from '@/components/ui';
import type { OwnerContact } from '@/types/contacts';

interface ContactsPageClientProps {
    bbl: string;
    address?: string;
    contactsData: OwnerContact[] | null;
    contactsError?: string;
}

export function ContactsPageClient({ bbl, address, contactsData, contactsError }: ContactsPageClientProps) {
    // Table view state - default to true for table view
    const [tableView, setTableView] = useState(true);

    // Use full width when table view is enabled, xl when disabled
    const maxWidth = tableView ? 'full' : 'xl';

    return (
        <>
            <AgGridProvider />
            <PropertyPageLayout bbl={bbl} activeTab="contacts" address={address} maxWidth={maxWidth}>
            {/* Handle error state */}
            {contactsError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Owner Contacts Data</h3>
                    <p className="text-sm text-red-600/80">{contactsError}</p>
                </div>
            )}

            {/* Handle no data state */}
            {!contactsError && (!contactsData || contactsData.length === 0) && (
                <Card>
                    <CardContent>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">No Owner Contact Data</h3>
                        <p className="text-sm text-foreground/70">
                            No owner contact data available for BBL {bbl}.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Display data */}
            {!contactsError && contactsData && contactsData.length > 0 && (
                <ContactsTabDisplay
                    contactsData={contactsData}
                    bbl={bbl}
                    tableView={tableView}
                    onTableViewChange={setTableView}
                />
            )}
        </PropertyPageLayout>
        </>
    );
}
