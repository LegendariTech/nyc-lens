import type { ServerSideGetRowsRequest } from '@/services/agGridToEs';
import type { AcrisRecord } from '@/types/acris';

export async function fetchAcrisProperties(params: {
  request?: ServerSideGetRowsRequest;
}): Promise<{ rows: AcrisRecord[]; total: number }> {
  const { request } = params;
  const payload: { request: ServerSideGetRowsRequest } = {
    request: request || {
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
    },
  };

  const res = await fetch('/api/acris/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to fetch acris properties');
  const json = (await res.json()) as { rows: AcrisRecord[]; total: number };
  return json;
}


