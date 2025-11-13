"use client";

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { myTheme } from '@/components/table/theme';
import { dobViolationColumnDefs } from './columnDefs';
import type { DobViolationRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule]);

interface DobViolationsTableProps {
  data: DobViolationRow[];
}

export function DobViolationsTable({ data }: DobViolationsTableProps) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
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
        <AgGridReact<DobViolationRow>
          theme={myTheme}
          domLayout="autoHeight"
          defaultColDef={defaultColDef}
          columnDefs={dobViolationColumnDefs}
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

