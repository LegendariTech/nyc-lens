import { notFound } from 'next/navigation';
import { ContactsPageClient } from '../components/ContactsPageClient';
import { fetchOwnerContacts } from '@/data/contacts';
import { parseAddressFromUrl } from '@/utils/urlSlug';

interface ContactsPageProps {
    params: Promise<{
        bbl: string;
        address?: string[];
    }>;
    searchParams: Promise<{
        address?: string; // Backwards compatibility
    }>;
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
    const { bbl, address: addressSegments } = await params;
    const { address: queryAddress } = await searchParams;

    // Parse address from URL path segments or fall back to query param
    const address = parseAddressFromUrl(addressSegments) || queryAddress;

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
