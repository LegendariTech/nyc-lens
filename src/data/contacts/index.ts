import 'server-only';
import { queryMany } from '../db';
import type { OwnerContact } from '@/types/contacts';

export interface OwnerContactsResult {
    data: OwnerContact[] | null;
    error?: string;
}

/**
 * Parse BBL string into borough, block, and lot for owner contacts
 * Block and lot are NOT padded (stored as strings in the table)
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001"
 * @returns Object with borough (string name), block (string), lot (string) or null if invalid
 */
function parseBBLForContacts(bbl: string): { borough: string; block: string; lot: string } | null {
    // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
    if (bbl.includes('-')) {
        const parts = bbl.split('-');
        if (parts.length === 3) {
            const boroCode = parts[0]; // 1 digit
            const block = parts[1]; // No padding needed for contacts table
            const lot = parts[2]; // No padding needed for contacts table

            // Validate that boro is 1-5
            const boroNum = parseInt(boroCode, 10);
            if (boroNum >= 1 && boroNum <= 5) {
                return { borough: boroCode, block, lot };
            }
        }
    }

    return null;
}

/**
 * Fetch owner contact information for a specific property from the database
 * Returns all owner contact records for the given BBL, ordered by date descending (most recent first)
 *
 * @param bbl - BBL in format "1-13-1"
 * @returns Promise containing array of owner contact records or error
 */
export async function fetchOwnerContacts(bbl: string): Promise<OwnerContactsResult> {
    try {
        // Parse the BBL
        const parsed = parseBBLForContacts(bbl);
        if (!parsed) {
            return {
                data: null,
                error: `Invalid BBL format: ${bbl}`,
            };
        }

        // Query the database
        // Fetch all owner contact records for this BBL, ordered by date descending (most recent first)
        const query = `
      SELECT *
      FROM gold.owner_contact
      WHERE borough = @borough
        AND block = @block
        AND lot = @lot
      ORDER BY
        CASE
          WHEN date IS NOT NULL
          THEN date
          ELSE '1900-01-01'
        END DESC
    `;

        const rows = await queryMany<OwnerContact>(query, {
            borough: parsed.borough,
            block: parsed.block,
            lot: parsed.lot,
        });

        if (!rows || rows.length === 0) {
            return {
                data: [],
                error: undefined,
            };
        }

        return {
            data: rows,
        };
    } catch (error) {
        console.error('Error fetching owner contacts data:', error);
        return {
            data: null,
            error: `Failed to load owner contacts data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}
