/**
 * NYC Property Tax Rates by Tax Class and Fiscal Year
 * Source: NYC Department of Finance
 */

/**
 * NYC Taxable Status Date
 * The date used to determine property assessments for the fiscal year
 * Format: "Month Day"
 */
export const NYC_TAXABLE_STATUS_DATE = 'January 5';

export interface TaxRatesByClass {
  year: string;
  fiscalYear: number;
  class1: number;
  class2: number;
  class3: number;
  class4: number;
}

/**
 * Historical NYC property tax rates by tax class
 * Rates are stored as percentages (e.g., 19.843 = 19.843%)
 */
export const NYC_TAX_RATES: TaxRatesByClass[] = [
  {
    year: '2025/26',
    fiscalYear: 2026,
    class1: 19.843,
    class2: 12.439,
    class3: 11.108,
    class4: 10.848,
  },
  {
    year: '2024/25',
    fiscalYear: 2025,
    class1: 20.085,
    class2: 12.500,
    class3: 11.181,
    class4: 10.762,
  },
  {
    year: '2023/24',
    fiscalYear: 2024,
    class1: 20.085,
    class2: 12.502,
    class3: 12.094,
    class4: 10.592,
  },
  {
    year: '2022/23',
    fiscalYear: 2023,
    class1: 20.309,
    class2: 12.267,
    class3: 12.755,
    class4: 10.646,
  },
  {
    year: '2021/22',
    fiscalYear: 2022,
    class1: 19.963,
    class2: 12.235,
    class3: 12.289,
    class4: 10.755,
  },
  {
    year: '2020/21',
    fiscalYear: 2021,
    class1: 21.045,
    class2: 12.267,
    class3: 12.826,
    class4: 10.694,
  },
  {
    year: '2019/20',
    fiscalYear: 2020,
    class1: 21.167,
    class2: 12.473,
    class3: 12.536,
    class4: 10.537,
  },
];

/**
 * Get tax rate for a specific fiscal year and tax class
 */
export function getTaxRate(fiscalYear: number | string | null, taxClass: number | string | null): number | null {
  const yearNum = typeof fiscalYear === 'string' ? parseInt(fiscalYear, 10) : fiscalYear;
  const rates = NYC_TAX_RATES.find(r => r.fiscalYear === yearNum);
  if (!rates) return null;

  const classNum = typeof taxClass === 'string' ? parseInt(taxClass, 10) : taxClass;

  switch (classNum) {
    case 1:
      return rates.class1;
    case 2:
      return rates.class2;
    case 3:
      return rates.class3;
    case 4:
      return rates.class4;
    default:
      return null;
  }
}

/**
 * Get all tax rates for a specific fiscal year
 */
export function getTaxRatesForYear(fiscalYear: number): TaxRatesByClass | null {
  return NYC_TAX_RATES.find(r => r.fiscalYear === fiscalYear) || null;
}

/**
 * Get the taxable status date for a given fiscal year
 * @param year - Fiscal year (e.g., "2026" for fiscal year 2025-2026)
 * @returns Formatted taxable status date (e.g., "January 5, 2025")
 */
export function getTaxableStatusDate(year: string | null): string {
  if (!year) return 'N/A';
  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return 'N/A';
  const assessmentYear = yearNum - 1;
  return `${NYC_TAXABLE_STATUS_DATE}, ${assessmentYear}`;
}

