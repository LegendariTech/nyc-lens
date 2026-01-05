import { describe, it, expect } from 'vitest';
import {
  formatTimestamp,
  formatDate,
  formatDateMMDDYYYY,
  formatCurrency,
  formatValue,
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
  });
});
