import { describe, it, expect } from 'vitest';
import {
  getFieldMetadata,
  getSections,
  type DatasourceMetadata,
  type DatasourceColumnMetadata,
} from '../datasourceDisplay';
import { type PlutoData } from '@/data/pluto';
import { plutoSections } from '@/app/property/[bbl]/pluto/components/plutoSections';

describe('datasourceDisplay utilities', () => {
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
      // Additional required fields
      cb2010: null,
      sanitboro: null,
      sanitsub: null,
      zonedist3: null,
      zonedist4: null,
      overlay2: null,
      spdist2: null,
      spdist3: null,
      ltdheight: null,
      easements: null,
      otherarea: null,
      areasource: null,
      lotfront: null,
      lotdepth: null,
      bldgfront: null,
      bldgdepth: null,
      ext: null,
      proxcode: null,
      irrlotcode: null,
      lottype: null,
      bsmtcode: null,
      yearalter1: null,
      yearalter2: null,
      borocode: null,
      condono: null,
      tract2010: null,
      zonemap: null,
      zmcode: null,
      sanborn: null,
      taxmap: null,
      edesignum: null,
      appbbl: null,
      appdate: null,
      plutomapid: null,
      version: null,
      sanitdistrict: null,
      healthcenterdistrict: null,
      firm07_flag: null,
      pfirm15_flag: null,
      rpaddate: null,
      dcasdate: null,
      zoningdate: null,
      landmkdate: null,
      basempdate: null,
      masdate: null,
      polidate: null,
      edesigdate: null,
      geom: null,
      dcpedited: null,
      notes: null,
      bct2020: null,
      bctcb2020: null,
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


