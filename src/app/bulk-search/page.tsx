'use client';

import { useRef } from "react";
import PropertyTable, { type PropertyTableRef } from "@/components/table/property/PropertyTable";
import { AgGridProvider } from "@/components/table/AgGridProvider";
import { Button } from "@/components/ui/Button";

export default function BulkSearchPage() {
  const propertyTableRef = useRef<PropertyTableRef>(null);

  const handleResetFilters = () => {
    propertyTableRef.current?.resetFilters();
  };

  return (
    <>
      <AgGridProvider />
      <div className="flex h-full w-full flex-col">
      {/* Top bar with reset button */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-foreground/20 bg-background px-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleResetFilters}
            variant="default"
            size="xs"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Content area with PropertyTable */}
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden p-4">
          <PropertyTable ref={propertyTableRef} />
        </div>
      </div>
    </div>
    </>
  );
}
