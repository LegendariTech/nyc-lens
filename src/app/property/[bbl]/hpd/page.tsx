import { notFound } from 'next/navigation';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { HpdTab } from './HpdTab';

interface HpdPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function HpdPage({ params, searchParams }: HpdPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  return (
    <PropertyPageLayout bbl={bbl} activeTab="hpd" address={address}>
      <HpdTab bbl={bbl} />
    </PropertyPageLayout>
  );
}

