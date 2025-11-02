"use client";

import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type RowClickedEvent } from 'ag-grid-community';
import { myTheme } from '../theme';
import { taxColumnDefs } from './columnDefs';
import type { TaxRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TaxTableProps {
  data: TaxRow[];
  onRowClick?: (year: string) => void;
}

export function TaxTable({ data, onRowClick }: TaxTableProps) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<TaxRow>) => {
      if (event.data && onRowClick) {
        onRowClick(event.data.rawYear);
      }
    },
    [onRowClick]
  );

  return (
    <div className="w-full">
      <div className="ag-theme-quartz-dark" style={{ width: '100%' }}>
        <AgGridReact<TaxRow>
          theme={myTheme}
          domLayout="autoHeight"
          defaultColDef={defaultColDef}
          columnDefs={taxColumnDefs}
          rowData={data}
          suppressCellFocus={true}
          rowSelection="single"
          onRowClicked={handleRowClicked}
        />
      </div>
    </div>
  );
}

