"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AcrisRecord } from '@/types/acris';

type Props = ICellRendererParams<AcrisRecord>;

export function AkaCell(props: Props) {
  const list = React.useMemo(() => (props?.data?.aka as string[] | undefined) || [], [props?.data?.aka]);
  const hasAka = list.length > 0;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const popoverId = useId();

  const title = useMemo(() => {
    if (!hasAka) return '';
    const preview = list.slice(0, 3).join(', ');
    return list.length > 3 ? preview + ', …' : preview;
  }, [hasAka, list]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!hasAka) return null;

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        ref={anchorRef}
        onClick={(e) => {
          e.stopPropagation(); setOpen((v) => !v);
        }}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        title={title}
        style={{
          color: '#2563eb',
          cursor: 'pointer',
          fontSize: '14px',
          textDecoration: 'underline',
          userSelect: 'none',
        }}
      >
        aka
      </span>
      {open && (() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        const top = (rect?.bottom ?? 0) + 4;
        const left = rect?.left ?? 0;
        return createPortal(
          <>
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 2147483646, background: 'transparent' }}
            />
            <div
              id={popoverId}
              role="dialog"
              aria-label="AKA addresses"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top,
                left,
                zIndex: 2147483647,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                maxHeight: '220px',
                minWidth: '260px',
                maxWidth: '480px',
                overflow: 'auto',
                padding: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}>AKA addresses</div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  close
                </button>
              </div>
              <ul style={{ listStyle: 'disc', paddingLeft: '18px', margin: 0 }}>
                {list.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', lineHeight: 1.25 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>,
          document.body
        );
      })()}
    </span>
  );
}

export default AkaCell;


