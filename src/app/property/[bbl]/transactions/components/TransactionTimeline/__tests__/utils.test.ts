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
                fromParty: 'SELLER LLC',
                toParty: 'BUYER INC',
                party1Type: 'Seller',
                party2Type: 'Buyer',
            };

            const result = mapDocumentToTransaction(doc);

            expect(result).toEqual({
                id: 'DOC123',
                type: 'DEED',
                docType: 'DEED',
                date: '2025-06-16',
                amount: 1000000,
                party1: 'SELLER LLC',
                party2: 'BUYER INC',
                party1Type: 'Seller',
                party2Type: 'Buyer',
                documentId: 'DOC123',
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
                fromParty: 'BORROWER CORP',
                toParty: 'LENDER BANK',
                party1Type: 'Borrower',
                party2Type: 'Lender',
            };

            const result = mapDocumentToTransaction(doc);

            expect(result).toEqual({
                id: 'DOC456',
                type: 'MTGE',
                docType: 'MORTGAGE',
                date: '2023-10-10',
                amount: 10403747,
                party1: 'BORROWER CORP',
                party2: 'LENDER BANK',
                party1Type: 'Borrower',
                party2Type: 'Lender',
                documentId: 'DOC456',
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
                fromParty: 'Unknown',
                toParty: 'Unknown',
                party1Type: 'Seller',
                party2Type: 'Buyer',
            };

            const result = mapDocumentToTransaction(doc);

            expect(result.party1).toBe('Unknown');
            expect(result.party2).toBe('Unknown');
        });

        it('should preserve document ID', () => {
            const doc: DocumentWithParties = {
                documentId: 'UNIQUE_ID_123',
                documentType: 'DEED',
                docTypeDescription: 'DEED',
                documentDate: '2025-01-01',
                documentAmount: 1000000,
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                fromParty: 'PARTY A',
                toParty: 'PARTY B',
                party1Type: 'Seller',
                party2Type: 'Buyer',
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
                fromParty: 'A',
                toParty: 'B',
                party1Type: 'Seller',
                party2Type: 'Buyer',
            };

            const mtgeDoc: DocumentWithParties = {
                ...deedDoc,
                documentId: 'DOC2',
                documentType: 'MTGE',
            };

            expect(mapDocumentToTransaction(deedDoc).type).toBe('DEED');
            expect(mapDocumentToTransaction(mtgeDoc).type).toBe('MTGE');
        });
    });
});

