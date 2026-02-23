/**
 * NYC Geography Constants
 * Comprehensive mappings for NYC boroughs and districts
 */

/**
 * Borough names mapped by all common code formats
 */
const boroughMap: Record<string, string> = {
  // Numeric string keys (ACRIS filters)
  '1': 'Manhattan',
  '2': 'Bronx',
  '3': 'Brooklyn',
  '4': 'Queens',
  '5': 'Staten Island',

  // Letter codes (PLUTO format)
  'MN': 'Manhattan',
  'BX': 'Bronx',
  'BK': 'Brooklyn',
  'QN': 'Queens',
  'SI': 'Staten Island',
};

/**
 * Borough names - accepts string or number keys
 * Handles all formats: numeric (1-5), string ('1'-'5'), letter codes ('MN', 'BX', etc.)
 */
export const BOROUGH_NAMES = new Proxy(boroughMap, {
  get: (target, prop: string | symbol) => {
    if (typeof prop === 'symbol') return undefined;
    // Convert numbers to strings for lookup
    const key = String(prop);
    return target[key];
  }
}) as Record<string | number, string>;

/**
 * Borough slugs for URL generation
 */
export const BOROUGH_SLUGS: Record<number, string> = {
  1: 'manhattan',
  2: 'bronx',
  3: 'brooklyn',
  4: 'queens',
  5: 'staten-island',
};

/**
 * Borough filter values for AG Grid filters (ACRIS format)
 */
export const BOROUGH_FILTER_VALUES = ['1', '2', '3', '4', '5'];

/**
 * Get borough name from any code format
 */
export function getBoroughName(code: string | number): string {
  return BOROUGH_NAMES[code] || String(code);
}

/**
 * Get borough name for display in titles and addresses (Manhattan → "New York")
 */
export function getBoroughDisplayName(code: string | number): string {
  const name = getBoroughName(code);
  return name === 'Manhattan' ? 'New York' : name;
}

/**
 * Get borough slug for URL generation
 */
export function getBoroughSlug(boroughCode: number): string | null {
  return BOROUGH_SLUGS[boroughCode] || null;
}

/**
 * Get community district description from code
 * @param cdCode - 3-digit code where first digit is borough (1-5) and last two digits are district (01-99)
 * @example getCommunityDistrictName(101) => "Manhattan Community District 1"
 */
export function getCommunityDistrictName(cdCode: number): string {
  if (!cdCode) return 'Unknown';

  const cdString = cdCode.toString();
  if (cdString.length !== 3) return `Community District ${cdCode}`;

  const boroughCode = parseInt(cdString.charAt(0));
  const districtNumber = parseInt(cdString.substring(1));

  const boroughName = getBoroughName(boroughCode);
  return `${boroughName} Community District ${districtNumber}`;
}

/**
 * Get community district profile URL
 * @param cdCode - 3-digit code where first digit is borough (1-5) and last two digits are district (01-99)
 * @example getCommunityDistrictUrl(101) => "https://communityprofiles.planning.nyc.gov/manhattan/1"
 */
export function getCommunityDistrictUrl(cdCode: number): string | null {
  if (!cdCode) return null;

  const cdString = cdCode.toString();
  if (cdString.length !== 3) return null;

  const boroughCode = parseInt(cdString.charAt(0));
  const districtNumber = parseInt(cdString.substring(1));

  const boroughSlug = getBoroughSlug(boroughCode);
  if (!boroughSlug) return null;

  return `https://communityprofiles.planning.nyc.gov/${boroughSlug}/${districtNumber}`;
}

/**
 * Get council district URL
 * @param councilDistrict - Council district number (1-51)
 * @example getCouncilDistrictUrl(1) => "https://council.nyc.gov/district-1/"
 */
export function getCouncilDistrictUrl(councilDistrict: number): string | null {
  if (!councilDistrict || councilDistrict < 1 || councilDistrict > 51) return null;

  return `https://council.nyc.gov/district-${councilDistrict}/`;
}

/**
 * Get zoning district URL with appropriate anchor
 * @param zoningDistrict - Zoning district code (e.g., "C5-5", "R7A", "M1-1")
 * @returns URL to NYC Planning zoning districts guide with anchor
 * @example getZoningDistrictUrl("C5-5") => "https://www.nyc.gov/content/planning/pages/zoning/zoning-districts-guide/commercial-districts/#C5-C6"
 * @example getZoningDistrictUrl("R7A") => "https://www.nyc.gov/content/planning/pages/zoning/zoning-districts-guide/residence-districts/#R6-R10"
 */
export function getZoningDistrictUrl(zoningDistrict: string | null): string | null {
  if (!zoningDistrict || typeof zoningDistrict !== 'string') return null;

  // Clean the zoning district string (remove spaces, convert to uppercase)
  const cleanZone = zoningDistrict.trim().toUpperCase();

  // Determine the district type based on the first character
  const firstChar = cleanZone.charAt(0);

  let baseUrl = 'https://www.nyc.gov/content/planning/pages/zoning/zoning-districts-guide';
  let anchor = '';

  if (firstChar === 'R') {
    // Residential districts
    baseUrl += '/residence-districts';

    // Extract the district number and suffix (e.g., "R7A" -> district=7, suffix="A")
    const match = cleanZone.match(/^R(\d+)(.*)$/);
    if (match) {
      const districtNum = parseInt(match[1]);

      // Map to the appropriate anchor based on specific district rules
      if (districtNum === 1) {
        anchor = '#R1';
      } else if (districtNum === 2) {
        anchor = '#R2-R2A-R2X';
      } else if (districtNum === 3) {
        anchor = '#R3-1-R3-2-R3A-R3X';
      } else if (districtNum === 4) {
        anchor = '#R4-R4Infill-R4-1-R4A-R4B';
      } else if (districtNum === 5) {
        anchor = '#R5-R5Infill-R5A-R5B-R5D';
      } else if (districtNum === 6) {
        anchor = '#R6-R6A-R6B';
      } else if (districtNum === 7) {
        anchor = '#R7-R7A-R7B-R7D-R7X';
      } else if (districtNum === 8) {
        anchor = '#R8-R8A-R8B-R8X';
      } else if (districtNum === 9) {
        anchor = '#R9-R9A-R9D-R9X';
      } else if (districtNum === 10) {
        anchor = '#R10-R10A-R10X';
      } else {
        anchor = '#R6-R6A-R6B';
      }
    }
  } else if (firstChar === 'C') {
    // Commercial districts
    baseUrl += '/commercial-districts';

    // Parse the district number and suffix (e.g., "C5-5" -> district=5, suffix="-5")
    const match = cleanZone.match(/^C(\d+)(.*)$/);
    if (match) {
      const districtNum = parseInt(match[1]);
      const suffix = match[2]; // e.g., "-5", "A", "-2A", etc.

      // Map to the appropriate anchor based on specific rules
      if (districtNum === 1 || districtNum === 2) {
        // Check if it's an overlay (C1-1 to C1-5 or C2-1 to C2-5)
        const subDistrictMatch = suffix.match(/^-(\d+)/);
        if (subDistrictMatch) {
          const subDistrict = parseInt(subDistrictMatch[1]);
          if (subDistrict >= 1 && subDistrict <= 5) {
            anchor = '#C1-C2-overlays';
          } else if (subDistrict >= 6 && subDistrict <= 9) {
            anchor = '#C1-C2';
          } else {
            anchor = '#C1-C2';
          }
        } else {
          anchor = '#C1-C2';
        }
      } else if (districtNum === 3) {
        anchor = '#C3-C3A';
      } else if (districtNum === 4) {
        anchor = '#C4';
      } else if (districtNum === 5) {
        anchor = '#C5';
      } else if (districtNum === 6) {
        anchor = '#C6';
      } else if (districtNum === 7) {
        anchor = '#C7';
      } else if (districtNum === 8) {
        anchor = '#C8';
      } else {
        anchor = '#C1-C2';
      }
    }
  } else if (firstChar === 'M') {
    // Manufacturing districts
    baseUrl += '/manufacturing-districts';

    // Extract the district number (e.g., "M1-1" -> 1, "M2-1" -> 2, "M1-5M" -> 1)
    const match = cleanZone.match(/^M(\d+)/);
    if (match) {
      const districtNum = parseInt(match[1]);

      if (districtNum === 1) {
        anchor = '#M1';
      } else if (districtNum === 2) {
        anchor = '#M2';
      } else if (districtNum === 3) {
        anchor = '#M3';
      }
    }
  } else {
    // Unknown district type, return null
    return null;
  }

  return baseUrl + anchor;
}


