import { PlutoData } from '@/data/pluto';
import { PropertyValuation } from '@/types/valuation';
import { AcrisRecord } from '@/types/acris';
import { OwnerContact } from '@/types/contacts';
import { getBuildingClassCategory } from '@/constants/building';
import { getBoroughDisplayName } from '@/constants/nyc';
import { formatValue, formatDate, formatCurrency, formatYoyChange } from '@/utils/formatters';
import { getTaxableAssessedValue, formatTaxYear, transformValuationToTaxRows } from '@/app/property/[bbl]/tax/components/utils';

const EM_DASH = '—';

// ---------------------------------------------------------------------------
// Building Section
// ---------------------------------------------------------------------------

export interface BuildingSectionData {
  buildingClass: string;
  squareFeet: string;
  buildingDimensions: string;
  buildingsOnLot: string;
  stories: string;
  totalUnits: string;
  yearBuilt: string;
  yearLastAltered: string;
}

function formatDimension(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined) return null;
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return isNaN(num) || num === 0 ? null : Math.round(num);
}

/**
 * Prepares display data for the Building section.
 * Uses PLUTO as primary source with PropertyValuation as fallback.
 */
export function getBuildingSectionData(
  plutoData: PlutoData | null,
  latestValuation: PropertyValuation | null,
): BuildingSectionData {
  const bldgClassCode = plutoData?.bldgclass ?? latestValuation?.bldg_class ?? null;
  const buildingClass = bldgClassCode
    ? `${getBuildingClassCategory(bldgClassCode)} (${bldgClassCode})`
    : EM_DASH;

  const rawArea = plutoData?.bldgarea ?? latestValuation?.gross_sqft ?? null;
  const squareFeet = rawArea != null
    ? formatValue(rawArea, undefined, 'number')
    : EM_DASH;

  const frontFt = formatDimension(plutoData?.bldgfront ?? latestValuation?.bld_frt);
  const depthFt = formatDimension(plutoData?.bldgdepth ?? latestValuation?.bld_dep);
  const buildingDimensions = frontFt && depthFt
    ? `${frontFt} ft x ${depthFt} ft`
    : EM_DASH;

  const rawBldgs = plutoData?.numbldgs ?? latestValuation?.num_bldgs ?? null;
  const buildingsOnLot = rawBldgs != null
    ? formatValue(rawBldgs, undefined, 'number')
    : EM_DASH;

  const rawStories = plutoData?.numfloors ?? latestValuation?.bld_story ?? null;
  const stories = rawStories != null
    ? formatValue(rawStories, undefined, 'number')
    : EM_DASH;

  const rawUnits = plutoData?.unitstotal ?? latestValuation?.units ?? null;
  const totalUnits = rawUnits != null
    ? formatValue(rawUnits, undefined, 'number')
    : EM_DASH;

  const rawYearBuilt = plutoData?.yearbuilt ?? latestValuation?.yrbuilt ?? null;
  const yearBuilt = rawYearBuilt
    ? formatValue(rawYearBuilt, undefined, 'year')
    : EM_DASH;

  const rawYearAltered =
    plutoData?.yearalter2 || plutoData?.yearalter1 ||
    latestValuation?.yralt2 || latestValuation?.yralt1 ||
    null;
  const yearLastAltered = rawYearAltered
    ? formatValue(rawYearAltered, undefined, 'year')
    : EM_DASH;

  return {
    buildingClass,
    squareFeet,
    buildingDimensions,
    buildingsOnLot,
    stories,
    totalUnits,
    yearBuilt,
    yearLastAltered,
  };
}

// ---------------------------------------------------------------------------
// Address Section
// ---------------------------------------------------------------------------

export interface AddressSectionData {
  propertyAddress: string | null;
  boroughCode: string;
  boroughName: string;
  block: string;
  lot: string;
  zipcode: string | null;
  alternativeAddresses: string[];
  fullAddress: string;
}

/**
 * Prepares display data for the Address section and the page header.
 */
export function getAddressSectionData(
  propertyData: AcrisRecord | null,
  plutoData: PlutoData | null,
  bbl: string | undefined,
  fullFormattedAddress: string | undefined,
): AddressSectionData {
  const propertyAddress = propertyData?.address_with_unit ||
    propertyData?.address ||
    (propertyData?.street_number && propertyData?.street_name
      ? `${propertyData.street_number} ${propertyData.street_name}`
      : null);

  const zipcode = propertyData?.zip_code || plutoData?.zipcode || null;
  const alternativeAddresses = propertyData?.aka || [];

  const parts = bbl?.split('-') || [];
  const boroughCode = parts[0] || '';
  const block = parts[1] || EM_DASH;
  const lot = parts[2] || EM_DASH;
  const boroughName = boroughCode ? getBoroughDisplayName(boroughCode) || 'NYC' : 'NYC';

  const fullAddress = fullFormattedAddress || (
    propertyAddress && zipcode
      ? `${propertyAddress}, ${boroughName}, NY ${zipcode}`
      : propertyAddress
        ? `${propertyAddress}, ${boroughName}, NY`
        : `BBL ${bbl}, ${boroughName}`
  );

  return {
    propertyAddress,
    boroughCode,
    boroughName,
    block,
    lot,
    zipcode,
    alternativeAddresses,
    fullAddress,
  };
}

// ---------------------------------------------------------------------------
// Ownership Section
// ---------------------------------------------------------------------------

export interface UnmaskedOwnerData {
  name: string;
  address: string | null;
  phones: string[];
}

export interface OwnershipSectionData {
  unmaskedOwner: UnmaskedOwnerData | null;
  recordedOwnerName: string;
  saleDate: string;
  salePrice: string;
  mortgageDate: string;
  mortgageAmount: string;
  lenderName: string;
}

/**
 * Prepares display data for the Ownership section.
 * Combines ACRIS property data with unmasked signator contacts.
 */
export function getOwnershipSectionData(
  propertyData: AcrisRecord | null,
  contactsData: OwnerContact[] | null,
): OwnershipSectionData {
  const unmaskedOwners = contactsData
    ?.filter(contact =>
      contact.status === 'current' &&
      contact.source?.includes('signator')
    )
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date as string).getTime() : 0;
      const dateB = b.date ? new Date(b.date as string).getTime() : 0;
      return dateB - dateA;
    }) || [];

  const topOwner = unmaskedOwners.length > 0 ? unmaskedOwners[0] : null;
  const unmaskedOwner: UnmaskedOwnerData | null = topOwner?.owner_master_full_name
    ? {
      name: topOwner.owner_master_full_name,
      address: topOwner.owner_full_address?.[0] || null,
      phones: topOwner.owner_phone?.filter(p => p && p !== 'N/A') || [],
    }
    : null;

  return {
    unmaskedOwner,
    recordedOwnerName: propertyData?.buyer_name || EM_DASH,
    saleDate: propertyData?.sale_document_date
      ? formatDate(propertyData.sale_document_date)
      : EM_DASH,
    salePrice: propertyData?.sale_document_amount != null
      ? formatValue(propertyData.sale_document_amount, undefined, 'currency')
      : EM_DASH,
    mortgageDate: propertyData?.mortgage_document_date
      ? formatDate(propertyData.mortgage_document_date)
      : EM_DASH,
    mortgageAmount: propertyData?.mortgage_document_amount != null
      ? formatValue(propertyData.mortgage_document_amount, undefined, 'currency')
      : EM_DASH,
    lenderName: propertyData?.lender_name || EM_DASH,
  };
}

// ---------------------------------------------------------------------------
// Tax Information Section
// ---------------------------------------------------------------------------

export interface TaxSectionData {
  estimatedMarketValue: string;
  assessedValue: string;
  hasMarketValueExemption: boolean;
  marketValueExemption: string;
  transitionalAssessedValue: string;
  hasTransitionalValueExemption: boolean;
  transitionalValueExemption: string;
  taxableAssessedValue: string;
  taxYear: string;
  propertyTax: string;
  yoyChange: string;
  yoyColor: string | undefined;
}

/**
 * Prepares display data for the Tax Information section.
 */
export function getTaxSectionData(
  valuationData: PropertyValuation[] | null,
): TaxSectionData {
  const latestValuation = valuationData && valuationData.length > 0 ? valuationData[0] : null;
  const taxRows = valuationData ? transformValuationToTaxRows(valuationData) : [];
  const latestTaxRow = taxRows.length > 0 ? taxRows[0] : null;

  const hasMarketValueExemption = latestValuation?.finactextot != null &&
    latestValuation.finactextot !== 0;

  const hasTransitionalValueExemption = latestValuation?.fintrnextot != null &&
    latestValuation.fintrnextot !== 0;

  const taxable = latestValuation
    ? getTaxableAssessedValue(latestValuation.fintxbtot, latestValuation.fintxbextot)
    : null;

  const yoyChangeValue = latestTaxRow?.yoyChange;

  return {
    estimatedMarketValue: latestValuation?.finmkttot != null
      ? formatCurrency(latestValuation.finmkttot)
      : EM_DASH,
    assessedValue: latestValuation?.finacttot != null
      ? formatCurrency(latestValuation.finacttot)
      : EM_DASH,
    hasMarketValueExemption,
    marketValueExemption: hasMarketValueExemption
      ? formatCurrency(latestValuation!.finactextot)
      : EM_DASH,
    transitionalAssessedValue: latestValuation?.fintrntot != null
      ? formatCurrency(latestValuation.fintrntot)
      : EM_DASH,
    hasTransitionalValueExemption,
    transitionalValueExemption: hasTransitionalValueExemption
      ? formatCurrency(latestValuation!.fintrnextot)
      : EM_DASH,
    taxableAssessedValue: taxable != null
      ? formatCurrency(taxable)
      : EM_DASH,
    taxYear: latestValuation?.year
      ? formatTaxYear(latestValuation.year)
      : EM_DASH,
    propertyTax: latestTaxRow?.propertyTax != null
      ? formatCurrency(latestTaxRow.propertyTax)
      : EM_DASH,
    yoyChange: formatYoyChange(yoyChangeValue),
    yoyColor: yoyChangeValue != null
      ? (yoyChangeValue >= 0 ? '#4ade80' : '#f87171')
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Contacts Section
// ---------------------------------------------------------------------------

export interface CleanedContact {
  owner_master_full_name: string;
  owner_phone: string[];
}

/**
 * Filters, cleans, and sorts contacts for the Contacts section.
 * Prioritizes contacts with phone numbers.
 */
export function getContactsSectionData(
  contactsData: OwnerContact[] | null,
): CleanedContact[] {
  if (!contactsData) return [];

  return contactsData
    .filter(contact =>
      contact.status === 'current' &&
      contact.owner_master_full_name &&
      contact.owner_master_full_name !== 'N/A'
    )
    .map(contact => ({
      owner_master_full_name: contact.owner_master_full_name!,
      owner_phone: contact.owner_phone?.filter(phone => phone && phone !== 'N/A') || [],
    }))
    .sort((a, b) => {
      const aHasPhone = a.owner_phone.length > 0;
      const bHasPhone = b.owner_phone.length > 0;
      if (aHasPhone && !bHasPhone) return -1;
      if (!aHasPhone && bHasPhone) return 1;
      return 0;
    });
}
