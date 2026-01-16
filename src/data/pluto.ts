import type { DatasourceMetadata } from '@/app/property/[bbl]/utils/datasourceDisplay';
import { queryOne } from './db';


export interface PlutoData extends Record<string, unknown> {
  borough: string | null;
  block: string | null;
  lot: string | null;
  cd: number | null;
  ct2010: number | null;
  cb2010: number | null;
  schooldist: number | null;
  council: number | null;
  zipcode: string | null;
  firecomp: string | null;
  policeprct: number | null;
  healtharea: number | null;
  sanitboro: number | null;
  sanitsub: string | null;
  address: string | null;
  zonedist1: string | null;
  zonedist2: string | null;
  zonedist3: string | null;
  zonedist4: string | null;
  overlay1: string | null;
  overlay2: string | null;
  spdist1: string | null;
  spdist2: string | null;
  spdist3: string | null;
  ltdheight: string | null;
  splitzone: boolean | null;
  bldgclass: string | null;
  landuse: number | null;
  easements: number | null;
  ownertype: string | null;
  ownername: string | null;
  lotarea: string | null;
  bldgarea: string | null;
  comarea: string | null;
  resarea: string | null;
  officearea: string | null;
  retailarea: string | null;
  garagearea: string | null;
  strgearea: string | null;
  factryarea: string | null;
  otherarea: string | null;
  areasource: number | null;
  numbldgs: number | null;
  numfloors: string | null;
  unitsres: number | null;
  unitstotal: number | null;
  lotfront: string | null;
  lotdepth: string | null;
  bldgfront: string | null;
  bldgdepth: string | null;
  ext: string | null;
  proxcode: number | null;
  irrlotcode: boolean | null;
  lottype: number | null;
  bsmtcode: number | null;
  assessland: string | null;
  assesstot: string | null;
  exempttot: string | null;
  yearbuilt: number | null;
  yearalter1: number | null;
  yearalter2: number | null;
  histdist: string | null;
  landmark: string | null;
  builtfar: string | null;
  residfar: string | null;
  commfar: string | null;
  facilfar: string | null;
  borocode: number | null;
  bbl: string | null;
  condono: number | null;
  tract2010: number | null;
  xcoord: string | null;
  ycoord: string | null;
  latitude: number | null;
  longitude: number | null;
  zonemap: string | null;
  zmcode: boolean | null;
  sanborn: string | null;
  taxmap: number | null;
  edesignum: string | null;
  appbbl: string | null;
  appdate: string | null;
  plutomapid: number | null;
  version: string | null;
  sanitdistrict: number | null;
  healthcenterdistrict: number | null;
  firm07_flag: number | null;
  pfirm15_flag: number | null;
  rpaddate: string | null;
  dcasdate: string | null;
  zoningdate: string | null;
  landmkdate: string | null;
  basempdate: string | null;
  masdate: string | null;
  polidate: string | null;
  edesigdate: string | null;
  geom: string | null;
  dcpedited: string | null;
  notes: string | null;
  bct2020: string | null;
  bctcb2020: string | null;
}

export interface PlutoDataResult {
  data: PlutoData | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Parse BBL string into borough code, block, and lot
 * @param bbl - BBL in format "1-13-1"
 * @returns Object with borocode, block, and lot
 */
function parseBBL(bbl: string): { borocode: number; block: string; lot: string } | null {
  // Handle hyphenated format (e.g., "1-13-1")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      return {
        borocode: parseInt(parts[0]),
        block: parts[1],
        lot: parts[2],
      };
    }
  }

  return null;
}

/**
 * Fetch PLUTO data for a specific property from the database
 */
export async function fetchPlutoData(bbl: string): Promise<PlutoDataResult> {
  try {
    // Parse the BBL
    const parsed = parseBBL(bbl);
    if (!parsed) {
      return {
        data: null,
        metadata: null,
        error: `Invalid BBL format: ${bbl}`,
      };
    }

    // Query the database
    // Note: Using TOP 1 to get the most recent version if multiple exist
    const query = `
      SELECT TOP 1 *
      FROM silver.pluto
      WHERE borocode = @borocode
        AND block = @block
        AND lot = @lot
    `;

    const row = await queryOne<PlutoData>(query, {
      borocode: parsed.borocode,
      block: parsed.block,
      lot: parsed.lot,
    });

    if (!row) {
      return {
        data: null,
        metadata: null,
        error: `No PLUTO data found for BBL ${bbl}`,
      };
    }

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/pluto/metadata.json');
    const metadata = metadataModule.default as unknown as DatasourceMetadata;

    return {
      data: row,
      metadata,
    };
  } catch (error) {
    console.error('Error fetching PLUTO data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load PLUTO data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

