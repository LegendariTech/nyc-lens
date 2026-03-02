import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/data/elasticsearch';
import type { RequestLogDocument } from '@/utils/requestTracker';

function getRequestsIndexName(): string | null {
  return process.env.ELASTICSEARCH_REQUESTS_INDEX_NAME || null;
}

let indexReady = false;

async function ensureIndex(indexName: string): Promise<void> {
  if (indexReady) return;

  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });

  if (!exists) {
    await client.indices.create({
      index: indexName,
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          method: { type: 'keyword' },
          path: { type: 'keyword' },
          url: { type: 'text' },
          query_params: { type: 'flattened' },
          status: { type: 'short' },
          duration_ms: { type: 'float' },
          ip: { type: 'ip' },
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
          request_body: { type: 'flattened' },
          route_type: { type: 'keyword' },
          request_id: { type: 'keyword' },
          host: { type: 'keyword' },
          protocol: { type: 'keyword' },
          vercel_deployment_id: { type: 'keyword' },
        },
      },
    });
  }

  indexReady = true;
}

/**
 * POST /api/events/request
 *
 * Internal endpoint for logging request metadata to Elasticsearch.
 * Called by middleware in a fire-and-forget pattern.
 */
export async function POST(req: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  const indexName = getRequestsIndexName();
  if (!indexName) {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  try {
    const doc: RequestLogDocument = await req.json();

    const client = getClient();
    await ensureIndex(indexName);

    await client.index({
      index: indexName,
      document: doc,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to log request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
