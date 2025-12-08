'use client';

import { Card, CardContent } from '@/components/ui';
import { ContactsTable } from './Table';
import type { OwnerContact } from '@/types/contacts';

interface ContactsTabDisplayProps {
    contactsData: OwnerContact[];
    bbl: string;
}

export function ContactsTabDisplay({ contactsData, bbl }: ContactsTabDisplayProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <ContactsTable data={contactsData} />
                </CardContent>
            </Card>
        </div>
    );
}
