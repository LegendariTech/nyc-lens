// elasticClient.mjs
import 'server-only';
import { Client } from '@elastic/elasticsearch';
import { AcrisRecord } from '@/types/acris';

// Create and configure the Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  },
});

/**
 * Execute a search query against Elasticsearch.
 * @param {string} index - The name of the index.
 * @param {object} body - The search body (Elasticsearch DSL JSON).
 * @returns {Promise<object>} - The search results.
 */
export async function search(index: string, body: object): Promise<unknown> {
  try {
    const result = await client.search<AcrisRecord>({
      index,
      body,
    });
    return result;
  } catch (err) {
    console.error('Elasticsearch search error:', err);
    throw err;
  }
}

export { client };
