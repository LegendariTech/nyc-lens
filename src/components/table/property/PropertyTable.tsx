"use client";

import { AgGridReact } from 'ag-grid-react';
import { useCallback, useImperativeHandle, useRef, forwardRef } from 'react';
import type { GridApi, GridReadyEvent, PaginationChangedEvent } from 'ag-grid-community';
import { myTheme } from '../theme';
import { MAIN_MENU_ITEMS } from '../constants/menu';
import { colDefs } from './columnDefs';
import { createDatasource } from './datasource';
import DetailCellRenderer from '../document/DocumentTable';

// Note: AG Grid modules are registered globally in AgGridRegistry component

export interface PropertyTableRef {
  resetFilters: () => void;
}

const Table = forwardRef<PropertyTableRef>((_, ref) => {

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

  // Expose resetFilters method to parent component
  useImperativeHandle(ref, () => ({
    resetFilters: handleResetFilters,
  }), [handleResetFilters]);

  return (
    <div className="h-full w-full">
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
  )

});

Table.displayName = 'PropertyTable';

export default Table;
