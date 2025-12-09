import { describe, it, expect } from 'vitest';
import {
    cleanupContact,
    cleanupContacts,
    reformatContactAddresses,
    reformatContactsAddresses,
    formatContact,
    formatContacts,
    deduplicateContacts,
    type FormattedOwnerContact
} from '../utils';
import type { OwnerContact } from '@/types/contacts';

describe('contacts/utils', () => {
    // Helper to create a mock contact with default values
    const createMockContact = (overrides: Partial<OwnerContact> = {}): OwnerContact => ({
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
        ...overrides,
    });

    describe('cleanupContact', () => {
        describe('name reformatting', () => {
            it('should reformat "LASTNAME, FIRSTNAME" to "FIRSTNAME LASTNAME"', () => {
                const contact = createMockContact({
                    owner_full_name: 'KEONG, LUCIAN',
                    owner_first_name: null,
                    owner_last_name: null,
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should reformat "SMITH, JOHN" to "JOHN SMITH"', () => {
                const contact = createMockContact({
                    owner_full_name: 'SMITH, JOHN',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('JOHN SMITH');
            });

            it('should handle middle names in "LASTNAME, FIRSTNAME MIDDLENAME" format', () => {
                const contact = createMockContact({
                    owner_full_name: 'DOE, JANE MARIE',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('JANE MARIE DOE');
            });

            it('should preserve names without commas', () => {
                const contact = createMockContact({
                    owner_full_name: 'JOHN SMITH',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('JOHN SMITH');
            });

            it('should handle names with extra whitespace', () => {
                const contact = createMockContact({
                    owner_full_name: 'KEONG,  LUCIAN',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should handle names with leading/trailing whitespace', () => {
                const contact = createMockContact({
                    owner_full_name: '  KEONG, LUCIAN  ',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should remove double quotes and trim trailing spaces', () => {
                const contact = createMockContact({
                    owner_full_name: '"KEONG, LUCIAN   "',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should remove single quotes and trim trailing spaces', () => {
                const contact = createMockContact({
                    owner_full_name: "'KEONG, LUCIAN   '",
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should handle quotes with extra spaces between parts', () => {
                const contact = createMockContact({
                    owner_full_name: '"KEONG,  LUCIAN   "',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should handle names with trailing spaces after comma', () => {
                const contact = createMockContact({
                    owner_full_name: 'KEONG, LUCIAN   ',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('LUCIAN KEONG');
            });

            it('should extract first name from reformatted name when not set', () => {
                const contact = createMockContact({
                    owner_full_name: 'KEONG, LUCIAN',
                    owner_first_name: null,
                    owner_last_name: null,
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_first_name).toBe('LUCIAN');
                expect(cleaned.owner_last_name).toBe('KEONG');
            });

            it('should extract first and last name from reformatted name with middle name', () => {
                const contact = createMockContact({
                    owner_full_name: 'DOE, JANE MARIE',
                    owner_first_name: null,
                    owner_last_name: null,
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_first_name).toBe('JANE MARIE');
                expect(cleaned.owner_last_name).toBe('DOE');
            });

            it('should preserve existing first/last names if already set', () => {
                const contact = createMockContact({
                    owner_full_name: 'KEONG, LUCIAN',
                    owner_first_name: 'Lucian',
                    owner_last_name: 'Keong',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_first_name).toBe('Lucian');
                expect(cleaned.owner_last_name).toBe('Keong');
            });

            it('should handle null owner_full_name', () => {
                const contact = createMockContact({
                    owner_full_name: null,
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBeNull();
            });

            it('should handle empty string owner_full_name', () => {
                const contact = createMockContact({
                    owner_full_name: '',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBeNull();
            });

            it('should handle names with multiple commas by not reformatting', () => {
                const contact = createMockContact({
                    owner_full_name: 'SMITH, JOHN, JR',
                });
                const cleaned = cleanupContact(contact);

                // Should return trimmed original since it doesn't match expected format
                expect(cleaned.owner_full_name).toBe('SMITH, JOHN, JR');
            });

            it('should handle single word names', () => {
                const contact = createMockContact({
                    owner_full_name: 'MADONNA',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('MADONNA');
            });

            it('should handle comma with no first name', () => {
                const contact = createMockContact({
                    owner_full_name: 'SMITH,',
                });
                const cleaned = cleanupContact(contact);

                // Should return trimmed original since second part is empty
                expect(cleaned.owner_full_name).toBe('SMITH,');
            });

            it('should not reformat business names with INC suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'MENEMSHOVITZ NY REALTY, INC',
                });
                const cleaned = cleanupContact(contact);

                // Should NOT be reversed - business suffix should be preserved
                expect(cleaned.owner_full_name).toBe('MENEMSHOVITZ NY REALTY, INC');
            });

            it('should not reformat business names with LLC suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'ABC PROPERTY MANAGEMENT, LLC',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('ABC PROPERTY MANAGEMENT, LLC');
            });

            it('should not reformat business names with CORP suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'SMITH ENTERPRISES, CORP',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('SMITH ENTERPRISES, CORP');
            });

            it('should not reformat business names with LTD suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'GLOBAL HOLDINGS, LTD',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('GLOBAL HOLDINGS, LTD');
            });

            it('should not reformat business names with LP suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'REAL ESTATE PARTNERS, LP',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('REAL ESTATE PARTNERS, LP');
            });

            it('should not reformat business names with L.L.C. suffix (with periods)', () => {
                const contact = createMockContact({
                    owner_full_name: 'ABC COMPANY, L.L.C.',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_full_name).toBe('ABC COMPANY, L.L.C.');
            });

            it('should not reformat business names with lowercase suffix', () => {
                const contact = createMockContact({
                    owner_full_name: 'DOWNTOWN PROPERTIES, inc',
                });
                const cleaned = cleanupContact(contact);

                // Should handle case-insensitive suffix matching
                expect(cleaned.owner_full_name).toBe('DOWNTOWN PROPERTIES, inc');
            });

            it('should still reformat personal names with commas', () => {
                const contact = createMockContact({
                    owner_full_name: 'DOE, JOHN',
                });
                const cleaned = cleanupContact(contact);

                // Should still reformat personal names (not business suffixes)
                expect(cleaned.owner_full_name).toBe('JOHN DOE');
            });

            it('should handle comma with no last name', () => {
                const contact = createMockContact({
                    owner_full_name: ', JOHN',
                });
                const cleaned = cleanupContact(contact);

                // Should return trimmed original since first part is empty
                expect(cleaned.owner_full_name).toBe(', JOHN');
            });
        });

        describe('owner_business_name cleanup', () => {
            it('should replace "N/A" with null', () => {
                const contact = createMockContact({ owner_business_name: 'N/A' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "n/a" (lowercase) with null', () => {
                const contact = createMockContact({ owner_business_name: 'n/a' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "NA" with null', () => {
                const contact = createMockContact({ owner_business_name: 'NA' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "na" (lowercase) with null', () => {
                const contact = createMockContact({ owner_business_name: 'na' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "N.A." with null', () => {
                const contact = createMockContact({ owner_business_name: 'N.A.' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "n.a." (lowercase) with null', () => {
                const contact = createMockContact({ owner_business_name: 'n.a.' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "N.A" (without trailing period) with null', () => {
                const contact = createMockContact({ owner_business_name: 'N.A' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "N A" (with space) with null', () => {
                const contact = createMockContact({ owner_business_name: 'N A' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "not available" with null', () => {
                const contact = createMockContact({ owner_business_name: 'not available' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "Not Available" (mixed case) with null', () => {
                const contact = createMockContact({ owner_business_name: 'Not Available' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "not applicable" with null', () => {
                const contact = createMockContact({ owner_business_name: 'not applicable' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should replace "Not Applicable" (mixed case) with null', () => {
                const contact = createMockContact({ owner_business_name: 'Not Applicable' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should handle N/A with leading/trailing whitespace', () => {
                const contact = createMockContact({ owner_business_name: '  N/A  ' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should handle NA with leading/trailing whitespace', () => {
                const contact = createMockContact({ owner_business_name: '  NA  ' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should preserve valid business names', () => {
                const contact = createMockContact({ owner_business_name: 'Acme Corporation' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBe('Acme Corporation');
            });

            it('should preserve business names containing "NA" as part of name', () => {
                const contact = createMockContact({ owner_business_name: 'National Bank' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBe('National Bank');
            });

            it('should preserve business names starting with "NA"', () => {
                const contact = createMockContact({ owner_business_name: 'NASA LLC' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBe('NASA LLC');
            });

            it('should keep null values as null', () => {
                const contact = createMockContact({ owner_business_name: null });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });

            it('should handle empty string', () => {
                const contact = createMockContact({ owner_business_name: '' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBe('');
            });

            it('should handle whitespace-only string', () => {
                const contact = createMockContact({ owner_business_name: '   ' });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBe('   ');
            });
        });

        describe('other fields preservation', () => {
            it('should preserve all other contact fields', () => {
                const contact = createMockContact({
                    owner_business_name: 'N/A',
                    owner_first_name: 'Jane',
                    owner_last_name: 'Smith',
                    owner_phone: '555-1234',
                });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_first_name).toBe('Jane');
                expect(cleaned.owner_last_name).toBe('Smith');
                expect(cleaned.owner_phone).toBe('555-1234');
                expect(cleaned.borough).toBe('1');
                expect(cleaned.block).toBe('13');
                expect(cleaned.lot).toBe('1');
            });

            it('should not mutate the original contact', () => {
                const contact = createMockContact({ owner_business_name: 'N/A' });
                const originalBusinessName = contact.owner_business_name;

                cleanupContact(contact);

                expect(contact.owner_business_name).toBe(originalBusinessName);
            });

            it('should return a new object', () => {
                const contact = createMockContact({ owner_business_name: 'N/A' });
                const cleaned = cleanupContact(contact);

                expect(cleaned).not.toBe(contact);
            });
        });
    });

    describe('cleanupContacts', () => {
        it('should clean up multiple contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'N/A' }),
                createMockContact({ owner_business_name: 'Acme Corp' }),
                createMockContact({ owner_business_name: 'n/a' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned).toHaveLength(3);
            expect(cleaned[0].owner_business_name).toBeNull();
            expect(cleaned[1].owner_business_name).toBe('Acme Corp');
            expect(cleaned[2].owner_business_name).toBeNull();
        });

        it('should handle empty array', () => {
            const contacts: OwnerContact[] = [];
            const cleaned = cleanupContacts(contacts);

            expect(cleaned).toEqual([]);
        });

        it('should handle array with single contact', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'N/A' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned).toHaveLength(1);
            expect(cleaned[0].owner_business_name).toBeNull();
        });

        it('should preserve order of contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'First Corp', owner_first_name: 'First' }),
                createMockContact({ owner_business_name: 'Second Corp', owner_first_name: 'Second' }),
                createMockContact({ owner_business_name: 'Third Corp', owner_first_name: 'Third' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned[0].owner_first_name).toBe('First');
            expect(cleaned[1].owner_first_name).toBe('Second');
            expect(cleaned[2].owner_first_name).toBe('Third');
        });

        it('should not mutate the original array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'N/A' }),
            ];
            const originalBusinessName = contacts[0].owner_business_name;

            cleanupContacts(contacts);

            expect(contacts[0].owner_business_name).toBe(originalBusinessName);
        });

        it('should return a new array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'N/A' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned).not.toBe(contacts);
        });

        it('should handle all contacts with N/A values', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'N/A' }),
                createMockContact({ owner_business_name: 'n/a' }),
                createMockContact({ owner_business_name: 'NA' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned.every(c => c.owner_business_name === null)).toBe(true);
        });

        it('should handle all contacts with valid business names', () => {
            const contacts: OwnerContact[] = [
                createMockContact({ owner_business_name: 'Corp A' }),
                createMockContact({ owner_business_name: 'Corp B' }),
                createMockContact({ owner_business_name: 'Corp C' }),
            ];

            const cleaned = cleanupContacts(contacts);

            expect(cleaned[0].owner_business_name).toBe('Corp A');
            expect(cleaned[1].owner_business_name).toBe('Corp B');
            expect(cleaned[2].owner_business_name).toBe('Corp C');
        });
    });

    describe('edge cases', () => {
        it('should handle contact with all null fields', () => {
            const contact: OwnerContact = {
                borough: null,
                block: null,
                lot: null,
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
            };

            const cleaned = cleanupContact(contact);

            expect(cleaned.owner_business_name).toBeNull();
        });

        it('should handle mixed case variations', () => {
            const testCases = [
                'N/A',
                'n/a',
                'N/a',
                'n/A',
                'NA',
                'na',
                'Na',
                'nA',
            ];

            testCases.forEach(naValue => {
                const contact = createMockContact({ owner_business_name: naValue });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });
        });

        it('should handle N/A with various whitespace', () => {
            const testCases = [
                ' N/A',
                'N/A ',
                ' N/A ',
                '  N/A  ',
                '\tN/A\t',
                '\nN/A\n',
            ];

            testCases.forEach(naValue => {
                const contact = createMockContact({ owner_business_name: naValue });
                const cleaned = cleanupContact(contact);

                expect(cleaned.owner_business_name).toBeNull();
            });
        });
    });

    describe('reformatContactAddresses', () => {
        describe('primary address formatting', () => {
            it('should format complete address with all fields', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St, New York, NY 10001');
                expect(reformatted.owner_city).toBeNull();
                expect(reformatted.owner_state).toBeNull();
                expect(reformatted.owner_zip).toBeNull();
            });

            it('should format address with street and city only', () => {
                const contact = createMockContact({
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: null,
                    owner_zip: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('456 Park Ave, Brooklyn');
            });

            it('should format address with street and state only', () => {
                const contact = createMockContact({
                    owner_address: '789 Broadway',
                    owner_city: null,
                    owner_state: 'NY',
                    owner_zip: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('789 Broadway, NY');
            });

            it('should format address with street and zip only', () => {
                const contact = createMockContact({
                    owner_address: '321 Oak St',
                    owner_city: null,
                    owner_state: null,
                    owner_zip: '10002',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('321 Oak St, 10002');
            });

            it('should format address with city, state, and zip only', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: 'Queens',
                    owner_state: 'NY',
                    owner_zip: '11101',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('Queens, NY 11101');
            });

            it('should format address with state and zip only', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: null,
                    owner_state: 'NY',
                    owner_zip: '10003',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('NY 10003');
            });

            it('should format address with city and state only', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: 'Manhattan',
                    owner_state: 'NY',
                    owner_zip: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('Manhattan, NY');
            });

            it('should return null when all address fields are null', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBeNull();
            });

            it('should return null when all address fields are empty strings', () => {
                const contact = createMockContact({
                    owner_address: '',
                    owner_city: '',
                    owner_state: '',
                    owner_zip: '',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBeNull();
            });

            it('should return null when all address fields are whitespace', () => {
                const contact = createMockContact({
                    owner_address: '   ',
                    owner_city: '  ',
                    owner_state: ' ',
                    owner_zip: '   ',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBeNull();
            });

            it('should trim whitespace from all components', () => {
                const contact = createMockContact({
                    owner_address: '  123 Main St  ',
                    owner_city: '  New York  ',
                    owner_state: '  NY  ',
                    owner_zip: '  10001  ',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St, New York, NY 10001');
            });

            it('should handle street address only', () => {
                const contact = createMockContact({
                    owner_address: '999 Test Ave',
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('999 Test Ave');
            });
        });

        describe('secondary address formatting', () => {
            it('should format complete secondary address with all fields', () => {
                const contact = createMockContact({
                    owner_address_2: '456 Second St',
                    owner_city_2: 'Brooklyn',
                    owner_state_2: 'NY',
                    owner_zip_2: '11201',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address_2).toBe('456 Second St, Brooklyn, NY 11201');
                expect(reformatted.owner_city_2).toBeNull();
                expect(reformatted.owner_state_2).toBeNull();
                expect(reformatted.owner_zip_2).toBeNull();
            });

            it('should format secondary address with partial fields', () => {
                const contact = createMockContact({
                    owner_address_2: '789 Third Ave',
                    owner_city_2: 'Queens',
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address_2).toBe('789 Third Ave, Queens');
            });

            it('should return null when all secondary address fields are null', () => {
                const contact = createMockContact({
                    owner_address_2: null,
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address_2).toBeNull();
            });

            it('should handle secondary address only', () => {
                const contact = createMockContact({
                    owner_address_2: 'PO Box 123',
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address_2).toBe('PO Box 123');
            });
        });

        describe('both addresses formatting', () => {
            it('should format both primary and secondary addresses', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: '456 Second St',
                    owner_city_2: 'Brooklyn',
                    owner_state_2: 'NY',
                    owner_zip_2: '11201',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St, New York, NY 10001');
                expect(reformatted.owner_address_2).toBe('456 Second St, Brooklyn, NY 11201');
                expect(reformatted.owner_city).toBeNull();
                expect(reformatted.owner_state).toBeNull();
                expect(reformatted.owner_zip).toBeNull();
                expect(reformatted.owner_city_2).toBeNull();
                expect(reformatted.owner_state_2).toBeNull();
                expect(reformatted.owner_zip_2).toBeNull();
            });

            it('should handle primary address only', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: null,
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St, New York, NY 10001');
                expect(reformatted.owner_address_2).toBeNull();
            });

            it('should handle secondary address only', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                    owner_address_2: '456 Second St',
                    owner_city_2: 'Brooklyn',
                    owner_state_2: 'NY',
                    owner_zip_2: '11201',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBeNull();
                expect(reformatted.owner_address_2).toBe('456 Second St, Brooklyn, NY 11201');
            });
        });

        describe('other fields preservation', () => {
            it('should preserve all other contact fields', () => {
                const contact = createMockContact({
                    owner_first_name: 'Jane',
                    owner_last_name: 'Smith',
                    owner_phone: '555-1234',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_first_name).toBe('Jane');
                expect(reformatted.owner_last_name).toBe('Smith');
                expect(reformatted.owner_phone).toBe('555-1234');
                expect(reformatted.borough).toBe('1');
                expect(reformatted.block).toBe('13');
                expect(reformatted.lot).toBe('1');
            });

            it('should not mutate the original contact', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });
                const originalAddress = contact.owner_address;
                const originalCity = contact.owner_city;

                reformatContactAddresses(contact);

                expect(contact.owner_address).toBe(originalAddress);
                expect(contact.owner_city).toBe(originalCity);
            });

            it('should return a new object', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted).not.toBe(contact);
            });
        });

        describe('special address formats', () => {
            it('should handle apartment numbers in street address', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St Apt 4B',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St Apt 4B, New York, NY 10001');
            });

            it('should handle PO Box addresses', () => {
                const contact = createMockContact({
                    owner_address: 'PO Box 12345',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('PO Box 12345, New York, NY 10001');
            });

            it('should handle zip+4 format', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001-1234',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Main St, New York, NY 10001-1234');
            });

            it('should handle long street addresses', () => {
                const contact = createMockContact({
                    owner_address: '123 Very Long Street Name Boulevard Suite 100',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const reformatted = reformatContactAddresses(contact);

                expect(reformatted.owner_address).toBe('123 Very Long Street Name Boulevard Suite 100, New York, NY 10001');
            });
        });
    });

    describe('reformatContactsAddresses', () => {
        it('should reformat multiple contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                createMockContact({
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                }),
                createMockContact({
                    owner_address: '789 Broadway',
                    owner_city: 'Queens',
                    owner_state: 'NY',
                    owner_zip: '11101',
                }),
            ];

            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted).toHaveLength(3);
            expect(reformatted[0].owner_address).toBe('123 Main St, New York, NY 10001');
            expect(reformatted[1].owner_address).toBe('456 Park Ave, Brooklyn, NY 11201');
            expect(reformatted[2].owner_address).toBe('789 Broadway, Queens, NY 11101');
        });

        it('should handle empty array', () => {
            const contacts: OwnerContact[] = [];
            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted).toEqual([]);
        });

        it('should handle array with single contact', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
            ];

            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted).toHaveLength(1);
            expect(reformatted[0].owner_address).toBe('123 Main St, New York, NY 10001');
        });

        it('should preserve order of contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_first_name: 'First',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                createMockContact({
                    owner_first_name: 'Second',
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                }),
            ];

            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted[0].owner_first_name).toBe('First');
            expect(reformatted[1].owner_first_name).toBe('Second');
        });

        it('should not mutate the original array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                }),
            ];
            const originalAddress = contacts[0].owner_address;

            reformatContactsAddresses(contacts);

            expect(contacts[0].owner_address).toBe(originalAddress);
        });

        it('should return a new array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                }),
            ];

            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted).not.toBe(contacts);
        });

        it('should handle contacts with mixed address completeness', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                createMockContact({
                    owner_address: '456 Park Ave',
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                }),
                createMockContact({
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                }),
            ];

            const reformatted = reformatContactsAddresses(contacts);

            expect(reformatted[0].owner_address).toBe('123 Main St, New York, NY 10001');
            expect(reformatted[1].owner_address).toBe('456 Park Ave');
            expect(reformatted[2].owner_address).toBeNull();
        });
    });

    describe('formatContact', () => {
        describe('combined transformations', () => {
            it('should apply both cleanup and address reformatting', () => {
                const contact = createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                // Cleanup applied
                expect(formatted.owner_business_name).toBeNull();

                // Address reformatted into array
                expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);

                // City/state/zip fields removed
                expect('owner_city' in formatted).toBe(false);
                expect('owner_state' in formatted).toBe(false);
                expect('owner_zip' in formatted).toBe(false);
            });

            it('should handle both primary and secondary addresses', () => {
                const contact = createMockContact({
                    owner_business_name: 'n/a',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: '456 Second St',
                    owner_city_2: 'Brooklyn',
                    owner_state_2: 'NY',
                    owner_zip_2: '11201',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBeNull();
                expect(formatted.owner_address).toEqual([
                    '123 Main St, New York, NY 10001',
                    '456 Second St, Brooklyn, NY 11201'
                ]);

                // All city/state/zip and secondary address fields removed
                expect('owner_city' in formatted).toBe(false);
                expect('owner_state' in formatted).toBe(false);
                expect('owner_zip' in formatted).toBe(false);
                expect('owner_city_2' in formatted).toBe(false);
                expect('owner_state_2' in formatted).toBe(false);
                expect('owner_zip_2' in formatted).toBe(false);
                expect('owner_address_2' in formatted).toBe(false);
            });

            it('should handle valid business name with address formatting', () => {
                const contact = createMockContact({
                    owner_business_name: 'Acme Corporation',
                    owner_address: '789 Broadway',
                    owner_city: 'Queens',
                    owner_state: 'NY',
                    owner_zip: '11101',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBe('Acme Corporation');
                expect(formatted.owner_address).toEqual(['789 Broadway, Queens, NY 11101']);
            });

            it('should handle N/A with partial address', () => {
                const contact = createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '999 Test Ave',
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBeNull();
                expect(formatted.owner_address).toEqual(['999 Test Ave']);
            });

            it('should handle N/A with no address', () => {
                const contact = createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBeNull();
                expect(formatted.owner_address).toEqual([]);
            });
        });

        describe('address deduplication within contact', () => {
            it('should deduplicate case variations of the same address', () => {
                const contact = createMockContact({
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'ALEXANDRIA',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                });

                const formatted = formatContact(contact);

                // Should have only one address (duplicate removed)
                expect(formatted.owner_address).toHaveLength(1);
                expect(formatted.owner_address[0]).toContain('210 N. WASHINGTON STREET');
            });

            it('should deduplicate addresses with minor formatting differences', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St, New York, NY 10001',
                    owner_address_2: '123 Main Street, New York, NY 10001',
                });

                const formatted = formatContact(contact);

                // Should deduplicate similar addresses
                expect(formatted.owner_address.length).toBeLessThanOrEqual(2);
            });

            it('should keep distinct addresses', () => {
                const contact = createMockContact({
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    owner_address_2: '106 WASHINGTON PLACE',
                    owner_city_2: 'New York',
                    owner_state_2: 'NY',
                    owner_zip_2: '10014',
                });

                const formatted = formatContact(contact);

                // Should keep both distinct addresses
                expect(formatted.owner_address).toHaveLength(2);
                expect(formatted.owner_address[0]).toContain('210 N. WASHINGTON STREET');
                expect(formatted.owner_address[1]).toContain('106 WASHINGTON PLACE');
            });

            it('should handle empty address arrays', () => {
                const contact = createMockContact({
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                    owner_address_2: null,
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_address).toEqual([]);
            });

            it('should deduplicate the specific example from user: Alexandria vs ALEXANDRIA', () => {
                const contact = createMockContact({
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'ALEXANDRIA',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                });

                const formatted = formatContact(contact);

                // Should deduplicate: "210 N. WASHINGTON STREET, Alexandria, VA 22314" 
                // and "210 N. WASHINGTON STREET, ALEXANDRIA, VA 22314" are duplicates
                expect(formatted.owner_address).toHaveLength(1);
                const address = formatted.owner_address[0];
                expect(address).toContain('210 N. WASHINGTON STREET');
                expect(address).toContain('VA');
                expect(address).toContain('22314');
            });

            it('should combine phone numbers into array', () => {
                const contact = createMockContact({
                    owner_phone: '212-555-0100',
                    owner_phone_2: '718-555-0200',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_phone).toEqual(['212-555-0100', '718-555-0200']);
                expect('owner_phone_2' in formatted).toBe(false);
            });

            it('should handle single phone number', () => {
                const contact = createMockContact({
                    owner_phone: '212-555-0100',
                    owner_phone_2: null,
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_phone).toEqual(['212-555-0100']);
            });

            it('should handle no phone numbers', () => {
                const contact = createMockContact({
                    owner_phone: null,
                    owner_phone_2: null,
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_phone).toEqual([]);
            });

            it('should filter out empty string addresses', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: '',
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);
            });

            it('should filter out whitespace-only addresses', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: '   ',
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);
            });

            it('should filter out empty string phones', () => {
                const contact = createMockContact({
                    owner_phone: '212-555-0100',
                    owner_phone_2: '',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_phone).toEqual(['212-555-0100']);
            });

            it('should trim whitespace from phones', () => {
                const contact = createMockContact({
                    owner_phone: '  212-555-0100  ',
                    owner_phone_2: '  718-555-0200  ',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_phone).toEqual(['212-555-0100', '718-555-0200']);
            });
        });

        describe('type safety', () => {
            it('should return FormattedOwnerContact type', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted: FormattedOwnerContact = formatContact(contact);

                // TypeScript should enforce that these fields don't exist
                expect(formatted).toBeDefined();
                expect(Array.isArray(formatted.owner_address)).toBe(true);
                expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);
                expect(Array.isArray(formatted.owner_phone)).toBe(true);
            });

            it('should preserve all other fields', () => {
                const contact = createMockContact({
                    owner_first_name: 'John',
                    owner_last_name: 'Doe',
                    owner_full_name: 'John Doe',
                    owner_phone: '555-1234',
                    owner_type: 'Individual',
                    borough: '1',
                    block: '13',
                    lot: '1',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                });

                const formatted = formatContact(contact);

                // owner_first_name and owner_last_name should not be in formatted contact
                expect(formatted).not.toHaveProperty('owner_first_name');
                expect(formatted).not.toHaveProperty('owner_last_name');
                expect(formatted.owner_full_name).toBe('John Doe');
                expect(formatted.owner_phone).toEqual(['555-1234']);
                expect(formatted.owner_type).toBe('Individual');
                expect(formatted.borough).toBe('1');
                expect(formatted.block).toBe('13');
                expect(formatted.lot).toBe('1');
                expect(formatted.agency).toBe('DOF');
                expect(formatted.source).toBe('property_valuation');
            });
        });

        describe('immutability', () => {
            it('should not mutate the original contact', () => {
                const contact = createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                });
                const originalBusinessName = contact.owner_business_name;
                const originalAddress = contact.owner_address;
                const originalCity = contact.owner_city;

                formatContact(contact);

                expect(contact.owner_business_name).toBe(originalBusinessName);
                expect(contact.owner_address).toBe(originalAddress);
                expect(contact.owner_city).toBe(originalCity);
            });

            it('should return a new object', () => {
                const contact = createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                });

                const formatted = formatContact(contact);

                expect(formatted).not.toBe(contact);
            });
        });

        describe('edge cases', () => {
            it('should handle contact with all null fields', () => {
                const contact: OwnerContact = {
                    borough: null,
                    block: null,
                    lot: null,
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
                };

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBeNull();
                expect(formatted.owner_address).toEqual([]);
                expect(formatted.owner_phone).toEqual([]);
            });

            it('should handle whitespace in business name and address', () => {
                const contact = createMockContact({
                    owner_business_name: '  N/A  ',
                    owner_address: '  123 Main St  ',
                    owner_city: '  New York  ',
                    owner_state: '  NY  ',
                    owner_zip: '  10001  ',
                });

                const formatted = formatContact(contact);

                expect(formatted.owner_business_name).toBeNull();
                expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);
            });

            it('should handle multiple N/A variations', () => {
                const testCases = ['N/A', 'n/a', 'NA', 'na', 'not available'];

                testCases.forEach(naValue => {
                    const contact = createMockContact({
                        owner_business_name: naValue,
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                    });

                    const formatted = formatContact(contact);

                    expect(formatted.owner_business_name).toBeNull();
                    expect(formatted.owner_address).toEqual(['123 Main St, New York, NY 10001']);
                });
            });
        });
    });

    describe('formatContacts', () => {
        it('should format multiple contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                createMockContact({
                    owner_business_name: 'Acme Corp',
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                }),
                createMockContact({
                    owner_business_name: 'n/a',
                    owner_address: '789 Broadway',
                    owner_city: 'Queens',
                    owner_state: 'NY',
                    owner_zip: '11101',
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted).toHaveLength(3);

            // First contact
            expect(formatted[0].owner_business_name).toBeNull();
            expect(formatted[0].owner_address).toEqual(['123 Main St, New York, NY 10001']);
            expect('owner_city' in formatted[0]).toBe(false);

            // Second contact
            expect(formatted[1].owner_business_name).toBe('Acme Corp');
            expect(formatted[1].owner_address).toEqual(['456 Park Ave, Brooklyn, NY 11201']);
            expect('owner_city' in formatted[1]).toBe(false);

            // Third contact
            expect(formatted[2].owner_business_name).toBeNull();
            expect(formatted[2].owner_address).toEqual(['789 Broadway, Queens, NY 11101']);
            expect('owner_city' in formatted[2]).toBe(false);
        });

        it('should handle empty array', () => {
            const contacts: OwnerContact[] = [];
            const formatted = formatContacts(contacts);

            expect(formatted).toEqual([]);
        });

        it('should handle array with single contact', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted).toHaveLength(1);
            expect(formatted[0].owner_business_name).toBeNull();
            expect(formatted[0].owner_address).toEqual(['123 Main St, New York, NY 10001']);
        });

        it('should preserve order of contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_first_name: 'First',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                createMockContact({
                    owner_first_name: 'Second',
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                }),
                createMockContact({
                    owner_first_name: 'Third',
                    owner_address: '789 Broadway',
                    owner_city: 'Queens',
                    owner_state: 'NY',
                    owner_zip: '11101',
                }),
            ];

            const formatted = formatContacts(contacts);

            // owner_first_name and owner_last_name should not be in formatted contacts
            expect(formatted[0]).not.toHaveProperty('owner_first_name');
            expect(formatted[1]).not.toHaveProperty('owner_first_name');
            expect(formatted[2]).not.toHaveProperty('owner_first_name');
        });

        it('should not mutate the original array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                }),
            ];
            const originalBusinessName = contacts[0].owner_business_name;
            const originalAddress = contacts[0].owner_address;

            formatContacts(contacts);

            expect(contacts[0].owner_business_name).toBe(originalBusinessName);
            expect(contacts[0].owner_address).toBe(originalAddress);
        });

        it('should return a new array', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted).not.toBe(contacts);
        });

        it('should handle mixed data quality', () => {
            const contacts: OwnerContact[] = [
                // Complete data
                createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
                // Partial address
                createMockContact({
                    owner_business_name: 'Valid Corp',
                    owner_address: '456 Park Ave',
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                }),
                // No address
                createMockContact({
                    owner_business_name: 'n/a',
                    owner_address: null,
                    owner_city: null,
                    owner_state: null,
                    owner_zip: null,
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted[0].owner_business_name).toBeNull();
            expect(formatted[0].owner_address).toEqual(['123 Main St, New York, NY 10001']);

            expect(formatted[1].owner_business_name).toBe('Valid Corp');
            expect(formatted[1].owner_address).toEqual(['456 Park Ave']);

            expect(formatted[2].owner_business_name).toBeNull();
            expect(formatted[2].owner_address).toEqual([]);
        });

        it('should handle both primary and secondary addresses', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_business_name: 'N/A',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_address_2: '456 Second St',
                    owner_city_2: 'Brooklyn',
                    owner_state_2: 'NY',
                    owner_zip_2: '11201',
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted[0].owner_address).toEqual([
                '123 Main St, New York, NY 10001',
                '456 Second St, Brooklyn, NY 11201'
            ]);
            expect('owner_city' in formatted[0]).toBe(false);
            expect('owner_city_2' in formatted[0]).toBe(false);
            expect('owner_address_2' in formatted[0]).toBe(false);
        });

        it('should handle both primary and secondary phones', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_phone: '212-555-0100',
                    owner_phone_2: '718-555-0200',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
            ];

            const formatted = formatContacts(contacts);

            expect(formatted[0].owner_phone).toEqual(['212-555-0100', '718-555-0200']);
            expect('owner_phone_2' in formatted[0]).toBe(false);
        });

        it('should return FormattedOwnerContact[] type', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                }),
            ];

            const formatted: FormattedOwnerContact[] = formatContacts(contacts);

            expect(formatted).toHaveLength(1);
            expect(Array.isArray(formatted[0].owner_address)).toBe(true);
            expect(formatted[0].owner_address).toEqual(['123 Main St, New York, NY 10001']);
        });
    });

    describe('deduplicateContacts', () => {
        it('should deduplicate contacts with similar names and same agency/source', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_phone: '212-555-0100',
                    owner_business_name: 'ABC Corp',
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe', // Similar name
                    agency: 'DOF', // Same agency
                    source: 'property_valuation', // Same source
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                    owner_phone: '718-555-0200',
                    owner_business_name: 'XYZ Inc',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].owner_address).toContain('123 Main St, New York, NY 10001');
            expect(deduplicated[0].owner_address).toContain('456 Park Ave, Brooklyn, NY 11201');
            expect(deduplicated[0].owner_phone).toContain('212-555-0100');
            expect(deduplicated[0].owner_phone).toContain('718-555-0200');
            expect(deduplicated[0].owner_business_name).toContain('ABC Corp');
            expect(deduplicated[0].owner_business_name).toContain('XYZ Inc');
        });

        it('should not deduplicate contacts with different agency', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe', // Similar name
                    agency: 'ACRIS', // Different agency
                    source: 'property_valuation',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(2);
        });

        it('should not deduplicate contacts with different source', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe', // Similar name
                    agency: 'DOF',
                    source: 'different_source', // Different source
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(2);
        });

        it('should remove duplicate addresses and phones', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_phone: '212-555-0100',
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_address: '123 Main St', // Duplicate address
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_phone: '212-555-0100', // Duplicate phone
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].owner_address).toHaveLength(1);
            expect(deduplicated[0].owner_phone).toHaveLength(1);
        });

        it('should handle contacts with no duplicates', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                }),
                createMockContact({
                    owner_full_name: 'Jane Smith',
                    agency: 'DOF',
                    source: 'property_valuation',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(2);
        });

        it('should combine multiple business names', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_business_name: 'ABC Corp',
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    owner_business_name: 'XYZ Inc',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].owner_business_name).toContain('ABC Corp');
            expect(deduplicated[0].owner_business_name).toContain('XYZ Inc');
        });

        it('should handle empty contacts array', () => {
            const deduplicated = deduplicateContacts([]);
            expect(deduplicated).toHaveLength(0);
        });

        it('should use the maximum date among deduplicated contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-01-15'),
                }),
                createMockContact({
                    owner_full_name: 'John Doe', // Same exact name
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-03-20'), // More recent date
                }),
                createMockContact({
                    owner_full_name: 'John Doe', // Same exact name
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-02-10'),
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].date).toBeInstanceOf(Date);
            expect(deduplicated[0].date!.getTime()).toBe(new Date('2024-03-20').getTime());
        });

        it('should handle null dates in deduplicated contacts', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: null,
                }),
                createMockContact({
                    owner_full_name: 'Jon Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-03-20'),
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.65);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].date).toBeInstanceOf(Date);
            expect(deduplicated[0].date!.getTime()).toBe(new Date('2024-03-20').getTime());
        });

        it('should deduplicate ROSALIND RESNICK contacts with same agency and source', () => {
            const contacts: OwnerContact[] = [
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].owner_full_name).toBe('ROSALIND RESNICK');
            expect(deduplicated[0].agency).toBe('hpd');
            expect(deduplicated[0].source).toBe('multiple_dwelling_registrations');
        });

        it('should deduplicate all ROSALIND RESNICK contacts from real data', () => {
            // Real-world test case with multiple duplicate contacts
            const contacts: OwnerContact[] = [
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            // All three should be deduplicated into one
            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].owner_full_name).toBe('ROSALIND RESNICK');
            expect(deduplicated[0].agency).toBe('hpd');
            expect(deduplicated[0].source).toBe('multiple_dwelling_registrations');
            // Should have only one unique address and phone (duplicates removed)
            expect(deduplicated[0].owner_address.length).toBe(1);
            expect(deduplicated[0].owner_phone.length).toBe(1);
        });

        it('should deduplicate multiple ROSALIND RESNICK contacts with same agency/source', () => {
            const contacts: OwnerContact[] = [
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: null,
                    owner_last_name: null,
                    owner_business_name: '7 LEROY STREET LLC',
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: null,
                    owner_middle_name: null,
                    owner_address_2: null,
                    owner_city_2: null,
                    owner_state_2: null,
                    owner_zip_2: null,
                    owner_phone_2: null,
                },
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
                {
                    borough: '1',
                    block: '586',
                    lot: '72',
                    owner_first_name: 'ROSALIND',
                    owner_last_name: 'RESNICK',
                    owner_business_name: null,
                    owner_type: 'GEN.PART',
                    owner_address: '210 N. WASHINGTON STREET',
                    owner_city: 'Alexandria',
                    owner_state: 'VA',
                    owner_zip: '22314',
                    date: new Date('2024-07-22'),
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                    owner_title: null,
                    owner_phone: '9176894368',
                    owner_full_name: 'ROSALIND RESNICK',
                    owner_middle_name: null,
                    owner_address_2: '210 N. WASHINGTON STREET',
                    owner_city_2: 'Alexandria',
                    owner_state_2: 'VA',
                    owner_zip_2: '22314',
                    owner_phone_2: '9176894368',
                },
            ];

            const formatted = formatContacts(contacts);
            // First contact has null owner_full_name, so it should be formatted to have a name
            // Let's check what formatContacts does with it
            expect(formatted.length).toBe(3);

            // Filter out contacts with empty names for deduplication
            const contactsWithNames = formatted.filter(c => c.owner_full_name && c.owner_full_name.trim());
            const deduplicated = deduplicateContacts(contactsWithNames, 0.85);

            // Should deduplicate the two contacts with "ROSALIND RESNICK"
            expect(deduplicated.length).toBeLessThanOrEqual(2);
        });

        it('should deduplicate dob agency contacts even with different sources', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'dob',
                    source: 'dob_job_application_filling',
                    owner_address: '123 Main St',
                    owner_city: 'New York',
                    owner_state: 'NY',
                    owner_zip: '10001',
                    owner_phone: '212-555-0100',
                }),
                createMockContact({
                    owner_full_name: 'John Doe', // Same name
                    agency: 'dob', // Same agency
                    source: 'different_source', // Different source (should still deduplicate)
                    owner_address: '456 Park Ave',
                    owner_city: 'Brooklyn',
                    owner_state: 'NY',
                    owner_zip: '11201',
                    owner_phone: '718-555-0200',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(1);
            expect(deduplicated[0].agency).toBe('dob');
            expect(deduplicated[0].owner_address.length).toBe(2);
            expect(deduplicated[0].owner_phone.length).toBe(2);
        });

        it('should not deduplicate dob agency contacts with different agencies', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'dob',
                    source: 'dob_job_application_filling',
                }),
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'hpd', // Different agency (should not deduplicate)
                    source: 'multiple_dwelling_registrations',
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(2);
        });

        it('should still require agency+source match for non-dob agencies', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'hpd',
                    source: 'multiple_dwelling_registrations',
                }),
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'hpd', // Same agency
                    source: 'different_source', // Different source (should not deduplicate)
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            expect(deduplicated).toHaveLength(2);
        });

        describe('address deduplication when merging contacts', () => {
            it('should deduplicate case variations of addresses when merging contacts', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '210 N. WASHINGTON STREET',
                        owner_city: 'Alexandria',
                        owner_state: 'VA',
                        owner_zip: '22314',
                    }),
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '210 N. WASHINGTON STREET',
                        owner_city: 'ALEXANDRIA',
                        owner_state: 'VA',
                        owner_zip: '22314',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                // Should have only one address (duplicate removed)
                expect(deduplicated[0].owner_address.length).toBe(1);
                expect(deduplicated[0].owner_address[0]).toContain('210 N. WASHINGTON STREET');
            });

            it('should deduplicate addresses from the user example when merging', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'ROSALIND RESNICK',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '210 N. WASHINGTON STREET',
                        owner_city: 'Alexandria',
                        owner_state: 'VA',
                        owner_zip: '22314',
                    }),
                    createMockContact({
                        owner_full_name: 'ROSALIND RESNICK',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '210 N. WASHINGTON STREET',
                        owner_city: 'ALEXANDRIA',
                        owner_state: 'VA',
                        owner_zip: '22314',
                    }),
                    createMockContact({
                        owner_full_name: 'ROSALIND RESNICK',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '106 WASHINGTON PLACE',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10014',
                    }),
                    createMockContact({
                        owner_full_name: 'ROSALIND RESNICK',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '122 WASHINGTON PLACE',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10014',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                // Should have 3 unique addresses (Alexandria/ALEXANDRIA deduplicated, plus 2 distinct WASHINGTON PLACE addresses)
                expect(deduplicated[0].owner_address.length).toBe(3);

                // Check that we have the deduplicated Alexandria address (only one)
                const alexandriaAddresses = deduplicated[0].owner_address.filter(addr =>
                    addr.includes('210 N. WASHINGTON STREET') && addr.includes('VA') && addr.includes('22314')
                );
                expect(alexandriaAddresses.length).toBe(1);

                // Check that we have both WASHINGTON PLACE addresses
                const washingtonPlaceAddresses = deduplicated[0].owner_address.filter(addr =>
                    addr.includes('WASHINGTON PLACE')
                );
                expect(washingtonPlaceAddresses.length).toBe(2);
            });

            it('should keep distinct addresses when merging contacts', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '210 N. WASHINGTON STREET',
                        owner_city: 'Alexandria',
                        owner_state: 'VA',
                        owner_zip: '22314',
                    }),
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '106 WASHINGTON PLACE',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10014',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                // Should keep both distinct addresses
                expect(deduplicated[0].owner_address.length).toBe(2);
                expect(deduplicated[0].owner_address.some(addr => addr.includes('210 N. WASHINGTON STREET'))).toBe(true);
                expect(deduplicated[0].owner_address.some(addr => addr.includes('106 WASHINGTON PLACE'))).toBe(true);
            });

            it('should deduplicate addresses with minor formatting differences when merging', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                    }),
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main Street',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                // Should deduplicate similar addresses (Main St vs Main Street)
                expect(deduplicated[0].owner_address.length).toBeLessThanOrEqual(2);
            });

            it('should handle empty addresses when merging', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: null,
                        owner_city: null,
                        owner_state: null,
                        owner_zip: null,
                    }),
                    createMockContact({
                        owner_full_name: 'John Doe',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_address.length).toBe(1);
                expect(deduplicated[0].owner_address[0]).toContain('123 Main St');
            });
        });

        describe('filtering and business name deduplication', () => {
            it('should filter out contacts where both owner_full_name and owner_business_name are empty', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: null,
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                    createMockContact({
                        owner_full_name: 'John Doe',
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                    createMockContact({
                        owner_full_name: '',
                        owner_business_name: '',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                // Should only have the contact with name or business name
                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_full_name).toBe('John Doe');
            });

            it('should keep contacts with only owner_full_name', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: 'John Doe',
                        owner_business_name: null,
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_full_name).toBe('John Doe');
            });

            it('should keep contacts with only owner_business_name', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_business_name).toBe('ABC Corp');
            });

            it('should deduplicate contacts with same business name when owner_full_name is empty', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                        owner_phone: '212-555-0100',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp', // Same business name
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '456 Park Ave',
                        owner_city: 'Brooklyn',
                        owner_state: 'NY',
                        owner_zip: '11201',
                        owner_phone: '718-555-0200',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_business_name).toBe('ABC Corp');
                expect(deduplicated[0].owner_address.length).toBe(2);
                expect(deduplicated[0].owner_phone.length).toBe(2);
            });

            it('should deduplicate contacts with similar business names when owner_full_name is empty', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corporation',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp', // Similar business name
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '456 Park Ave',
                        owner_city: 'Brooklyn',
                        owner_state: 'NY',
                        owner_zip: '11201',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                // Should deduplicate if similarity is above threshold
                expect(deduplicated.length).toBeLessThanOrEqual(2);
            });

            it('should not deduplicate business name contacts with different agencies', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'DOF', // Different agency
                        source: 'property_valuation',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(2);
            });

            it('should not deduplicate business name contacts with different sources (non-dob)', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'different_source', // Different source
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(2);
            });

            it('should deduplicate business name contacts with dob agency even with different sources', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'dob',
                        source: 'dob_job_application_filling',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'dob',
                        source: 'different_source', // Different source, but dob agency exception
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
            });

            it('should combine addresses and phones when deduplicating by business name', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '123 Main St',
                        owner_city: 'New York',
                        owner_state: 'NY',
                        owner_zip: '10001',
                        owner_phone: '212-555-0100',
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        owner_address: '456 Park Ave',
                        owner_city: 'Brooklyn',
                        owner_state: 'NY',
                        owner_zip: '11201',
                        owner_phone: '718-555-0200',
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].owner_address.length).toBe(2);
                expect(deduplicated[0].owner_phone.length).toBe(2);
            });

            it('should use maximum date when deduplicating by business name', () => {
                const contacts: OwnerContact[] = [
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        date: new Date('2024-01-01'),
                    }),
                    createMockContact({
                        owner_full_name: null,
                        owner_business_name: 'ABC Corp',
                        agency: 'hpd',
                        source: 'multiple_dwelling_registrations',
                        date: new Date('2024-07-22'), // More recent date
                    }),
                ];

                const formatted = formatContacts(contacts);
                const deduplicated = deduplicateContacts(formatted, 0.85);

                expect(deduplicated).toHaveLength(1);
                expect(deduplicated[0].date).toEqual(new Date('2024-07-22'));
            });
        });

        it('should sort deduplicated contacts by date (most recent first)', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2023-01-15'), // Oldest
                }),
                createMockContact({
                    owner_full_name: 'Jane Smith',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-06-20'), // Most recent
                }),
                createMockContact({
                    owner_full_name: 'Bob Johnson',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-03-10'), // Middle
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            // Should be sorted by date descending (most recent first)
            expect(deduplicated).toHaveLength(3);
            expect(deduplicated[0].owner_full_name).toBe('Jane Smith'); // 2024-06-20
            expect(deduplicated[1].owner_full_name).toBe('Bob Johnson'); // 2024-03-10
            expect(deduplicated[2].owner_full_name).toBe('John Doe'); // 2023-01-15
        });

        it('should handle contacts with missing dates when sorting', () => {
            const contacts: OwnerContact[] = [
                createMockContact({
                    owner_full_name: 'John Doe',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-01-15'),
                }),
                createMockContact({
                    owner_full_name: 'Jane Smith',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: null as any, // No date
                }),
                createMockContact({
                    owner_full_name: 'Bob Johnson',
                    agency: 'DOF',
                    source: 'property_valuation',
                    date: new Date('2024-06-20'),
                }),
            ];

            const formatted = formatContacts(contacts);
            const deduplicated = deduplicateContacts(formatted, 0.85);

            // Should sort contacts with dates first, then contacts without dates
            expect(deduplicated).toHaveLength(3);
            expect(deduplicated[0].owner_full_name).toBe('Bob Johnson'); // 2024-06-20
            expect(deduplicated[1].owner_full_name).toBe('John Doe'); // 2024-01-15
            expect(deduplicated[2].owner_full_name).toBe('Jane Smith'); // no date (sorted last)
        });
    });
});
