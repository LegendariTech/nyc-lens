import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/data/elasticsearch';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/utils/agGrid';
import type { AcrisPropertiesRequest, AcrisPropertiesResponse } from '@/types/api';
import type { AcrisRecord } from '@/types/acris';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request } = body as AcrisPropertiesRequest;

    // Merge with defaults
    const fullRequest: ServerSideGetRowsRequest = {
      startRow: 0,
      endRow: 100,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [
        { colId: 'mortgage_document_date', sort: 'desc' },
        { colId: 'borough', sort: 'asc' },
        { colId: 'block', sort: 'asc' },
        { colId: 'lot', sort: 'asc' },
      ],
      ...request, // Override with provided values
    };

    const index = process.env.ELASTICSEARCH_ACRIS_INDEX_NAME || '';
    const base = buildEsQueryFromAgGrid(fullRequest);
    (base as Record<string, unknown>).track_total_hits = true;

    console.log(JSON.stringify(base, null, 2));

    const res = await search(index, base);
    const hits = (res as { hits?: { hits?: Array<{ _source?: unknown }>; total?: { value: number } } })?.hits?.hits || [];
    const total = (res as { hits?: { total?: { value: number } } })?.hits?.total?.value ?? hits.length;
    const rows = hits.map(h => h._source).filter((r): r is unknown => r !== undefined) as AcrisRecord[];

    const response: AcrisPropertiesResponse = { rows, total };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


