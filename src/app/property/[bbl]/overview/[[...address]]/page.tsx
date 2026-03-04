import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PropertyPageLayout } from '../../PropertyPageLayout';
import { OverviewTab } from '../OverviewTab';
import { getPropertyData, getCondoInfo } from '../../utils/getPropertyData';
import { fetchPlutoData } from '@/data/pluto';
import { fetchCondoUnits } from '@/data/acris';
import { fetchOwnerContacts } from '@/data/contacts';
import { fetchPropertyValuation } from '@/data/valuation';
import { getBoroughDisplayName } from '@/constants/nyc';
import { formatBuildingClassForProse } from '@/constants/building';
import { formatFullAddress } from '@/utils/formatters';
import { getFormattedAddressForMetadata, getCanonicalUrl } from '../../utils/metadata';
import type { CondoContext } from '../utils';

// Revalidate property data every hour
export const revalidate = 3600;

interface OverviewPageProps {
  params: Promise<{
    bbl: string;
    address?: string[];
  }>;
}

export async function generateMetadata({ params }: OverviewPageProps): Promise<Metadata> {
  const { bbl } = await params;

  // Get formatted address using shared utility
  const fullFormattedAddress = await getFormattedAddressForMetadata(bbl);

  // Build additional context from PLUTO data
  let buildingInfo = '';
  try {
    const plutoResult = await fetchPlutoData(bbl);
    if (plutoResult.data) {
      const { bldgclass, yearbuilt, unitstotal, bldgarea } = plutoResult.data;
      const parts: string[] = [];

      if (bldgclass) {
        const buildingType = formatBuildingClassForProse(bldgclass);
        if (buildingType !== 'property') {
          parts.push(buildingType.charAt(0).toUpperCase() + buildingType.slice(1));
        }
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
    console.error('Error fetching building info:', error);
  }

  const title = `${fullFormattedAddress} - NYC Property Records`;
  const description = `${fullFormattedAddress}: View ownership, sales history, tax assessments, building details & contacts from official NYC databases.${buildingInfo ? ` ${buildingInfo}` : ''}`;

  const canonical = await getCanonicalUrl(bbl, 'overview');

  return {
    title,
    description,
    // Add applicationName for site branding in search results
    applicationName: 'BBL Club',
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      siteName: 'BBL Club',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@bblclub',
    },
  };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { bbl, address: addressSegments } = await params;

  // Parse BBL format
  const bblParts = bbl.split('-');
  if (bblParts.length !== 3) {
    notFound();
  }

  // Fetch property data
  // Note: getPropertyData fetches PLUTO & ACRIS from cache (warmed by layout.tsx)
  const { plutoData, propertyData, error: propertyError } = await getPropertyData(bbl);

  const { isCondoUnit, isBillingLot, billingLot, billingLotBbl } = getCondoInfo(propertyData, bblParts);

  // Fetch additional data needed for overview page
  let contactsData = null;
  let valuationData = null;
  let condoContext: CondoContext | null = null;
  let error: string | undefined = propertyError;

  try {
    // Build parallel fetch array: always fetch contacts + valuation,
    // and conditionally fetch condo-specific data
    const [contactsResult, valuationResult, billingLotPlutoResult, condoUnitsResult] =
      await Promise.all([
        fetchOwnerContacts(bbl),
        fetchPropertyValuation(bbl),
        billingLotBbl ? fetchPlutoData(billingLotBbl) : Promise.resolve(null),
        isCondoUnit
          ? fetchCondoUnits(bblParts[0], bblParts[1], billingLot!)
          : isBillingLot
            ? fetchCondoUnits(bblParts[0], bblParts[1], bblParts[2])
            : Promise.resolve(null),
      ]);

    contactsData = contactsResult.data;
    valuationData = valuationResult.data;

    if (isCondoUnit || isBillingLot) {
      const billingLotPluto = isCondoUnit
        ? (billingLotPlutoResult?.data ?? null)
        : null;
      const units = (condoUnitsResult ?? []).map((record) => ({
        bbl: `${record.borough}-${record.block}-${record.lot}`,
        unit: record.unit,
        buildingClass: record.avroll_building_class || null,
        owner: record.buyer_name || null,
        saleAmount: record.sale_document_amount ?? null,
        saleDate: record.sale_document_date || null,
        mortgageAmount: record.mortgage_document_amount ?? null,
        lender: record.lender_name || null,
      }));

      condoContext = {
        isCondoUnit,
        billingLot: isCondoUnit ? billingLot : bblParts[2],
        billingLotBbl: isCondoUnit ? billingLotBbl : bbl,
        billingLotPluto,
        condoUnits: units,
      };
    }
  } catch (e) {
    console.error('Error fetching additional property data:', e);
    error = e instanceof Error ? e.message : 'Failed to load property data';
  }

  // Generate structured data for SEO
  const streetAddress = propertyData?.address_with_unit || plutoData?.address;
  const unit = propertyData?.unit || undefined;
  const zipcode = propertyData?.zip_code ?? plutoData?.zipcode;
  const latitude = plutoData?.latitude;
  const longitude = plutoData?.longitude;
  const boroughCode = parseInt(bbl.split('-')[0]);
  const borough = getBoroughDisplayName(boroughCode) || 'NYC';

  // Build formatted full address using formatFullAddress
  const fullFormattedAddress = streetAddress && zipcode
    ? formatFullAddress(streetAddress, undefined, boroughCode, zipcode)
    : streetAddress
      ? `${streetAddress}, ${borough}, NY`
      : `BBL ${bbl}`;

  const baseUrl = 'https://bblclub.com';
  const propertyUrl = `${baseUrl}/property/${bbl}`;

  // Place structured data
  const placeData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": fullFormattedAddress,
    "url": `${propertyUrl}/overview`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": unit ? `${streetAddress} ${unit}` : streetAddress,
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

  // Breadcrumb structured data for navigation hierarchy
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Property Search",
        "item": `${baseUrl}/search`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": fullFormattedAddress,
        "item": `${propertyUrl}/overview`
      }
    ]
  };

  // Website structured data (without SearchAction since search is autocomplete-only, not URL-based)
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BBL Club",
    "url": baseUrl,
    "description": "NYC Real Estate Data - Property records, ownership, transactions, and tax information"
  };

  // ItemList to hint important sub-pages for sitelinks
  const sitelinksData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Property Information Sections",
    "description": "Key sections of property information available",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Overview",
        "url": `${propertyUrl}/overview`,
        "description": "Property overview with building details and ownership"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Owner Contacts",
        "url": `${propertyUrl}/contacts`,
        "description": "Contact information for property owners"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Transactions History",
        "url": `${propertyUrl}/transactions`,
        "description": "Sales history, mortgages, and deeds"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Tax Assessment",
        "url": `${propertyUrl}/tax`,
        "description": "Property tax records and assessments"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Building Information",
        "url": `${propertyUrl}/pluto`,
        "description": "PLUTO building characteristics and zoning"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "DOB Violations",
        "url": `${propertyUrl}/dob/violations`,
        "description": "Department of Buildings violations and permits"
      }
    ]
  };

  return (
    <>
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksData) }}
      />

      <PropertyPageLayout bbl={bbl} activeTab="overview" address={streetAddress || undefined}>
        <OverviewTab
          plutoData={plutoData}
          propertyData={propertyData}
          contactsData={contactsData}
          valuationData={valuationData}
          condoContext={condoContext}
          error={error}
          bbl={bbl}
          fullFormattedAddress={fullFormattedAddress}
          addressSegment={addressSegments?.[0]}
        />
      </PropertyPageLayout>
    </>
  );
}

