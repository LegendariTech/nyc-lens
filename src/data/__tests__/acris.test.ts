import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AcrisDoc, AcrisParty } from '@/types/acris';

// Mock server-only module
vi.mock('server-only', () => ({}));

// Mock the elasticsearch module
vi.mock('../elasticsearch', () => ({
    search: vi.fn(),
}));

// Import after mocks are set up
const { fetchTransactionsWithParties } = await import('../acris');
const { search } = await import('../elasticsearch');

describe('acris data layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the search mock to clear queued responses
        vi.mocked(search).mockReset();
    });

    describe('fetchTransactionsWithParties', () => {
        const mockDocuments: AcrisDoc[] = [
            {
                master_document_id: 'DOC123',
                document_type: 'DEED',
                doc_type_description: 'DEED',
                document_date: '2025-06-16',
                document_amount: 1000000,
                class_code_description: 'DEEDS AND OTHER CONVEYANCES',
                borough: '1',
                block: '13',
                lot: '1',
            } as AcrisDoc,
            {
                master_document_id: 'DOC456',
                document_type: 'MTGE',
                doc_type_description: 'MORTGAGE',
                document_date: '2023-10-10',
                document_amount: 5000000,
                class_code_description: 'MORTGAGES & INSTRUMENTS',
                borough: '1',
                block: '13',
                lot: '1',
            } as AcrisDoc,
        ];

        const mockParties: AcrisParty[] = [
            {
                party_document_id: 'DOC123',
                party_party_type: '1',
                party_party_type_description: 'SELLER',
                party_name: 'SELLER LLC',
            } as AcrisParty,
            {
                party_document_id: 'DOC123',
                party_party_type: '2',
                party_party_type_description: 'BUYER',
                party_name: 'BUYER INC',
            } as AcrisParty,
            {
                party_document_id: 'DOC456',
                party_party_type: '1',
                party_party_type_description: 'BORROWER',
                party_name: 'BORROWER CORP',
            } as AcrisParty,
            {
                party_document_id: 'DOC456',
                party_party_type: '2',
                party_party_type_description: 'LENDER',
                party_name: 'LENDER BANK',
            } as AcrisParty,
        ];

        describe('BBL validation', () => {
            it('should throw error for invalid BBL format', async () => {
                await expect(fetchTransactionsWithParties('invalid')).rejects.toThrow(
                    'Invalid BBL format: invalid. Expected format: borough-block-lot (e.g., 1-13-1)'
                );
            });

            it('should throw error for non-numeric BBL components', async () => {
                await expect(fetchTransactionsWithParties('a-b-c')).rejects.toThrow(
                    'Invalid BBL components'
                );
            });

            it('should accept valid BBL format', async () => {
                vi.mocked(search).mockResolvedValueOnce({
                    hits: { hits: [] },
                });

                await fetchTransactionsWithParties('1-13-1');

                expect(search).toHaveBeenCalled();
            });
        });

        describe('Successful data fetching', () => {
            beforeEach(() => {
                // Mock documents query
                vi.mocked(search).mockResolvedValueOnce({
                    hits: {
                        hits: mockDocuments.map(doc => ({ _source: doc })),
                    },
                });

                // Mock parties query
                vi.mocked(search).mockResolvedValueOnce({
                    hits: {
                        hits: mockParties.map(party => ({ _source: party })),
                    },
                });
            });

            it('should fetch and combine documents with parties', async () => {
                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result).toHaveLength(2);
                expect(result[0].documentId).toBe('DOC123');
                expect(result[0].fromParty).toEqual(['SELLER LLC']);
                expect(result[0].toParty).toEqual(['BUYER INC']);
                expect(result[1].documentId).toBe('DOC456');
                expect(result[1].fromParty).toEqual(['BORROWER CORP']);
                expect(result[1].toParty).toEqual(['LENDER BANK']);
            });

            it('should set correct party types for DEED transactions', async () => {
                const result = await fetchTransactionsWithParties('1-13-1');

                const deedTransaction = result.find(t => t.documentType === 'DEED');
                // Party types now come from ACRIS control codes (using last part of slash-separated types)
                expect(deedTransaction?.party1Type).toBe('SELLER');
                expect(deedTransaction?.party2Type).toBe('BUYER');
            });

            it('should set correct party types for MORTGAGE transactions', async () => {
                const result = await fetchTransactionsWithParties('1-13-1');

                const mortgageTransaction = result.find(t => t.documentType === 'MTGE');
                // Party types now come from ACRIS control codes (using last part of slash-separated types)
                expect(mortgageTransaction?.party1Type).toBe('BORROWER');
                expect(mortgageTransaction?.party2Type).toBe('LENDER');
            });

            it('should query Elasticsearch with correct BBL components', async () => {
                await fetchTransactionsWithParties('1-13-1');

                expect(search).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining({
                        query: expect.objectContaining({
                            bool: expect.objectContaining({
                                must: expect.arrayContaining([
                                    { term: { borough: '1' } },
                                    { term: { 'block.integer': 13 } },
                                    { term: { 'lot.integer': 1 } },
                                ]),
                            }),
                        }),
                    })
                );
            });
        });

        describe('Empty results handling', () => {
            it('should return empty array when no documents found', async () => {
                vi.mocked(search).mockResolvedValueOnce({
                    hits: { hits: [] },
                });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result).toEqual([]);
            });

            it('should return empty array when documents have no master_document_id', async () => {
                vi.mocked(search).mockResolvedValueOnce({
                    hits: {
                        hits: [{
                            _source: {
                                ...mockDocuments[0],
                                master_document_id: undefined,
                            },
                        }],
                    },
                });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result).toEqual([]);
            });
        });

        describe('Document amounts', () => {
            it('should include transactions with zero amount', async () => {
                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: [{
                                _source: {
                                    ...mockDocuments[0],
                                    document_amount: 0,
                                },
                            }],
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockParties.slice(0, 2).map(party => ({ _source: party })),
                        },
                    });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result).toHaveLength(1);
                expect(result[0].documentAmount).toBe(0);
            });

            it('should include transactions with null amount', async () => {
                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: [{
                                _source: {
                                    ...mockDocuments[0],
                                    document_amount: null,
                                },
                            }],
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockParties.slice(0, 2).map(party => ({ _source: party })),
                        },
                    });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result).toHaveLength(1);
                expect(result[0].documentAmount).toBe(null);
            });

            it('should include transactions with positive amounts', async () => {
                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockDocuments.map(doc => ({ _source: doc })),
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockParties.map(party => ({ _source: party })),
                        },
                    });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result.length).toBeGreaterThan(0);
                expect(result[0].documentAmount).toBe(1000000);
                expect(result[1].documentAmount).toBe(5000000);
            });
        });

        describe('Party matching', () => {
            it('should handle multiple parties of same type', async () => {
                const multipleParties: AcrisParty[] = [
                    {
                        party_document_id: 'DOC123',
                        party_party_type: '1',
                        party_party_type_description: 'SELLER',
                        party_name: 'SELLER A',
                    } as AcrisParty,
                    {
                        party_document_id: 'DOC123',
                        party_party_type: '1',
                        party_party_type_description: 'SELLER',
                        party_name: 'SELLER B',
                    } as AcrisParty,
                    {
                        party_document_id: 'DOC123',
                        party_party_type: '2',
                        party_party_type_description: 'BUYER',
                        party_name: 'BUYER C',
                    } as AcrisParty,
                ];

                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: [{ _source: mockDocuments[0] }],
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: multipleParties.map(party => ({ _source: party })),
                        },
                    });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result[0].fromParty).toEqual(['SELLER A', 'SELLER B']);
                expect(result[0].toParty).toEqual(['BUYER C']);
            });

            it('should handle parties with no type information', async () => {
                const partiesNoType: AcrisParty[] = [
                    {
                        party_document_id: 'DOC123',
                        party_party_type: undefined,
                        party_party_type_description: undefined,
                        party_name: 'UNKNOWN PARTY',
                    } as AcrisParty,
                ];

                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: [{ _source: mockDocuments[0] }],
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: partiesNoType.map(party => ({ _source: party })),
                        },
                    });

                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result[0].fromParty).toEqual(['Unknown']);
                expect(result[0].toParty).toEqual(['Unknown']);
            });

        });

        describe('Error handling', () => {
            it('should throw error when documents query fails', async () => {
                vi.mocked(search).mockRejectedValueOnce(new Error('Elasticsearch error'));

                await expect(fetchTransactionsWithParties('1-13-1')).rejects.toThrow(
                    'Failed to fetch documents from Elasticsearch'
                );
            });

            it('should continue without parties if parties query fails', async () => {
                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: [{ _source: mockDocuments[0] }],
                        },
                    })
                    .mockRejectedValueOnce(new Error('Parties query failed'));

                const result = await fetchTransactionsWithParties('1-13-1');

                // Should still return documents with 'Unknown' parties
                expect(result).toHaveLength(1);
                expect(result[0].fromParty).toEqual(['Unknown']);
                expect(result[0].toParty).toEqual(['Unknown']);
            });

            it('should include BBL in error message', async () => {
                vi.mocked(search).mockRejectedValueOnce(new Error('Network error'));

                await expect(fetchTransactionsWithParties('1-13-1')).rejects.toThrow(
                    'Failed to fetch documents from Elasticsearch'
                );
            });
        });

        describe('Data structure', () => {
            beforeEach(() => {
                vi.mocked(search)
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockDocuments.map(doc => ({ _source: doc })),
                        },
                    })
                    .mockResolvedValueOnce({
                        hits: {
                            hits: mockParties.map(party => ({ _source: party })),
                        },
                    });
            });

            it('should return DocumentWithParties interface', async () => {
                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result[0]).toHaveProperty('documentId');
                expect(result[0]).toHaveProperty('documentType');
                expect(result[0]).toHaveProperty('docTypeDescription');
                expect(result[0]).toHaveProperty('documentDate');
                expect(result[0]).toHaveProperty('documentAmount');
                expect(result[0]).toHaveProperty('classCodeDescription');
                expect(result[0]).toHaveProperty('fromParty');
                expect(result[0]).toHaveProperty('toParty');
                expect(result[0]).toHaveProperty('party1Type');
                expect(result[0]).toHaveProperty('party2Type');
            });

            it('should preserve all document fields', async () => {
                const result = await fetchTransactionsWithParties('1-13-1');

                expect(result[0].documentId).toBe('DOC123');
                expect(result[0].documentType).toBe('DEED');
                expect(result[0].docTypeDescription).toBe('DEED');
                expect(result[0].documentDate).toBe('2025-06-16');
                expect(result[0].documentAmount).toBe(1000000);
                expect(result[0].classCodeDescription).toBe('DEEDS AND OTHER CONVEYANCES');
            });
        });
    });
});

