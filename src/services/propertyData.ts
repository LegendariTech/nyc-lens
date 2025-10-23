export interface PlutoColumn {
  id: number;
  name: string;
  dataTypeName: string;
  description: string;
  fieldName: string;
  position: number;
  renderTypeName: string;
  tableColumnId: number;
  format?: Record<string, string | undefined>;
}

export interface PlutoMetadata {
  id: string;
  name: string;
  description: string;
  attribution: string;
  attributionLink: string;
  rowsUpdatedAt?: number; // Unix timestamp
  viewLastModified?: number; // Unix timestamp
  columns: PlutoColumn[];
}

import { LAND_USE_CODES, BOROUGH_CODES, BUILDING_CLASS_CATEGORIES } from '@/types/pluto';

export interface PlutoData {
  [key: string]: string | number | boolean | null;
}

export interface PropertyDataResult {
  data: PlutoData | null;
  metadata: PlutoMetadata | null;
  error?: string;
}

/**
 * Fetch property data from different sources
 * @param bbl - Borough-Block-Lot identifier (e.g., "1-13-1")
 * @param source - Data source ('pluto', 'dob', 'hpd')
 */
export async function usePropertyData(
  bbl: string,
  source: 'pluto' | 'dob' | 'hpd'
): Promise<PropertyDataResult> {
  try {
    if (source === 'pluto') {
      return await fetchPlutoData(bbl);
    }

    // TODO: Implement other sources
    return {
      data: null,
      metadata: null,
      error: `Source "${source}" not yet implemented`,
    };
  } catch (error) {
    return {
      data: null,
      metadata: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch PLUTO data for a specific property
 */
export async function fetchPlutoData(bbl: string): Promise<PropertyDataResult> {
  try {
    // Using static sample data for testing purposes
    // The data is located at a fixed path: /app/property/[bbl]/data/pluto/
    // In production, this would fetch from an API based on the BBL parameter
    const dataModule = await import('@/app/property/[bbl]/data/pluto/data.json');
    const metadataModule = await import('@/app/property/[bbl]/data/pluto/metadata.json');

    const data = dataModule.default[0] as PlutoData;
    const metadata = metadataModule.default as PlutoMetadata;

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
 * Get metadata for a specific field
 */
export function getFieldMetadata(
  metadata: PlutoMetadata | null,
  fieldName: string
): PlutoColumn | undefined {
  return metadata?.columns.find((col) => col.fieldName === fieldName);
}

/**
 * Format a value based on its metadata and field format
 */
export function formatValue(
  value: string | number | boolean | null,
  column?: PlutoColumn,
  fieldFormat?: 'currency' | 'number' | 'percentage'
): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle numeric values with formatting
  if (typeof value === 'number') {
    // Check for currency formatting first
    if (fieldFormat === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // Check for number formatting
    if (fieldFormat === 'number') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Check if the column has a format specification
    if (column?.format?.noCommas === 'true') {
      return value.toString();
    }
    return value.toLocaleString();
  }

  // Handle string values that should be formatted as currency
  if (typeof value === 'string' && fieldFormat === 'currency') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
  }

  // Handle string values that should be formatted as numbers
  if (typeof value === 'string' && fieldFormat === 'number') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numericValue);
    }
  }

  return String(value);
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

/**
 * Format Unix timestamp to readable date
 */
export function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) return 'Unknown';

  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Group PLUTO fields into logical sections for display
 */
export interface PlutoSection {
  title: string;
  fields: Array<{
    label: string;
    fieldName: string;
    value: string | number | boolean | null;
    description?: string;
    format?: 'currency' | 'number' | 'percentage';
    link?: string;
  }>;
}

export function groupPlutoData(
  data: PlutoData | null,
  metadata: PlutoMetadata | null
): PlutoSection[] {
  if (!data) return [];

  // Create sections with balanced heights
  const sections: PlutoSection[] = [
    {
      title: 'Basic Information',
      fields: [
        { label: 'Address', fieldName: 'address', value: data.address },
        { label: 'Borough', fieldName: 'borough', value: data.borough },
        { label: 'Block', fieldName: 'block', value: data.block },
        { label: 'Lot', fieldName: 'lot', value: data.lot },
        { label: 'BBL', fieldName: 'bbl', value: data.bbl },
        { label: 'ZIP Code', fieldName: 'zipcode', value: data.zipcode },
        { label: 'Borough Code', fieldName: 'borocode', value: data.borocode },
        { label: 'Condominium Number', fieldName: 'condono', value: data.condono },
      ],
    },
    {
      title: 'Building Information',
      fields: [
        { label: 'Building Class', fieldName: 'bldgclass', value: data.bldgclass },
        { label: 'Year Built', fieldName: 'yearbuilt', value: data.yearbuilt },
        { label: 'Year Altered 1', fieldName: 'yearalter1', value: data.yearalter1 },
        { label: 'Year Altered 2', fieldName: 'yearalter2', value: data.yearalter2 },
        { label: 'Number of Buildings', fieldName: 'numbldgs', value: data.numbldgs },
        { label: 'Number of Floors', fieldName: 'numfloors', value: data.numfloors, format: 'number' },
        { label: 'Building Area (sq ft)', fieldName: 'bldgarea', value: data.bldgarea, format: 'number' },
        { label: 'Residential Units', fieldName: 'unitsres', value: data.unitsres },
        { label: 'Total Units', fieldName: 'unitstotal', value: data.unitstotal },
        { label: 'Extension', fieldName: 'ext', value: data.ext },
        { label: 'Basement Code', fieldName: 'bsmtcode', value: data.bsmtcode },
      ],
    },
    {
      title: 'Geographic & Administrative',
      fields: [
        { label: 'Community District', fieldName: 'cd', value: data.cd, link: getCommunityDistrictUrl(data.cd as number) || undefined },
        { label: 'Council District', fieldName: 'council', value: data.council, link: getCouncilDistrictUrl(data.council as number) || undefined },
        { label: 'Census Tract 2010', fieldName: 'ct2010', value: data.ct2010 },
        { label: 'Census Block 2010', fieldName: 'cb2010', value: data.cb2010 },
        { label: 'Census Tract 2020', fieldName: 'tract2010', value: data.tract2010 },
        { label: 'School District', fieldName: 'schooldist', value: data.schooldist },
        { label: 'Police Precinct', fieldName: 'policeprct', value: data.policeprct },
        { label: 'Fire Company', fieldName: 'firecomp', value: data.firecomp },
        { label: 'Health Area', fieldName: 'healtharea', value: data.healtharea },
        { label: 'Health Center District', fieldName: 'healthcenterdistrict', value: data.healthcenterdistrict },
        { label: 'Sanitation Borough', fieldName: 'sanitboro', value: data.sanitboro },
        { label: 'Sanitation Subsection', fieldName: 'sanitsub', value: data.sanitsub },
        { label: 'Sanitation District', fieldName: 'sanitdistrict', value: data.sanitdistrict },
      ],
    },
    {
      title: 'Area Breakdown',
      fields: [
        { label: 'Lot Area (sq ft)', fieldName: 'lotarea', value: data.lotarea, format: 'number' },
        { label: 'Lot Frontage', fieldName: 'lotfront', value: data.lotfront, format: 'number' },
        { label: 'Lot Depth', fieldName: 'lotdepth', value: data.lotdepth, format: 'number' },
        { label: 'Building Frontage', fieldName: 'bldgfront', value: data.bldgfront, format: 'number' },
        { label: 'Building Depth', fieldName: 'bldgdepth', value: data.bldgdepth, format: 'number' },
        { label: 'Commercial Area (sq ft)', fieldName: 'comarea', value: data.comarea, format: 'number' },
        { label: 'Residential Area (sq ft)', fieldName: 'resarea', value: data.resarea, format: 'number' },
        { label: 'Office Area (sq ft)', fieldName: 'officearea', value: data.officearea, format: 'number' },
        { label: 'Retail Area (sq ft)', fieldName: 'retailarea', value: data.retailarea, format: 'number' },
        { label: 'Garage Area (sq ft)', fieldName: 'garagearea', value: data.garagearea, format: 'number' },
        { label: 'Storage Area (sq ft)', fieldName: 'strgearea', value: data.strgearea, format: 'number' },
        { label: 'Factory Area (sq ft)', fieldName: 'factryarea', value: data.factryarea, format: 'number' },
        { label: 'Other Area (sq ft)', fieldName: 'otherarea', value: data.otherarea, format: 'number' },
        { label: 'Area Source', fieldName: 'areasource', value: data.areasource },
      ],
    },
    {
      title: 'Ownership & Assessment',
      fields: [
        { label: 'Owner Name', fieldName: 'ownername', value: data.ownername },
        { label: 'Owner Type', fieldName: 'ownertype', value: data.ownertype },
        { label: 'Assessed Land Value', fieldName: 'assessland', value: data.assessland, format: 'currency' },
        { label: 'Total Assessed Value', fieldName: 'assesstot', value: data.assesstot, format: 'currency' },
        { label: 'Exempt Total', fieldName: 'exempttot', value: data.exempttot, format: 'currency' },
        { label: 'Easements', fieldName: 'easements', value: data.easements },
      ],
    },
    {
      title: 'Floor Area Ratio (FAR)',
      fields: [
        { label: 'Built FAR', fieldName: 'builtfar', value: data.builtfar, format: 'number' },
        { label: 'Residential FAR', fieldName: 'residfar', value: data.residfar, format: 'number' },
        { label: 'Commercial FAR', fieldName: 'commfar', value: data.commfar, format: 'number' },
        { label: 'Facility FAR', fieldName: 'facilfar', value: data.facilfar, format: 'number' },
      ],
    },
    {
      title: 'Land Use & Zoning',
      fields: [
        { label: 'Land Use', fieldName: 'landuse', value: data.landuse },
        { label: 'Zoning District 1', fieldName: 'zonedist1', value: data.zonedist1, link: getZoningDistrictUrl(data.zonedist1 as string) || undefined },
        { label: 'Zoning District 2', fieldName: 'zonedist2', value: data.zonedist2, link: getZoningDistrictUrl(data.zonedist2 as string) || undefined },
        { label: 'Zoning District 3', fieldName: 'zonedist3', value: data.zonedist3, link: getZoningDistrictUrl(data.zonedist3 as string) || undefined },
        { label: 'Zoning District 4', fieldName: 'zonedist4', value: data.zonedist4, link: getZoningDistrictUrl(data.zonedist4 as string) || undefined },
        { label: 'Commercial Overlay 1', fieldName: 'overlay1', value: data.overlay1 },
        { label: 'Commercial Overlay 2', fieldName: 'overlay2', value: data.overlay2 },
        { label: 'Special District 1', fieldName: 'spdist1', value: data.spdist1 },
        { label: 'Special District 2', fieldName: 'spdist2', value: data.spdist2 },
        { label: 'Special District 3', fieldName: 'spdist3', value: data.spdist3 },
        { label: 'Limited Height District', fieldName: 'ltdheight', value: data.ltdheight },
        { label: 'Split Zone', fieldName: 'splitzone', value: data.splitzone },
        { label: 'Zoning Map', fieldName: 'zonemap', value: data.zonemap },
        { label: 'Zoning Map Code', fieldName: 'zmcode', value: data.zmcode },
      ],
    },
    {
      title: 'Administrative Dates',
      fields: [
        { label: 'RPAD Date', fieldName: 'rpaddate', value: data.rpaddate },
        { label: 'DCAS Date', fieldName: 'dcasdate', value: data.dcasdate },
        { label: 'Zoning Date', fieldName: 'zoningdate', value: data.zoningdate },
        { label: 'Landmark Date', fieldName: 'landmkdate', value: data.landmkdate },
        { label: 'Basement Date', fieldName: 'basempdate', value: data.basempdate },
        { label: 'MAS Date', fieldName: 'masdate', value: data.masdate },
        { label: 'Police Date', fieldName: 'polidate', value: data.polidate },
        { label: 'Edition Designation Date', fieldName: 'edesigdate', value: data.edesigdate },
      ],
    },
    {
      title: 'Historic & Landmark',
      fields: [
        { label: 'Historic District', fieldName: 'histdist', value: data.histdist },
        { label: 'Landmark', fieldName: 'landmark', value: data.landmark },
      ],
    },
    {
      title: 'Census 2020',
      fields: [
        { label: 'Block Census Tract 2020', fieldName: 'bct2020', value: data.bct2020 },
        { label: 'Block Census Tract/Census Block 2020', fieldName: 'bctcb2020', value: data.bctcb2020 },
      ],
    },
  ];

  // Add descriptions from metadata if available
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const columnMetadata = getFieldMetadata(metadata, field.fieldName);
      if (columnMetadata) {
        field.description = columnMetadata.description;
      }
    });
  });

  return sections;
}

