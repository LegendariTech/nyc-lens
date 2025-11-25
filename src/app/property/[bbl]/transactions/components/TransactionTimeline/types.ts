export interface Transaction {
  id: string;
  type: string;
  docType: string;
  date: string;
  amount: number;
  party1: string;
  party2: string;
  party1Type: string;
  party2Type: string;
  documentId?: string;
}

