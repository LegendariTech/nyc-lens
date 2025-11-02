/**
 * Tax table row data
 */
export interface TaxRow {
  // Display fields
  year: string; // e.g. "2024/25"
  marketValue: number | null;
  assessedValue: number | null;
  taxable: number | null;
  taxRate: number | null; // as percentage
  propertyTax: number | null;
  yoyChange: number | null; // as decimal (0.0679 = 6.79%)

  // Raw year for sorting
  rawYear: string;
}

