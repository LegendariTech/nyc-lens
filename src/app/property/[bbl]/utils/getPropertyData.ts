import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';
import type { PlutoData } from '@/data/pluto';
import type { AcrisRecord } from '@/types/acris';

export interface PropertyDataResult {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  error?: string;
}

export interface CondoInfo {
  isCondoUnit: boolean;
  isBillingLot: boolean;
  billingLot: string | null;
  billingLotBbl: string | null;
}

/**
 * Detect condo status from ACRIS property data and BBL parts.
 *
 * - **Condo unit**: has a `billing_lot` field pointing to the building-level record
 * - **Billing lot**: the building-level record itself — NYC assigns lot numbers >= 7500
 *   to condo billing lots (DOF convention), with "R"-prefix building class codes (R0-R9, RA-RW)
 */
export function getCondoInfo(propertyData: AcrisRecord | null, bblParts: string[]): CondoInfo {
  const billingLot = propertyData?.billing_lot || null;
  const isCondoUnit = billingLot != null;
  const billingLotBbl = isCondoUnit
    ? `${bblParts[0]}-${bblParts[1]}-${billingLot}`
    : null;

  const lotNum = parseInt(bblParts[2], 10);
  const bldgClass = propertyData?.avroll_building_class || '';
  const isBillingLot = !isCondoUnit && lotNum >= 7500 && bldgClass.startsWith('R');

  return { isCondoUnit, isBillingLot, billingLot, billingLotBbl };
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
