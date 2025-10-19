import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/services/elasticClient';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/services/agGridToEs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, borough, block, lot } = body as { request: ServerSideGetRowsRequest; borough: string; block: string; lot: string };
    if (!request || !borough || !block || !lot) {
      return NextResponse.json({ error: 'Missing request or identifiers' }, { status: 400 });
    }

    const index = 'acris_documents_v_7_1';
    const base = buildEsQueryFromAgGrid(request);
    const constrained = {
      ...base,
      query: {
        bool: {
          must: [
            base.query || { match_all: {} },
            { term: { borough: borough } },
            { term: { 'block.integer': Number(block) } },
            { term: { 'lot.integer': Number(lot) } },
          ]
        }
      }
    };

    const res = await search(index, constrained);
    const hits = (res as { hits?: { hits?: Array<{ _source?: unknown }>; total?: { value: number } } })?.hits?.hits || [];
    const total = (res as { hits?: { total?: { value: number } } })?.hits?.total?.value ?? hits.length;
    const rows = hits.map(h => h._source).filter((r): r is unknown => r !== undefined);
    return NextResponse.json({ rows, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


