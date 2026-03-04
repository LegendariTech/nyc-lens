import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { PlutoTabDisplay } from '../components/PlutoTabDisplay';
import { getPropertyData, getCondoInfo } from '../../utils/getPropertyData';
import { fetchPlutoData } from '@/data/pluto';
import { getFormattedAddressForMetadata, getCanonicalUrl } from '../../utils/metadata';

interface PlutoPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
}

export async function generateMetadata({ params }: PlutoPageProps): Promise<Metadata> {
  const { bbl } = await params;
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  const canonical = await getCanonicalUrl(bbl, 'pluto');

  return {
    title: `${fullFormattedAddress} - Building Information`,
    description: `View PLUTO building data for ${fullFormattedAddress}. Property characteristics, lot size, zoning, building class, units, square footage, and construction details from NYC Department of City Planning.`,
    alternates: { canonical },
    openGraph: {
      title: `${fullFormattedAddress} - Building Information`,
      description: `PLUTO property data for ${fullFormattedAddress}`,
    },
  };
}

export default async function PlutoPage({ params }: PlutoPageProps) {
  const { bbl } = await params;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Get propertyData for address extraction and condo detection (returns instantly from cache)
  const { propertyData } = await getPropertyData(bbl);
  const { isCondoUnit, billingLotBbl } = getCondoInfo(propertyData, bblParts);

  // Fetch PLUTO data — for condo units, also fetch the billing lot's PLUTO (building-level data)
  const [unitPluto, billingLotPluto] = await Promise.all([
    fetchPlutoData(bbl),
    billingLotBbl ? fetchPlutoData(billingLotBbl) : Promise.resolve(null),
  ]);

  // For condo units, display the billing lot's PLUTO data (building info)
  // Fall back to unit's own PLUTO if billing lot fetch fails
  const useBillingLot = isCondoUnit && billingLotPluto?.data != null;
  const data = useBillingLot ? billingLotPluto!.data : unitPluto.data;
  const metadata = useBillingLot ? billingLotPluto!.metadata : unitPluto.metadata;
  const error = useBillingLot ? billingLotPluto!.error : unitPluto.error;

  // Extract street address from shared data
  const streetAddress = propertyData?.address_with_unit || unitPluto.data?.address;

  return (
    <PropertyPageLayout bbl={bbl} activeTab="pluto" address={streetAddress || undefined}>
      <PlutoTabDisplay data={data} metadata={metadata} error={error} bbl={bbl} billingLotBbl={useBillingLot ? billingLotBbl! : undefined} />
    </PropertyPageLayout>
  );
}

