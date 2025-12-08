import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { ContactsTabDisplay } from './components/ContactsTabDisplay';
import { Card, CardContent } from '@/components/ui';
import { fetchOwnerContacts } from '@/data/contacts';

interface ContactsPageProps {
    params: Promise<{
        bbl: string;
    }>;
    searchParams: Promise<{
        address?: string;
    }>;
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
    const { bbl } = await params;
    const { address } = await searchParams;

    // Parse BBL format
    const bblParts = bbl.split('-');
    if (bblParts.length !== 3) {
        notFound();
    }

    // Fetch owner contacts data
    const { data: contactsData, error: contactsError } = await fetchOwnerContacts(bbl);

    return (
        <PropertyPageLayout bbl={bbl} activeTab="contacts" address={address} maxWidth="full">
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
                <ContactsTabDisplay contactsData={contactsData} bbl={bbl} />
            )}
        </PropertyPageLayout>
    );
}
