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

export interface Transaction {
  id: string;
  type: string;
  docType: string;
  date: string;
  amount: number;
  party1: string[];
  party2: string[];
  party1Type: string;
  party2Type: string;
  documentId?: string;
  classCodeDescription: string;
  isDeed: boolean;
  isMortgage: boolean;
  isUccLien: boolean;
  isOtherDocument: boolean;
  partyDetails?: PartyDetail[];
}

export type DocumentCategory = 'deed' | 'mortgage' | 'ucc-lien' | 'other';

export interface CategoryMetadata {
  key: DocumentCategory;
  label: string;
  pluralLabel: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  darkTextColor: string;
  filterBgActive: string;
  filterTextActive: string;
  filterBorderActive: string;
}

