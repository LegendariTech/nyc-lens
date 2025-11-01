"use client";

import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { myTheme } from '../theme';
import { taxColumnDefs } from './columnDefs';
import type { TaxRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TaxTableProps {
  data: TaxRow[];
}

export function TaxTable({ data }: TaxTableProps) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <AgGridReact<TaxRow>
        theme={myTheme}
        domLayout="normal"
        defaultColDef={defaultColDef}
        columnDefs={taxColumnDefs}
        rowData={data}
        suppressCellFocus={true}
        rowSelection="single"
      />
    </div>
  );
}

