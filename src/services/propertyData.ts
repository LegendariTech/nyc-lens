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
async function fetchPlutoData(bbl: string): Promise<PropertyDataResult> {
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
 * Format a value based on its metadata
 */
export function formatValue(
  value: string | number | boolean | null,
  column?: PlutoColumn
): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle numeric values with formatting
  if (typeof value === 'number' && column?.format?.noCommas !== 'true') {
    return value.toLocaleString();
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
  }>;
}

export function groupPlutoData(
  data: PlutoData | null,
  metadata: PlutoMetadata | null
): PlutoSection[] {
  if (!data) return [];

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
      ],
    },
    {
      title: 'Building Information',
      fields: [
        { label: 'Building Class', fieldName: 'bldgclass', value: data.bldgclass },
        { label: 'Year Built', fieldName: 'yearbuilt', value: data.yearbuilt },
        { label: 'Number of Buildings', fieldName: 'numbldgs', value: data.numbldgs },
        { label: 'Number of Floors', fieldName: 'numfloors', value: data.numfloors },
        { label: 'Building Area (sq ft)', fieldName: 'bldgarea', value: data.bldgarea },
        { label: 'Residential Units', fieldName: 'unitsres', value: data.unitsres },
        { label: 'Total Units', fieldName: 'unitstotal', value: data.unitstotal },
      ],
    },
    {
      title: 'Land Use & Zoning',
      fields: [
        { label: 'Land Use', fieldName: 'landuse', value: data.landuse },
        { label: 'Zoning District 1', fieldName: 'zonedist1', value: data.zonedist1 },
        { label: 'Zoning District 2', fieldName: 'zonedist2', value: data.zonedist2 },
        { label: 'Commercial Overlay 1', fieldName: 'overlay1', value: data.overlay1 },
        { label: 'Special District 1', fieldName: 'spdist1', value: data.spdist1 },
        { label: 'Split Zone', fieldName: 'splitzone', value: data.splitzone },
      ],
    },
    {
      title: 'Area Breakdown',
      fields: [
        { label: 'Lot Area (sq ft)', fieldName: 'lotarea', value: data.lotarea },
        { label: 'Commercial Area (sq ft)', fieldName: 'comarea', value: data.comarea },
        { label: 'Residential Area (sq ft)', fieldName: 'resarea', value: data.resarea },
        { label: 'Office Area (sq ft)', fieldName: 'officearea', value: data.officearea },
        { label: 'Retail Area (sq ft)', fieldName: 'retailarea', value: data.retailarea },
        { label: 'Garage Area (sq ft)', fieldName: 'garagearea', value: data.garagearea },
        { label: 'Storage Area (sq ft)', fieldName: 'strgearea', value: data.strgearea },
        { label: 'Factory Area (sq ft)', fieldName: 'factryarea', value: data.factryarea },
      ],
    },
    {
      title: 'Ownership & Assessment',
      fields: [
        { label: 'Owner Name', fieldName: 'ownername', value: data.ownername },
        { label: 'Owner Type', fieldName: 'ownertype', value: data.ownertype },
        { label: 'Assessed Land Value', fieldName: 'assessland', value: data.assessland },
        { label: 'Total Assessed Value', fieldName: 'assesstot', value: data.assesstot },
        { label: 'Exempt Total', fieldName: 'exempttot', value: data.exempttot },
      ],
    },
    {
      title: 'Floor Area Ratio (FAR)',
      fields: [
        { label: 'Built FAR', fieldName: 'builtfar', value: data.builtfar },
        { label: 'Residential FAR', fieldName: 'residfar', value: data.residfar },
        { label: 'Commercial FAR', fieldName: 'commfar', value: data.commfar },
        { label: 'Facility FAR', fieldName: 'facilfar', value: data.facilfar },
      ],
    },
    {
      title: 'Geographic & Administrative',
      fields: [
        { label: 'Community District', fieldName: 'cd', value: data.cd },
        { label: 'Council District', fieldName: 'council', value: data.council },
        { label: 'Census Tract 2010', fieldName: 'ct2010', value: data.ct2010 },
        { label: 'School District', fieldName: 'schooldist', value: data.schooldist },
        { label: 'Police Precinct', fieldName: 'policeprct', value: data.policeprct },
        { label: 'Fire Company', fieldName: 'firecomp', value: data.firecomp },
        { label: 'Health Area', fieldName: 'healtharea', value: data.healtharea },
      ],
    },
    {
      title: 'Coordinates',
      fields: [
        { label: 'Latitude', fieldName: 'latitude', value: data.latitude },
        { label: 'Longitude', fieldName: 'longitude', value: data.longitude },
        { label: 'X Coordinate', fieldName: 'xcoord', value: data.xcoord },
        { label: 'Y Coordinate', fieldName: 'ycoord', value: data.ycoord },
      ],
    },
    {
      title: 'Historic & Landmark',
      fields: [
        { label: 'Historic District', fieldName: 'histdist', value: data.histdist },
        { label: 'Landmark', fieldName: 'landmark', value: data.landmark },
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

