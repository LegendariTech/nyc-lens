import type { PropertyValuation } from '@/types/valuation';
import type { TaxRow } from './types';
import { getTaxRate } from '@/constants/taxRates';

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
  if (!currentTax || !previousTax || previousTax === 0) return null;
  return (currentTax - previousTax) / previousTax;
}

/**
 * Get the taxable amount from the valuation
 */
function getTaxable(valuation: PropertyValuation): number | null {
  return valuation.finacttot ? valuation.finacttot - (valuation.finactextot || 0) : null;
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
    const previousValuation = i < valuations.length - 1 ? valuations[i + 1] : null;

    // Use final values as they represent the actual assessed/taxable amounts
    const marketValue = valuation.finmkttot;
    const assessedValue = valuation.finacttot;
    const taxable = getTaxable(valuation);
    const taxClass = valuation.fintaxclass;
    const fiscalYear = valuation.year;

    // Get the actual tax rate from NYC tax rates and calculate base tax
    const taxRate = getTaxRate(fiscalYear, taxClass);
    const propertyTax = taxable && taxRate ? taxable * (taxRate / 100) : null;

    // Calculate year over year change
    const previousTaxable = previousValuation ? getTaxable(previousValuation) : null;
    const previousTaxClass = previousValuation?.fintaxclass || null;
    const previousFiscalYear = previousValuation?.year || null;
    const previousRate = getTaxRate(previousFiscalYear, previousTaxClass);
    const previousPropertyTax = previousTaxable && previousRate ? previousTaxable * (previousRate / 100) : null;
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

