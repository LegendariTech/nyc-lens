/**
 * Sitemap Generation Script
 *
 * Generates sitemap files for SEO with scalable structure:
 * - sitemap-index.xml (main index)
 * - sitemap-static.xml (homepage, search, bulk-search, etc.)
 * - sitemap-properties-1.xml, sitemap-properties-2.xml, etc. (property pages)
 *
 * Usage:
 *   npx tsx scripts/generate-sitemap.ts
 *
 * Output:
 *   public/sitemap.xml (main sitemap index)
 *   public/sitemap-static.xml
 *   public/sitemap-properties-1.xml
 */

import { Client } from '@elastic/elasticsearch';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { addressToSlug } from '../src/utils/urlSlug';
import { BOROUGH_NAMES } from '../src/constants/nyc';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = 'https://bblclub.com';
const PUBLIC_DIR = join(process.cwd(), 'public');
const PROPERTIES_PER_SITEMAP = 10000; // Google's limit is 50k URLs per sitemap
const TEST_MODE = true; // Set to false for production to include all properties

interface PropertyForSitemap {
  borough: string;
  block: string;
  lot: string;
  address: string;
  zip_code?: string;
  mortgage_document_date?: string;
}

/**
 * Create Elasticsearch client
 */
function createElasticsearchClient(): Client {
  const node = process.env.ELASTICSEARCH_NODE;
  const username = process.env.ELASTICSEARCH_USERNAME;
  const password = process.env.ELASTICSEARCH_PASSWORD;

  if (!node || !username || !password) {
    throw new Error('Missing Elasticsearch credentials in .env.local');
  }

  return new Client({
    node,
    auth: { username, password },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Fetch properties from Elasticsearch for sitemap
 */
async function fetchPropertiesForSitemap(
  limit: number = 50
): Promise<PropertyForSitemap[]> {
  const client = createElasticsearchClient();
  const indexName = process.env.ELASTICSEARCH_ACRIS_INDEX_NAME || 'acris_search_v_6_1';

  try {
    const response = await client.search({
      index: indexName,
      size: limit,
      _source: ['borough', 'block', 'lot', 'address', 'zip_code', 'mortgage_document_date'],
      query: {
        bool: {
          must: [
            // Must have an address
            {
              exists: {
                field: 'address',
              },
            },
            // Address must not be empty
            {
              bool: {
                must_not: {
                  term: {
                    'address.keyword': '',
                  },
                },
              },
            },
          ],
        },
      },
      sort: [
        {
          mortgage_document_date: {
            order: 'desc',
            missing: '_last',
          },
        },
      ],
    });

    const hits = response.hits.hits as Array<{ _source: PropertyForSitemap }>;
    return hits.map(hit => hit._source);
  } catch (error) {
    console.error('Error fetching properties from Elasticsearch:', error);
    throw error;
  }
}

/**
 * Generate XML for a URL entry
 */
function generateUrlEntry(
  loc: string,
  lastmod?: string,
  changefreq?: string,
  priority?: string
): string {
  return `  <url>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}${changefreq ? `
    <changefreq>${changefreq}</changefreq>` : ''}${priority ? `
    <priority>${priority}</priority>` : ''}
  </url>`;
}

/**
 * Generate sitemap XML wrapper
 */
function generateSitemapXml(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

/**
 * Generate sitemap index XML
 */
function generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod: string }>): string {
  const entries = sitemaps.map(
    sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

/**
 * Generate static pages sitemap
 */
function generateStaticSitemap(): string {
  const now = new Date().toISOString();

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/search', priority: '0.9', changefreq: 'daily' },
    { url: '/bulk-search', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookies', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  ];

  const urls = staticPages.map(page =>
    generateUrlEntry(
      `${BASE_URL}${page.url}`,
      now,
      page.changefreq,
      page.priority
    )
  );

  return generateSitemapXml(urls);
}

/**
 * Generate property pages sitemap
 */
function generatePropertySitemap(
  properties: PropertyForSitemap[],
  batchNumber: number = 1
): string {
  const urls = properties.map(property => {
    const bbl = `${property.borough}-${property.block}-${property.lot}`;
    const boroughName = BOROUGH_NAMES[property.borough.toString()] || '';

    // Generate SEO-friendly URL with address slug
    const addressSlug = addressToSlug(
      property.address,
      boroughName,
      'NY',
      property.zip_code
    );

    const url = addressSlug
      ? `${BASE_URL}/property/${bbl}/overview/${addressSlug}`
      : `${BASE_URL}/property/${bbl}/overview`;

    // Use mortgage date as last modified, or current date
    const lastmod = property.mortgage_document_date || new Date().toISOString();

    return generateUrlEntry(url, lastmod, 'monthly', '0.7');
  });

  return generateSitemapXml(urls);
}

/**
 * Main sitemap generation function
 */
async function generateSitemaps() {
  console.log('🗺️  Starting sitemap generation...\n');

  // Ensure public directory exists
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const now = new Date().toISOString();
  const sitemapFiles: Array<{ loc: string; lastmod: string }> = [];

  // 1. Generate static pages sitemap
  console.log('📄 Generating static pages sitemap...');
  const staticSitemap = generateStaticSitemap();
  const staticPath = join(PUBLIC_DIR, 'sitemap-static.xml');
  writeFileSync(staticPath, staticSitemap, 'utf-8');
  console.log(`   ✅ Created: sitemap-static.xml (5 pages)\n`);

  sitemapFiles.push({
    loc: `${BASE_URL}/sitemap-static.xml`,
    lastmod: now,
  });

  // 2. Fetch properties from Elasticsearch
  const limit = TEST_MODE ? 50 : PROPERTIES_PER_SITEMAP;
  console.log(`🏢 Fetching properties from Elasticsearch (limit: ${limit})...`);
  const properties = await fetchPropertiesForSitemap(limit);
  console.log(`   ✅ Found ${properties.length} properties with addresses\n`);

  // 3. Generate property sitemaps (split into batches if needed)
  const batches = Math.ceil(properties.length / PROPERTIES_PER_SITEMAP);

  for (let i = 0; i < batches; i++) {
    const start = i * PROPERTIES_PER_SITEMAP;
    const end = Math.min(start + PROPERTIES_PER_SITEMAP, properties.length);
    const batch = properties.slice(start, end);
    const batchNumber = i + 1;

    console.log(`📋 Generating property sitemap batch ${batchNumber}/${batches}...`);
    const propertySitemap = generatePropertySitemap(batch, batchNumber);
    const filename = `sitemap-properties-${batchNumber}.xml`;
    const filepath = join(PUBLIC_DIR, filename);
    writeFileSync(filepath, propertySitemap, 'utf-8');
    console.log(`   ✅ Created: ${filename} (${batch.length} properties)\n`);

    sitemapFiles.push({
      loc: `${BASE_URL}/${filename}`,
      lastmod: now,
    });
  }

  // 4. Generate main sitemap index as sitemap.xml
  console.log('📑 Generating main sitemap...');
  const sitemapIndex = generateSitemapIndex(sitemapFiles);
  const sitemapPath = join(PUBLIC_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemapIndex, 'utf-8');
  console.log(`   ✅ Created: sitemap.xml (${sitemapFiles.length} sub-sitemaps)\n`);

  // Summary
  console.log('✨ Sitemap generation complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Static pages: 5`);
  console.log(`   - Property pages: ${properties.length}`);
  console.log(`   - Total sitemaps: ${sitemapFiles.length}`);
  console.log(`   - Main file: public/sitemap.xml\n`);
  console.log('🌐 Submit to Google Search Console:');
  console.log(`   ${BASE_URL}/sitemap.xml`);
}

// Run the script
generateSitemaps()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  });
