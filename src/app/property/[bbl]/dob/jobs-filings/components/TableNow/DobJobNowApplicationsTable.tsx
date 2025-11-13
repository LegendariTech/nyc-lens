"use client";

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { myTheme } from '@/components/table/theme';
import { dobJobNowApplicationsColumnDefs } from './columnDefs';
import type { DobJobNowApplicationRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule]);

interface DobJobNowApplicationsTableProps {
  data: DobJobNowApplicationRow[];
}

export function DobJobNowApplicationsTable({ data }: DobJobNowApplicationsTableProps) {
  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      resizable: true,
      filter: false,
    }),
    []
  );

  return (
    <div className="w-full relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        .ag-theme-quartz-dark .multiline-cell {
          line-height: 1.4 !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
      `}} />
      <div className="ag-theme-quartz-dark" style={{ width: '100%' }}>
        <AgGridReact<DobJobNowApplicationRow>
          theme={myTheme}
          domLayout="autoHeight"
          defaultColDef={defaultColDef}
          columnDefs={dobJobNowApplicationsColumnDefs}
          rowData={data}
          suppressCellFocus={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50, 100]}
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
              },
            ],
            defaultToolPanel: '',
          }}
        />
      </div>
    </div>
  );
}

