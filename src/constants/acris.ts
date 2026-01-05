/**
 * ACRIS (Automated City Register Information System) Control Codes
 * Document type descriptions and party type mappings for NYC property records
 */

import acrisControlCodeData from './acris_control_code.json';

export interface AcrisControlCode {
  'RECORD TYPE': string;
  'DOC. TYPE': string;
  'DOC. TYPE DESCRIPTION': string;
  'CLASS CODE DESCRIPTION': string;
  'PARTY1 TYPE': string | null;
  'PARTY2 TYPE': string | null;
  'PARTY3 TYPE': string | null;
}

export const ACRIS_CONTROL_CODES = acrisControlCodeData as AcrisControlCode[];

