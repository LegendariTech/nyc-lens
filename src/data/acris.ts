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
      throw new Error(`Invalid BBL format: ${bbl}`);
    }

    const [borough, block, lot] = bblParts;

    // Query for DEED and MORTGAGE documents
    const documentsIndexName = process.env.ELASTICSEARCH_DOCUMENTS_INDEX_NAME || 'acris_documents_v_7_1';
    const partiesIndexName = 'acris_parties_v_8_1';

    // Fetch documents that are DEEDs or MORTGAGEs
    const docsResult = await search(documentsIndexName, {
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

    const docsHits = (docsResult as { hits: { hits: Array<{ _source: AcrisDoc }> } }).hits.hits;
    const documents = docsHits.map(hit => hit._source);

    if (documents.length === 0) {
      return [];
    }

    // Get unique document IDs
    const documentIds = documents
      .map(doc => doc.master_document_id)
      .filter((id): id is string => !!id);

    if (documentIds.length === 0) {
      return [];
    }

    // Fetch parties for these documents
    const partiesResult = await search(partiesIndexName, {
      query: {
        terms: { 'party_document_id.keyword': documentIds },
      },
      size: 500,
    });

    const partiesHits = (partiesResult as { hits: { hits: Array<{ _source: AcrisParty }> } }).hits.hits;
    const parties = partiesHits.map(hit => hit._source);

    // Group parties by document ID
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

    // Combine documents with parties
    const transactions: DocumentWithParties[] = documents.map(doc => {
      const docParties = partiesByDocId.get(doc.master_document_id || '') || [];
      const isMortgage = doc.document_type === 'MTGE';

      // Party type labels from ACRIS control codes
      const party1Type = isMortgage ? 'Borrower' : 'Seller';
      const party2Type = isMortgage ? 'Lender' : 'Buyer';

      // Find from/to parties based on party type
      // For DEEDs: GRANTOR/SELLER -> GRANTEE/BUYER
      // For MORTGAGES: MORTGAGER/BORROWER -> MORTGAGEE/LENDER
      let party1 = '';
      let party2 = '';

      for (const party of docParties) {
        const partyType = party.party_party_type?.toUpperCase() || '';
        const partyTypeDesc = party.party_party_type_description?.toUpperCase() || '';

        // Party 1 (seller/grantor/borrower)
        if (partyType === '1' || partyTypeDesc.includes('GRANTOR') || partyTypeDesc.includes('SELLER') ||
          partyTypeDesc.includes('BORROWER') || partyTypeDesc.includes('MORTGAGOR')) {
          if (party1) party1 += ', ';
          party1 += party.party_name || '';
        }
        // Party 2 (buyer/grantee/lender)
        else if (partyType === '2' || partyTypeDesc.includes('GRANTEE') || partyTypeDesc.includes('BUYER') ||
          partyTypeDesc.includes('LENDER') || partyTypeDesc.includes('MORTGAGEE')) {
          if (party2) party2 += ', ';
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
        fromParty: party1 || 'Unknown',
        toParty: party2 || 'Unknown',
        party1Type,
        party2Type,
      };
    });

    // Filter out transactions with 0 or null/undefined amounts
    return transactions.filter(t => t.documentAmount && t.documentAmount > 0);
  } catch (error) {
    console.error('Error fetching transactions with parties:', error);
    throw error;
  }
}
