import { fetchAcrisProperties } from '@/services/acrisProperties';

export interface PropertyItem {
  id: string;
  address: string;
  borough: string;
  block: string;
  lot: string;
  aka: string[];
  sale_document_date?: string;
  sale_document_amount?: number;
  buyer_name?: string;
  [key: string]: string | string[] | number | undefined; // Index signature for BaseItem constraint
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
export async function fetchProperties(query: string): Promise<PropertyItem[]> {
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
        address: {
          filterType: 'text',
          type: 'startsWith',
          filter: query,
        },
      };

    const data = await fetchAcrisProperties({
      request: {
        startRow: 0,
        endRow: 10, // Limit to 10 results for autocomplete
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel,
        sortModel: [],
      },
    });

    return data.rows.map((row) => ({
      id: row.id,
      address: row.address,
      borough: row.borough,
      block: row.block,
      lot: row.lot,
      aka: row.aka || [],
      sale_document_date: row.sale_document_date,
      sale_document_amount: row.sale_document_amount,
      buyer_name: row.buyer_name,
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

