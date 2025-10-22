'use client';

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PropertyAutocomplete } from "@/components/search/PropertyAutocomplete";
import PropertyTable, { type PropertyTableRef } from "@/components/table/property/PropertyTable";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useViewport } from "@/components/layout/ViewportContext";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bulkMode = searchParams.get('bulk') === 'true';
  const propertyTableRef = useRef<PropertyTableRef>(null);
  const { isMobile } = useViewport();

  const effectiveBulkMode = useMemo(() => !isMobile && bulkMode, [isMobile, bulkMode]);

  // On mobile, strip bulk param from URL to avoid confusing states
  useEffect(() => {
    if (isMobile && bulkMode) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('bulk');
      router.replace(`/search${params.toString() ? `?${params.toString()}` : ''}`);
    }
  }, [isMobile, bulkMode, router, searchParams]);

  const handleBulkModeChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set('bulk', 'true');
    } else {
      params.delete('bulk');
    }
    router.replace(`/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
    propertyTableRef.current?.resetFilters();
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top bar with toggle and reset button (hidden on mobile) */}
      <div className="hidden md:flex h-10 shrink-0 items-center justify-between border-b border-foreground/20 bg-background px-4">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-xs text-foreground/70">Bulk Search</span>
            <Switch
              checked={effectiveBulkMode}
              onCheckedChange={handleBulkModeChange}
              size="sm"
            />
          </label>
          {effectiveBulkMode && (
            <Button
              onClick={handleResetFilters}
              variant="default"
              size="xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content area */}
      {effectiveBulkMode ? (
        <div className="flex h-full flex-col overflow-hidden">
          {/* <div className="shrink-0 border-b border-foreground/10 px-4 py-3">
            <PropertyAutocomplete compact />
          </div> */}
          <div className="flex-1 overflow-hidden p-4">
            <PropertyTable ref={propertyTableRef} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-full items-start justify-center p-4 pt-4 md:pt-[20vh]">
          <PropertyAutocomplete />
        </div>
      )}
    </div>
  );
}


