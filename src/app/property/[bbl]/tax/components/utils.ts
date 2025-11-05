import type { PropertyValuation } from '@/types/valuation';
import type { TaxRow } from './taxTypes';
import { getBuildingClassDescription } from '@/constants/building';
import { resolveBuildingExtension } from '@/utils/taxCodes';
import { getTaxRate } from '@/constants/taxRates';
import { ASSESSMENT_FIELD_DESCRIPTIONS } from './const';

/**
 * Format year as "2023/24" from "2024"
 */
export function formatTaxYear(year: string | null): string {
  if (!year) return 'N/A';
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return year;
  const prevYear = yearNum - 1;
  const nextYear = yearNum % 100;
  return `${prevYear}/${nextYear.toString().padStart(2, '0')}`;
}

/**
 * Format year as "2023 - 2024" from "2024" (full year range format for assessments)
 */
export function formatAssessmentYear(year: string | null): string {
  if (!year) return 'N/A';
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return year;
  const prevYear = yearNum - 1;
  return `${prevYear} - ${yearNum}`;
}

/**
 * Calculate year over year change as decimal (0.0679 = 6.79% increase)
 */
function calculateYoyChange(currentTax: number | null, previousTax: number | null): number | null {
  if (currentTax == null || previousTax == null) return null;
  if (previousTax === 0) {
    if (currentTax === 0) return 0;
    return null;
  }
  return (currentTax - previousTax) / previousTax;
}

/**
 * Get the taxable amount from the valuation
 */
export function getTaxableAssessedValue(fintxbtot: number | null, fintxbextot: number | null): number | null {
  return fintxbtot ? fintxbtot - (fintxbextot || 0) : null;
}

/**
 * Transform PropertyValuation array to TaxRow array
 * Assumes data is already sorted by year descending
 */
export function transformValuationToTaxRows(valuations: PropertyValuation[]): TaxRow[] {
  if (!valuations || valuations.length === 0) return [];

  const rows: TaxRow[] = [];

  for (let i = 0; i < valuations.length; i++) {
    const valuation = valuations[i];

    // Use final values as they represent the actual assessed/taxable amounts
    const marketValue = valuation.finmkttot;
    const assessedValue = valuation.finacttot;
    const taxable = getTaxableAssessedValue(valuation.fintxbtot, valuation.fintxbextot);
    const taxClass = valuation.fintaxclass;
    const fiscalYear = valuation.year;

    // Get the actual tax rate from NYC tax rates and calculate base tax
    const taxRate = getTaxRate(fiscalYear, taxClass);
    const propertyTax = taxable != null && taxRate != null ? taxable * (taxRate / 100) : null;

    // Calculate year over year change
    const previousTaxable = getTaxableAssessedValue(valuation.pytxbtot, valuation.pytxbextot);
    const previousTaxClass = valuation.pytaxclass || null;
    const previousFiscalYear = valuation.year - 1;
    const previousRate = getTaxRate(previousFiscalYear, previousTaxClass);
    const previousPropertyTax = previousTaxable != null && previousRate != null ? previousTaxable * (previousRate / 100) : null;
    const yoyChange = calculateYoyChange(propertyTax, previousPropertyTax);

    rows.push({
      year: formatTaxYear(valuation.year),
      rawYear: valuation.year || '',
      marketValue,
      assessedValue,
      taxable,
      taxRate,
      propertyTax,
      yoyChange,
    });
  }

  return rows;
}

/**
 * Format property address from valuation data
 */
export function formatPropertyAddress(valuation: PropertyValuation): string {
  if (!valuation.housenum_lo || !valuation.street_name) {
    return 'N/A';
  }

  const zipCode = valuation.zip_code ? ` # ${valuation.zip_code}` : '';
  return `${valuation.housenum_lo} ${valuation.street_name}${zipCode}`;
}

/**
 * Format building class with description
 */
export function formatBuildingClass(bldgClass: string | null): string {
  if (!bldgClass) return 'N/A';
  return `${bldgClass} - ${getBuildingClassDescription(bldgClass)}`;
}

/**
 * Get assessment table rows from valuation
 */
export function getAssessmentTableRows(valuation: PropertyValuation) {
  return [
    {
      description: 'Estimated Market Value',
      landValue: valuation.finmktland,
      totalValue: valuation.finmkttot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.estimatedMarketValue,
    },
    {
      description: 'Market Assessed Value',
      landValue: valuation.finactland,
      totalValue: valuation.finacttot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.marketAssessedValue,
    },
    {
      description: 'Market Value Exemption',
      landValue: valuation.finactextot,
      totalValue: valuation.finactextot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.marketValueExemption,
    },
    {
      description: 'Transitional Assessed Value',
      landValue: valuation.fintrnland,
      totalValue: valuation.fintrntot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.transitionalAssessedValue,
    },
    {
      description: 'Transitional Value Exemption',
      landValue: valuation.fintrnextot,
      totalValue: valuation.fintrnextot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.transitionalValueExemption,
    },
  ];
}

/**
 * Format lot shape value
 */
export function formatLotShape(lotIrreg: string | null): string {
  return lotIrreg || 'Regular';
}

/**
 * Format corner value
 */
export function formatCorner(corner: string | null): string {
  return corner || 'No';
}

/**
 * Get formatted extension value
 */
export function getExtensionValue(bldExt: string | null): string {
  return resolveBuildingExtension(bldExt);
}
