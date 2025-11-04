/**
 * DOB Safety Violations Data Types
 * Based on silver.dob_safety_violation table schema (DOB NOW)
 */
export interface DobSafetyViolation {
  bin: string | null;
  violation_issue_date: string | null;
  violation_number: string | null;
  violation_type: string | null;
  violation_remarks: string | null;
  violation_status: string | null;
  device_number: string | null;
  device_type: string | null;
  cycle_end_date: string | null;
  borough: string | null;
  block: number | null;
  lot: number | null;
  house_number: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  community_board: number | null;
  council_district: number | null;
  bbl: number | null;
  census_tract_2020_: number | null;
  neighborhood_tabulation_area_nta_2020_: string | null;
  
  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

/**
 * DOB Violations Data Types (BIS)
 * Based on silver.dob_violation table schema (Buildings Information System)
 */
export interface DobViolationBIS {
  isn_dob_bis_viol: string | null;
  boro: string | null;
  bin: string | null;
  block: string | null;
  lot: string | null;
  issue_date: string | null;
  violation_type_code: string | null;
  violation_number: string | null;
  house_number: string | null;
  street: string | null;
  disposition_date: string | null;
  disposition_comments: string | null;
  device_number: string | null;
  description: string | null;
  ecb_number: string | null;
  number: string | null;
  violation_category: string | null;
  violation_type: string | null;
  
  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

