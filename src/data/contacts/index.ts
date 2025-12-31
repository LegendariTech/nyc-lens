import 'server-only';
import { search } from '../elasticsearch';
import type { OwnerContact } from '@/types/contacts';

export interface OwnerContactsResult {
    data: OwnerContact[] | null;
    error?: string;
}

/**
 * Parse BBL string into components for Elasticsearch query
 * @param bbl - BBL in format "1-13-1" or "1-00013-0001" or "1000130001"
 * @returns Object with bbl string or null if invalid
 */
function parseBBLForContacts(bbl: string): { bbl: string } | null {
    // Handle hyphenated format (e.g., "1-13-1" or "1-00013-0001")
    if (bbl.includes('-')) {
        const parts = bbl.split('-');
        if (parts.length === 3) {
            const boroCode = parts[0].padStart(1, '0'); // 1 digit
            const block = parts[1].padStart(5, '0'); // 5 digits
            const lot = parts[2].padStart(4, '0'); // 4 digits

            // Validate that boro is 1-5
            const boroNum = parseInt(boroCode, 10);
            if (boroNum >= 1 && boroNum <= 5) {
                return { bbl: `${boroCode}${block}${lot}` };
            }
        }
    } else if (bbl.length === 10) {
        // Already in 10-digit format
        const boroNum = parseInt(bbl[0], 10);
        if (boroNum >= 1 && boroNum <= 5) {
            return { bbl };
        }
    }

    return null;
}

/**
 * Fetch owner contact information for a specific property from Elasticsearch
 * Returns all owner contact records for the given BBL, ordered by date descending (most recent first)
 *
 * @param bbl - BBL in format "1-13-1" or "1000130001"
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

        // Get the index name from environment variable
        const indexName = process.env.ELASTICSEARCH_CONTACTS_INDEX_NAME || 'owner_contacts_normalized_v_1_3';

        // Query Elasticsearch
        const query = {
            query: {
                term: {
                    bbl: parsed.bbl,
                },
            },
            sort: [
                {
                    date: {
                        order: 'desc',
                        unmapped_type: 'date',
                    },
                },
            ],
            size: 10000, // Maximum results
        };

        const result = await search(indexName, query) as {
            hits: {
                hits: Array<{
                    _source: OwnerContact;
                }>;
            };
        };

        if (!result.hits || !result.hits.hits || result.hits.hits.length === 0) {
            return {
                data: [],
                error: undefined,
            };
        }

        // Extract contacts from Elasticsearch response
        const contacts = result.hits.hits.map(hit => hit._source);

        return {
            data: contacts,
        };
    } catch (error) {
        console.error('Error fetching owner contacts data from Elasticsearch:', error);
        return {
            data: null,
            error: `Failed to load owner contacts data for BBL ${bbl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}
