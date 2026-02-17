import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../PropertyPageLayout';
import { OverviewTab } from './OverviewTab';
import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';
import { fetchOwnerContacts } from '@/data/contacts';
import { fetchPropertyValuation } from '@/data/valuation';
import { BOROUGH_NAMES } from '@/constants/nyc';
import { BUILDING_CLASS_CODE_MAP } from '@/constants/building';

// Revalidate property data every hour
export const revalidate = 3600;

interface OverviewPageProps {
  params: Promise<{
    bbl: string;
  }>;
  searchParams: Promise<{
    address?: string;
  }>;
}

export async function generateMetadata({ params }: OverviewPageProps): Promise<Metadata> {
  const { bbl } = await params;

  // Parse BBL to get borough
  const bblParts = bbl.split('-');
  const boroughCode = bblParts[0];
  const borough = BOROUGH_NAMES[boroughCode] || 'NYC';

  // Fetch property data for metadata
  let address = `BBL ${bbl}`;
  let buildingInfo = '';

  try {
    const [plutoResult, propertyResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
    ]);

    // Get address from property data or PLUTO
    if (propertyResult?.address) {
      address = propertyResult.address;
    } else if (plutoResult.data?.address) {
      address = plutoResult.data.address;
    }

    // Build additional context from PLUTO data
    if (plutoResult.data) {
      const { bldgclass, yearbuilt, unitstotal, bldgarea } = plutoResult.data;
      const parts: string[] = [];

      if (bldgclass && BUILDING_CLASS_CODE_MAP[bldgclass]) {
        const buildingType = BUILDING_CLASS_CODE_MAP[bldgclass];
        parts.push(buildingType);
      }

      if (yearbuilt) {
        parts.push(`Built in ${yearbuilt}`);
      }

      if (unitstotal && Number(unitstotal) > 0) {
        const unitsNum = Number(unitstotal);
        parts.push(`${unitsNum} ${unitsNum === 1 ? 'unit' : 'units'}`);
      }

      if (bldgarea && Number(bldgarea) > 0) {
        parts.push(`${Number(bldgarea).toLocaleString()} sq ft`);
      }

      if (parts.length > 0) {
        buildingInfo = ` ${parts.join(', ')}.`;
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  const title = `${address}, ${borough} - NYC Property Records | BBL Club`;
  const description = `View comprehensive property information for ${address} in ${borough}. Access ownership records, sales history, tax assessments, building details, and contact information from official NYC databases.${buildingInfo}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/property/${bbl}/overview`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function OverviewPage({ params, searchParams }: OverviewPageProps) {
  const { bbl } = await params;
  const { address } = await searchParams;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch PLUTO data, Elasticsearch property data, contacts, and valuation data with error handling
  let plutoData = null;
  let propertyData = null;
  let contactsData = null;
  let valuationData = null;
  let error: string | undefined;

  try {
    const [plutoResult, acrisResult, contactsResult, valuationResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
      fetchOwnerContacts(bbl),
      fetchPropertyValuation(bbl),
    ]);
    plutoData = plutoResult.data;
    propertyData = acrisResult;
    contactsData = contactsResult.data;
    valuationData = valuationResult.data;
  } catch (e) {
    console.error('Error fetching property data:', e);
    error = e instanceof Error ? e.message : 'Failed to load property data';
  }

  // Generate structured data for SEO
  const propertyAddress = propertyData?.address || plutoData?.address;
  const zipcode = plutoData?.zipcode;
  const latitude = plutoData?.latitude;
  const longitude = plutoData?.longitude;
  const boroughCode = bbl.split('-')[0];
  const borough = BOROUGH_NAMES[boroughCode] || 'NYC';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": propertyAddress || `BBL ${bbl}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": propertyAddress,
      "addressLocality": borough,
      "addressRegion": "NY",
      "postalCode": zipcode,
      "addressCountry": "US"
    },
    ...(latitude && longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude
      }
    }),
    "identifier": bbl,
  };

  return (
    <>
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PropertyPageLayout bbl={bbl} activeTab="overview" address={address}>
        <OverviewTab
          plutoData={plutoData}
          propertyData={propertyData}
          contactsData={contactsData}
          valuationData={valuationData}
          error={error}
          bbl={bbl}
        />
      </PropertyPageLayout>
    </>
  );
}

