import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';
import type { PlutoData } from '@/data/pluto';
import type { AcrisRecord } from '@/types/acris';

export interface PropertyDataResult {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  error?: string;
}

/**
 * Fetch shared property data (PLUTO & ACRIS) for a given BBL.
 *
 * **Important**: The layout.tsx already fetches this data and warms the React.cache().
 * When you call this function from any page, you'll get instant cached results - no duplicate database queries!
 *
 * This provides a clean API for pages to access the shared data without directly coupling to the layout's implementation.
 *
 * @param bbl - BBL in format "1-13-1"
 * @returns Object containing plutoData, propertyData, and optional error
 *
 * @example
 * ```tsx
 * // In any property page (Server Component)
 * export default async function MyPage({ params }: PageProps) {
 *   const { bbl } = await params;
 *   const { plutoData, propertyData } = await getPropertyData(bbl);
 *
 *   return <div>Address: {propertyData?.address}</div>;
 * }
 * ```
 */
export async function getPropertyData(bbl: string): Promise<PropertyDataResult> {
  try {
    // These calls return instantly from cache (warmed by layout.tsx)
    const [plutoResult, propertyData] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
    ]);

    return {
      plutoData: plutoResult.data,
      propertyData,
    };
  } catch (e) {
    console.error('Error fetching property data:', e);
    return {
      plutoData: null,
      propertyData: null,
      error: e instanceof Error ? e.message : 'Failed to load property data',
    };
  }
}
