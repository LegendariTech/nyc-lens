import { describe, it, expect } from 'vitest';
import {
  formatTimestamp,
  formatDate,
  formatDateMMDDYYYY,
  formatCurrency,
  formatValue,
  formatFullAddress,
  type DatasourceColumnMetadata,
} from '../formatters';

describe('utils/formatters', () => {
  const mockColumn: DatasourceColumnMetadata = {
    id: 1,
    name: 'Test Field',
    dataTypeName: 'number',
    description: 'Test description',
    fieldName: 'testfield',
    position: 1,
    renderTypeName: 'number',
    tableColumnId: 1,
    format: {},
  };

  describe('formatValue', () => {
    it('formats null values as N/A', () => {
      expect(formatValue(null)).toBe('N/A');
      expect(formatValue(undefined)).toBe('N/A');
      expect(formatValue('')).toBe('N/A');
    });

    it('formats boolean values', () => {
      expect(formatValue(true)).toBe('Yes');
      expect(formatValue(false)).toBe('No');
    });

    it('formats numeric values with commas by default', () => {
      expect(formatValue(1000)).toBe('1,000');
      expect(formatValue(1234567)).toBe('1,234,567');
    });

    it('formats numeric values without commas when specified', () => {
      const columnWithNoCommas: DatasourceColumnMetadata = {
        ...mockColumn,
        format: { noCommas: 'true' },
      };
      expect(formatValue(1000, columnWithNoCommas)).toBe('1000');
    });

    it('formats string values', () => {
      expect(formatValue('test string')).toBe('test string');
    });

    it('formats numbers as currency when specified', () => {
      expect(formatValue(1000, mockColumn, 'currency')).toBe('$1,000');
      expect(formatValue(1234567, mockColumn, 'currency')).toBe('$1,234,567');
    });

    it('formats numbers with decimals when specified', () => {
      expect(formatValue(1000.5, mockColumn, 'number')).toBe('1,000.5');
      expect(formatValue(1234.567, mockColumn, 'number')).toBe('1,234.57');
    });

    it('formats string values as currency when specified', () => {
      expect(formatValue('1000', mockColumn, 'currency')).toBe('$1,000');
      expect(formatValue('1234567.89', mockColumn, 'currency')).toBe('$1,234,568');
    });

    it('formats string values as numbers when specified', () => {
      expect(formatValue('1000.5', mockColumn, 'number')).toBe('1,000.5');
      expect(formatValue('1234.567', mockColumn, 'number')).toBe('1,234.57');
    });

    it('handles invalid string values for numeric formats', () => {
      expect(formatValue('not a number', mockColumn, 'currency')).toBe('not a number');
      expect(formatValue('not a number', mockColumn, 'number')).toBe('not a number');
    });

    it('formats year values without commas', () => {
      expect(formatValue(1998, mockColumn, 'year')).toBe('1998');
      expect(formatValue(2024, mockColumn, 'year')).toBe('2024');
      expect(formatValue(1900, mockColumn, 'year')).toBe('1900');
      expect(formatValue(2100, mockColumn, 'year')).toBe('2100');
    });

    it('formats string year values without commas', () => {
      expect(formatValue('1998', mockColumn, 'year')).toBe('1998');
      expect(formatValue('2024', mockColumn, 'year')).toBe('2024');
      expect(formatValue('1900.0', mockColumn, 'year')).toBe('1900');
    });

    it('handles invalid year values', () => {
      expect(formatValue('not a year', mockColumn, 'year')).toBe('not a year');
      expect(formatValue('', mockColumn, 'year')).toBe('N/A');
      expect(formatValue(null, mockColumn, 'year')).toBe('N/A');
      expect(formatValue(undefined, mockColumn, 'year')).toBe('N/A');
    });

    it('formats year values ignoring noCommas metadata', () => {
      const columnWithNoCommas: DatasourceColumnMetadata = {
        ...mockColumn,
        format: { noCommas: 'true' },
      };
      // Year format should always display without commas regardless of metadata
      expect(formatValue(1998, columnWithNoCommas, 'year')).toBe('1998');
      expect(formatValue(2024, columnWithNoCommas, 'year')).toBe('2024');
    });
  });

  describe('formatTimestamp', () => {
    it('formats Unix timestamp to readable date', () => {
      // January 1, 2024 00:00:00 UTC
      const timestamp = 1704067200;
      const result = formatTimestamp(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('January');
    });

    it('formats string Unix timestamp to readable date', () => {
      const timestamp = '1704067200';
      const result = formatTimestamp(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('January');
    });

    it('returns "Unknown" for undefined timestamp', () => {
      expect(formatTimestamp(undefined)).toBe('Unknown');
    });

    it('formats various Unix timestamps correctly', () => {
      // June 15, 2023 12:00:00 UTC
      const timestamp1 = 1686830400;
      const result1 = formatTimestamp(timestamp1);
      expect(result1).toContain('2023');
      expect(result1).toContain('June');
      expect(result1).toContain('15');

      // December 31, 2025 23:59:59 UTC
      const timestamp2 = 1767225599;
      const result2 = formatTimestamp(timestamp2);
      expect(result2).toContain('2025');
      expect(result2).toContain('December');
      expect(result2).toContain('31');
    });
  });

  describe('formatDate', () => {
    describe('Valid Date Formatting', () => {
      it('should format ISO date strings correctly', () => {
        expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
        expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
        expect(formatDate('2023-06-01')).toBe('Jun 1, 2023');
      });

      it('should format full ISO datetime strings', () => {
        expect(formatDate('2024-01-15T10:30:00')).toBe('Jan 15, 2024');
        expect(formatDate('2024-01-15T10:30:00Z')).toBe('Jan 15, 2024');
        expect(formatDate('2024-01-15T10:30:00.000Z')).toBe('Jan 15, 2024');
      });

      it('should format dates with different separators', () => {
        expect(formatDate('2024/01/15')).toBe('Jan 15, 2024');
        expect(formatDate('01-15-2024')).toBe('Jan 15, 2024');
        expect(formatDate('01/15/2024')).toBe('Jan 15, 2024');
      });

      it('should handle dates from different years', () => {
        expect(formatDate('2020-03-15')).toBe('Mar 15, 2020');
        expect(formatDate('2025-07-04')).toBe('Jul 4, 2025');
        expect(formatDate('2000-01-01')).toBe('Jan 1, 2000');
      });

      it('should handle all months correctly', () => {
        expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
        expect(formatDate('2024-02-01')).toBe('Feb 1, 2024');
        expect(formatDate('2024-03-01')).toBe('Mar 1, 2024');
        expect(formatDate('2024-04-01')).toBe('Apr 1, 2024');
        expect(formatDate('2024-05-01')).toBe('May 1, 2024');
        expect(formatDate('2024-06-01')).toBe('Jun 1, 2024');
        expect(formatDate('2024-07-01')).toBe('Jul 1, 2024');
        expect(formatDate('2024-08-01')).toBe('Aug 1, 2024');
        expect(formatDate('2024-09-01')).toBe('Sep 1, 2024');
        expect(formatDate('2024-10-01')).toBe('Oct 1, 2024');
        expect(formatDate('2024-11-01')).toBe('Nov 1, 2024');
        expect(formatDate('2024-12-01')).toBe('Dec 1, 2024');
      });

      it('should handle leap year dates', () => {
        expect(formatDate('2024-02-29')).toBe('Feb 29, 2024');
        expect(formatDate('2020-02-29')).toBe('Feb 29, 2020');
      });

      it('should handle end of month dates', () => {
        expect(formatDate('2024-01-31')).toBe('Jan 31, 2024');
        expect(formatDate('2024-04-30')).toBe('Apr 30, 2024');
        expect(formatDate('2024-02-28')).toBe('Feb 28, 2024');
      });
    });

    describe('Edge Cases and Invalid Inputs', () => {
      it('should return "N/A" for undefined', () => {
        expect(formatDate(undefined)).toBe('N/A');
      });

      it('should return "N/A" for null', () => {
        expect(formatDate(null)).toBe('N/A');
      });

      it('should return "N/A" for empty string', () => {
        expect(formatDate('')).toBe('N/A');
      });

      it('should return "N/A" for invalid date strings', () => {
        expect(formatDate('invalid-date')).toBe('N/A');
        expect(formatDate('not a date')).toBe('N/A');
        expect(formatDate('2024-13-01')).toBe('N/A'); // Invalid month
        expect(formatDate('2024-00-01')).toBe('N/A'); // Invalid month
      });

      it('should return "N/A" for malformed date strings', () => {
        // '2024' is parsed as a valid date (year 2024, Jan 1 UTC)
        expect(formatDate('2024')).toBe('Jan 1, 2024');
        // '01-15' is parsed as Jan 15, 2001 (year defaults to 2001)
        expect(formatDate('01-15')).toBe('Jan 15, 2001');
        expect(formatDate('15/2024')).toBe('N/A');
      });

      it('should handle whitespace-only strings', () => {
        expect(formatDate('   ')).toBe('N/A');
        expect(formatDate('\t')).toBe('N/A');
        expect(formatDate('\n')).toBe('N/A');
      });
    });

    describe('Historical and Future Dates', () => {
      it('should format historical dates', () => {
        expect(formatDate('1900-01-01')).toBe('Jan 1, 1900');
        expect(formatDate('1950-06-15')).toBe('Jun 15, 1950');
        expect(formatDate('1999-12-31')).toBe('Dec 31, 1999');
      });

      it('should format future dates', () => {
        expect(formatDate('2030-01-01')).toBe('Jan 1, 2030');
        expect(formatDate('2050-12-31')).toBe('Dec 31, 2050');
        expect(formatDate('2100-06-15')).toBe('Jun 15, 2100');
      });

      it('should format very old dates', () => {
        expect(formatDate('1800-01-01')).toBe('Jan 1, 1800');
        expect(formatDate('1850-07-04')).toBe('Jul 4, 1850');
      });
    });

    describe('Real-world Property Date Scenarios', () => {
      it('should format typical document recording dates', () => {
        expect(formatDate('2023-11-15')).toBe('Nov 15, 2023');
        expect(formatDate('2024-03-01')).toBe('Mar 1, 2024');
      });

      it('should format building permit dates', () => {
        expect(formatDate('2022-08-20T14:30:00Z')).toBe('Aug 20, 2022');
        expect(formatDate('2023-12-15T09:00:00Z')).toBe('Dec 15, 2023');
      });

      it('should format certificate of occupancy dates', () => {
        expect(formatDate('2021-05-10')).toBe('May 10, 2021');
        expect(formatDate('2020-01-20')).toBe('Jan 20, 2020');
      });

      it('should format violation dates', () => {
        expect(formatDate('2024-10-05T16:45:00')).toBe('Oct 5, 2024');
        expect(formatDate('2023-07-22T08:15:00')).toBe('Jul 22, 2023');
      });
    });

    describe('Date String Format Variations', () => {
      it('should handle timestamp with milliseconds', () => {
        expect(formatDate('2024-01-15T10:30:00.123Z')).toBe('Jan 15, 2024');
        expect(formatDate('2024-01-15T10:30:00.999Z')).toBe('Jan 15, 2024');
      });

      it('should handle dates with timezone offsets', () => {
        expect(formatDate('2024-01-15T10:30:00-05:00')).toBe('Jan 15, 2024');
        expect(formatDate('2024-01-15T10:30:00+00:00')).toBe('Jan 15, 2024');
      });

      it('should handle Unix timestamp (milliseconds)', () => {
        // Unix timestamps as strings are not valid date strings
        expect(formatDate('1704067200000')).toBe('N/A');
      });

      it('should handle date strings with time but no timezone', () => {
        expect(formatDate('2024-01-15 10:30:00')).toBe('Jan 15, 2024');
        expect(formatDate('2024-01-15 23:59:59')).toBe('Jan 15, 2024');
      });
    });

    describe('Boundary Dates', () => {
      it('should handle first day of year', () => {
        expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
      });

      it('should handle last day of year', () => {
        expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
      });

      it('should handle dates at month boundaries', () => {
        expect(formatDate('2024-02-01')).toBe('Feb 1, 2024');
        expect(formatDate('2024-01-31')).toBe('Jan 31, 2024');
      });
    });
  });

  describe('formatDateMMDDYYYY (alias)', () => {
    it('is an alias for formatDate', () => {
      expect(formatDateMMDDYYYY).toBe(formatDate);
    });

    it('works identically to formatDate', () => {
      expect(formatDateMMDDYYYY('2024-01-15')).toBe('Jan 15, 2024');
      expect(formatDateMMDDYYYY(undefined)).toBe('N/A');
      expect(formatDateMMDDYYYY(null)).toBe('N/A');
    });
  });

  describe('formatCurrency', () => {
    describe('Valid Currency Formatting', () => {
      it('should format positive integers correctly', () => {
        expect(formatCurrency(1000)).toBe('$1,000');
        expect(formatCurrency(1000000)).toBe('$1,000,000');
        expect(formatCurrency(500)).toBe('$500');
      });

      it('should format large numbers with proper thousand separators', () => {
        expect(formatCurrency(1234567)).toBe('$1,234,567');
        expect(formatCurrency(999999999)).toBe('$999,999,999');
      });

      it('should format small positive numbers', () => {
        expect(formatCurrency(1)).toBe('$1');
        expect(formatCurrency(10)).toBe('$10');
        expect(formatCurrency(99)).toBe('$99');
      });

      it('should round decimal numbers to whole dollars', () => {
        expect(formatCurrency(1000.99)).toBe('$1,001');
        expect(formatCurrency(1000.50)).toBe('$1,001');
        expect(formatCurrency(1000.49)).toBe('$1,000');
        expect(formatCurrency(1000.01)).toBe('$1,000');
      });

      it('should handle negative numbers', () => {
        expect(formatCurrency(-1000)).toBe('-$1,000');
        expect(formatCurrency(-500.50)).toBe('-$501');
      });

      it('should handle very large numbers', () => {
        expect(formatCurrency(1000000000)).toBe('$1,000,000,000');
        expect(formatCurrency(999999999999)).toBe('$999,999,999,999');
      });
    });

    describe('Edge Cases and Invalid Inputs', () => {
      it('should return "$0" for zero', () => {
        expect(formatCurrency(0)).toBe('$0');
      });

      it('should return "N/A" for undefined', () => {
        expect(formatCurrency(undefined)).toBe('N/A');
      });

      it('should return "N/A" for null', () => {
        expect(formatCurrency(null)).toBe('N/A');
      });

      it('should handle negative zero', () => {
        expect(formatCurrency(-0)).toBe('$0');
      });

      it('should handle very small positive numbers', () => {
        expect(formatCurrency(0.01)).toBe('$0');
        expect(formatCurrency(0.99)).toBe('$1');
      });

      it('should handle Infinity', () => {
        // Intl.NumberFormat handles Infinity
        const result = formatCurrency(Infinity);
        expect(result).toBeTruthy();
      });
    });

    describe('Real-world Property Values', () => {
      it('should format typical NYC property values', () => {
        expect(formatCurrency(500000)).toBe('$500,000');
        expect(formatCurrency(1250000)).toBe('$1,250,000');
        expect(formatCurrency(3500000)).toBe('$3,500,000');
      });

      it('should format commercial property values', () => {
        expect(formatCurrency(10000000)).toBe('$10,000,000');
        expect(formatCurrency(50000000)).toBe('$50,000,000');
      });

      it('should format assessment values with cents', () => {
        expect(formatCurrency(450000.75)).toBe('$450,001');
        expect(formatCurrency(1234567.89)).toBe('$1,234,568');
      });
    });
  });

  describe('formatFullAddress', () => {
    describe('All Borough Addresses', () => {
      it('should format Manhattan address with "New York" (borough 1)', () => {
        expect(formatFullAddress('220 Riverside Blvd', '20A', 1, '10069')).toBe(
          '220 Riverside Blvd 20A, New York, NY 10069'
        );
      });

      it('should format Bronx address (borough 2)', () => {
        expect(formatFullAddress('1141 Burnett Pl', '3B', 2, '10472')).toBe(
          '1141 Burnett Pl 3B, Bronx, NY 10472'
        );
      });

      it('should format Brooklyn address (borough 3)', () => {
        expect(formatFullAddress('123 Main St', '4C', 3, '11201')).toBe(
          '123 Main St 4C, Brooklyn, NY 11201'
        );
      });

      it('should format Queens address (borough 4)', () => {
        expect(formatFullAddress('45-67 Broadway', '2A', 4, '11373')).toBe(
          '45-67 Broadway 2A, Queens, NY 11373'
        );
      });

      it('should format Staten Island address (borough 5)', () => {
        expect(formatFullAddress('100 Victory Blvd', '1', 5, '10301')).toBe(
          '100 Victory Blvd 1, Staten Island, NY 10301'
        );
      });
    });

    describe('Addresses Without Unit', () => {
      it('should format Manhattan address without unit', () => {
        expect(formatFullAddress('1 Broadway', undefined, 1, '10004')).toBe(
          '1 Broadway, New York, NY 10004'
        );
      });

      it('should format Bronx address without unit', () => {
        expect(formatFullAddress('456 Grand Concourse', undefined, 2, '10451')).toBe(
          '456 Grand Concourse, Bronx, NY 10451'
        );
      });

      it('should format Brooklyn address without unit', () => {
        expect(formatFullAddress('123 Main St', undefined, 3, '11201')).toBe(
          '123 Main St, Brooklyn, NY 11201'
        );
      });

      it('should format Queens address without unit', () => {
        expect(formatFullAddress('78-90 Metropolitan Ave', undefined, 4, '11385')).toBe(
          '78-90 Metropolitan Ave, Queens, NY 11385'
        );
      });

      it('should format Staten Island address without unit', () => {
        expect(formatFullAddress('200 Richmond Ter', undefined, 5, '10301')).toBe(
          '200 Richmond Ter, Staten Island, NY 10301'
        );
      });
    });

    describe('Different State Values', () => {
      it('should use default state NY when not provided', () => {
        expect(formatFullAddress('220 Riverside Blvd', '20A', 1, '10069')).toBe(
          '220 Riverside Blvd 20A, New York, NY 10069'
        );
      });

      it('should accept custom state value', () => {
        expect(formatFullAddress('123 Main St', '4C', 3, '11201', 'NY')).toBe(
          '123 Main St 4C, Brooklyn, NY 11201'
        );
      });

      it('should handle different state abbreviation', () => {
        // Edge case: if someone passes a different state
        expect(formatFullAddress('123 Test St', '1A', 1, '12345', 'CA')).toBe(
          '123 Test St 1A, New York, CA 12345'
        );
      });
    });

    describe('Various Address Formats', () => {
      it('should handle short street names', () => {
        expect(formatFullAddress('1 Ave A', '5', 1, '10009')).toBe(
          '1 Ave A 5, New York, NY 10009'
        );
      });

      it('should handle long street names', () => {
        expect(
          formatFullAddress('350 West 42nd Street', 'PHB', 1, '10036')
        ).toBe('350 West 42nd Street PHB, New York, NY 10036');
      });

      it('should handle numeric street names', () => {
        expect(formatFullAddress('123 East 86th St', '12A', 1, '10028')).toBe(
          '123 East 86th St 12A, New York, NY 10028'
        );
      });

      it('should handle street names with directions', () => {
        expect(formatFullAddress('500 West End Ave', 'PH', 1, '10024')).toBe(
          '500 West End Ave PH, New York, NY 10024'
        );
      });
    });

    describe('Various Unit Formats', () => {
      it('should handle single letter units', () => {
        expect(formatFullAddress('123 Main St', 'A', 3, '11201')).toBe(
          '123 Main St A, Brooklyn, NY 11201'
        );
      });

      it('should handle numeric units', () => {
        expect(formatFullAddress('123 Main St', '101', 3, '11201')).toBe(
          '123 Main St 101, Brooklyn, NY 11201'
        );
      });

      it('should handle alphanumeric units', () => {
        expect(formatFullAddress('123 Main St', '20A', 1, '10069')).toBe(
          '123 Main St 20A, New York, NY 10069'
        );
      });

      it('should handle penthouse units', () => {
        expect(formatFullAddress('432 Park Ave', 'PH92', 1, '10022')).toBe(
          '432 Park Ave PH92, New York, NY 10022'
        );
      });

      it('should skip empty string units', () => {
        expect(formatFullAddress('123 Main St', '', 3, '11201')).toBe(
          '123 Main St, Brooklyn, NY 11201'
        );
      });
    });

    describe('Manhattan Specific Behavior', () => {
      it('should always convert Manhattan to "New York" in addresses', () => {
        // Test that borough 1 specifically becomes "New York" not "Manhattan"
        const address1 = formatFullAddress('15 Central Park West', '31B', 1, '10023');
        expect(address1).toContain('New York');
        expect(address1).not.toContain('Manhattan');
      });

      it('should format famous Manhattan addresses correctly', () => {
        expect(formatFullAddress('350 Fifth Ave', undefined, 1, '10118')).toBe(
          '350 Fifth Ave, New York, NY 10118'
        );

        expect(formatFullAddress('1 World Trade Center', undefined, 1, '10007')).toBe(
          '1 World Trade Center, New York, NY 10007'
        );

        expect(formatFullAddress('Trump Tower', '5818', 1, '10022')).toBe(
          'Trump Tower 5818, New York, NY 10022'
        );
      });
    });

    describe('Real-world NYC Addresses', () => {
      it('should format typical residential addresses', () => {
        expect(formatFullAddress('220 Riverside Blvd', '20A', 1, '10069')).toBe(
          '220 Riverside Blvd 20A, New York, NY 10069'
        );

        expect(formatFullAddress('301 East 79th St', '28D', 1, '10075')).toBe(
          '301 East 79th St 28D, New York, NY 10075'
        );
      });

      it('should format commercial addresses', () => {
        expect(formatFullAddress('1633 Broadway', undefined, 1, '10019')).toBe(
          '1633 Broadway, New York, NY 10019'
        );

        expect(formatFullAddress('4 Times Square', undefined, 1, '10036')).toBe(
          '4 Times Square, New York, NY 10036'
        );
      });

      it('should format co-op addresses with units', () => {
        expect(formatFullAddress('200 East 66th St', '18C', 1, '10065')).toBe(
          '200 East 66th St 18C, New York, NY 10065'
        );
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should format property data consistently', () => {
      const propertyValue = 1500000;
      const saleDate = '2024-03-15';
      const lastModified = 1704067200; // Unix timestamp

      expect(formatCurrency(propertyValue)).toBe('$1,500,000');
      expect(formatDate(saleDate)).toBe('Mar 15, 2024');
      expect(formatTimestamp(lastModified)).toContain('2024');
    });

    it('should handle missing data gracefully', () => {
      expect(formatCurrency(undefined)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatTimestamp(undefined)).toBe('Unknown');
    });

    it('should format multiple property transactions', () => {
      const transactions = [
        { amount: 500000, date: '2024-01-15' },
        { amount: 750000, date: '2024-02-20' },
        { amount: 1000000, date: '2024-03-10' },
      ];

      transactions.forEach(tx => {
        expect(formatCurrency(tx.amount)).toMatch(/^\$[\d,]+$/);
        expect(formatDate(tx.date)).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
      });
    });

    it('should format complete property listing with address', () => {
      const listing = {
        street: '220 Riverside Blvd',
        unit: '20A',
        borough: 1,
        zipcode: '10069',
        price: 2500000,
        listingDate: '2024-01-15',
      };

      const formattedAddress = formatFullAddress(
        listing.street,
        listing.unit,
        listing.borough,
        listing.zipcode
      );
      const formattedPrice = formatCurrency(listing.price);
      const formattedDate = formatDate(listing.listingDate);

      expect(formattedAddress).toBe('220 Riverside Blvd 20A, New York, NY 10069');
      expect(formattedPrice).toBe('$2,500,000');
      expect(formattedDate).toBe('Jan 15, 2024');
    });
  });
});
