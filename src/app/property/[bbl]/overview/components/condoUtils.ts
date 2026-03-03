import { BUILDING_CLASS_CODE_MAP } from '@/constants/building';

/** Simplified building class names for condo unit context */
export const CONDO_CLASS_LABELS: Record<string, string> = {
  R0: 'Billing Lot',
  R1: 'Residential Unit',
  R2: 'Residential Unit',
  R3: 'Residential Unit',
  R4: 'Residential Unit',
  R5: 'Commercial',
  R6: 'Residential Unit',
  R7: 'Commercial Unit',
  R8: 'Commercial Unit',
  R9: 'Co-op',
  RA: 'Cultural/Medical/Educational',
  RB: 'Office',
  RG: 'Parking (Indoor)',
  RH: 'Hotel',
  RK: 'Retail',
  RP: 'Parking (Outdoor)',
  RR: 'Rental',
  RS: 'Storage',
  RT: 'Terrace/Garden/Cabana',
  RW: 'Warehouse/Industrial',
};

export function getCondoClassLabel(code: string | null | undefined): string {
  if (!code) return '';
  return CONDO_CLASS_LABELS[code] || BUILDING_CLASS_CODE_MAP[code] || code;
}
