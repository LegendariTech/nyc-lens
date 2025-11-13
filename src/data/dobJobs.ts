import 'server-only';
import { queryMany } from './db';
import type { DobJobApplicationFiling, DobJobApplicationFilingNow } from '@/types/dob';
import type { DatasourceMetadata } from '@/app/property/[bbl]/utils/datasourceDisplay';
import { getBoroughName } from '@/constants/nyc';

export interface DobJobApplicationsResult {
  data: DobJobApplicationFiling[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

export interface DobJobApplicationsNowResult {
  data: DobJobApplicationFilingNow[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

/**
 * Parse BBL string into borough, block, and lot for job applications (BIS)
 * Block and lot are padded to 5 digits
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with borough (string name), block (string, padded), lot (string, padded) or null if invalid
 */
function parseBBLForJobApplications(bbl: string): { borough: string; block: string; lot: string } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boroCode = parts[0]; // 1 digit
      const block = parts[1].padStart(5, '0'); // Pad to 5 digits
      const lot = parts[2].padStart(5, '0'); // Pad to 5 digits

      // Validate that boro is 1-5
      const boroNum = parseInt(boroCode, 10);
      if (boroNum >= 1 && boroNum <= 5) {
        const borough = getBoroughName(boroCode);
        return { borough, block, lot };
      }
    }
  }

  return null;
}

/**
 * Parse BBL string into borough, block, and lot for DOB NOW job applications
 * Block and lot are NOT padded (used as-is)
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with borough (string name), block (string), lot (string) or null if invalid
 */
function parseBBLForJobApplicationsNow(bbl: string): { borough: string; block: string; lot: string } | null {
  // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
  if (bbl.includes('-')) {
    const parts = bbl.split('-');
    if (parts.length === 3) {
      const boroCode = parts[0]; // 1 digit
      const block = parts[1]; // No padding
      const lot = parts[2]; // No padding

      // Validate that boro is 1-5
      const boroNum = parseInt(boroCode, 10);
      if (boroNum >= 1 && boroNum <= 5) {
        const borough = getBoroughName(boroCode);
        return { borough, block, lot };
      }
    }
  }

  return null;
}

/**
 * Fetch DOB job application filings data for a specific property from the database
 * Returns all job application records for the given BBL, ordered by latest_action_date descending
 *
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of job application records or error
 */
export async function fetchDobJobApplications(bbl: string): Promise<DobJobApplicationsResult> {
  try {
    // Parse the BBL
    const parsed = parseBBLForJobApplications(bbl);
    if (!parsed) {
      return {
        data: null,
        metadata: null,
        error: `Invalid BBL format: ${bbl}`,
      };
    }

    // Query the database
    // Fetch all job application records for this BBL, ordered by pre__filing_date descending (most recent first), then by doc__
    const query = `
      SELECT *
      FROM silver.dob_job_application_filling
      WHERE borough = @borough
        AND block = @block
        AND lot = @lot
      ORDER BY
        CASE
          WHEN pre__filing_date IS NOT NULL
          THEN pre__filing_date
          ELSE '1900-01-01'
        END DESC,
        doc__ ASC
    `;

    const rows = await queryMany<DobJobApplicationFiling>(query, {
      borough: parsed.borough,
      block: parsed.block,
      lot: parsed.lot,
    });

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/dob/jobs-filings/metadata.json');
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
    console.error('Error fetching DOB job applications data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load DOB job applications data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Fetch DOB NOW job application filings data for a specific property from the database
 * Returns all job application records for the given BBL, ordered by filing_date descending
 *
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of job application records or error
 */
export async function fetchDobJobApplicationsNow(bbl: string): Promise<DobJobApplicationsNowResult> {
  try {
    // Parse the BBL
    const parsed = parseBBLForJobApplicationsNow(bbl);
    if (!parsed) {
      return {
        data: null,
        metadata: null,
        error: `Invalid BBL format: ${bbl}`,
      };
    }

    // Query the database
    // Fetch all job application records for this BBL, ordered by filing_date descending (most recent first)
    const query = `
      SELECT *
      FROM silver.dob_job_application_filling_now
      WHERE borough = @borough
        AND block = @block
        AND lot = @lot
      ORDER BY
        CASE
          WHEN filing_date IS NOT NULL
          THEN filing_date
          ELSE '1900-01-01'
        END DESC,
        job_filing_number ASC
    `;

    const rows = await queryMany<DobJobApplicationFilingNow>(query, {
      borough: parsed.borough,
      block: parsed.block,
      lot: parsed.lot,
    });

    // Load metadata (static file with field descriptions)
    const metadataModule = await import('@/app/property/[bbl]/dob/jobs-filings/now-metadata.json');
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
    console.error('Error fetching DOB NOW job applications data:', error);
    return {
      data: null,
      metadata: null,
      error: `Failed to load DOB NOW job applications data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

