import { describe, it, expect } from 'vitest';
import { bblToSbl, sblToBbl } from '../bbl';

describe('BBL Utility Functions', () => {
  describe('bblToSbl', () => {
    it('should convert BBL format to SBL format with proper padding', () => {
      expect(bblToSbl('4-476-1')).toBe('4004760001');
      expect(bblToSbl('1-1-1')).toBe('1000010001');
      expect(bblToSbl('2-12345-9999')).toBe('2123459999');
    });

    it('should pad block with leading zeros to 5 digits', () => {
      expect(bblToSbl('1-47-1')).toBe('1000470001');
      expect(bblToSbl('1-476-1')).toBe('1004760001');
    });

    it('should pad lot with leading zeros to 4 digits', () => {
      expect(bblToSbl('1-1-9')).toBe('1000010009');
      expect(bblToSbl('1-1-99')).toBe('1000010099');
      expect(bblToSbl('1-1-999')).toBe('1000010999');
    });

    it('should throw error for invalid BBL format', () => {
      expect(() => bblToSbl('invalid')).toThrow('Invalid BBL format');
      expect(() => bblToSbl('1-2')).toThrow('Invalid BBL format');
      expect(() => bblToSbl('1-2-3-4')).toThrow('Invalid BBL format');
    });
  });

  describe('sblToBbl', () => {
    it('should convert SBL format to BBL format', () => {
      expect(sblToBbl('4004760001')).toBe('4-476-1');
      expect(sblToBbl('1000010001')).toBe('1-1-1');
      expect(sblToBbl('2123459999')).toBe('2-12345-9999');
    });

    it('should remove leading zeros from block and lot', () => {
      expect(sblToBbl('1000470001')).toBe('1-47-1');
      expect(sblToBbl('1004760001')).toBe('1-476-1');
      expect(sblToBbl('1000010009')).toBe('1-1-9');
      expect(sblToBbl('1000010099')).toBe('1-1-99');
    });

    it('should throw error for invalid SBL format', () => {
      expect(() => sblToBbl('invalid')).toThrow('Invalid SBL format');
      expect(() => sblToBbl('123')).toThrow('Invalid SBL format');
      expect(() => sblToBbl('12345678901')).toThrow('Invalid SBL format');
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain data integrity when converting BBL -> SBL -> BBL', () => {
      const testCases = ['1-1-1', '4-476-1', '2-12345-9999', '3-100-500'];

      testCases.forEach(originalBbl => {
        const sbl = bblToSbl(originalBbl);
        const convertedBbl = sblToBbl(sbl);
        expect(convertedBbl).toBe(originalBbl);
      });
    });

    it('should maintain data integrity when converting SBL -> BBL -> SBL', () => {
      const testCases = ['1000010001', '4004760001', '2123459999', '3001000500'];

      testCases.forEach(originalSbl => {
        const bbl = sblToBbl(originalSbl);
        const convertedSbl = bblToSbl(bbl);
        expect(convertedSbl).toBe(originalSbl);
      });
    });
  });
});
