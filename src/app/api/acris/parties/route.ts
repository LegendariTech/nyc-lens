import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/services/elasticClient';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/services/agGridToEs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, documentId } = body as { request: ServerSideGetRowsRequest; documentId: string };
    if (!request || !documentId) {
      return NextResponse.json({ error: 'Missing request or documentId' }, { status: 400 });
    }

    const index = 'acris_parties_v_8_1';
    const base = buildEsQueryFromAgGrid(request);
    const constrained = {
      ...base,
      query: {
        bool: {
          must: [
            base.query || { match_all: {} },
            { term: { 'party_document_id.keyword': documentId } },
          ]
        }
      }
    };

    console.log(JSON.stringify(constrained, null, 2));

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


