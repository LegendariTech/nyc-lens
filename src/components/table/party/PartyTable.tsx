"use client";

import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { AcrisDoc, AcrisParty } from '@/types/acris';
import type { AcrisPartiesRequest, AcrisPartiesResponse } from '@/types/api';
import { partyColDefs } from './columnDefs';
import { myTheme } from '../theme';
import { formatCurrency, formatDateMMDDYYYY } from '../utils/formatters';

function PartiesDetailRenderer(props: CustomCellRendererProps<AcrisDoc>) {
  const [rows, setRows] = useState<AcrisParty[]>([]);
  const [loading, setLoading] = useState(true);
  const doc = props.data;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const documentId = doc?.master_document_id || '';
        if (!documentId) {
          if (!cancelled) setRows([]);
          return;
        }

        // Call API directly - defaults handle everything
        const payload: AcrisPartiesRequest = {
          documentId,
          // request is optional - will use sensible defaults
        };

        const response = await fetch('/api/acris/parties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to fetch parties');
        const res = (await response.json()) as AcrisPartiesResponse;

        if (!cancelled) setRows(res.rows || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [doc?.master_document_id]);

  const defaultColDef = useMemo(() => ({ sortable: false, resizable: true }), []);

  return (
    <div className='p-16 bg-background'>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
        <div>
          <b style={{}}>Parties: </b>
          <span>{(doc?.document_type || '') + (doc?.doc_type_description ? ` - ${doc.doc_type_description}` : '')}</span>
        </div>
        <div>
          <span style={{ opacity: 0.8 }}>Date: </span>
          <span>{formatDateMMDDYYYY(doc?.document_date || '')}</span>
        </div>
        <div>
          <span style={{ opacity: 0.8 }}>Amount: </span>
          <span>{formatCurrency(doc?.document_amount as number)}</span>
        </div>
      </div>
      <AgGridReact
        theme={myTheme}
        domLayout="autoHeight"
        defaultColDef={defaultColDef}
        columnDefs={partyColDefs}
        rowData={rows}
        loading={loading}
      />
    </div>
  );
}

export default PartiesDetailRenderer;


