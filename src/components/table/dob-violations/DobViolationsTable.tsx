"use client";

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { myTheme } from '../theme';
import { dobViolationColumnDefs } from './columnDefs';
import type { DobViolationRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

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
      <style dangerouslySetInnerHTML={{ __html: `
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
          paginationPageSize={50}
          paginationPageSizeSelector={[25, 50, 100, 200]}
        />
      </div>
    </div>
  );
}

