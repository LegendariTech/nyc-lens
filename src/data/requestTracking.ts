import 'server-only';
import { errors } from '@elastic/elasticsearch';
import { getClient } from './elasticsearch';
import type { RequestLogDocument } from '@/utils/requestTracker';

/**
 * Get the requests index name from environment variables.
 * Returns null if not configured (tracking will be skipped).
 */
function getRequestsIndexName(): string | null {
  return process.env.ELASTICSEARCH_REQUESTS_INDEX_NAME || null;
}

// Note: indexReady won't survive if the ES index is deleted while a Lambda
// container is warm. Subsequent writes will fail silently (fire-and-forget
// caller ignores 500s). This is an acceptable trade-off vs. checking on
// every request.
let indexReady = false;

/**
 * Ensure the requests index exists with explicit mappings.
 * Uses try-catch on create to handle concurrent cold-starts gracefully.
 */
async function ensureIndex(indexName: string): Promise<void> {
  if (indexReady) return;

  const client = getClient();

  try {
    await client.indices.create({
      index: indexName,
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          method: { type: 'keyword' },
          path: { type: 'keyword' },
          url: { type: 'text' },
          query_params: { type: 'flattened' },
          ip: { type: 'keyword' },
          user_agent: { type: 'text' },
          ua_browser: { type: 'keyword' },
          ua_os: { type: 'keyword' },
          ua_device: { type: 'keyword' },
          is_bot: { type: 'boolean' },
          bot_name: { type: 'keyword' },
          referer: { type: 'text' },
          accept_language: { type: 'keyword' },
          content_type: { type: 'keyword' },
          geo_country: { type: 'keyword' },
          geo_region: { type: 'keyword' },
          geo_city: { type: 'keyword' },
          route_type: { type: 'keyword' },
          request_id: { type: 'keyword' },
          host: { type: 'keyword' },
          protocol: { type: 'keyword' },
          vercel_deployment_id: { type: 'keyword' },
        },
      },
    });
  } catch (err: unknown) {
    // Ignore "index already exists" — expected with concurrent cold-starts
    if (
      err instanceof errors.ResponseError &&
      err.body?.error?.type === 'resource_already_exists_exception'
    ) {
      // Index was created by another cold-start — safe to proceed
    } else {
      throw err;
    }
  }

  indexReady = true;
}

/**
 * Log a request to Elasticsearch.
 *
 * Fails gracefully — errors are logged but not thrown so that
 * tracking failures never break the user experience.
 *
 * @returns true if indexed successfully, false if skipped or failed
 */
export async function trackRequest(doc: RequestLogDocument): Promise<boolean> {
  const indexName = getRequestsIndexName();
  if (!indexName) {
    return false;
  }

  try {
    const client = getClient();
    await ensureIndex(indexName);

    await client.index({
      index: indexName,
      document: doc,
    });

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to log request:', message);
    return false;
  }
}
