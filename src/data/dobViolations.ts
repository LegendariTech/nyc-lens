import 'server-only';
import { queryMany } from './db';
import type { DobSafetyViolation, DobViolationBIS } from '@/types/dob';
import type { DatasourceMetadata } from '@/app/property/[bbl]/utils/datasourceDisplay';
import { getBoroughName } from '@/constants/nyc';

export interface DobSafetyViolationsResult {
  data: DobSafetyViolation[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

export interface DobViolationsBISResult {
  data: DobViolationBIS[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Parse BBL string into borough name, block, and lot
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with borough (string like "Manhattan"), block (number), lot (number) or null if invalid
 */
function parseBBLForDob(bbl: string): { borough: string; block: number; lot: number } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boroCode = parts[0]; // 1 digit
      const blockStr = parts[1]; // Don't pad - use as-is
      const lotStr = parts[2]; // Don't pad - use as-is

      // Validate that boro is 1-5
      const boroNum = parseInt(boroCode, 10);
      if (boroNum >= 1 && boroNum <= 5) {
        const borough = getBoroughName(boroCode);
        const block = parseInt(blockStr, 10);
        const lot = parseInt(lotStr, 10);

        return { borough, block, lot };
      }
    }
  }

  return null;
}

/**
 * Parse BBL string into boro, block, and lot for BIS violations
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with boro (string), block (string, padded), lot (string, padded) or null if invalid
 */
function parseBBLForDobBIS(bbl: string): { boro: string; block: string; lot: string } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boro = parts[0]; // 1 digit
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
 * Fetch DOB safety violations data for a specific property from the database
 * Returns all violation records for the given BBL, ordered by violation_issue_date descending
 * 
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of violation records or error
 */
export async function fetchDobSafetyViolations(bbl: string): Promise<DobSafetyViolationsResult> {
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
    // Fetch all violation records for this BBL, ordered by violation_issue_date descending (most recent first)
    const query = `
      SELECT *
      FROM silver.dob_safety_violation
      WHERE borough = @borough
        AND block = @block
        AND lot = @lot
      ORDER BY 
        CASE 
          WHEN violation_issue_date IS NOT NULL 
          THEN violation_issue_date
          ELSE '1900-01-01'
        END DESC,
        [:updated_at] DESC
    `;

    const rows = await queryMany<DobSafetyViolation>(query, {
      borough: parsed.borough,
      block: parsed.block,
      lot: parsed.lot,
    });

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/dob/violations/metadata-safety.json');
    const metadata = metadataModule.default as unknown as DatasourceMetadata;

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
    console.error('Error fetching DOB safety violations data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load DOB safety violations data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Fetch DOB violations (BIS) data for a specific property from the database
 * Returns all violation records for the given BBL, ordered by issue_date descending
 * 
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of violation records or error
 */
export async function fetchDobViolationsBIS(bbl: string): Promise<DobViolationsBISResult> {
  try {
    // Parse the BBL
    const parsed = parseBBLForDobBIS(bbl);
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

    const rows = await queryMany<DobViolationBIS>(query, {
      boro: parsed.boro,
      block: parsed.block,
      lot: parsed.lot,
    });

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/dob/violations/metadata.json');
    const metadata = metadataModule.default as unknown as DatasourceMetadata;

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
    console.error('Error fetching DOB violations (BIS) data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load DOB violations (BIS) data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

