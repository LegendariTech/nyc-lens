import 'server-only';
import { search } from './elasticsearch';
import { AcrisRecord, AcrisDoc, AcrisParty } from '@/types/acris';
import acrisControlCodes from '@/constants/acris_control_code.json';

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
 * Party detail with address information
 */
export interface PartyDetail {
  name: string;
  type: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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
  fromParty: string[];
  toParty: string[];
  party1Type: string;
  party2Type: string;
  isDeed: boolean;
  isMortgage: boolean;
  isUccLien: boolean;
  isOtherDocument: boolean;
  partyDetails: PartyDetail[];
}

/**
 * Get party type labels for a specific document type from ACRIS control codes
 * @param docType - Document type code (e.g., 'DEED', 'MTGE')
 * @returns Object with party1Type and party2Type labels, or defaults if not found
 */
function getPartyTypeLabels(docType: string): { party1Type: string; party2Type: string } {
  // Find the document type in the control codes
  const controlCode = acrisControlCodes.find(
    (code) => code['DOC. TYPE'] === docType
  );

  if (controlCode) {
    // Extract the last part of slash-separated types (e.g., "MORTGAGOR/BORROWER" -> "BORROWER")
    const extractLastType = (type: string | null): string => {
      if (!type) return 'Party';
      const parts = type.split('/');
      return parts[parts.length - 1].trim();
    };

    return {
      party1Type: extractLastType(controlCode['PARTY1 TYPE']),
      party2Type: extractLastType(controlCode['PARTY2 TYPE']),
    };
  }

  // Fallback defaults based on class code description
  // This handles cases where the specific doc type isn't in the control codes
  return {
    party1Type: 'Party 1',
    party2Type: 'Party 2',
  };
}

/**
 * Fetch all ACRIS transactions with party information
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

    // Query for all documents
    const documentsIndexName = process.env.ELASTICSEARCH_DOCUMENTS_INDEX_NAME || 'acris_documents_v_7_1';
    const partiesIndexName = 'acris_parties_v_8_1';

    // Fetch all documents for this BBL
    // Using Elasticsearch boolean query with:
    // - must: BBL components must match exactly
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
          },
        },
        sort: [{ document_date: { order: 'desc' } }],
        size: 10000,
      });
    } catch (error) {
      console.error(`Error querying documents index for BBL ${bbl}:`, error);
      throw new Error(`Failed to fetch documents from Elasticsearch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const docsHits = (docsResult as { hits: { hits: Array<{ _source: AcrisDoc }> } }).hits.hits;
    const documents = docsHits.map(hit => hit._source);

    // Filter out documents with zero or null amounts
    const validDocuments = documents.filter(doc =>
      doc.document_amount !== null &&
      doc.document_amount !== undefined &&
      doc.document_amount > 0
    );

    if (validDocuments.length === 0) {
      console.info(`No valid documents found for BBL ${bbl} (all filtered out due to zero/null amounts)`);
      return [];
    }

    // Get unique document IDs to fetch associated parties
    // Filter out any documents without a master_document_id
    const documentIds = validDocuments
      .map(doc => doc.master_document_id)
      .filter((id): id is string => !!id);

    if (documentIds.length === 0) {
      console.warn(`Found ${validDocuments.length} documents for BBL ${bbl} but none have master_document_id`);
      return [];
    }

    // Fetch all parties associated with these documents
    // Size 10000 to handle large transaction histories (typically 2-4 parties per document)
    let partiesResult;
    try {
      partiesResult = await search(partiesIndexName, {
        query: {
          terms: { 'party_document_id.keyword': documentIds },
        },
        size: 10000,
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
    const transactions: DocumentWithParties[] = validDocuments.map(doc => {
      const docParties = partiesByDocId.get(doc.master_document_id || '') || [];

      // Get party type labels from ACRIS control codes based on document type
      const { party1Type, party2Type } = getPartyTypeLabels(doc.document_type);

      // Extract party names from ACRIS party records
      // ACRIS uses numeric codes to identify party roles:
      // '1' for party1 (grantor/seller/borrower), '2' for party2 (grantee/buyer/lender), '3' for party3
      const party1Set = new Set<string>();
      const party2Set = new Set<string>();
      const partyDetailsMap = new Map<string, PartyDetail>();

      for (const party of docParties) {
        const partyType = party.party_party_type?.trim() || '';
        const partyName = party.party_name?.trim() || '';

        if (!partyName) continue; // Skip parties without names

        // Party 1: Typically grantor/seller/borrower/assignor
        if (partyType === '1') {
          party1Set.add(partyName);
        }
        // Party 2: Typically grantee/buyer/lender/assignee
        else if (partyType === '2') {
          party2Set.add(partyName);
        }

        // Store party details for all parties (only once per unique name)
        if (!partyDetailsMap.has(partyName)) {
          partyDetailsMap.set(partyName, {
            name: partyName,
            type: party.party_party_type_description || `Party ${partyType}`,
            address1: party.party_address_1?.trim(),
            address2: party.party_address_2?.trim(),
            city: party.party_city?.trim(),
            state: party.party_state?.trim(),
            zip: party.party_zip?.trim(),
            country: party.party_country?.trim(),
          });
        }
      }

      // Convert sets to arrays for the final output
      const party1 = Array.from(party1Set);
      const party2 = Array.from(party2Set);
      const partyDetails = Array.from(partyDetailsMap.values());

      // Determine document category based on ACRIS class code
      const isDeed = doc.class_code_description === 'DEEDS AND OTHER CONVEYANCES';
      const isMortgage = doc.class_code_description === 'MORTGAGES & INSTRUMENTS';
      const isUccLien = doc.class_code_description === 'UCC AND FEDERAL LIENS';
      const isOtherDocument = doc.class_code_description === 'OTHER DOCUMENTS';

      return {
        documentId: doc.master_document_id || '',
        documentType: doc.document_type,
        docTypeDescription: doc.doc_type_description,
        documentDate: doc.document_date,
        documentAmount: doc.document_amount,
        classCodeDescription: doc.class_code_description,
        fromParty: party1.length > 0 ? party1 : ['Unknown'], // Default to ['Unknown'] if no party found
        toParty: party2.length > 0 ? party2 : ['Unknown'],   // Default to ['Unknown'] if no party found
        party1Type,
        party2Type,
        isDeed,
        isMortgage,
        isUccLien,
        isOtherDocument,
        partyDetails,
      };
    });

    return transactions;
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
