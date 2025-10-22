import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyAutocomplete } from '@/components/search/PropertyAutocomplete';

interface PropertyPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { bbl } = await params;

  return {
    title: `Property ${bbl} | NYC Lens`,
    description: `View property details, documents, and transaction history for BBL ${bbl}`,
  };
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format (e.g., "1-11-111" -> borough: 1, block: 11, lot: 111)
  const bblParts = bbl.split('-');

  if (bblParts.length !== 3) {
    notFound();
  }

  const [borough, block, lot] = bblParts;

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {/* Search Header */}
      <div className="border-b border-foreground/20 bg-background px-6 py-3">
        <PropertyAutocomplete compact initialValue={address || ''} autoFocus={false} />
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-screen-xl space-y-6">
          {/* Property Information Card */}
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Property Information
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-foreground/70">Borough</dt>
                <dd className="mt-1 text-base text-foreground">{borough}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground/70">Block</dt>
                <dd className="mt-1 text-base text-foreground">{block}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground/70">Lot</dt>
                <dd className="mt-1 text-base text-foreground">{lot}</dd>
              </div>
            </dl>
          </div>

          {/* Placeholder for additional sections */}
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Documents & Transactions
            </h2>
            <p className="text-sm text-foreground/70">
              Document history will be displayed here.
            </p>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Parties
            </h2>
            <p className="text-sm text-foreground/70">
              Associated parties will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

