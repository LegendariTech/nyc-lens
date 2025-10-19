"use client";

import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { GridApi, GridReadyEvent, PaginationChangedEvent } from 'ag-grid-community';
import { ServerSideRowModelModule, SetFilterModule, ColumnMenuModule, ContextMenuModule, SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule, MasterDetailModule } from 'ag-grid-enterprise';
import { myTheme } from '../theme';
import { MAIN_MENU_ITEMS } from '../constants/menu';
import { colDefs } from './columnDefs';
import { createDatasource } from '../utils/datasource';
import DetailCellRenderer from '../document/DocumentTable';


ModuleRegistry.registerModules([
  AllCommunityModule,
  SetFilterModule, ServerSideRowModelModule, ColumnMenuModule, ContextMenuModule,
  SideBarModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MasterDetailModule,
]);

const Table = () => {

  const datasource = createDatasource();
  const gridApiRef = useRef<GridApi | null>(null);
  const isBlockingPaginationRef = useRef(false);
  const PAGINATION_HARD_LIMIT = 10000;

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  }, []);

  const handleResetFilters = useCallback(() => {
    const api = gridApiRef.current;
    if (!api) return;
    api.setFilterModel(null);
    api.onFilterChanged();
  }, []);

  return (
    <div className="h-full w-full" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingBottom: 8 }}>
        <button onClick={handleResetFilters} className="reset-button">
          Reset Filters
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact
          suppressContextMenu={true}
          theme={myTheme}
          onGridReady={onGridReady}
          rowModelType="serverSide"
          serverSideDatasource={datasource}
          masterDetail={true}
          isRowMaster={() => true}
          detailCellRenderer={DetailCellRenderer}
          detailRowAutoHeight={true}
          getRowId={({ data }) => data.id}
          columnMenu="new"
          defaultColDef={{ sortable: true, filter: true, resizable: true, mainMenuItems: MAIN_MENU_ITEMS }}
          suppressMultiSort={false}
          pagination={true}
          paginationPageSize={100}
          paginationPageSizeSelector={[25, 50, 100, 250]}
          onPaginationChanged={(params: PaginationChangedEvent) => {
            const api = params.api || gridApiRef.current;
            if (!api) return;
            if (isBlockingPaginationRef.current) return;

            const pageSize = api.paginationGetPageSize();
            const currentPage = api.paginationGetCurrentPage();
            const startRow = currentPage * pageSize;

            if (startRow >= PAGINATION_HARD_LIMIT) {
              isBlockingPaginationRef.current = true;
              const lastAllowedPage = Math.floor((PAGINATION_HARD_LIMIT - 1) / pageSize);
              api.paginationGoToPage(lastAllowedPage);
              isBlockingPaginationRef.current = false;
            }
          }}
          // multiSortKey="ctrl"
          alwaysMultiSort={true}
          autoGroupColumnDef={{ headerName: '', minWidth: 60, cellRendererParams: { suppressCount: true } }}
          columnDefs={colDefs}
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                  suppressRowGroups: true,
                  suppressValues: true,
                  suppressPivots: true,
                  suppressPivotMode: true,
                },
              }, 'filters',
            ],
            defaultToolPanel: 'columns',
          }}
        />
      </div>
    </div>
  )

}

export default Table;
