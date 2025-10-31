/**
 * NYC Land Use Classifications
 * Primary land use categories for NYC property records
 */

/**
 * Land Use codes from PLUTO data
 */
export const LAND_USE_CODES: Record<number, string> = {
  1: 'One & Two Family Buildings',
  2: 'Multi-Family Walk-Up Buildings',
  3: 'Multi-Family Elevator Buildings',
  4: 'Mixed Residential & Commercial Buildings',
  5: 'Commercial & Office Buildings',
  6: 'Industrial & Manufacturing',
  7: 'Transportation & Utility',
  8: 'Public Facilities & Institutions',
  9: 'Open Space & Outdoor Recreation',
  10: 'Parking Facilities',
  11: 'Vacant Land',
};

/**
 * Get human-readable land use description
 * @param landUseCode - Numeric land use code (1-11)
 * @returns Description of the land use category
 */
export function getLandUseDescription(landUseCode: number): string {
  return LAND_USE_CODES[landUseCode] || `Unknown (${landUseCode})`;
}


