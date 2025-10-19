import type { ServerSideGetRowsRequest } from '@/services/agGridToEs';
import type { AcrisParty } from '@/types/acris';

export async function fetchAcrisParties(params: {
  documentId: string;
  request?: ServerSideGetRowsRequest;
}): Promise<{ rows: AcrisParty[]; total: number }> {
  const { documentId, request } = params;
  const payload: { documentId: string; request: ServerSideGetRowsRequest } = {
    documentId,
    request: request || {
      startRow: 0,
      endRow: 500,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [{ colId: 'party_party_type.keyword', sort: 'asc' }],
    },
  };

  const res = await fetch('/api/acris/parties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to fetch acris parties');
  const json = (await res.json()) as { rows: AcrisParty[]; total: number };
  return json;
}


