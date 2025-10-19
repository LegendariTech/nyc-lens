import { IServerSideDatasource, IServerSideGetRowsRequest } from 'ag-grid-community';
import { fetchAcrisProperties } from '@/services/acrisProperties';

export const createDatasource = (): IServerSideDatasource => ({
  getRows: async (params) => {
    try {
      const request: IServerSideGetRowsRequest = params.request;
      const { rows, total } = await fetchAcrisProperties({ request });
      params.success({ rowData: rows, rowCount: total });
    } catch (e) {
      console.error(e);
      params.fail();
    }
  },
});


