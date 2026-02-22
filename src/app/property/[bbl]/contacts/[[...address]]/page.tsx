import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContactsPageClient } from '../components/ContactsPageClient';
import { fetchOwnerContacts } from '@/data/contacts';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { fetchPropertyByBBL } from '@/data/acris';
import { BOROUGH_NAMES } from '@/constants/nyc';

interface ContactsPageProps {
    params: Promise<{
        bbl: string;
        address?: string[];
    }>;
    searchParams: Promise<{
        address?: string; // Backwards compatibility
    }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
    const { bbl } = await params;
    const boroughCode = bbl.split('-')[0];
    const borough = BOROUGH_NAMES[boroughCode] || 'NYC';

    let address = `BBL ${bbl}`;
    try {
        const propertyData = await fetchPropertyByBBL(bbl);
        if (propertyData?.address) {
            address = propertyData.address;
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title: `Property Contacts - ${address}`,
        description: `Find owner contact information for ${address} in ${borough}. Phone numbers, mailing addresses, and responsible parties from NYC HPD and public records.`,
        openGraph: {
            title: `Property Contacts - ${address}`,
            description: `Owner contact information for ${address}`,
        },
    };
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
