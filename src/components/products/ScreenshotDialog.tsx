'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface ScreenshotDialogProps {
  src: string;
  alt: string;
  title?: string;
}

/**
 * Screenshot component that opens in a dialog for full-size viewing
 */
export function ScreenshotDialog({ src, alt, title }: ScreenshotDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl overflow-hidden shadow-2xl border border-foreground/20 hover:border-foreground/40 transition-all cursor-zoom-in group relative"
        type="button"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto transition-transform group-hover:scale-[1.02]"
        />
        {/* Zoom indicator overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-foreground/90 text-background px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            Click to enlarge
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          {title && (
            <div className="px-6 py-4 border-b border-foreground/10 bg-background">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            </div>
          )}
          <div className="overflow-auto max-h-[85vh] p-6">
            <img
              src={src}
              alt={alt}
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
