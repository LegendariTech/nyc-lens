/**
 * Structured Data Component
 *
 * Adds JSON-LD structured data to pages to improve search appearance.
 * Helps Google understand site structure and potentially show sitelinks.
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type: 'property' | 'website';
  breadcrumbs?: BreadcrumbItem[];
  propertyData?: {
    bbl: string;
    address?: string;
    borough?: string;
  };
}

export function StructuredData({ type, breadcrumbs, propertyData }: StructuredDataProps) {
  const baseUrl = 'https://bblclub.com';

  // Organization schema (for all pages)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BBL Club',
    alternateName: 'Open Block',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Search NYC real estate data, uncover property owners, and access comprehensive tax and building information.',
    sameAs: [
      // Add social media profiles when available
    ],
  };

  // Website schema with potential actions
  const websiteSchema = type === 'website' ? {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BBL Club',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  } : null;

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } : null;

  // Property page schema with sitelinks
  const propertySchema = type === 'property' && propertyData ? {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyData.address || `Property ${propertyData.bbl}`,
    url: `${baseUrl}/property/${propertyData.bbl}/overview`,
    address: propertyData.address ? {
      '@type': 'PostalAddress',
      streetAddress: propertyData.address,
      addressLocality: propertyData.borough || 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    } : undefined,
  } : null;

  const schemas = [
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
    propertySchema,
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
