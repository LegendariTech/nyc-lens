import type { PropertyValuation } from '@/types/valuation';
import { getBuildingClassDescription } from '@/constants/building';
import { resolveBuildingExtension } from '@/utils/taxCodes';
import { ASSESSMENT_FIELD_DESCRIPTIONS } from './assessmentFieldDescriptions';

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
 * Calculate taxable assessed value
 */
export function getTaxableAssessedValue(valuation: PropertyValuation): number | null {
  return valuation.fintxbtot ? valuation.fintxbtot - (valuation.fintxbextot || 0) : null;
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

