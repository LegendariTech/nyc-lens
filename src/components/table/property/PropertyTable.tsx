"use client";

import { AgGridReact } from 'ag-grid-react';
import { useCallback, useImperativeHandle, useRef, forwardRef } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { GridApi, GridReadyEvent, PaginationChangedEvent } from 'ag-grid-community';
import { ServerSideRowModelModule, SetFilterModule, ColumnMenuModule, ContextMenuModule, SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule, MasterDetailModule, LicenseManager } from 'ag-grid-enterprise';
import { myTheme } from '../theme';
import { MAIN_MENU_ITEMS } from '../constants/menu';
import { colDefs } from './columnDefs';
import { createDatasource } from '../utils/datasource';
import DetailCellRenderer from '../document/DocumentTable';

LicenseManager.setLicenseKey('Using_this_{AG_Grid}_Enterprise_key_{AG-073142}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Tyler_Technologies}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Socrata}_only_for_{38}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_{Socrata}_need_to_be_licensed___{Socrata}_has_been_granted_a_Deployment_License_Add-on_for_{2}_Production_Environments___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{14_July_2026}____[v3]_[01]_MTc4Mzk4MzYwMDAwMA==953dd63b704319b712726e8a48b3898f')


ModuleRegistry.registerModules([
  AllCommunityModule,
  SetFilterModule, ServerSideRowModelModule, ColumnMenuModule, ContextMenuModule,
  SideBarModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MasterDetailModule,
]);

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
