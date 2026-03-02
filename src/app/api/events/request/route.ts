import { NextRequest, NextResponse } from 'next/server';
import { trackRequest } from '@/data/requestTracking';
import type { RequestLogDocument } from '@/utils/requestTracker';

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

  try {
    const doc: RequestLogDocument = await req.json();
    const success = await trackRequest(doc);

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in request tracking API:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
