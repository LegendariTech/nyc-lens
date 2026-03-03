import { describe, expect, it, vi } from 'vitest';
import type { AcrisRecord } from '@/types/acris';

// Mock server-only modules so the pure getCondoInfo function can be imported in tests
vi.mock('server-only', () => ({}));
vi.mock('@/data/pluto', () => ({ fetchPlutoData: vi.fn() }));
vi.mock('@/data/acris', () => ({ fetchPropertyByBBL: vi.fn() }));

import { getCondoInfo } from '../getPropertyData';

function makeAcris(overrides: Partial<AcrisRecord> = {}): AcrisRecord {
  return {
    borough: '1', block: '100', lot: '1', billing_lot: null, street_name: '', street_number: '',
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

describe('getCondoInfo', () => {
  it('returns all false/null for non-condo property', () => {
    const result = getCondoInfo(makeAcris({ avroll_building_class: 'A5' }), ['1', '100', '1']);
    expect(result).toEqual({
      isCondoUnit: false,
      isBillingLot: false,
      billingLot: null,
      billingLotBbl: null,
    });
  });

  it('returns all false/null for null propertyData', () => {
    const result = getCondoInfo(null, ['1', '100', '1']);
    expect(result).toEqual({
      isCondoUnit: false,
      isBillingLot: false,
      billingLot: null,
      billingLotBbl: null,
    });
  });

  it('detects condo unit with billing_lot', () => {
    const result = getCondoInfo(
      makeAcris({ billing_lot: '7501', avroll_building_class: 'R1' }),
      ['1', '1171', '1640'],
    );
    expect(result).toEqual({
      isCondoUnit: true,
      isBillingLot: false,
      billingLot: '7501',
      billingLotBbl: '1-1171-7501',
    });
  });

  it('detects billing lot (lot >= 7500, R-class)', () => {
    const result = getCondoInfo(
      makeAcris({ avroll_building_class: 'R0' }),
      ['1', '1171', '7501'],
    );
    expect(result).toEqual({
      isCondoUnit: false,
      isBillingLot: true,
      billingLot: null,
      billingLotBbl: null,
    });
  });

  it('does not flag billing lot when lot < 7500', () => {
    const result = getCondoInfo(
      makeAcris({ avroll_building_class: 'R1' }),
      ['1', '100', '500'],
    );
    expect(result).toEqual({
      isCondoUnit: false,
      isBillingLot: false,
      billingLot: null,
      billingLotBbl: null,
    });
  });

  it('does not flag billing lot when building class is not R-prefix', () => {
    const result = getCondoInfo(
      makeAcris({ avroll_building_class: 'A5' }),
      ['1', '100', '7500'],
    );
    expect(result).toEqual({
      isCondoUnit: false,
      isBillingLot: false,
      billingLot: null,
      billingLotBbl: null,
    });
  });

  it('condo unit with billing_lot is never flagged as billing lot even with lot >= 7500 and R-class', () => {
    const result = getCondoInfo(
      makeAcris({ billing_lot: '7501', avroll_building_class: 'R4' }),
      ['1', '100', '8000'],
    );
    expect(result.isCondoUnit).toBe(true);
    expect(result.isBillingLot).toBe(false);
  });

  it('treats empty string billing_lot as absent', () => {
    const result = getCondoInfo(
      makeAcris({ billing_lot: '' }),
      ['1', '100', '1'],
    );
    expect(result.isCondoUnit).toBe(false);
    expect(result.billingLot).toBeNull();
  });
});
