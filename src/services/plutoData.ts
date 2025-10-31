import { LAND_USE_CODES, BOROUGH_CODES, BUILDING_CLASS_CATEGORIES } from '@/types/pluto';
import type { DatasourceMetadata } from './propertyData';

export interface PlutoData {
  [key: string]: string | number | boolean | null;
}

export interface PlutoDataResult {
  data: PlutoData | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Fetch PLUTO data for a specific property
 */
export async function fetchPlutoData(bbl: string): Promise<PlutoDataResult> {
  try {
    // Using static sample data for testing purposes
    // The data is located at a fixed path: /app/property/[bbl]/data/pluto/
    // In production, this would fetch from an API based on the BBL parameter
    const dataModule = await import('@/app/property/[bbl]/data/pluto/data.json');
    const metadataModule = await import('@/app/property/[bbl]/components/PlutoTab/metadata.json');

    const data = dataModule.default[0] as PlutoData;
    const metadata = metadataModule.default as DatasourceMetadata;

    return {
      data,
      metadata,
    };
  } catch {
    return {
      data: null,
      metadata: null,
      error: `Failed to load PLUTO data for BBL ${bbl}`,
    };
  }
}

/**
 * Get human-readable land use description
 */
export function getLandUseDescription(landUseCode: number): string {
  return LAND_USE_CODES[landUseCode] || `Unknown (${landUseCode})`;
}

/**
 * Get borough name from code
 */
export function getBoroughName(boroughCode: string): string {
  return BOROUGH_CODES[boroughCode] || boroughCode;
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

  const boroughNames: Record<number, string> = {
    1: 'Manhattan',
    2: 'Bronx',
    3: 'Brooklyn',
    4: 'Queens',
    5: 'Staten Island',
  };

  const boroughName = boroughNames[boroughCode] || 'Unknown Borough';
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

  const boroughSlugs: Record<number, string> = {
    1: 'manhattan',
    2: 'bronx',
    3: 'brooklyn',
    4: 'queens',
    5: 'staten-island',
  };

  const boroughSlug = boroughSlugs[boroughCode];
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
        // R1-1, R1-2, R1-2A (and any R1 sub-district)
        anchor = '#R1';
      } else if (districtNum === 2) {
        // R2, R2A, R2X
        anchor = '#R2-R2A-R2X';
      } else if (districtNum === 3) {
        // R3-1, R3-2, R3A, R3X
        anchor = '#R3-1-R3-2-R3A-R3X';
      } else if (districtNum === 4) {
        // R4, R4 Infill, R4-1, R4A, R4B
        anchor = '#R4-R4Infill-R4-1-R4A-R4B';
      } else if (districtNum === 5) {
        // R5, R5 Infill, R5A, R5B, R5D
        anchor = '#R5-R5Infill-R5A-R5B-R5D';
      } else if (districtNum === 6) {
        // R6, R6A, R6B
        anchor = '#R6-R6A-R6B';
      } else if (districtNum === 7) {
        // R7, R7A, R7B, R7D, R7X
        anchor = '#R7-R7A-R7B-R7D-R7X';
      } else if (districtNum === 8) {
        // R8, R8A, R8B, R8X
        anchor = '#R8-R8A-R8B-R8X';
      } else if (districtNum === 9) {
        // R9, R9A, R9D, R9X
        anchor = '#R9-R9A-R9D-R9X';
      } else if (districtNum === 10) {
        // R10, R10A, R10X
        anchor = '#R10-R10A-R10X';
      } else {
        // Default for unknown R districts
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
            // C1-6 to C1-9 or C2-6 to C2-8
            anchor = '#C1-C2';
          } else {
            anchor = '#C1-C2';
          }
        } else {
          anchor = '#C1-C2';
        }
      } else if (districtNum === 3) {
        // C3 and C3A - waterfront recreational
        anchor = '#C3-C3A';
      } else if (districtNum === 4) {
        // C4 districts (all variants)
        anchor = '#C4';
      } else if (districtNum === 5) {
        // C5 districts (all variants)
        anchor = '#C5';
      } else if (districtNum === 6) {
        // C6 districts (all variants)
        anchor = '#C6';
      } else if (districtNum === 7) {
        // C7 - amusement parks
        anchor = '#C7';
      } else if (districtNum === 8) {
        // C8 districts (C8-1 to C8-4)
        anchor = '#C8';
      } else {
        // Default for unknown C districts
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

      // Map to the appropriate anchor based on district number
      // M1-1 through M1-6 (including special sub-districts like M1-5M, M1-6M)
      if (districtNum === 1) {
        anchor = '#M1';
      }
      // M2-1 through M2-4
      else if (districtNum === 2) {
        anchor = '#M2';
      }
      // M3-1 and M3-2
      else if (districtNum === 3) {
        anchor = '#M3';
      }
    }
  } else {
    // Unknown district type, return null
    return null;
  }

  return baseUrl + anchor;
}

/**
 * Get building class category description
 */
export function getBuildingClassCategory(buildingClass: string): string {
  if (!buildingClass) return 'Unknown';
  const category = buildingClass.charAt(0).toUpperCase();
  return BUILDING_CLASS_CATEGORIES[category] || 'Unknown';
}

