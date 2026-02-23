import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ContactsPageClient } from '../components/ContactsPageClient';
import { getPropertyData } from '../../utils/getPropertyData';
import { fetchOwnerContacts } from '@/data/contacts';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

interface ContactsPageProps {
    params: Promise<{
        bbl: string;
        address?: string[];
    }>;
}

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
    const { bbl } = await params;
    const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

    return {
        title: `${fullFormattedAddress} - Property Contacts`,
        description: `Find owner contact information for ${fullFormattedAddress}. Phone numbers, mailing addresses, and responsible parties from NYC HPD and public records.`,
        openGraph: {
            title: `${fullFormattedAddress} - Property Contacts`,
            description: `Owner contact information for ${fullFormattedAddress}`,
        },
    };
}

export default async function ContactsPage({ params }: ContactsPageProps) {
    const { bbl } = await params;

    // Parse BBL format
    const bblParts = bbl.split('-');
    if (bblParts.length !== 3) {
        notFound();
    }

    // Get shared property data from cache (warmed by layout)
    const { plutoData, propertyData } = await getPropertyData(bbl);

    // Extract street address from shared data
    const streetAddress = propertyData?.address_with_unit || plutoData?.address;

    // Fetch owner contacts data
    const { data: contactsData, error: contactsError } = await fetchOwnerContacts(bbl);

    return (
        <ContactsPageClient
            bbl={bbl}
            address={streetAddress || undefined}
            contactsData={contactsData}
            contactsError={contactsError}
        />
    );
}
