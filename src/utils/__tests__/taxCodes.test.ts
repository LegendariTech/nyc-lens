import { describe, it, expect } from 'vitest';
import {
  resolveTaxableFlag,
  resolveCondoSuffix,
  resolveBuildingExtension,
  resolveEasement,
  getTaxableFlagShort,
} from '../taxCodes';

describe('taxCodes utilities', () => {
  describe('resolveTaxableFlag', () => {
    it('should resolve T to Taxable', () => {
      expect(resolveTaxableFlag('T')).toBe('Taxable');
      expect(resolveTaxableFlag('t')).toBe('Taxable');
    });

    it('should resolve A to Actual', () => {
      expect(resolveTaxableFlag('A')).toBe('Actual');
      expect(resolveTaxableFlag('a')).toBe('Actual');
    });

    it('should handle blank/null/undefined', () => {
      expect(resolveTaxableFlag('')).toBe('Not Specified');
      expect(resolveTaxableFlag('   ')).toBe('Not Specified');
      expect(resolveTaxableFlag(null)).toBe('Not Specified');
      expect(resolveTaxableFlag(undefined)).toBe('Not Specified');
    });

    it('should return unknown codes as-is', () => {
      expect(resolveTaxableFlag('X')).toBe('X');
    });
  });

  describe('resolveCondoSuffix', () => {
    it('should resolve C to Commercial unit', () => {
      expect(resolveCondoSuffix('C')).toBe('Commercial unit');
      expect(resolveCondoSuffix('c')).toBe('Commercial unit');
    });

    it('should resolve R to Residential unit', () => {
      expect(resolveCondoSuffix('R')).toBe('Residential unit');
      expect(resolveCondoSuffix('r')).toBe('Residential unit');
    });

    it('should handle blank/null/undefined', () => {
      expect(resolveCondoSuffix('')).toBe('Entire condo (all residential or all commercial)');
      expect(resolveCondoSuffix('   ')).toBe('Entire condo (all residential or all commercial)');
      expect(resolveCondoSuffix(null)).toBe('Entire condo (all residential or all commercial)');
      expect(resolveCondoSuffix(undefined)).toBe('Entire condo (all residential or all commercial)');
    });

    it('should return unknown codes as-is', () => {
      expect(resolveCondoSuffix('X')).toBe('X');
    });
  });

  describe('resolveBuildingExtension', () => {
    it('should resolve E to Extension', () => {
      expect(resolveBuildingExtension('E')).toBe('Extension');
      expect(resolveBuildingExtension('e')).toBe('Extension');
    });

    it('should resolve G to Garage', () => {
      expect(resolveBuildingExtension('G')).toBe('Garage');
      expect(resolveBuildingExtension('g')).toBe('Garage');
    });

    it('should resolve EG to Extension and Garage', () => {
      expect(resolveBuildingExtension('EG')).toBe('Extension and Garage');
      expect(resolveBuildingExtension('eg')).toBe('Extension and Garage');
    });

    it('should handle blank/null/undefined', () => {
      expect(resolveBuildingExtension('')).toBe('None');
      expect(resolveBuildingExtension('   ')).toBe('None');
      expect(resolveBuildingExtension(null)).toBe('None');
      expect(resolveBuildingExtension(undefined)).toBe('None');
    });

    it('should return unknown codes as-is', () => {
      expect(resolveBuildingExtension('X')).toBe('X');
    });
  });

  describe('resolveEasement', () => {
    it('should resolve A to Air Rights', () => {
      expect(resolveEasement('A')).toBe('Air Rights');
      expect(resolveEasement('a')).toBe('Air Rights');
    });

    it('should resolve B to Non-Air Rights', () => {
      expect(resolveEasement('B')).toBe('Non-Air Rights');
    });

    it('should resolve E to Land Easement', () => {
      expect(resolveEasement('E')).toBe('Land Easement');
    });

    it('should resolve F-M to Multiple Easements', () => {
      expect(resolveEasement('F')).toBe('Multiple Easements');
      expect(resolveEasement('G')).toBe('Multiple Easements');
      expect(resolveEasement('H')).toBe('Multiple Easements');
      expect(resolveEasement('I')).toBe('Multiple Easements');
      expect(resolveEasement('J')).toBe('Multiple Easements');
      expect(resolveEasement('K')).toBe('Multiple Easements');
      expect(resolveEasement('L')).toBe('Multiple Easements');
      expect(resolveEasement('M')).toBe('Multiple Easements');
    });

    it('should resolve N to Non-Transit', () => {
      expect(resolveEasement('N')).toBe('Non-Transit');
    });

    it('should resolve P to Piers', () => {
      expect(resolveEasement('P')).toBe('Piers');
    });

    it('should resolve R to Railroads', () => {
      expect(resolveEasement('R')).toBe('Railroads');
    });

    it('should resolve S to Street', () => {
      expect(resolveEasement('S')).toBe('Street');
    });

    it('should resolve U to U.S. Government', () => {
      expect(resolveEasement('U')).toBe('U.S. Government');
    });

    it('should handle blank/null/undefined', () => {
      expect(resolveEasement('')).toBe('No Easement');
      expect(resolveEasement('   ')).toBe('No Easement');
      expect(resolveEasement(null)).toBe('No Easement');
      expect(resolveEasement(undefined)).toBe('No Easement');
    });

    it('should return unknown codes as-is', () => {
      expect(resolveEasement('X')).toBe('X');
    });
  });

  describe('getTaxableFlagShort', () => {
    it('should return short codes', () => {
      expect(getTaxableFlagShort('T')).toBe('T');
      expect(getTaxableFlagShort('A')).toBe('A');
    });

    it('should handle blank/null/undefined', () => {
      expect(getTaxableFlagShort('')).toBe('-');
      expect(getTaxableFlagShort(null)).toBe('-');
      expect(getTaxableFlagShort(undefined)).toBe('-');
    });

    it('should return unknown codes as-is', () => {
      expect(getTaxableFlagShort('X')).toBe('X');
    });
  });
});

