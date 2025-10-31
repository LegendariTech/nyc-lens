import { IServerSideDatasource, IServerSideGetRowsRequest } from 'ag-grid-community';
import type { AcrisPropertiesRequest, AcrisPropertiesResponse } from '@/types/api';

export const createDatasource = (): IServerSideDatasource => ({
  getRows: async (params) => {
    try {
      const request: IServerSideGetRowsRequest = params.request;

      // Call API directly - pass the full ag-grid request
      const payload: AcrisPropertiesRequest = { request };

      const res = await fetch('/api/acris/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to fetch properties');
      const { rows, total } = (await res.json()) as AcrisPropertiesResponse;

      params.success({ rowData: rows, rowCount: total });
    } catch (e) {
      console.error(e);
      params.fail();
    }
  },
});


