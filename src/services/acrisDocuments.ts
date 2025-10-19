import type { ServerSideGetRowsRequest } from '@/services/agGridToEs';
import type { AcrisDoc } from '@/types/acris';

export async function fetchAcrisDocuments(params: {
  borough: string;
  block: string;
  lot: string;
  request?: ServerSideGetRowsRequest;
}): Promise<{ rows: AcrisDoc[]; total: number }> {
  const { borough, block, lot, request } = params;
  const payload: { borough: string; block: string; lot: string; request: ServerSideGetRowsRequest } = {
    borough,
    block,
    lot,
    request: request || {
      startRow: 0,
      endRow: 500,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [{ colId: 'document_date', sort: 'desc' }],
    },
  };

  const res = await fetch('/api/acris/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to fetch acris documents');
  const json = (await res.json()) as { rows: AcrisDoc[]; total: number };
  return json;
}


