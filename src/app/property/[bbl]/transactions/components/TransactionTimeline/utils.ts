import type { DocumentWithParties } from '@/data/acris';
import type { Transaction } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Maps a DocumentWithParties (from the data layer) to a Transaction (for the UI layer)
 * This decouples the data fetching layer from the presentation layer
 * 
 * @param doc - Raw document with parties from Elasticsearch
 * @returns Transaction object ready for timeline display
 */
export function mapDocumentToTransaction(doc: DocumentWithParties): Transaction {
  return {
    id: doc.documentId,
    type: doc.documentType,
    docType: doc.docTypeDescription,
    date: doc.documentDate,
    amount: doc.documentAmount,
    party1: doc.fromParty,
    party2: doc.toParty,
    party1Type: doc.party1Type,
    party2Type: doc.party2Type,
    documentId: doc.documentId,
  };
}

