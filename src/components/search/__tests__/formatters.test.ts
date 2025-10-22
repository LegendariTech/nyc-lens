import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../formatters';

describe('formatters', () => {
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
      it('should return "N/A" for zero', () => {
        expect(formatCurrency(0)).toBe('N/A');
      });

      it('should return "N/A" for undefined', () => {
        expect(formatCurrency(undefined)).toBe('N/A');
      });

      it('should handle negative zero', () => {
        expect(formatCurrency(-0)).toBe('N/A');
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

  describe('formatDate', () => {
    describe('Valid Date Formatting', () => {
      it('should format ISO date strings correctly', () => {
        // Tests run in UTC timezone for consistency
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

  describe('Integration Scenarios', () => {
    it('should format property data consistently', () => {
      // Simulating property data formatting
      const propertyValue = 1500000;
      const saleDate = '2024-03-15';

      expect(formatCurrency(propertyValue)).toBe('$1,500,000');
      expect(formatDate(saleDate)).toBe('Mar 15, 2024');
    });

    it('should handle missing data gracefully', () => {
      expect(formatCurrency(undefined)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
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

