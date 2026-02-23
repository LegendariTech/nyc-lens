import 'server-only';
import { cache } from 'react';
import { queryMany } from './db';
import type { PropertyValuation } from '@/types/valuation';
import type { DatasourceMetadata } from '@/app/property/[bbl]/utils/datasourceDisplay';

export interface PropertyValuationResult {
  data: PropertyValuation[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Parse BBL string into borough, block, and lot
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with boro, block, and lot as numbers
 */
function parseBBL(bbl: string): { boro: number; block: number; lot: number } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boro = parseInt(parts[0], 10);
      const block = parseInt(parts[1], 10);
      const lot = parseInt(parts[2], 10);

      if (!isNaN(boro) && !isNaN(block) && !isNaN(lot)) {
        return { boro, block, lot };
      }
    }
  }

  return null;
}

/**
 * Fetch property valuation data for a specific property from the database
 * Returns all valuation records for the given BBL, ordered by year descending
 *
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of valuation records or error
 *
 * Wrapped with React.cache() to deduplicate requests within the same render pass.
 * This prevents duplicate MSSQL queries when called from both generateMetadata() and page components.
 */
export const fetchPropertyValuation = cache(async (bbl: string): Promise<PropertyValuationResult> => {
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
    // Fetch all records for this BBL, ordered by year descending (most recent first)
    const query = `
      SELECT *
      FROM silver.dof_property_valuation
      WHERE boro = @boro
        AND block = @block
        AND lot = @lot
        AND finmkttot > 0
      ORDER BY year DESC, [:updated_at] DESC
    `;

    const rows = await queryMany<PropertyValuation>(query, {
      boro: parsed.boro,
      block: parsed.block,
      lot: parsed.lot,
    });

    if (!rows || rows.length === 0) {
      return {
        data: null,
        metadata: null,
        error: `No valuation data found for BBL ${bbl}`,
      };
    }

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/tax/metadata.json');
    const metadata = metadataModule.default as unknown as DatasourceMetadata;

    return {
      data: rows,
      metadata,
    };
  } catch (error) {
    console.error('Error fetching property valuation data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load valuation data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
});
