import 'server-only';
import { queryMany } from './db';
import type { DobViolation } from '@/types/dob';
import type { DatasourceMetadata } from '@/app/property/[bbl]/utils/datasourceDisplay';

export interface DobViolationsResult {
  data: DobViolation[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Parse BBL string into borough, block, and lot with proper formatting
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with boro (1 digit), block (5 digits, left-padded), lot (4 digits, left-padded)
 */
function parseBBLForDob(bbl: string): { boro: string; block: string; lot: string } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boro = parts[0]; // Already 1 digit
      const block = parts[1].padStart(5, '0'); // Pad to 5 digits
      const lot = parts[2].padStart(5, '0'); // Pad to 5 digits

      // Validate that boro is 1-5
      const boroNum = parseInt(boro, 10);
      if (boroNum >= 1 && boroNum <= 5) {
        return { boro, block, lot };
      }
    }
  }

  return null;
}

/**
 * Fetch DOB violations data for a specific property from the database
 * Returns all violation records for the given BBL, ordered by issue_date descending
 * 
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of violation records or error
 */
export async function fetchDobViolations(bbl: string): Promise<DobViolationsResult> {
  try {
    // Parse the BBL
    const parsed = parseBBLForDob(bbl);
    if (!parsed) {
      return {
        data: null,
        metadata: null,
        error: `Invalid BBL format: ${bbl}`,
      };
    }

    // Query the database
    // Fetch all violation records for this BBL, ordered by issue_date descending (most recent first)
    const query = `
      SELECT *
      FROM silver.dob_violation
      WHERE boro = @boro
        AND block = @block
        AND lot = @lot
      ORDER BY 
        CASE 
          WHEN TRY_CONVERT(datetime2, issue_date) IS NOT NULL 
          THEN TRY_CONVERT(datetime2, issue_date)
          ELSE '1900-01-01'
        END DESC,
        [:updated_at] DESC
    `;

    const rows = await queryMany<DobViolation>(query, {
      boro: parsed.boro,
      block: parsed.block,
      lot: parsed.lot,
    });

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/dob/components/metadata.json');
    const metadata = metadataModule.default as DatasourceMetadata;

    if (!rows || rows.length === 0) {
      return {
        data: [],
        metadata,
        error: undefined,
      };
    }

    return {
      data: rows,
      metadata,
    };
  } catch (error) {
    console.error('Error fetching DOB violations data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load DOB violations data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

