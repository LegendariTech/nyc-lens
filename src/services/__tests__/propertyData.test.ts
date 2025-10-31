import { describe, it, expect } from 'vitest';
import {
  formatValue,
  getFieldMetadata,
  getSections,
  formatTimestamp,
  type DatasourceMetadata,
  type DatasourceColumnMetadata,
} from '../propertyData';
import { type PlutoData } from '../plutoData';
import { plutoSections } from '@/app/property/[bbl]/components/PlutoTab';

describe('propertyData service', () => {
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

  const mockMetadata: DatasourceMetadata = {
    id: 'test-id',
    name: 'Test Dataset',
    description: 'Test description',
    attribution: 'Test Attribution',
    attributionLink: 'https://example.com',
    columns: [
      mockColumn,
      {
        ...mockColumn,
        id: 2,
        fieldName: 'address',
        name: 'Address',
      },
      {
        ...mockColumn,
        id: 3,
        fieldName: 'borough',
        name: 'Borough',
      },
    ],
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
  });

  describe('formatTimestamp', () => {
    it('formats Unix timestamp to readable date', () => {
      // January 1, 2024 00:00:00 UTC
      const timestamp = 1704067200;
      const result = formatTimestamp(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('January');
    });

    it('returns "Unknown" for undefined timestamp', () => {
      expect(formatTimestamp(undefined)).toBe('Unknown');
    });
  });

  describe('getFieldMetadata', () => {
    it('finds metadata by field name', () => {
      const result = getFieldMetadata(mockMetadata, 'address');
      expect(result).toBeDefined();
      expect(result?.fieldName).toBe('address');
    });

    it('returns undefined for non-existent field', () => {
      const result = getFieldMetadata(mockMetadata, 'nonexistent');
      expect(result).toBeUndefined();
    });

    it('returns undefined when metadata is null', () => {
      const result = getFieldMetadata(null, 'address');
      expect(result).toBeUndefined();
    });
  });

  describe('getSections', () => {
    const mockData: PlutoData = {
      address: '123 Main St',
      borough: 'MN',
      block: '100',
      lot: '1',
      bbl: '1001000001',
      zipcode: '10001',
      bldgclass: 'A1',
      yearbuilt: 1900,
      numbldgs: 1,
      numfloors: '5',
      bldgarea: '10000',
      unitsres: 10,
      unitstotal: 10,
      landuse: 1,
      zonedist1: 'R1',
      zonedist2: null,
      overlay1: null,
      spdist1: null,
      splitzone: false,
      lotarea: '5000',
      comarea: '0',
      resarea: '10000',
      officearea: '0',
      retailarea: '0',
      garagearea: '0',
      strgearea: '0',
      factryarea: '0',
      ownername: 'Test Owner',
      ownertype: 'Private',
      assessland: '100000',
      assesstot: '500000',
      exempttot: '0',
      builtfar: '2.0',
      residfar: '2.0',
      commfar: '0',
      facilfar: '0',
      cd: 101,
      council: 1,
      ct2010: 100,
      schooldist: 1,
      policeprct: 1,
      firecomp: 'E001',
      healtharea: 1000,
      latitude: 40.7,
      longitude: -74.0,
      xcoord: '1000',
      ycoord: '2000',
      histdist: null,
      landmark: null,
    };

    it('returns empty array when data is null', () => {
      const result = getSections(plutoSections, null, mockMetadata);
      expect(result).toEqual([]);
    });

    it('groups data into sections', () => {
      const result = getSections(plutoSections, mockData, mockMetadata);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('includes basic information section', () => {
      const result = getSections(plutoSections, mockData, mockMetadata);
      const basicInfo = result.find((s) => s.title === 'Basic Information');
      expect(basicInfo).toBeDefined();
      expect(basicInfo?.fields.some((f) => f.fieldName === 'address')).toBe(true);
    });

    it('includes building information section', () => {
      const result = getSections(plutoSections, mockData, mockMetadata);
      const buildingInfo = result.find((s) => s.title === 'Building Information');
      expect(buildingInfo).toBeDefined();
      expect(buildingInfo?.fields.some((f) => f.fieldName === 'yearbuilt')).toBe(true);
    });

    it('includes field descriptions from metadata', () => {
      const result = getSections(plutoSections, mockData, mockMetadata);
      const basicInfo = result.find((s) => s.title === 'Basic Information');
      const addressField = basicInfo?.fields.find((f) => f.fieldName === 'address');
      expect(addressField?.description).toBeDefined();
    });
  });
});

