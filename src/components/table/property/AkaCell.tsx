"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AcrisRecord } from '@/types/acris';
import { cn } from '@/utils/cn';

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
    <span className="relative inline-block">
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
        className="cursor-pointer select-none text-sm text-blue-600 underline dark:text-blue-400"
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
              className="fixed inset-0 bg-transparent"
              style={{ zIndex: 2147483646 }}
            />
            <div
              id={popoverId}
              role="dialog"
              aria-label="AKA addresses"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'fixed overflow-auto rounded-md border border-foreground/20 bg-background p-2 shadow-lg',
                'max-h-[220px] min-w-[260px] max-w-[480px]'
              )}
              style={{
                top,
                left,
                zIndex: 2147483647,
              }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-xs font-semibold text-foreground">AKA addresses</div>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer border-0 bg-transparent text-xs text-foreground/60 hover:text-foreground"
                >
                  close
                </button>
              </div>
              <ul className="m-0 list-disc pl-[18px]">
                {list.map((item, idx) => (
                  <li key={idx} className="mb-1 text-xs leading-tight text-foreground/80">
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


