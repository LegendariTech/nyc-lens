import type { DocumentWithParties } from '@/data/acris';
import type { Transaction, DocumentCategory, CategoryMetadata } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  // Parse the date string as UTC to avoid timezone conversion
  // For ISO strings like "2025-11-19T00:00:00.000Z", we want to display Nov 19, not Nov 18
  const date = new Date(dateStr);

  // Extract UTC date components to avoid local timezone conversion
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Create a new date using UTC components
  const utcDate = new Date(Date.UTC(year, month, day));

  return utcDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Category metadata for different document types
 */
export const CATEGORY_METADATA: Record<DocumentCategory, CategoryMetadata> = {
  deed: {
    key: 'deed',
    label: 'Deed',
    pluralLabel: 'Deeds',
    color: 'amber-500',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    darkTextColor: 'dark:text-amber-400',
    filterBgActive: 'bg-amber-500/10',
    filterTextActive: 'text-amber-600 dark:text-amber-400',
    filterBorderActive: 'border-amber-500/50',
  },
  mortgage: {
    key: 'mortgage',
    label: 'Mortgage',
    pluralLabel: 'Mortgages',
    color: 'blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    darkTextColor: 'dark:text-blue-400',
    filterBgActive: 'bg-blue-500/10',
    filterTextActive: 'text-blue-600 dark:text-blue-400',
    filterBorderActive: 'border-blue-500/50',
  },
  'ucc-lien': {
    key: 'ucc-lien',
    label: 'UCC/Lien',
    pluralLabel: 'UCC & Liens',
    color: 'red-500',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500',
    textColor: 'text-red-600',
    darkTextColor: 'dark:text-red-400',
    filterBgActive: 'bg-red-500/10',
    filterTextActive: 'text-red-600 dark:text-red-400',
    filterBorderActive: 'border-red-500/50',
  },
  other: {
    key: 'other',
    label: 'Other',
    pluralLabel: 'Other Documents',
    color: 'gray-500',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-600',
    darkTextColor: 'dark:text-gray-400',
    filterBgActive: 'bg-gray-500/10',
    filterTextActive: 'text-gray-600 dark:text-gray-400',
    filterBorderActive: 'border-gray-500/50',
  },
};

/**
 * Get the category of a transaction
 */
export function getTransactionCategory(transaction: Transaction): DocumentCategory {
  if (transaction.isDeed) return 'deed';
  if (transaction.isMortgage) return 'mortgage';
  if (transaction.isUccLien) return 'ucc-lien';
  return 'other';
}

/**
 * Get category metadata for a transaction
 */
export function getCategoryMetadata(transaction: Transaction): CategoryMetadata {
  const category = getTransactionCategory(transaction);
  return CATEGORY_METADATA[category];
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
    classCodeDescription: doc.classCodeDescription,
    isDeed: doc.isDeed,
    isMortgage: doc.isMortgage,
    isUccLien: doc.isUccLien,
    isOtherDocument: doc.isOtherDocument,
    partyDetails: doc.partyDetails,
  };
}

