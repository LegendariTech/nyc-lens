import { fetchPlutoData } from '@/data/pluto';
import { PlutoTabDisplay } from './PlutoTabDisplay';

interface PlutoTabProps {
  bbl: string;
}

export async function PlutoTab({ bbl }: PlutoTabProps) {
  const { data, metadata, error } = await fetchPlutoData(bbl);

  return <PlutoTabDisplay data={data} metadata={metadata} error={error} bbl={bbl} />;
}

