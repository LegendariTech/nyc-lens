import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { fetchTransactionsWithParties, DocumentWithParties } from '@/data/acris';
import { TransactionsView } from '../components/TransactionsView';
import { mapDocumentToTransaction } from '../components/TransactionTimeline/utils';
import { parseAddressFromUrl } from '@/utils/urlSlug';
import { getFormattedAddressForMetadata } from '../../utils/metadata';

interface TransactionsPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export async function generateMetadata({ params }: TransactionsPageProps): Promise<Metadata> {
  const { bbl } = await params;
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  return {
    title: `${fullFormattedAddress} - Property Transactions`,
    description: `View all ACRIS property transactions, sales, mortgages, and deeds for ${fullFormattedAddress}. Complete transaction history from NYC Department of Finance records.`,
    openGraph: {
      title: `${fullFormattedAddress} - Property Transactions`,
      description: `ACRIS transaction history for ${fullFormattedAddress}`,
    },
  };
}

export default async function TransactionsPage({ params, searchParams }: TransactionsPageProps) {
  const { bbl, address: addressSegments } = await params;
  const { address: queryAddress } = await searchParams;

  const address = parseAddressFromUrl(addressSegments) || queryAddress;

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
      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Transactions</h3>
          <p className="text-sm text-red-600/80">{error}</p>
        </div>
      ) : (
        <TransactionsView
          transactions={transactions.map(mapDocumentToTransaction)}
          bbl={bbl}
          address={address}
        />
      )}
    </PropertyPageLayout>
  );
}

