import { describe, expect, it } from 'vitest';
import { PlutoData } from '@/data/pluto';
import { PropertyValuation } from '@/types/valuation';
import { AcrisRecord } from '@/types/acris';
import { OwnerContact } from '@/types/contacts';
import {
  getBuildingSectionData,
  getAddressSectionData,
  getOwnershipSectionData,
  getTaxSectionData,
  getContactsSectionData,
} from '../utils';

const EM_DASH = '—';

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

function makePluto(overrides: Partial<PlutoData> = {}): PlutoData {
  return {
    borough: null, block: null, lot: null, cd: null, ct2010: null, cb2010: null,
    schooldist: null, council: null, zipcode: null, firecomp: null, policeprct: null,
    healtharea: null, sanitboro: null, sanitsub: null, address: null, zonedist1: null,
    zonedist2: null, zonedist3: null, zonedist4: null, overlay1: null, overlay2: null,
    spdist1: null, spdist2: null, spdist3: null, ltdheight: null, splitzone: null,
    bldgclass: null, landuse: null, easements: null, ownertype: null, ownername: null,
    lotarea: null, bldgarea: null, comarea: null, resarea: null, officearea: null,
    retailarea: null, garagearea: null, strgearea: null, factryarea: null, otherarea: null,
    areasource: null, numbldgs: null, numfloors: null, unitsres: null, unitstotal: null,
    lotfront: null, lotdepth: null, bldgfront: null, bldgdepth: null, ext: null,
    proxcode: null, irrlotcode: null, lottype: null, bsmtcode: null, assessland: null,
    assesstot: null, exempttot: null, yearbuilt: null, yearalter1: null, yearalter2: null,
    histdist: null, landmark: null, builtfar: null, residfar: null, commfar: null,
    facilfar: null, borocode: null, bbl: null, condono: null, tract2010: null,
    xcoord: null, ycoord: null, latitude: null, longitude: null, zonemap: null,
    zmcode: null, sanborn: null, taxmap: null, edesignum: null, appbbl: null,
    appdate: null, plutomapid: null, version: null, sanitdistrict: null,
    healthcenterdistrict: null, firm07_flag: null, pfirm15_flag: null, rpaddate: null,
    dcasdate: null, zoningdate: null, landmkdate: null, basempdate: null, masdate: null,
    polidate: null, edesigdate: null, geom: null, dcpedited: null, notes: null,
    bct2020: null, bctcb2020: null,
    ...overrides,
  } as PlutoData;
}

function makeValuation(overrides: Partial<PropertyValuation> = {}): PropertyValuation {
  return {
    parid: null, boro: null, block: null, lot: null, easement: null, subident_reuc: null,
    rectype: null, year: null, ident: null, subident: null, roll_section: null, secvol: null,
    pymktland: null, pymkttot: null, pyactland: null, pyacttot: null, pyactextot: null,
    pytrnland: null, pytrntot: null, pytrnextot: null, pytxbtot: null, pytxbextot: null,
    pytaxclass: null, tenmktland: null, tenmkttot: null, tenactland: null, tenacttot: null,
    tenactextot: null, tentrnland: null, tentrntot: null, tentrnextot: null, tentxbtot: null,
    tentxbextot: null, tentaxclass: null, cbnmktland: null, cbnmkttot: null, cbnactland: null,
    cbnacttot: null, cbnactextot: null, cbntrnland: null, cbntrntot: null, cbntrnextot: null,
    cbntxbtot: null, cbntxbextot: null, cbntaxclass: null, finmktland: null, finmkttot: null,
    finactland: null, finacttot: null, finactextot: null, fintrnland: null, fintrntot: null,
    fintrnextot: null, fintxbtot: null, fintxbextot: null, fintaxclass: null, curmktland: null,
    curmkttot: null, curactland: null, curacttot: null, curactextot: null, curtrnland: null,
    curtrntot: null, curtrnextot: null, curtxbtot: null, curtxbextot: null, curtaxclass: null,
    period: null, newdrop: null, noav: null, valref: null, bldg_class: null, owner: null,
    zoning: null, housenum_lo: null, housenum_hi: null, street_name: null, zip_code: null,
    gepsupport_rc: null, stcode: null, lot_frt: null, lot_dep: null, lot_irreg: null,
    bld_frt: null, bld_dep: null, bld_ext: null, bld_story: null, corner: null,
    land_area: null, num_bldgs: null, yrbuilt: null, yrbuilt_range: null, yrbuilt_flag: null,
    yralt1: null, yralt1_range: null, yralt2: null, yralt2_range: null, coop_apts: null,
    units: null, reuc_ref: null, aptno: null, coop_num: null, cpb_boro: null, cpb_dist: null,
    appt_date: null, appt_boro: null, appt_block: null, appt_lot: null, appt_ease: null,
    condo_number: null, condo_sfx1: null, condo_sfx2: null, condo_sfx3: null,
    uaf_land: null, uaf_bldg: null, protest_1: null, protest_2: null, protest_old: null,
    attorney_group1: null, attorney_group2: null, attorney_group_old: null,
    gross_sqft: null, hotel_area_gross: null, office_area_gross: null,
    residential_area_gross: null, retail_area_gross: null, loft_area_gross: null,
    factory_area_gross: null, warehouse_area_gross: null, storage_area_gross: null,
    garage_area: null, other_area_gross: null, reuc_description: null, extracrdt: null,
    pytaxflag: null, tentaxflag: null, cbntaxflag: null, fintaxflag: null, curtaxflag: null,
    ':id': null, ':version': null, ':created_at': null, ':updated_at': null,
    ...overrides,
  };
}

function makeAcris(overrides: Partial<AcrisRecord> = {}): AcrisRecord {
  return {
    borough: '1', block: '100', lot: '1', street_name: '', street_number: '',
    unit: null, lender_name: '', borrower_name: '', buyer_name: '',
    mortgage_document_id: '', mortgage_document_date: '', mortgage_recorded_date: '',
    mortgage_document_amount: 0, sale_document_date: '', sale_recorded_date: '',
    sale_document_amount: 0, avroll_building_class: '', avroll_building_story: 0,
    avroll_units: 0, id: '', address: '', address_with_unit: '', zip_code: '',
    aka: [], aka_address_street_name: [], aka_address_street_number: [],
    prior_mortgage_document_id: '', prior_mortgage_document_date: '',
    prior_mortgage_recorded_date: '', prior_mortgage_document_amount: 0,
    prior_lender: '', prior_lendee: '', hpd_name: null, hpd_phone: null,
    purchase_refinance: '',
    ...overrides,
  };
}

function makeContact(overrides: Partial<OwnerContact> = {}): OwnerContact {
  return {
    bbl: null, borough: null, block: null, lot: null,
    bucket_name: null, date: null, owner_business_name: null,
    owner_full_address: null, owner_full_name: null,
    owner_master_full_name: null, owner_phone: null,
    owner_title: null, status: 'current', merged_count: null,
    source: null, agency: null,
    ...overrides,
  };
}

// ===========================================================================
// getBuildingSectionData
// ===========================================================================

describe('getBuildingSectionData', () => {
  it('returns em-dashes when both sources are null', () => {
    const result = getBuildingSectionData(null, null);
    expect(result).toEqual({
      buildingClass: EM_DASH,
      squareFeet: EM_DASH,
      buildingDimensions: EM_DASH,
      buildingsOnLot: EM_DASH,
      stories: EM_DASH,
      totalUnits: EM_DASH,
      yearBuilt: EM_DASH,
      yearLastAltered: EM_DASH,
    });
  });

  it('uses pluto data when available', () => {
    const pluto = makePluto({
      bldgclass: 'D4', bldgarea: '12500', bldgfront: '25', bldgdepth: '100',
      numbldgs: 1, numfloors: '5', unitstotal: 20, yearbuilt: 1925, yearalter1: 2010,
    });
    const result = getBuildingSectionData(pluto, null);
    expect(result.buildingClass).toContain('D4');
    expect(result.squareFeet).toBe('12,500');
    expect(result.buildingDimensions).toBe('25 ft x 100 ft');
    expect(result.buildingsOnLot).toBe('1');
    expect(result.stories).toBe('5');
    expect(result.totalUnits).toBe('20');
    expect(result.yearBuilt).toBe('1925');
    expect(result.yearLastAltered).toBe('2010');
  });

  it('falls back to valuation when pluto is null', () => {
    const valuation = makeValuation({
      bldg_class: 'R1', gross_sqft: 3200, bld_frt: 20, bld_dep: 55,
      num_bldgs: 1, bld_story: 3, units: 2, yrbuilt: 1940, yralt1: 2005,
    });
    const result = getBuildingSectionData(null, valuation);
    expect(result.buildingClass).toContain('R1');
    expect(result.squareFeet).toBe('3,200');
    expect(result.buildingDimensions).toBe('20 ft x 55 ft');
    expect(result.buildingsOnLot).toBe('1');
    expect(result.stories).toBe('3');
    expect(result.totalUnits).toBe('2');
    expect(result.yearBuilt).toBe('1940');
    expect(result.yearLastAltered).toBe('2005');
  });

  it('prefers pluto over valuation when both present', () => {
    const pluto = makePluto({ bldgclass: 'A1', bldgarea: '5000', yearbuilt: 1910 });
    const valuation = makeValuation({ bldg_class: 'B2', gross_sqft: 9999, yrbuilt: 2020 });
    const result = getBuildingSectionData(pluto, valuation);
    expect(result.buildingClass).toContain('A1');
    expect(result.squareFeet).toBe('5,000');
    expect(result.yearBuilt).toBe('1910');
  });

  it('falls back per-field: pluto has some, valuation fills the rest', () => {
    const pluto = makePluto({ bldgclass: 'C0', yearbuilt: 1950 });
    const valuation = makeValuation({ gross_sqft: 4800, bld_frt: 30, bld_dep: 60, bld_story: 4, units: 8, yralt2: 2018 });
    const result = getBuildingSectionData(pluto, valuation);
    expect(result.buildingClass).toContain('C0');
    expect(result.squareFeet).toBe('4,800');
    expect(result.buildingDimensions).toBe('30 ft x 60 ft');
    expect(result.stories).toBe('4');
    expect(result.totalUnits).toBe('8');
    expect(result.yearBuilt).toBe('1950');
    expect(result.yearLastAltered).toBe('2018');
  });

  it('returns em-dash for dimensions when only front is available', () => {
    const result = getBuildingSectionData(makePluto({ bldgfront: '40' }), null);
    expect(result.buildingDimensions).toBe(EM_DASH);
  });

  it('returns em-dash for dimensions when only depth is available', () => {
    const result = getBuildingSectionData(null, makeValuation({ bld_dep: 80 }));
    expect(result.buildingDimensions).toBe(EM_DASH);
  });

  it('treats zero dimensions as unavailable', () => {
    const result = getBuildingSectionData(makePluto({ bldgfront: '0', bldgdepth: '0' }), null);
    expect(result.buildingDimensions).toBe(EM_DASH);
  });

  it('prefers yearalter2 over yearalter1 in pluto', () => {
    const result = getBuildingSectionData(makePluto({ yearalter1: 2000, yearalter2: 2015 }), null);
    expect(result.yearLastAltered).toBe('2015');
  });

  it('falls back from pluto yearalter to valuation yralt', () => {
    const result = getBuildingSectionData(
      makePluto({ yearalter1: 0, yearalter2: 0 }),
      makeValuation({ yralt1: 1998 }),
    );
    expect(result.yearLastAltered).toBe('1998');
  });

  it('uses valuation yralt2 over yralt1', () => {
    const result = getBuildingSectionData(null, makeValuation({ yralt1: 1990, yralt2: 2022 }));
    expect(result.yearLastAltered).toBe('2022');
  });

  it('rounds non-integer dimensions', () => {
    const result = getBuildingSectionData(makePluto({ bldgfront: '24.6', bldgdepth: '99.4' }), null);
    expect(result.buildingDimensions).toBe('25 ft x 99 ft');
  });
});

// ===========================================================================
// getAddressSectionData
// ===========================================================================

describe('getAddressSectionData', () => {
  it('returns em-dashes and empty values when all inputs are null', () => {
    const result = getAddressSectionData(null, null, undefined, undefined);
    expect(result.propertyAddress).toBeNull();
    expect(result.boroughCode).toBe('');
    expect(result.boroughName).toBe('NYC');
    expect(result.block).toBe(EM_DASH);
    expect(result.lot).toBe(EM_DASH);
    expect(result.zipcode).toBeNull();
    expect(result.alternativeAddresses).toEqual([]);
  });

  it('extracts address_with_unit from acris data', () => {
    const acris = makeAcris({ address_with_unit: '100 Broadway Apt 5A' });
    const result = getAddressSectionData(acris, null, '1-100-1', undefined);
    expect(result.propertyAddress).toBe('100 Broadway Apt 5A');
  });

  it('falls back to plain address when address_with_unit is empty', () => {
    const acris = makeAcris({ address_with_unit: '', address: '100 Broadway' });
    const result = getAddressSectionData(acris, null, '1-100-1', undefined);
    expect(result.propertyAddress).toBe('100 Broadway');
  });

  it('constructs address from street_number + street_name as last resort', () => {
    const acris = makeAcris({ address_with_unit: '', address: '', street_number: '100', street_name: 'Broadway' });
    const result = getAddressSectionData(acris, null, '1-100-1', undefined);
    expect(result.propertyAddress).toBe('100 Broadway');
  });

  it('parses BBL into borough, block, lot', () => {
    const result = getAddressSectionData(null, null, '3-456-78', undefined);
    expect(result.boroughCode).toBe('3');
    expect(result.block).toBe('456');
    expect(result.lot).toBe('78');
    expect(result.boroughName).toBe('Brooklyn');
  });

  it('prefers acris zip_code over pluto zipcode', () => {
    const acris = makeAcris({ zip_code: '10001' });
    const pluto = makePluto({ zipcode: '10002' });
    const result = getAddressSectionData(acris, pluto, '1-1-1', undefined);
    expect(result.zipcode).toBe('10001');
  });

  it('falls back to pluto zipcode when acris has no zip', () => {
    const acris = makeAcris({ zip_code: '' });
    const pluto = makePluto({ zipcode: '10002' });
    const result = getAddressSectionData(acris, pluto, '1-1-1', undefined);
    expect(result.zipcode).toBe('10002');
  });

  it('passes through alternativeAddresses from acris', () => {
    const acris = makeAcris({ aka: ['200 Broadway', '202 Broadway'] });
    const result = getAddressSectionData(acris, null, '1-1-1', undefined);
    expect(result.alternativeAddresses).toEqual(['200 Broadway', '202 Broadway']);
  });

  it('uses fullFormattedAddress when provided', () => {
    const result = getAddressSectionData(null, null, '1-1-1', '100 Broadway, New York, NY 10001');
    expect(result.fullAddress).toBe('100 Broadway, New York, NY 10001');
  });

  it('builds fullAddress from components when no formatted address', () => {
    const acris = makeAcris({ address_with_unit: '100 Broadway', zip_code: '10001' });
    const result = getAddressSectionData(acris, null, '1-1-1', undefined);
    expect(result.fullAddress).toBe('100 Broadway, New York, NY 10001');
  });

  it('builds fullAddress without zip when zip not available', () => {
    const acris = makeAcris({ address_with_unit: '100 Broadway', zip_code: '' });
    const result = getAddressSectionData(acris, null, '1-1-1', undefined);
    expect(result.fullAddress).toBe('100 Broadway, New York, NY');
  });

  it('falls back to BBL when no address at all', () => {
    const result = getAddressSectionData(null, null, '2-500-10', undefined);
    expect(result.fullAddress).toBe('BBL 2-500-10, Bronx');
  });
});

// ===========================================================================
// getOwnershipSectionData
// ===========================================================================

describe('getOwnershipSectionData', () => {
  it('returns em-dashes when all inputs are null', () => {
    const result = getOwnershipSectionData(null, null);
    expect(result.unmaskedOwner).toBeNull();
    expect(result.recordedOwnerName).toBe(EM_DASH);
    expect(result.saleDate).toBe(EM_DASH);
    expect(result.salePrice).toBe(EM_DASH);
    expect(result.mortgageDate).toBe(EM_DASH);
    expect(result.mortgageAmount).toBe(EM_DASH);
    expect(result.lenderName).toBe(EM_DASH);
  });

  it('extracts ownership data from acris', () => {
    const acris = makeAcris({
      buyer_name: 'JOHN DOE',
      sale_document_date: '2023-06-15',
      sale_document_amount: 1500000,
      mortgage_document_date: '2023-06-15',
      mortgage_document_amount: 1000000,
      lender_name: 'Chase Bank',
    });
    const result = getOwnershipSectionData(acris, null);
    expect(result.recordedOwnerName).toBe('JOHN DOE');
    expect(result.saleDate).not.toBe(EM_DASH);
    expect(result.salePrice).toBe('$1,500,000');
    expect(result.mortgageAmount).toBe('$1,000,000');
    expect(result.lenderName).toBe('Chase Bank');
  });

  it('extracts unmasked owner from signator contacts', () => {
    const contacts: OwnerContact[] = [
      makeContact({
        status: 'current',
        source: ['signator'],
        owner_master_full_name: 'Jane Smith',
        owner_full_address: ['123 Main St, NY 10001'],
        owner_phone: ['2125551234', 'N/A', '2125555678'],
        date: '2023-01-01',
      }),
    ];
    const result = getOwnershipSectionData(null, contacts);
    expect(result.unmaskedOwner).not.toBeNull();
    expect(result.unmaskedOwner!.name).toBe('Jane Smith');
    expect(result.unmaskedOwner!.address).toBe('123 Main St, NY 10001');
    expect(result.unmaskedOwner!.phones).toEqual(['2125551234', '2125555678']);
  });

  it('picks the most recent signator contact', () => {
    const contacts: OwnerContact[] = [
      makeContact({
        status: 'current', source: ['signator'],
        owner_master_full_name: 'Old Owner', date: '2020-01-01',
      }),
      makeContact({
        status: 'current', source: ['signator'],
        owner_master_full_name: 'New Owner', date: '2024-01-01',
      }),
    ];
    const result = getOwnershipSectionData(null, contacts);
    expect(result.unmaskedOwner!.name).toBe('New Owner');
  });

  it('excludes non-current contacts from unmasked owners', () => {
    const contacts: OwnerContact[] = [
      makeContact({
        status: 'historical', source: ['signator'],
        owner_master_full_name: 'Historic Owner',
      }),
    ];
    const result = getOwnershipSectionData(null, contacts);
    expect(result.unmaskedOwner).toBeNull();
  });

  it('excludes contacts without signator source', () => {
    const contacts: OwnerContact[] = [
      makeContact({
        status: 'current', source: ['hpd'],
        owner_master_full_name: 'HPD Contact',
      }),
    ];
    const result = getOwnershipSectionData(null, contacts);
    expect(result.unmaskedOwner).toBeNull();
  });

  it('returns null unmasked owner when name is missing', () => {
    const contacts: OwnerContact[] = [
      makeContact({
        status: 'current', source: ['signator'],
        owner_master_full_name: null,
      }),
    ];
    const result = getOwnershipSectionData(null, contacts);
    expect(result.unmaskedOwner).toBeNull();
  });
});

// ===========================================================================
// getTaxSectionData
// ===========================================================================

describe('getTaxSectionData', () => {
  it('returns em-dashes when valuation data is null', () => {
    const result = getTaxSectionData(null);
    expect(result.estimatedMarketValue).toBe(EM_DASH);
    expect(result.assessedValue).toBe(EM_DASH);
    expect(result.hasMarketValueExemption).toBe(false);
    expect(result.hasTransitionalValueExemption).toBe(false);
    expect(result.taxableAssessedValue).toBe(EM_DASH);
    expect(result.taxYear).toBe(EM_DASH);
    expect(result.propertyTax).toBe(EM_DASH);
    expect(result.yoyChange).toBe('N/A');
    expect(result.yoyColor).toBeUndefined();
  });

  it('returns em-dashes when valuation array is empty', () => {
    const result = getTaxSectionData([]);
    expect(result.estimatedMarketValue).toBe(EM_DASH);
    expect(result.taxYear).toBe(EM_DASH);
  });

  it('formats market and assessed values', () => {
    const valuation = makeValuation({
      finmkttot: 2000000,
      finacttot: 500000,
      fintrntot: 450000,
      year: '2024',
    });
    const result = getTaxSectionData([valuation]);
    expect(result.estimatedMarketValue).toBe('$2,000,000');
    expect(result.assessedValue).toBe('$500,000');
    expect(result.transitionalAssessedValue).toBe('$450,000');
    expect(result.taxYear).toBe('2023/24');
  });

  it('detects market value exemption', () => {
    const valuation = makeValuation({ finactextot: 50000 });
    const result = getTaxSectionData([valuation]);
    expect(result.hasMarketValueExemption).toBe(true);
    expect(result.marketValueExemption).toBe('$50,000');
  });

  it('reports no exemption when value is zero', () => {
    const valuation = makeValuation({ finactextot: 0 });
    const result = getTaxSectionData([valuation]);
    expect(result.hasMarketValueExemption).toBe(false);
  });

  it('detects transitional value exemption', () => {
    const valuation = makeValuation({ fintrnextot: 30000 });
    const result = getTaxSectionData([valuation]);
    expect(result.hasTransitionalValueExemption).toBe(true);
    expect(result.transitionalValueExemption).toBe('$30,000');
  });

  it('computes taxable assessed value (txbtot minus txbextot)', () => {
    const valuation = makeValuation({ fintxbtot: 200000, fintxbextot: 20000 });
    const result = getTaxSectionData([valuation]);
    expect(result.taxableAssessedValue).toBe('$180,000');
  });

  it('returns em-dash for taxable when fintxbtot is null', () => {
    const valuation = makeValuation({ fintxbtot: null });
    const result = getTaxSectionData([valuation]);
    expect(result.taxableAssessedValue).toBe(EM_DASH);
  });
});

// ===========================================================================
// getContactsSectionData
// ===========================================================================

describe('getContactsSectionData', () => {
  it('returns empty array when contacts is null', () => {
    expect(getContactsSectionData(null)).toEqual([]);
  });

  it('returns empty array when contacts is empty', () => {
    expect(getContactsSectionData([])).toEqual([]);
  });

  it('filters out non-current contacts', () => {
    const contacts = [
      makeContact({ status: 'historical', owner_master_full_name: 'Old' }),
      makeContact({ status: 'current', owner_master_full_name: 'Current' }),
    ];
    const result = getContactsSectionData(contacts);
    expect(result).toHaveLength(1);
    expect(result[0].owner_master_full_name).toBe('Current');
  });

  it('filters out contacts with N/A name', () => {
    const contacts = [
      makeContact({ status: 'current', owner_master_full_name: 'N/A' }),
      makeContact({ status: 'current', owner_master_full_name: 'Valid Name' }),
    ];
    const result = getContactsSectionData(contacts);
    expect(result).toHaveLength(1);
    expect(result[0].owner_master_full_name).toBe('Valid Name');
  });

  it('filters out contacts with null name', () => {
    const contacts = [
      makeContact({ status: 'current', owner_master_full_name: null }),
    ];
    expect(getContactsSectionData(contacts)).toEqual([]);
  });

  it('strips N/A from phone arrays', () => {
    const contacts = [
      makeContact({
        status: 'current',
        owner_master_full_name: 'Test',
        owner_phone: ['2125551234', 'N/A', '', '2125555678'],
      }),
    ];
    const result = getContactsSectionData(contacts);
    expect(result[0].owner_phone).toEqual(['2125551234', '2125555678']);
  });

  it('sorts contacts with phones before those without', () => {
    const contacts = [
      makeContact({ status: 'current', owner_master_full_name: 'No Phone', owner_phone: [] }),
      makeContact({ status: 'current', owner_master_full_name: 'Has Phone', owner_phone: ['2125551234'] }),
      makeContact({ status: 'current', owner_master_full_name: 'Also No Phone', owner_phone: null }),
    ];
    const result = getContactsSectionData(contacts);
    expect(result[0].owner_master_full_name).toBe('Has Phone');
    expect(result[1].owner_master_full_name).toBe('No Phone');
    expect(result[2].owner_master_full_name).toBe('Also No Phone');
  });

  it('returns cleaned contacts with only needed fields', () => {
    const contacts = [
      makeContact({
        status: 'current',
        owner_master_full_name: 'John Doe',
        owner_phone: ['2125551234'],
        owner_business_name: ['ACME Corp'],
        owner_full_address: ['123 Main St'],
      }),
    ];
    const result = getContactsSectionData(contacts);
    expect(result[0]).toEqual({
      owner_master_full_name: 'John Doe',
      owner_phone: ['2125551234'],
    });
  });
});
