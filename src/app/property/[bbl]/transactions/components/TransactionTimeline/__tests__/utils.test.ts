import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, mapDocumentToTransaction } from '../utils';
import type { DocumentWithParties } from '@/data/acris';

describe('TransactionTimeline Utils', () => {
    describe('formatCurrency', () => {
        it('should format positive amounts correctly', () => {
            expect(formatCurrency(1000000)).toBe('$1,000,000');
            expect(formatCurrency(10403747)).toBe('$10,403,747');
            expect(formatCurrency(125000000)).toBe('$125,000,000');
        });

        it('should format zero correctly', () => {
            expect(formatCurrency(0)).toBe('$0');
        });

        it('should format small amounts correctly', () => {
            expect(formatCurrency(1)).toBe('$1');
            expect(formatCurrency(99)).toBe('$99');
            expect(formatCurrency(999)).toBe('$999');
        });

        it('should not include decimal places', () => {
            expect(formatCurrency(1000.99)).toBe('$1,001');
            expect(formatCurrency(1234.56)).toBe('$1,235');
        });

        it('should handle negative amounts', () => {
            expect(formatCurrency(-1000)).toBe('-$1,000');
        });
    });

    describe('formatDate', () => {
        it('should format dates correctly', () => {
            expect(formatDate('2025-06-16')).toBe('Jun 16, 2025');
            expect(formatDate('2023-10-10')).toBe('Oct 10, 2023');
            expect(formatDate('2020-01-01')).toBe('Jan 1, 2020');
        });

        it('should handle different date formats', () => {
            expect(formatDate('2025-06-16T00:00:00')).toBe('Jun 16, 2025');
            expect(formatDate('2025-06-16T12:30:45Z')).toContain('2025');
        });

        it('should handle single-digit days', () => {
            expect(formatDate('2025-03-05')).toBe('Mar 5, 2025');
            expect(formatDate('2025-12-09')).toBe('Dec 9, 2025');
        });
    });

    describe('mapDocumentToTransaction', () => {
        it('should map DEED document correctly', () => {
            const doc: DocumentWithParties = {
                documentId: 'DOC123',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2025-06-16',
                documentAmount: 1000000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: ['SELLER LLC'],
                toParty: ['BUYER INC'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [
                    {
                        name: 'SELLER LLC',
                        type: 'Seller',
                        address1: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        zip: '10001',
                    },
                    {
                        name: 'BUYER INC',
                        type: 'Buyer',
                        address1: '456 Oak Ave',
                        city: 'Brooklyn',
                        state: 'NY',
                        zip: '11201',
                    },
                ],
            };

            const result = mapDocumentToTransaction(doc);

            expect(result).toEqual({
                id: 'DOC123',
                type: 'DEED',
                docType: 'DEED',
                date: '2025-06-16',
                amount: 1000000,
                party1: ['SELLER LLC'],
                party2: ['BUYER INC'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                documentId: 'DOC123',
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [
                    {
                        name: 'SELLER LLC',
                        type: 'Seller',
                        address1: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        zip: '10001',
                    },
                    {
                        name: 'BUYER INC',
                        type: 'Buyer',
                        address1: '456 Oak Ave',
                        city: 'Brooklyn',
                        state: 'NY',
                        zip: '11201',
                    },
                ],
            });
        });

        it('should map MORTGAGE document correctly', () => {
            const doc: DocumentWithParties = {
                documentId: 'DOC456',
                documentType: 'MTGE',
                docTypeDescription: 'MORTGAGE',
                documentDate: '2023-10-10',
                documentAmount: 10403747,
                classCodeDescription: 'MORTGAGES & INSTRUMENTS',
                fromParty: ['BORROWER CORP'],
                toParty: ['LENDER BANK'],
                party1Type: 'Borrower',
                party2Type: 'Lender',
                isDeed: false,
                isMortgage: true,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [
                    {
                        name: 'BORROWER CORP',
                        type: 'Borrower',
                        address1: '789 Business Blvd',
                        city: 'Manhattan',
                        state: 'NY',
                        zip: '10004',
                    },
                    {
                        name: 'LENDER BANK',
                        type: 'Lender',
                        address1: '100 Wall St',
                        city: 'New York',
                        state: 'NY',
                        zip: '10005',
                    },
                ],
            };

            const result = mapDocumentToTransaction(doc);

            expect(result).toEqual({
                id: 'DOC456',
                type: 'MTGE',
                docType: 'MORTGAGE',
                date: '2023-10-10',
                amount: 10403747,
                party1: ['BORROWER CORP'],
                party2: ['LENDER BANK'],
                party1Type: 'Borrower',
                party2Type: 'Lender',
                documentId: 'DOC456',
                classCodeDescription: 'MORTGAGES & INSTRUMENTS',
                isDeed: false,
                isMortgage: true,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [
                    {
                        name: 'BORROWER CORP',
                        type: 'Borrower',
                        address1: '789 Business Blvd',
                        city: 'Manhattan',
                        state: 'NY',
                        zip: '10004',
                    },
                    {
                        name: 'LENDER BANK',
                        type: 'Lender',
                        address1: '100 Wall St',
                        city: 'New York',
                        state: 'NY',
                        zip: '10005',
                    },
                ],
            });
        });

        it('should handle documents with unknown parties', () => {
            const doc: DocumentWithParties = {
                documentId: 'DOC789',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2020-01-01',
                documentAmount: 500000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: ['Unknown'],
                toParty: ['Unknown'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [],
            };

            const result = mapDocumentToTransaction(doc);

            expect(result.party1).toEqual(['Unknown']);
            expect(result.party2).toEqual(['Unknown']);
        });

        it('should preserve document ID', () => {
            const doc: DocumentWithParties = {
                documentId: 'UNIQUE_ID_123',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2025-01-01',
                documentAmount: 1000000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: ['PARTY A'],
                toParty: ['PARTY B'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [],
            };

            const result = mapDocumentToTransaction(doc);

            expect(result.id).toBe('UNIQUE_ID_123');
            expect(result.documentId).toBe('UNIQUE_ID_123');
        });

        it('should handle all document types', () => {
            const deedDoc: DocumentWithParties = {
                documentId: 'DOC1',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2025-01-01',
                documentAmount: 1000000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: ['A'],
                toParty: ['B'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [],
            };

            const mtgeDoc: DocumentWithParties = {
                ...deedDoc,
                documentId: 'DOC2',
                documentType: 'MTGE',
                classCodeDescription: 'MORTGAGES & INSTRUMENTS',
                isDeed: false,
                isMortgage: true,
            };

            expect(mapDocumentToTransaction(deedDoc).type).toBe('DEED');
            expect(mapDocumentToTransaction(mtgeDoc).type).toBe('MTGE');
        });

        it('should map partyDetails correctly', () => {
            const doc: DocumentWithParties = {
                documentId: 'DOC999',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2025-01-01',
                documentAmount: 1500000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: ['SELLER A', 'SELLER B'],
                toParty: ['BUYER X'],
                party1Type: 'Seller',
                party2Type: 'Buyer',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
                partyDetails: [
                    {
                        name: 'SELLER A',
                        type: 'Seller',
                        address1: '111 First St',
                        city: 'Queens',
                        state: 'NY',
                        zip: '11101',
                    },
                    {
                        name: 'SELLER B',
                        type: 'Seller',
                        address1: '222 Second Ave',
                        address2: 'Suite 300',
                        city: 'Bronx',
                        state: 'NY',
                        zip: '10451',
                    },
                    {
                        name: 'BUYER X',
                        type: 'Buyer',
                        address1: '333 Third Pl',
                        city: 'Staten Island',
                        state: 'NY',
                        zip: '10301',
                        country: 'US',
                    },
                ],
            };

            const result = mapDocumentToTransaction(doc);

            expect(result.partyDetails).toEqual(doc.partyDetails);
            expect(result.partyDetails).toHaveLength(3);
            expect(result.partyDetails?.[0].name).toBe('SELLER A');
            expect(result.partyDetails?.[1].address2).toBe('Suite 300');
        });
    });
});

