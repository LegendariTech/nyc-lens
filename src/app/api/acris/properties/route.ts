import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/services/elasticClient';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/services/agGridToEs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request } = body as { request: ServerSideGetRowsRequest };
    if (!request) {
      return NextResponse.json({ error: 'Missing request' }, { status: 400 });
    }

    const index = process.env.ELASTICSEARCH_ACRIS_INDEX_NAME || '';
    const base = buildEsQueryFromAgGrid(request);
    (base as Record<string, unknown>).track_total_hits = true;

    console.log(JSON.stringify(request, null, 2));

    const res = await search(index, base);
    const hits = (res as { hits?: { hits?: Array<{ _source?: unknown }>; total?: { value: number } } })?.hits?.hits || [];
    const total = (res as { hits?: { total?: { value: number } } })?.hits?.total?.value ?? hits.length;
    const rows = hits.map(h => h._source).filter((r): r is unknown => r !== undefined);
    return NextResponse.json({ rows, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


