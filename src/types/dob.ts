/**
 * DOB Violations Data Types
 * Based on silver.dob_violation table schema
 */

export interface DobViolation {
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

