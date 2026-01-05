import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only module
vi.mock('server-only', () => ({}));

// Mock the database module
vi.mock('../db', () => ({
  queryMany: vi.fn(),
}));

// Mock the metadata.json file
vi.mock('@/app/property/[bbl]/tax/metadata.json', () => ({
  default: {
    id: 'test-dataset-id',
    name: 'Property Valuation',
    description: 'Test metadata',
    attribution_link: 'https://example.com',
    last_updated: '2024-01-01',
  },
}));

import { queryMany } from '../db';
import { fetchPropertyValuation } from '../valuation';
import type { PropertyValuation } from '@/types/valuation';

describe('data/valuation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockValuationData: PropertyValuation[] = [
    {
      parid: '1-13-1',
      boro: 1,
      block: 13,
      lot: 1,
      year: '2024',
      finmkttot: 1500000,
      finacttot: 1200000,
      fintaxclass: '2',
      owner: 'Test Owner',
      bldg_class: 'A1',
      street_name: 'MAIN ST',
      gross_sqft: 2000,
      land_area: 1500,
      yrbuilt: 1990,
      ':id': 'test-id-1',
      ':version': 'v1',
      ':created_at': new Date('2024-01-01'),
      ':updated_at': new Date('2024-01-15'),
      // Set all other fields to null for brevity
      easement: null,
      subident_reuc: null,
      rectype: null,
      ident: null,
      subident: null,
      roll_section: null,
      secvol: null,
      pymktland: null,
      pymkttot: null,
      pyactland: null,
      pyacttot: null,
      pyactextot: null,
      pytrnland: null,
      pytrntot: null,
      pytrnextot: null,
      pytxbtot: null,
      pytxbextot: null,
      pytaxclass: null,
      tenmktland: null,
      tenmkttot: null,
      tenactland: null,
      tenacttot: null,
      tenactextot: null,
      tentrnland: null,
      tentrntot: null,
      tentrnextot: null,
      tentxbtot: null,
      tentxbextot: null,
      tentaxclass: null,
      cbnmktland: null,
      cbnmkttot: null,
      cbnactland: null,
      cbnacttot: null,
      cbnactextot: null,
      cbntrnland: null,
      cbntrntot: null,
      cbntrnextot: null,
      cbntxbtot: null,
      cbntxbextot: null,
      cbntaxclass: null,
      finmktland: null,
      finactland: null,
      finactextot: null,
      fintrnland: null,
      fintrntot: null,
      fintrnextot: null,
      fintxbtot: null,
      fintxbextot: null,
      curmktland: null,
      curmkttot: null,
      curactland: null,
      curacttot: null,
      curactextot: null,
      curtrnland: null,
      curtrntot: null,
      curtrnextot: null,
      curtxbtot: null,
      curtxbextot: null,
      curtaxclass: null,
      period: null,
      newdrop: null,
      noav: null,
      valref: null,
      zoning: null,
      housenum_lo: null,
      housenum_hi: null,
      zip_code: null,
      gepsupport_rc: null,
      stcode: null,
      lot_frt: null,
      lot_dep: null,
      lot_irreg: null,
      bld_frt: null,
      bld_dep: null,
      bld_ext: null,
      bld_story: null,
      corner: null,
      num_bldgs: null,
      yrbuilt_range: null,
      yrbuilt_flag: null,
      yralt1: null,
      yralt1_range: null,
      yralt2: null,
      yralt2_range: null,
      coop_apts: null,
      units: null,
      reuc_ref: null,
      aptno: null,
      coop_num: null,
      cpb_boro: null,
      cpb_dist: null,
      appt_date: null,
      appt_boro: null,
      appt_block: null,
      appt_lot: null,
      appt_ease: null,
      condo_number: null,
      condo_sfx1: null,
      condo_sfx2: null,
      condo_sfx3: null,
      uaf_land: null,
      uaf_bldg: null,
      protest_1: null,
      protest_2: null,
      protest_old: null,
      attorney_group1: null,
      attorney_group2: null,
      attorney_group_old: null,
      hotel_area_gross: null,
      office_area_gross: null,
      residential_area_gross: null,
      retail_area_gross: null,
      loft_area_gross: null,
      factory_area_gross: null,
      warehouse_area_gross: null,
      storage_area_gross: null,
      garage_area: null,
      other_area_gross: null,
      reuc_description: null,
      extracrdt: null,
      pytaxflag: null,
      tentaxflag: null,
      cbntaxflag: null,
      fintaxflag: null,
      curtaxflag: null,
    },
    {
      parid: '1-13-1',
      boro: 1,
      block: 13,
      lot: 1,
      year: '2023',
      finmkttot: 1400000,
      finacttot: 1100000,
      fintaxclass: '2',
      owner: 'Test Owner',
      bldg_class: 'A1',
      street_name: 'MAIN ST',
      gross_sqft: 2000,
      land_area: 1500,
      yrbuilt: 1990,
      ':id': 'test-id-2',
      ':version': 'v1',
      ':created_at': new Date('2023-01-01'),
      ':updated_at': new Date('2023-01-15'),
      // Set all other fields to null
      easement: null,
      subident_reuc: null,
      rectype: null,
      ident: null,
      subident: null,
      roll_section: null,
      secvol: null,
      pymktland: null,
      pymkttot: null,
      pyactland: null,
      pyacttot: null,
      pyactextot: null,
      pytrnland: null,
      pytrntot: null,
      pytrnextot: null,
      pytxbtot: null,
      pytxbextot: null,
      pytaxclass: null,
      tenmktland: null,
      tenmkttot: null,
      tenactland: null,
      tenacttot: null,
      tenactextot: null,
      tentrnland: null,
      tentrntot: null,
      tentrnextot: null,
      tentxbtot: null,
      tentxbextot: null,
      tentaxclass: null,
      cbnmktland: null,
      cbnmkttot: null,
      cbnactland: null,
      cbnacttot: null,
      cbnactextot: null,
      cbntrnland: null,
      cbntrntot: null,
      cbntrnextot: null,
      cbntxbtot: null,
      cbntxbextot: null,
      cbntaxclass: null,
      finmktland: null,
      finactland: null,
      finactextot: null,
      fintrnland: null,
      fintrntot: null,
      fintrnextot: null,
      fintxbtot: null,
      fintxbextot: null,
      curmktland: null,
      curmkttot: null,
      curactland: null,
      curacttot: null,
      curactextot: null,
      curtrnland: null,
      curtrntot: null,
      curtrnextot: null,
      curtxbtot: null,
      curtxbextot: null,
      curtaxclass: null,
      period: null,
      newdrop: null,
      noav: null,
      valref: null,
      zoning: null,
      housenum_lo: null,
      housenum_hi: null,
      zip_code: null,
      gepsupport_rc: null,
      stcode: null,
      lot_frt: null,
      lot_dep: null,
      lot_irreg: null,
      bld_frt: null,
      bld_dep: null,
      bld_ext: null,
      bld_story: null,
      corner: null,
      num_bldgs: null,
      yrbuilt_range: null,
      yrbuilt_flag: null,
      yralt1: null,
      yralt1_range: null,
      yralt2: null,
      yralt2_range: null,
      coop_apts: null,
      units: null,
      reuc_ref: null,
      aptno: null,
      coop_num: null,
      cpb_boro: null,
      cpb_dist: null,
      appt_date: null,
      appt_boro: null,
      appt_block: null,
      appt_lot: null,
      appt_ease: null,
      condo_number: null,
      condo_sfx1: null,
      condo_sfx2: null,
      condo_sfx3: null,
      uaf_land: null,
      uaf_bldg: null,
      protest_1: null,
      protest_2: null,
      protest_old: null,
      attorney_group1: null,
      attorney_group2: null,
      attorney_group_old: null,
      hotel_area_gross: null,
      office_area_gross: null,
      residential_area_gross: null,
      retail_area_gross: null,
      loft_area_gross: null,
      factory_area_gross: null,
      warehouse_area_gross: null,
      storage_area_gross: null,
      garage_area: null,
      other_area_gross: null,
      reuc_description: null,
      extracrdt: null,
      pytaxflag: null,
      tentaxflag: null,
      cbntaxflag: null,
      fintaxflag: null,
      curtaxflag: null,
    },
  ];

  describe('fetchPropertyValuation', () => {
    it('should fetch valuation data successfully', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);

      const result = await fetchPropertyValuation('1-13-1');

      expect(result.error).toBeUndefined();
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].year).toBe('2024');
      expect(result.data?.[1].year).toBe('2023');
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.name).toBe('Property Valuation');
    });

    it('should handle BBL with leading zeros', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);

      const result = await fetchPropertyValuation('1-00013-0001');

      expect(result.error).toBeUndefined();
      expect(queryMany).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          boro: 1,
          block: 13,
          lot: 1,
        })
      );
    });

    it('should return error for invalid BBL format', async () => {
      const result = await fetchPropertyValuation('invalid-bbl');

      expect(result.error).toContain('Invalid BBL format');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
      expect(queryMany).not.toHaveBeenCalled();
    });

    it('should return error when no data found', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce([]);

      const result = await fetchPropertyValuation('1-13-1');

      expect(result.error).toContain('No valuation data found');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(queryMany).mockRejectedValueOnce(new Error('Database connection failed'));

      const result = await fetchPropertyValuation('1-13-1');

      expect(result.error).toContain('Failed to load valuation data');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
    });

    it('should parse BBL with different formats', async () => {
      const testCases = [
        { bbl: '1-13-1', expected: { boro: 1, block: 13, lot: 1 } },
        { bbl: '2-1234-56', expected: { boro: 2, block: 1234, lot: 56 } },
        { bbl: '3-00013-0001', expected: { boro: 3, block: 13, lot: 1 } },
      ];

      for (const testCase of testCases) {
        vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);
        await fetchPropertyValuation(testCase.bbl);

        expect(queryMany).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining(testCase.expected)
        );
      }
    });
  });

  describe('BBL Parsing Edge Cases', () => {
    it('should reject BBL without hyphens', async () => {
      const result = await fetchPropertyValuation('1131');

      expect(result.error).toContain('Invalid BBL format');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
    });

    it('should reject BBL with wrong number of parts', async () => {
      const result = await fetchPropertyValuation('1-13');

      expect(result.error).toContain('Invalid BBL format');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
    });

    it('should reject BBL with non-numeric values', async () => {
      const result = await fetchPropertyValuation('a-b-c');

      expect(result.error).toContain('Invalid BBL format');
      expect(result.data).toBeNull();
      expect(result.metadata).toBeNull();
    });

    it('should accept BBL with all boroughs', async () => {
      const boroughs = [1, 2, 3, 4, 5];

      for (const boro of boroughs) {
        vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);
        await fetchPropertyValuation(`${boro}-13-1`);

        expect(queryMany).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ boro })
        );
      }
    });
  });

  describe('SQL Query Structure', () => {
    it('should query with correct BBL parameters', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);

      await fetchPropertyValuation('2-456-789');

      expect(queryMany).toHaveBeenCalledWith(
        expect.stringContaining('FROM silver.dof_property_valuation'),
        {
          boro: 2,
          block: 456,
          lot: 789,
        }
      );
    });

    it('should include ORDER BY clause in query', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);

      await fetchPropertyValuation('1-13-1');

      const query = vi.mocked(queryMany).mock.calls[0][0];
      expect(query).toContain('ORDER BY year DESC');
      expect(query).toContain('[:updated_at] DESC');
    });

    it('should filter by boro, block, and lot', async () => {
      vi.mocked(queryMany).mockResolvedValueOnce(mockValuationData);

      await fetchPropertyValuation('1-13-1');

      const query = vi.mocked(queryMany).mock.calls[0][0];
      expect(query).toContain('WHERE boro = @boro');
      expect(query).toContain('AND block = @block');
      expect(query).toContain('AND lot = @lot');
    });
  });
});

