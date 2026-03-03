import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/data/elasticsearch';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/utils/agGrid';
import type { AcrisDocumentsRequest, AcrisDocumentsResponse } from '@/types/api';
import type { AcrisDoc } from '@/types/acris';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, borough, block, lot } = body as AcrisDocumentsRequest;

    if (!borough || !block || !lot) {
      return NextResponse.json({ error: 'Missing borough, block, or lot' }, { status: 400 });
    }

    // Merge with defaults
    const fullRequest: ServerSideGetRowsRequest = {
      startRow: 0,
      endRow: 500,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [{ colId: 'document_date', sort: 'desc' }],
      ...request, // Override with provided values
    };

    const index = 'acris_documents_v_7_1';
    const base = buildEsQueryFromAgGrid(fullRequest);
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
    const rows = hits.map(h => h._source).filter((r): r is unknown => r !== undefined) as AcrisDoc[];

    const response: AcrisDocumentsResponse = { rows, total };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


