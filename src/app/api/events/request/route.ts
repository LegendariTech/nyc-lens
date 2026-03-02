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
  } catch (err: unknown) {
    // Ignore "index already exists" — expected with concurrent cold-starts
    const esError = err as { meta?: { body?: { error?: { type?: string } } } };
    if (esError?.meta?.body?.error?.type !== 'resource_already_exists_exception') {
      throw err;
    }
  }

  indexReady = true;
}

/**
 * POST /api/events/request
 *
 * Internal endpoint for logging request metadata to Elasticsearch.
 * Called by middleware in a fire-and-forget pattern.
 * Gated to production only via VERCEL_ENV check.
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
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to log request:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
