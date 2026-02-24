import type { ReactNode } from 'react';
import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';
import { PropertyDataProvider } from './PropertyDataContext';

interface PropertyLayoutProps {
  children: ReactNode;
  params: Promise<{
    bbl: string;
  }>;
}

/**
 * Common layout for all property [bbl] routes.
 *
 * Fetches shared data (PLUTO & ACRIS) once at the layout level and provides it
 * to all descendant pages via PropertyDataContext. This eliminates duplicate fetches
 * and centralizes the common data loading logic.
 *
 * With React.cache() on the data functions, even if pages fetch directly,
 * they'll get the cached results from this layout's initial fetch.
 */
export default async function PropertyLayout({ children, params }: PropertyLayoutProps) {
  const { bbl } = await params;

  // Fetch shared data that most property pages need
  // React.cache() ensures these are deduplicated within the same request
  const [plutoResult, propertyData] = await Promise.all([
    fetchPlutoData(bbl),
    fetchPropertyByBBL(bbl),
  ]);

  return (
    <PropertyDataProvider
      plutoData={plutoResult.data}
      propertyData={propertyData}
      bbl={bbl}
    >
      {children}
    </PropertyDataProvider>
  );
}
