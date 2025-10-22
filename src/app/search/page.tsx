'use client';

import { useState, useRef } from "react";
import { PropertyAutocomplete } from "@/components/search/PropertyAutocomplete";
import PropertyTable, { type PropertyTableRef } from "@/components/table/property/PropertyTable";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [bulkMode, setBulkMode] = useState(false);
  const propertyTableRef = useRef<PropertyTableRef>(null);

  const handleResetFilters = () => {
    propertyTableRef.current?.resetFilters();
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top bar with toggle and reset button */}
      <div className="flex items-center justify-between border-b border-foreground/20 bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-sm text-foreground/70">Bulk</span>
            <button
              role="switch"
              aria-checked={bulkMode}
              onClick={() => setBulkMode(!bulkMode)}
              className={cn(
                'relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                bulkMode ? 'bg-foreground' : 'bg-foreground/20'
              )}
            >
              <span
                className={cn(
                  'inline-block size-4 rounded-full bg-background transition-transform',
                  bulkMode ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </label>
          {bulkMode && (
            <button
              onClick={handleResetFilters}
              className={cn(
                'inline-flex h-6 cursor-pointer items-center rounded-md px-3 text-xs font-medium transition-colors',
                'bg-foreground/10 text-foreground hover:bg-foreground/20',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
              )}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      {bulkMode ? (
        <div className="flex h-full flex-col overflow-hidden">
          {/* <div className="shrink-0 border-b border-foreground/10 px-4 py-3">
            <PropertyAutocomplete compact />
          </div> */}
          <div className="flex-1 overflow-hidden p-4">
            <PropertyTable ref={propertyTableRef} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-full items-start justify-center p-4 pt-[20vh]">
          <PropertyAutocomplete />
        </div>
      )}
    </div>
  );
}


