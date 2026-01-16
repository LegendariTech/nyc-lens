import { notFound } from 'next/navigation';
import { ContactsPageClient } from './components/ContactsPageClient';
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
        <ContactsPageClient
            bbl={bbl}
            address={address}
            contactsData={contactsData}
            contactsError={contactsError}
        />
    );
}
