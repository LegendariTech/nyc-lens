'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { SearchIcon } from '@/components/icons';
import type { PartyDetail } from './types';

interface PartyDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parties: PartyDetail[];
    transactionType: string;
    transactionDate: string;
}

export function PartyDetailsDialog({
    open,
    onOpenChange,
    parties,
    transactionType,
    transactionDate,
}: PartyDetailsDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Format city, state, zip line
    const formatCityStateZip = (party: PartyDetail): string => {
        const parts: string[] = [];
        if (party.city) parts.push(party.city);
        if (party.state) parts.push(party.state);
        if (party.zip) parts.push(party.zip);
        return parts.join(', ');
    };

    // Filter parties based on search query
    const filteredParties = useMemo(() => {
        if (!searchQuery.trim()) {
            return parties;
        }

        const query = searchQuery.toLowerCase();
        return parties.filter(party => {
            // Search in party type
            if (party.type?.toLowerCase().includes(query)) {
                return true;
            }

            // Search in name
            if (party.name?.toLowerCase().includes(query)) {
                return true;
            }

            // Search in address fields
            if (party.address1?.toLowerCase().includes(query)) {
                return true;
            }
            if (party.address2?.toLowerCase().includes(query)) {
                return true;
            }
            if (party.city?.toLowerCase().includes(query)) {
                return true;
            }
            if (party.state?.toLowerCase().includes(query)) {
                return true;
            }
            if (party.zip?.toLowerCase().includes(query)) {
                return true;
            }
            if (party.country?.toLowerCase().includes(query)) {
                return true;
            }

            return false;
        });
    }, [parties, searchQuery]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="xl" className="max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Transaction Parties</DialogTitle>
                    <p className="text-sm text-foreground/70 mt-1">
                        {transactionType} • {new Date(transactionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </DialogHeader>

                {/* Search Input */}
                {parties.length > 0 && (
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                        <Input
                            type="text"
                            placeholder="Search by name, type, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                )}

                <div className="overflow-auto flex-1">
                    {parties.length === 0 ? (
                        <p className="text-sm text-foreground/70 py-4">No party information available.</p>
                    ) : filteredParties.length === 0 ? (
                        <p className="text-sm text-foreground/70 py-4">No parties match your search.</p>
                    ) : (
                        <div className="space-y-3">
                            {filteredParties.map((party, index) => {
                                const cityStateZip = formatCityStateZip(party);

                                // Build address line: concatenate address1 and address2 with comma
                                const addressParts: string[] = [];
                                if (party.address1) addressParts.push(party.address1);
                                if (party.address2) addressParts.push(party.address2);
                                const addressLine = addressParts.join(', ');

                                // Build full address: address + city/state/zip + country
                                const fullAddressParts: string[] = [];
                                if (addressLine) fullAddressParts.push(addressLine);
                                if (cityStateZip) fullAddressParts.push(cityStateZip);
                                if (party.country && party.country !== 'US' && party.country !== 'USA') {
                                    fullAddressParts.push(party.country);
                                }
                                const fullAddress = fullAddressParts.join(', ');

                                return (
                                    <div
                                        key={`${party.name}-${index}`}
                                        className="rounded-lg border border-foreground/10 bg-card p-4 hover:border-foreground/20 transition-colors"
                                    >
                                        {/* Role/Type */}
                                        <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide mb-2">
                                            {party.type}
                                        </div>

                                        {/* Name */}
                                        <div className="text-base font-semibold text-foreground mb-2">
                                            {party.name}
                                        </div>

                                        {/* Address Line */}
                                        <div className="text-sm text-foreground/70">
                                            {fullAddress ? (
                                                <div>{fullAddress}</div>
                                            ) : (
                                                <div className="text-foreground/50 italic">No address available</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

