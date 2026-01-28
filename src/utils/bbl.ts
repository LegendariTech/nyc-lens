/**
 * BBL (Borough-Block-Lot) utility functions
 * Handles conversion between different BBL formats used in the application
 */

/**
 * Converts BBL from URL format (4-476-1) to SBL format used in Mapbox tileset (4004760001)
 * @param bbl - BBL in format "borough-block-lot" (e.g., "4-476-1")
 * @returns SBL string with format: borough(1 digit) + block(5 digits with leading zeros) + lot(4 digits with leading zeros)
 * @example
 * bblToSbl("4-476-1") // returns "4004760001"
 * bblToSbl("1-1-1") // returns "1000010001"
 */
export function bblToSbl(bbl: string): string {
  const parts = bbl.split('-');
  if (parts.length !== 3) {
    throw new Error(`Invalid BBL format: ${bbl}. Expected format: borough-block-lot`);
  }

  const [borough, block, lot] = parts;

  // Borough: 1 digit
  // Block: 5 digits with leading zeros
  // Lot: 4 digits with leading zeros
  return borough + block.padStart(5, '0') + lot.padStart(4, '0');
}

/**
 * Converts SBL from Mapbox tileset format (4004760001) to URL format (4-476-1)
 * @param sbl - SBL string with 10 digits
 * @returns BBL in format "borough-block-lot"
 * @example
 * sblToBbl("4004760001") // returns "4-476-1"
 * sblToBbl("1000010001") // returns "1-1-1"
 */
export function sblToBbl(sbl: string): string {
  if (sbl.length !== 10) {
    throw new Error(`Invalid SBL format: ${sbl}. Expected 10 digits`);
  }

  const borough = sbl.substring(0, 1);
  const block = parseInt(sbl.substring(1, 6), 10).toString();
  const lot = parseInt(sbl.substring(6, 10), 10).toString();

  return `${borough}-${block}-${lot}`;
}
