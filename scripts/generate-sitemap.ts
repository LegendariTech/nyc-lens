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
import { getBoroughDisplayName } from '../src/constants/nyc';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = 'https://bblclub.com';
const PUBLIC_DIR = join(process.cwd(), 'public');
const PROPERTIES_PER_SITEMAP = 10000; // Google's limit is 50k URLs per sitemap
const TEST_MODE = false; // Set to true to limit to 50 properties for testing
const MAX_RETRIES = 3; // Retry failed Elasticsearch queries

interface PropertyForSitemap {
  borough: string;
  block: string;
  lot: string;
  address_with_unit: string;
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
 * Fetch total count of properties with addresses
 */
async function getTotalPropertiesCount(client: Client, indexName: string): Promise<number> {
  const response = await client.count({
    index: indexName,
    query: {
      bool: {
        must: [
          { exists: { field: 'address_with_unit' } },
          { bool: { must_not: { term: { 'address_with_unit.keyword': '' } } } },
        ],
      },
    },
  });
  return response.count;
}

/**
 * Fetch properties from Elasticsearch using search_after for efficient pagination
 */
async function fetchPropertiesBatch(
  client: Client,
  indexName: string,
  batchSize: number,
  searchAfter?: Array<string | number>
): Promise<{ properties: PropertyForSitemap[]; nextSearchAfter?: Array<string | number> }> {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const searchParams: any = {
        index: indexName,
        size: batchSize,
        _source: ['borough', 'block', 'lot', 'address_with_unit', 'zip_code', 'mortgage_document_date'],
        query: {
          bool: {
            must: [
              { exists: { field: 'address_with_unit' } },
              { exists: { field: 'street_name' } }, // Must have street name
              { bool: { must_not: { term: { 'address_with_unit.keyword': '' } } } },
            ],
          },
        },
        sort: [
          { 'borough.integer': 'asc' }, // Sort by BBL (safe, always valid)
          { 'block.integer': 'asc' },
          { 'lot.integer': 'asc' },
        ],
      };

      if (searchAfter) {
        searchParams.search_after = searchAfter;
      }

      const response = await client.search(searchParams);
      const hits = response.hits.hits as Array<{ _source: PropertyForSitemap; sort: Array<string | number> }>;

      const properties = hits.map(hit => hit._source);
      const nextSearchAfter = hits.length > 0 ? hits[hits.length - 1].sort : undefined;

      return { properties, nextSearchAfter };
    } catch (error) {
      attempts++;
      if (attempts >= MAX_RETRIES) {
        console.error(`\n❌ Failed after ${MAX_RETRIES} attempts:`, error);
        throw error;
      }
      console.log(`\n⚠️  Attempt ${attempts} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
    }
  }

  return { properties: [], nextSearchAfter: undefined };
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
 * Determine priority based on mortgage date
 * - Recent activity (>= 2020): 0.7 (high priority)
 * - Older activity (< 2020): 0.6 (medium priority)
 * - No mortgage date: 0.5 (low priority)
 */
function getPriorityForProperty(mortgageDate?: string): string {
  if (!mortgageDate) {
    return '0.5'; // No mortgage date
  }

  const date = new Date(mortgageDate);
  const year = date.getFullYear();

  // Check if valid date (between 1900-2100)
  if (year < 1900 || year > 2100) {
    return '0.5'; // Invalid date, treat as no date
  }

  if (year >= 2020) {
    return '0.7'; // Recent activity
  }

  return '0.6'; // Older activity
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
    // Use getBoroughDisplayName to convert Manhattan → "New York" for addresses
    const boroughName = getBoroughDisplayName(property.borough);

    // Generate SEO-friendly URL with address slug
    const addressSlug = addressToSlug(
      property.address_with_unit,
      boroughName,
      'NY',
      property.zip_code
    );

    const url = addressSlug
      ? `${BASE_URL}/property/${bbl}/overview/${addressSlug}`
      : `${BASE_URL}/property/${bbl}/overview`;

    // Use mortgage date as last modified, or current date
    const lastmod = property.mortgage_document_date || new Date().toISOString();

    // Determine priority based on mortgage date
    const priority = getPriorityForProperty(property.mortgage_document_date);

    return generateUrlEntry(url, lastmod, 'monthly', priority);
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

  // 2. Get total count and initialize pagination
  const client = createElasticsearchClient();
  const indexName = process.env.ELASTICSEARCH_ACRIS_INDEX_NAME || 'acris_search_v_6_1';

  console.log('🏢 Fetching total property count from Elasticsearch...');
  const totalCount = await getTotalPropertiesCount(client, indexName);
  const limit = TEST_MODE ? 50 : totalCount;
  console.log(`   ✅ Found ${totalCount.toLocaleString()} total properties with addresses`);
  console.log(`   📊 Generating sitemaps for ${limit.toLocaleString()} properties\n`);

  // 3. Generate property sitemaps using search_after pagination
  let processedCount = 0;
  let batchNumber = 0;
  let searchAfter: Array<string | number> | undefined = undefined;
  const startTime = Date.now();

  while (processedCount < limit) {
    const batchSize = Math.min(PROPERTIES_PER_SITEMAP, limit - processedCount);
    batchNumber++;

    const percentage = ((processedCount / limit) * 100).toFixed(1);
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = processedCount / elapsed;
    const remaining = (limit - processedCount) / rate;

    console.log(`📋 Batch ${batchNumber} (${percentage}% - ${processedCount.toLocaleString()}/${limit.toLocaleString()} properties)`);
    if (processedCount > 0) {
      console.log(`   ⏱️  Speed: ${rate.toFixed(0)} properties/sec | ETA: ${Math.ceil(remaining)}s`);
    }

    const { properties, nextSearchAfter } = await fetchPropertiesBatch(
      client,
      indexName,
      batchSize,
      searchAfter
    );

    if (properties.length === 0) {
      console.log('   ⚠️  No more properties found, stopping pagination\n');
      break;
    }

    // Generate sitemap for this batch
    const propertySitemap = generatePropertySitemap(properties, batchNumber);
    const filename = `sitemap-properties-${String(batchNumber).padStart(3, '0')}.xml`;
    const filepath = join(PUBLIC_DIR, filename);
    writeFileSync(filepath, propertySitemap, 'utf-8');
    console.log(`   ✅ Created: ${filename} (${properties.length.toLocaleString()} properties)\n`);

    sitemapFiles.push({
      loc: `${BASE_URL}/${filename}`,
      lastmod: now,
    });

    processedCount += properties.length;
    searchAfter = nextSearchAfter;

    // Safety check: prevent infinite loop
    if (!nextSearchAfter && processedCount < limit) {
      console.log('   ⚠️  No search_after returned, stopping pagination\n');
      break;
    }
  }

  // 4. Generate main sitemap index as sitemap.xml
  console.log('📑 Generating main sitemap...');
  const sitemapIndex = generateSitemapIndex(sitemapFiles);
  const sitemapPath = join(PUBLIC_DIR, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemapIndex, 'utf-8');
  console.log(`   ✅ Created: sitemap.xml (${sitemapFiles.length} sub-sitemaps)\n`);

  // Summary
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgRate = processedCount / (Date.now() - startTime) * 1000;

  console.log('✨ Sitemap generation complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Static pages: 8`);
  console.log(`   - Property pages: ${processedCount.toLocaleString()}`);
  console.log(`   - Property sitemaps: ${batchNumber} files`);
  console.log(`   - Total sitemaps: ${sitemapFiles.length}`);
  console.log(`   - Generation time: ${totalTime}s`);
  console.log(`   - Average speed: ${avgRate.toFixed(0)} properties/sec`);
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
