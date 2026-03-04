import { redirect } from 'next/navigation';
import { getPropertyData } from './utils/getPropertyData';
import { buildPropertyUrl } from '@/utils/urlSlug';
import { getBoroughDisplayName } from '@/constants/nyc';

interface PropertyPageProps {
  params: Promise<{
    bbl: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { bbl } = await params;

  // Look up property address to build SEO-friendly redirect URL
  const { plutoData, propertyData } = await getPropertyData(bbl);
  const street = propertyData?.address_with_unit || plutoData?.address;
  const borough = getBoroughDisplayName(bbl.split('-')[0]);
  const zip = propertyData?.zip_code || (plutoData?.zipcode ? String(plutoData.zipcode) : undefined);

  const url = buildPropertyUrl(bbl, 'transactions', street ? { street, borough, state: 'NY', zip } : undefined);
  redirect(url);
}

