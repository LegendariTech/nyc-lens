import type { DatasourceMetadata } from './propertyData';
import { queryOne } from './dbClient';


export interface PlutoData {
  [key: string]: string | number | boolean | null;
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
    const metadataModule = await import('@/app/property/[bbl]/components/PlutoTab/metadata.json');
    const metadata = metadataModule.default as DatasourceMetadata;

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

