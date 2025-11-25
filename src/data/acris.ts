import 'server-only';
import { search } from './elasticsearch';
import { AcrisRecord, AcrisDoc, AcrisParty } from '@/types/acris';

/**
 * Fetch a single ACRIS property record by BBL
 * @param bbl - BBL in format "1-13-1" (borough-block-lot with hyphens)
 * @returns ACRIS property record or null if not found
 */
export async function fetchPropertyByBBL(bbl: string): Promise<AcrisRecord | null> {
  try {
    // Parse BBL
    const bblParts = bbl.split('-');
    if (bblParts.length !== 3) {
      throw new Error(`Invalid BBL format: ${bbl}`);
    }

    const [borough, block, lot] = bblParts;

    // Query Elasticsearch
    const indexName = process.env.ELASTICSEARCH_ACRIS_INDEX_NAME || 'acris';

    const result = await search(indexName, {
      query: {
        bool: {
          must: [
            { term: { borough } },
            { term: { 'block.integer': parseInt(block) } },
            { term: { 'lot.integer': parseInt(lot) } },
          ],
        },
      },
      size: 1,
    });

    // Type assertion for the result structure
    const hits = (result as { hits: { hits: Array<{ _source: AcrisRecord }> } }).hits.hits;

    if (hits.length === 0) {
      return null;
    }

    return hits[0]._source;
  } catch (error) {
    console.error('Error fetching property from Elasticsearch:', error);
    throw error;
  }
}

/**
 * Fetch property documents by BBL from the documents index
 * @param bbl - BBL in format "1-13-1" (borough-block-lot with hyphens)
 * @returns Array of property documents or an empty array if none found
 */
export async function fetchDocumentsByBBL(bbl: string): Promise<AcrisDoc[]> {
  try {
    // Parse BBL
    const bblParts = bbl.split('-');
    if (bblParts.length !== 3) {
      throw new Error(`Invalid BBL format: ${bbl}`);
    }

    const [borough, block, lot] = bblParts;

    // Query Elasticsearch
    const indexName = process.env.ELASTICSEARCH_DOCUMENTS_INDEX_NAME || 'documents';

    const result = await search(indexName, {
      query: {
        bool: {
          must: [
            { term: { borough } },
            { term: { 'block.integer': parseInt(block) } },
            { term: { 'lot.integer': parseInt(lot) } },
          ],
        },
      },
      size: 100, // Adjust size as needed
    });

    // Type assertion for the result structure
    const hits = (result as { hits: { hits: Array<{ _source: AcrisDoc }> } }).hits.hits;

    return hits.map(hit => hit._source);
  } catch (error) {
    console.error('Error fetching documents from Elasticsearch:', error);
    throw error;
  }
}

/**
 * Document with party information for timeline display
 */
export interface DocumentWithParties {
  documentId: string;
  documentType: string;
  docTypeDescription: string;
  documentDate: string;
  documentAmount: number;
  classCodeDescription: string;
  fromParty: string;
  toParty: string;
  party1Type: string;
  party2Type: string;
}

/**
 * Fetch deed and mortgage transactions with party information
 * @param bbl - BBL in format "1-13-1" (borough-block-lot with hyphens)
 * @returns Array of documents with party information
 */
export async function fetchTransactionsWithParties(bbl: string): Promise<DocumentWithParties[]> {
  try {
    // Parse BBL
    const bblParts = bbl.split('-');
    if (bblParts.length !== 3) {
      throw new Error(`Invalid BBL format: ${bbl}. Expected format: borough-block-lot (e.g., 1-13-1)`);
    }

    const [borough, block, lot] = bblParts;
    
    // Validate BBL components are numeric
    if (isNaN(parseInt(borough)) || isNaN(parseInt(block)) || isNaN(parseInt(lot))) {
      throw new Error(`Invalid BBL components: borough=${borough}, block=${block}, lot=${lot}. All must be numeric.`);
    }

    // Query for DEED and MORTGAGE documents
    const documentsIndexName = process.env.ELASTICSEARCH_DOCUMENTS_INDEX_NAME || 'acris_documents_v_7_1';
    const partiesIndexName = 'acris_parties_v_8_1';

    // Fetch documents that are DEEDs or MORTGAGEs
    // Using Elasticsearch boolean query with:
    // - must: BBL components must match exactly
    // - should: Document must be either a DEED or MORTGAGE (minimum_should_match: 1)
    // - sort: Most recent transactions first
    let docsResult;
    try {
      docsResult = await search(documentsIndexName, {
        query: {
          bool: {
            must: [
              { term: { borough } },
              { term: { 'block.integer': parseInt(block) } },
              { term: { 'lot.integer': parseInt(lot) } },
            ],
            should: [
              { term: { 'class_code_description.keyword': 'DEEDS AND OTHER CONVEYANCES' } },
              { term: { 'class_code_description.keyword': 'MORTGAGES & INSTRUMENTS' } },
            ],
            minimum_should_match: 1,
          },
        },
        sort: [{ document_date: { order: 'desc' } }],
        size: 50,
      });
    } catch (error) {
      console.error(`Error querying documents index for BBL ${bbl}:`, error);
      throw new Error(`Failed to fetch documents from Elasticsearch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const docsHits = (docsResult as { hits: { hits: Array<{ _source: AcrisDoc }> } }).hits.hits;
    const documents = docsHits.map(hit => hit._source);

    if (documents.length === 0) {
      console.info(`No deed or mortgage documents found for BBL ${bbl}`);
      return [];
    }

    // Get unique document IDs to fetch associated parties
    // Filter out any documents without a master_document_id
    const documentIds = documents
      .map(doc => doc.master_document_id)
      .filter((id): id is string => !!id);

    if (documentIds.length === 0) {
      console.warn(`Found ${documents.length} documents for BBL ${bbl} but none have master_document_id`);
      return [];
    }

    // Fetch all parties associated with these documents
    // Size 500 should handle most cases (typically 2-4 parties per document)
    let partiesResult;
    try {
      partiesResult = await search(partiesIndexName, {
        query: {
          terms: { 'party_document_id.keyword': documentIds },
        },
        size: 500,
      });
    } catch (error) {
      console.error(`Error querying parties index for document IDs:`, error);
      // Continue with empty parties rather than failing completely
      // This allows us to show transactions even if party data is unavailable
      console.warn(`Continuing without party data for BBL ${bbl}`);
      partiesResult = { hits: { hits: [] } };
    }

    const partiesHits = (partiesResult as { hits: { hits: Array<{ _source: AcrisParty }> } }).hits.hits;
    const parties = partiesHits.map(hit => hit._source);
    
    if (parties.length === 0) {
      console.warn(`No parties found for ${documentIds.length} documents for BBL ${bbl}`);
    }

    // Group parties by document ID for efficient lookup
    // This creates a Map where the key is the document ID and value is an array of parties
    const partiesByDocId = new Map<string, AcrisParty[]>();
    for (const party of parties) {
      const docId = (party as AcrisParty & { party_document_id?: string }).party_document_id;
      if (docId) {
        if (!partiesByDocId.has(docId)) {
          partiesByDocId.set(docId, []);
        }
        partiesByDocId.get(docId)!.push(party);
      }
    }

    // Combine documents with their associated parties
    const transactions: DocumentWithParties[] = documents.map(doc => {
      const docParties = partiesByDocId.get(doc.master_document_id || '') || [];
      const isMortgage = doc.document_type === 'MTGE';

      // Determine display labels based on transaction type
      // DEED: Seller (party 1) transfers property to Buyer (party 2)
      // MORTGAGE: Borrower (party 1) receives loan from Lender (party 2)
      const party1Type = isMortgage ? 'Borrower' : 'Seller';
      const party2Type = isMortgage ? 'Lender' : 'Buyer';

      // Extract party names from ACRIS party records
      // ACRIS uses two systems to identify party roles:
      // 1. party_party_type: Numeric codes ('1' for grantor/seller/borrower, '2' for grantee/buyer/lender)
      // 2. party_party_type_description: Text descriptions (e.g., "GRANTOR", "GRANTEE", "MORTGAGOR", "MORTGAGEE")
      // We check both to ensure we capture all parties correctly
      let party1 = '';
      let party2 = '';

      for (const party of docParties) {
        const partyType = party.party_party_type?.toUpperCase() || '';
        const partyTypeDesc = party.party_party_type_description?.toUpperCase() || '';

        // Party 1: The seller (in deeds) or borrower (in mortgages)
        // Match by: numeric code '1', or keywords like GRANTOR, SELLER, BORROWER, MORTGAGOR
        if (partyType === '1' || partyTypeDesc.includes('GRANTOR') || partyTypeDesc.includes('SELLER') ||
          partyTypeDesc.includes('BORROWER') || partyTypeDesc.includes('MORTGAGOR')) {
          if (party1) party1 += ', '; // Multiple parties are comma-separated
          party1 += party.party_name || '';
        }
        // Party 2: The buyer (in deeds) or lender (in mortgages)
        // Match by: numeric code '2', or keywords like GRANTEE, BUYER, LENDER, MORTGAGEE
        else if (partyType === '2' || partyTypeDesc.includes('GRANTEE') || partyTypeDesc.includes('BUYER') ||
          partyTypeDesc.includes('LENDER') || partyTypeDesc.includes('MORTGAGEE')) {
          if (party2) party2 += ', '; // Multiple parties are comma-separated
          party2 += party.party_name || '';
        }
      }

      return {
        documentId: doc.master_document_id || '',
        documentType: doc.document_type,
        docTypeDescription: doc.doc_type_description,
        documentDate: doc.document_date,
        documentAmount: doc.document_amount,
        classCodeDescription: doc.class_code_description,
        fromParty: party1 || 'Unknown', // Default to 'Unknown' if no party found
        toParty: party2 || 'Unknown',   // Default to 'Unknown' if no party found
        party1Type,
        party2Type,
      };
    });

    // Filter out transactions with invalid amounts
    // Excludes transactions where amount is 0, null, or undefined
    // (These are often administrative filings without monetary value)
    const filteredTransactions = transactions.filter(t => t.documentAmount && t.documentAmount > 0);
    
    console.info(`Fetched ${filteredTransactions.length} valid transactions for BBL ${bbl} (filtered from ${transactions.length} total)`);
    
    return filteredTransactions;
  } catch (error) {
    // Log the full error for debugging
    console.error('Error fetching transactions with parties:', error);
    
    // Re-throw with context if it's not already a custom error
    if (error instanceof Error && !error.message.includes('BBL')) {
      throw new Error(`Failed to fetch transactions for BBL ${bbl}: ${error.message}`);
    }
    
    throw error;
  }
}
