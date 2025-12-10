// elasticClient.mjs
import 'server-only';
import { Client } from '@elastic/elasticsearch';
import { AcrisRecord } from '@/types/acris';

// Lazy-initialized client - created on first use, not at import time
let client: Client | null = null;

/**
 * Get or create the Elasticsearch client.
 * Uses lazy initialization to avoid build-time failures when env vars are missing.
 */
function getClient(): Client {
  if (!client) {
    if (!process.env.ELASTICSEARCH_NODE) {
      throw new Error(
        'ELASTICSEARCH_NODE environment variable is not configured. ' +
        'Please set it in your environment or .env.local file.'
      );
    }
    client = new Client({
      node: process.env.ELASTICSEARCH_NODE,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || '',
        password: process.env.ELASTICSEARCH_PASSWORD || '',
      },
    });
  }
  return client;
}

/**
 * Execute a search query against Elasticsearch.
 * @param {string} index - The name of the index.
 * @param {object} body - The search body (Elasticsearch DSL JSON).
 * @returns {Promise<object>} - The search results.
 */
export async function search(index: string, body: object): Promise<unknown> {
  try {
    const result = await getClient().search<AcrisRecord>({
      index,
      body,
    });
    return result;
  } catch (err) {
    console.error('Elasticsearch search error:', err);
    throw err;
  }
}

// Export getClient for cases where direct client access is needed
export { getClient };
