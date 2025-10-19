"use client";

import type { ValueFormatterParams } from 'ag-grid-community';
import type { AcrisDoc } from '@/types/acris';

export function LinkCell(p: ValueFormatterParams<AcrisDoc, string>) {
  const id = p.value;
  if (!id) return '' as unknown as JSX.Element;
  return (
    <a
      // https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=2025100801019001
      href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
    >
      Open
    </a>
  );
}

export default LinkCell;


