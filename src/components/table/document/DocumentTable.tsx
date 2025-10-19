"use client";

import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { AcrisRecord, AcrisDoc } from '@/types/acris';
import { detailColDefs } from './columnDefs';
import { myTheme } from '../theme';
import { fetchAcrisDocuments } from '@/services/acrisDocuments';
import PartiesDetailRenderer from '../party/PartyTable';

function DetailCellRenderer(props: CustomCellRendererProps<AcrisRecord>) {
  const [rows, setRows] = useState<AcrisDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const parent = props.data;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!parent) return;
        setLoading(true);
        const { rows } = await fetchAcrisDocuments({
          borough: parent.borough,
          block: parent.block,
          lot: parent.lot,
        });
        if (!cancelled) setRows(rows || []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setRows([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [parent]);

  const defaultColDef = useMemo(() => ({ sortable: true, resizable: true }), []);

  return (
    <div style={{ padding: 16, backgroundColor: 'rgb(54, 73, 104)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
        <div>
          <b style={{}}>Recorded Documents:</b> {parent?.address}
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <AgGridReact
          theme={myTheme}
          domLayout="autoHeight"
          detailRowAutoHeight={true}
          defaultColDef={defaultColDef}
          columnDefs={detailColDefs}
          rowData={rows}
          loading={loading}
          masterDetail={true}
          isRowMaster={() => true}
          detailCellRenderer={PartiesDetailRenderer}
        />
      </div>
    </div>
  );
}

export default DetailCellRenderer;


