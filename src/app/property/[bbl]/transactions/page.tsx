import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { fetchTransactionsWithParties, DocumentWithParties } from '@/data/acris';
import { TransactionTimeline } from './components/TransactionTimeline';
import { mapDocumentToTransaction } from './components/TransactionTimeline/utils';

interface TransactionsPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function TransactionsPage({ params, searchParams }: TransactionsPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch transactions with error handling
  let transactions: DocumentWithParties[] = [];
  let error: string | undefined;

  try {
    transactions = await fetchTransactionsWithParties(bbl);
  } catch (e) {
    console.error('Error fetching transactions:', e);
    error = e instanceof Error ? e.message : 'Failed to load transactions';
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="transactions" address={address}>
      <div className="space-y-6">
        {error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Transactions</h3>
            <p className="text-sm text-red-600/80">{error}</p>
          </div>
        ) : (
          <TransactionTimeline
            transactions={transactions.map(mapDocumentToTransaction)}
          />
        )}
      </div>
    </PropertyPageLayout>
  );
}

