import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only module
vi.mock('server-only', () => ({}));

// Mock the database module
vi.mock('../../db', () => ({
    queryMany: vi.fn(),
}));

import { queryMany } from '../../db';
import { fetchOwnerContacts, type OwnerContactsResult } from '../index';
import type { OwnerContact } from '@/types/contacts';

describe('data/contacts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockContactData: OwnerContact[] = [
        {
            borough: '1',
            block: '13',
            lot: '1',
            owner_first_name: 'John',
            owner_last_name: 'Doe',
            owner_business_name: null,
            owner_type: 'Individual',
            owner_address: '123 Main St',
            owner_city: 'New York',
            owner_state: 'NY',
            owner_zip: '10001',
            date: new Date('2024-01-15'),
            agency: 'DOF',
            source: 'property_valuation',
            owner_title: null,
            owner_phone: '212-555-0100',
            owner_full_name: 'John Doe',
            owner_middle_name: null,
            owner_address_2: null,
            owner_city_2: null,
            owner_state_2: null,
            owner_zip_2: null,
            owner_phone_2: null,
        },
        {
            borough: '1',
            block: '13',
            lot: '1',
            owner_first_name: null,
            owner_last_name: null,
            owner_business_name: 'Acme Corp',
            owner_type: 'Corporation',
            owner_address: '456 Business Ave',
            owner_city: 'New York',
            owner_state: 'NY',
            owner_zip: '10002',
            date: new Date('2023-06-10'),
            agency: 'HPD',
            source: 'multiple_dwelling_registrations',
            owner_title: 'Owner',
            owner_phone: '212-555-0200',
            owner_full_name: null,
            owner_middle_name: null,
            owner_address_2: '456 Business Ave Apt 2',
            owner_city_2: 'Brooklyn',
            owner_state_2: 'NY',
            owner_zip_2: '11201',
            owner_phone_2: '718-555-0300',
        },
        {
            borough: '1',
            block: '13',
            lot: '1',
            owner_first_name: 'Jane',
            owner_last_name: 'Smith',
            owner_business_name: null,
            owner_type: 'Individual',
            owner_address: '789 Park Ave',
            owner_city: 'New York',
            owner_state: 'NY',
            owner_zip: '10003',
            date: null, // Contact with no date
            agency: 'DOB',
            source: 'permits',
            owner_title: 'Permit Holder',
            owner_phone: null,
            owner_full_name: 'Jane Smith',
            owner_middle_name: 'M',
            owner_address_2: null,
            owner_city_2: null,
            owner_state_2: null,
            owner_zip_2: null,
            owner_phone_2: null,
        },
    ];

    describe('fetchOwnerContacts', () => {
        it('should fetch owner contacts successfully', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toBeUndefined();
            expect(result.data).toHaveLength(3);
            expect(result.data?.[0].owner_full_name).toBe('John Doe');
            expect(result.data?.[1].owner_business_name).toBe('Acme Corp');
            expect(result.data?.[2].owner_full_name).toBe('Jane Smith');
        });

        it('should handle BBL with leading zeros', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            const result = await fetchOwnerContacts('1-00013-0001');

            expect(result.error).toBeUndefined();
            expect(queryMany).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    borough: '1',
                    block: '00013',
                    lot: '0001',
                })
            );
        });

        it('should return error for invalid BBL format', async () => {
            const result = await fetchOwnerContacts('invalid-bbl');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
            expect(queryMany).not.toHaveBeenCalled();
        });

        it('should return empty array when no contacts found', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce([]);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toBeUndefined();
            expect(result.data).toEqual([]);
        });

        it('should handle database errors gracefully', async () => {
            vi.mocked(queryMany).mockRejectedValueOnce(new Error('Database connection failed'));

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toContain('Failed to load owner contacts data');
            expect(result.error).toContain('Database connection failed');
            expect(result.data).toBeNull();
        });

        it('should handle unknown errors gracefully', async () => {
            vi.mocked(queryMany).mockRejectedValueOnce('Unknown error string');

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toContain('Failed to load owner contacts data');
            expect(result.error).toContain('Unknown error');
            expect(result.data).toBeNull();
        });

        it('should parse BBL with different formats', async () => {
            const testCases = [
                { bbl: '1-13-1', expected: { borough: '1', block: '13', lot: '1' } },
                { bbl: '2-1234-56', expected: { borough: '2', block: '1234', lot: '56' } },
                { bbl: '3-00013-0001', expected: { borough: '3', block: '00013', lot: '0001' } },
                { bbl: '5-999-9999', expected: { borough: '5', block: '999', lot: '9999' } },
            ];

            for (const testCase of testCases) {
                vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);
                await fetchOwnerContacts(testCase.bbl);

                expect(queryMany).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining(testCase.expected)
                );
            }
        });

        it('should preserve leading zeros in block and lot', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            await fetchOwnerContacts('1-00013-0001');

            expect(queryMany).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    borough: '1',
                    block: '00013',
                    lot: '0001',
                })
            );
        });
    });

    describe('BBL Parsing Edge Cases', () => {
        it('should reject BBL without hyphens', async () => {
            const result = await fetchOwnerContacts('1131');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should reject BBL with wrong number of parts', async () => {
            const testCases = ['1-13', '1', '1-13-1-1', ''];

            for (const bbl of testCases) {
                const result = await fetchOwnerContacts(bbl);

                expect(result.error).toContain('Invalid BBL format');
                expect(result.data).toBeNull();
            }
        });

        it('should reject BBL with non-numeric borough', async () => {
            const result = await fetchOwnerContacts('a-13-1');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should reject BBL with invalid borough code (0)', async () => {
            const result = await fetchOwnerContacts('0-13-1');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should reject BBL with invalid borough code (6)', async () => {
            const result = await fetchOwnerContacts('6-13-1');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should accept BBL with all valid boroughs (1-5)', async () => {
            const boroughs = [1, 2, 3, 4, 5];

            for (const boro of boroughs) {
                vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);
                const result = await fetchOwnerContacts(`${boro}-13-1`);

                expect(result.error).toBeUndefined();
                expect(queryMany).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.objectContaining({ borough: String(boro) })
                );
            }
        });

        it('should accept BBL with non-numeric block and lot', async () => {
            // Block and lot can be alphanumeric in some edge cases
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            const result = await fetchOwnerContacts('1-ABC-XYZ');

            expect(result.error).toBeUndefined();
            expect(queryMany).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    borough: '1',
                    block: 'ABC',
                    lot: 'XYZ',
                })
            );
        });
    });

    describe('SQL Query Structure', () => {
        it('should query with correct BBL parameters', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            await fetchOwnerContacts('2-456-789');

            expect(queryMany).toHaveBeenCalledWith(
                expect.stringContaining('FROM gold.owner_contact'),
                {
                    borough: '2',
                    block: '456',
                    lot: '789',
                }
            );
        });

        it('should include ORDER BY clause with date handling', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            await fetchOwnerContacts('1-13-1');

            const query = vi.mocked(queryMany).mock.calls[0][0];
            expect(query).toContain('ORDER BY');
            expect(query).toContain('CASE');
            expect(query).toContain('WHEN date IS NOT NULL');
            expect(query).toContain('THEN date');
            expect(query).toContain("ELSE '1900-01-01'");
            expect(query).toContain('DESC');
        });

        it('should filter by borough, block, and lot', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            await fetchOwnerContacts('1-13-1');

            const query = vi.mocked(queryMany).mock.calls[0][0];
            expect(query).toContain('WHERE borough = @borough');
            expect(query).toContain('AND block = @block');
            expect(query).toContain('AND lot = @lot');
        });

        it('should select all columns', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            await fetchOwnerContacts('1-13-1');

            const query = vi.mocked(queryMany).mock.calls[0][0];
            expect(query).toContain('SELECT *');
        });
    });

    describe('Data Ordering', () => {
        it('should order contacts by date descending (most recent first)', async () => {
            const orderedContacts: OwnerContact[] = [
                {
                    ...mockContactData[0],
                    date: new Date('2024-12-01'),
                    owner_full_name: 'Most Recent',
                },
                {
                    ...mockContactData[1],
                    date: new Date('2023-06-01'),
                    owner_full_name: 'Middle',
                },
                {
                    ...mockContactData[2],
                    date: new Date('2022-01-01'),
                    owner_full_name: 'Oldest',
                },
            ];

            vi.mocked(queryMany).mockResolvedValueOnce(orderedContacts);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data?.[0].owner_full_name).toBe('Most Recent');
            expect(result.data?.[1].owner_full_name).toBe('Middle');
            expect(result.data?.[2].owner_full_name).toBe('Oldest');
        });

        it('should handle contacts with null dates', async () => {
            const contactsWithNullDates: OwnerContact[] = [
                {
                    ...mockContactData[0],
                    date: new Date('2024-01-01'),
                },
                {
                    ...mockContactData[1],
                    date: null,
                },
            ];

            vi.mocked(queryMany).mockResolvedValueOnce(contactsWithNullDates);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toBeUndefined();
            expect(result.data).toHaveLength(2);
        });
    });

    describe('Return Type Structure', () => {
        it('should return OwnerContactsResult interface', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            const result: OwnerContactsResult = await fetchOwnerContacts('1-13-1');

            expect(result).toHaveProperty('data');
            // error property is optional and only present when there's an error
            expect(result.error).toBeUndefined();
        });

        it('should return data as array when successful', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(mockContactData);

            const result = await fetchOwnerContacts('1-13-1');

            expect(Array.isArray(result.data)).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('should return data as null when error occurs', async () => {
            vi.mocked(queryMany).mockRejectedValueOnce(new Error('Test error'));

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });

        it('should preserve all OwnerContact fields', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce([mockContactData[0]]);

            const result = await fetchOwnerContacts('1-13-1');

            const contact = result.data?.[0];
            expect(contact).toHaveProperty('borough');
            expect(contact).toHaveProperty('block');
            expect(contact).toHaveProperty('lot');
            expect(contact).toHaveProperty('owner_first_name');
            expect(contact).toHaveProperty('owner_last_name');
            expect(contact).toHaveProperty('owner_business_name');
            expect(contact).toHaveProperty('owner_type');
            expect(contact).toHaveProperty('owner_address');
            expect(contact).toHaveProperty('owner_city');
            expect(contact).toHaveProperty('owner_state');
            expect(contact).toHaveProperty('owner_zip');
            expect(contact).toHaveProperty('date');
            expect(contact).toHaveProperty('agency');
            expect(contact).toHaveProperty('source');
            expect(contact).toHaveProperty('owner_title');
            expect(contact).toHaveProperty('owner_phone');
            expect(contact).toHaveProperty('owner_full_name');
            expect(contact).toHaveProperty('owner_middle_name');
            expect(contact).toHaveProperty('owner_address_2');
            expect(contact).toHaveProperty('owner_city_2');
            expect(contact).toHaveProperty('owner_state_2');
            expect(contact).toHaveProperty('owner_zip_2');
            expect(contact).toHaveProperty('owner_phone_2');
        });
    });

    describe('Different Contact Types', () => {
        it('should handle individual owners', async () => {
            const individualContact: OwnerContact[] = [{
                ...mockContactData[0],
                owner_type: 'Individual',
                owner_first_name: 'John',
                owner_last_name: 'Doe',
                owner_business_name: null,
            }];

            vi.mocked(queryMany).mockResolvedValueOnce(individualContact);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data?.[0].owner_type).toBe('Individual');
            expect(result.data?.[0].owner_first_name).toBe('John');
            expect(result.data?.[0].owner_last_name).toBe('Doe');
        });

        it('should handle business owners', async () => {
            const businessContact: OwnerContact[] = [{
                ...mockContactData[1],
                owner_type: 'Corporation',
                owner_business_name: 'Acme Corp',
                owner_first_name: null,
                owner_last_name: null,
            }];

            vi.mocked(queryMany).mockResolvedValueOnce(businessContact);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data?.[0].owner_type).toBe('Corporation');
            expect(result.data?.[0].owner_business_name).toBe('Acme Corp');
        });

        it('should handle contacts from different agencies', async () => {
            const multiAgencyContacts: OwnerContact[] = [
                { ...mockContactData[0], agency: 'DOF', source: 'property_valuation' },
                { ...mockContactData[1], agency: 'HPD', source: 'multiple_dwelling_registrations' },
                { ...mockContactData[2], agency: 'DOB', source: 'permits' },
            ];

            vi.mocked(queryMany).mockResolvedValueOnce(multiAgencyContacts);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data?.[0].agency).toBe('DOF');
            expect(result.data?.[1].agency).toBe('HPD');
            expect(result.data?.[2].agency).toBe('DOB');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty strings in BBL', async () => {
            const result = await fetchOwnerContacts('--');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should handle BBL with extra parts after splitting', async () => {
            // Test with more than 3 parts
            const result = await fetchOwnerContacts('1-13-1-extra');

            expect(result.error).toContain('Invalid BBL format');
            expect(result.data).toBeNull();
        });

        it('should handle null query result', async () => {
            vi.mocked(queryMany).mockResolvedValueOnce(null as any);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.data).toEqual([]);
            expect(result.error).toBeUndefined();
        });

        it('should handle contacts with all null fields', async () => {
            const nullContact: OwnerContact[] = [{
                borough: '1',
                block: '13',
                lot: '1',
                owner_first_name: null,
                owner_last_name: null,
                owner_business_name: null,
                owner_type: null,
                owner_address: null,
                owner_city: null,
                owner_state: null,
                owner_zip: null,
                date: null,
                agency: null,
                source: null,
                owner_title: null,
                owner_phone: null,
                owner_full_name: null,
                owner_middle_name: null,
                owner_address_2: null,
                owner_city_2: null,
                owner_state_2: null,
                owner_zip_2: null,
                owner_phone_2: null,
            }];

            vi.mocked(queryMany).mockResolvedValueOnce(nullContact);

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toBeUndefined();
            expect(result.data).toHaveLength(1);
        });

        it('should include BBL in error messages', async () => {
            vi.mocked(queryMany).mockRejectedValueOnce(new Error('Connection timeout'));

            const result = await fetchOwnerContacts('1-13-1');

            expect(result.error).toContain('1-13-1');
            expect(result.error).toContain('Connection timeout');
        });
    });
});
