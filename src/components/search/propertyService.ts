import type { BaseAutocompleteItem } from '@/components/ui/Autocomplete';
import type { AcrisPropertiesRequest, AcrisPropertiesResponse } from '@/types/api';

export interface PropertyItem extends BaseAutocompleteItem {
  address: string;
  address_with_unit: string;
  borough: string;
  block: string;
  lot: string;
  zipcode: string;
  aka: string[];
  sale_document_date?: string;
  sale_document_amount?: number;
  buyer_name?: string;
  avroll_building_class?: string;
  /** The matched address (either main address or AKA) - set by UI layer */
  matchedAddress?: string;
}

/**
 * Parse BBL pattern from query string
 * Supports formats: "1-2469-22" or "1 2469 22"
 */
function parseBBL(query: string): { borough: string; block: string; lot: string } | null {
  // Match pattern: number-number-number or number space number space number
  const bblPattern = /^(\d+)[\s-](\d+)[\s-](\d+)$/;
  const match = query.trim().match(bblPattern);

  if (match) {
    return {
      borough: match[1],
      block: match[2],
      lot: match[3],
    };
  }

  return null;
}

/**
 * Fetch properties from Elasticsearch based on search query
 */
export async function fetchProperties(
  query: string,
  searchField: 'address' | 'address_with_unit' = 'address'
): Promise<PropertyItem[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const bbl = parseBBL(query);

    // Build filter based on whether it's a BBL search or address search
    const filterModel = bbl
      ? {
        borough: {
          filterType: 'text',
          type: 'equals',
          filter: bbl.borough,
        },
        block: {
          filterType: 'text',
          type: 'equals',
          filter: bbl.block,
        },
        lot: {
          filterType: 'text',
          type: 'equals',
          filter: bbl.lot,
        },
      }
      : {
        [searchField]: {
          filterType: 'text',
          type: 'startsWith',
          filter: query,
        },
      };

    // Call API directly - only pass what we need to override defaults
    const payload: AcrisPropertiesRequest = {
      request: {
        endRow: 10, // Limit to 10 results for autocomplete
        filterModel,
        sortModel: [], // Sort by relevance, not by date
      },
    };

    const res = await fetch('/api/acris/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Failed to fetch properties');
    const data = (await res.json()) as AcrisPropertiesResponse;

    return data.rows.map((row) => ({
      id: row.id,
      address: row.address,
      address_with_unit: row.address_with_unit,
      borough: row.borough,
      block: row.block,
      lot: row.lot,
      zipcode: row.zipcode || '',
      aka: row.aka || [],
      sale_document_date: row.sale_document_date,
      sale_document_amount: row.sale_document_amount,
      buyer_name: row.buyer_name,
      avroll_building_class: row.avroll_building_class,
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

