import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/data/elasticsearch';
import { buildEsQueryFromAgGrid, ServerSideGetRowsRequest } from '@/utils/agGrid';
import type { AcrisPartiesRequest, AcrisPartiesResponse } from '@/types/api';
import type { AcrisParty } from '@/types/acris';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { request, documentId } = body as AcrisPartiesRequest;

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
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
      sortModel: [{ colId: 'party_party_type.keyword', sort: 'asc' }],
      ...request, // Override with provided values
    };

    const index = 'acris_parties_v_8_1';
    const base = buildEsQueryFromAgGrid(fullRequest);
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

    const res = await search(index, constrained);
    const hits = (res as { hits?: { hits?: Array<{ _source?: unknown }>; total?: { value: number } } })?.hits?.hits || [];
    const allRows = hits.map(h => h._source).filter((r): r is unknown => r !== undefined) as AcrisParty[];

    // Deduplicate parties by name - keep first occurrence
    const seenNames = new Set<string>();
    const rows = allRows.filter(party => {
      const name = party.party_name?.trim();
      if (!name || seenNames.has(name)) {
        return false;
      }
      seenNames.add(name);
      return true;
    });

    const total = rows.length;
    const response: AcrisPartiesResponse = { rows, total };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


