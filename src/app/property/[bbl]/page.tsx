import { redirect } from 'next/navigation';

interface PropertyPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Redirect to pluto tab by default
  redirect(`/property/${bbl}/pluto${address ? `?address=${address}` : ''}`);
}

