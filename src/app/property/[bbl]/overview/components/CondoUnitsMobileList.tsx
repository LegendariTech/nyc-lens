'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { cn } from '@/utils/cn';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { trackEvent, debounce } from '@/utils/trackEvent';
import { EventType } from '@/types/events';
import { getCondoClassLabel } from './condoUtils';
import type { CondoUnitSummary } from '../utils';

const INITIAL_DISPLAY_COUNT = 10;

interface CondoUnitsMobileListProps {
  condoUnits: CondoUnitSummary[];
  currentBbl: string;
  addressSegment?: string;
}

export function CondoUnitsMobileList({ condoUnits, currentBbl, addressSegment }: CondoUnitsMobileListProps) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const trackSearchDebounced = useRef(
    debounce((q: string, resultCount: number, totalCount: number, bbl: string) => {
      trackEvent(EventType.CONDO_UNIT_SEARCH, {
        query: q,
        resultCount,
        totalCount,
        source: 'mobile',
        currentBbl: bbl,
      });
    }, 1500)
  ).current;

  useEffect(() => {
    return () => { trackSearchDebounced.cancel(); };
  }, [trackSearchDebounced]);

  const filtered = useMemo(() => {
    if (!query) return condoUnits;
    const q = query.toLowerCase();
    return condoUnits.filter(
      (u) =>
        u.unit?.toLowerCase().includes(q) ||
        u.owner?.toLowerCase().includes(q)
    );
  }, [condoUnits, query]);

  // Track search queries after debounce (uses filtered result count to avoid duplicate computation)
  useEffect(() => {
    if (query.length >= 2) {
      trackSearchDebounced(query, filtered.length, condoUnits.length, currentBbl);
    }
  }, [query, filtered.length, condoUnits.length, currentBbl, trackSearchDebounced]);

  const isSearching = query.length > 0;
  const displayedUnits = isSearching || showAll ? filtered : filtered.slice(0, INITIAL_DISPLAY_COUNT);
  const hiddenCount = filtered.length - INITIAL_DISPLAY_COUNT;

  return (
    <div className="space-y-3">
      <Input
        size="sm"
        placeholder="Search by unit or owner…"
        startIcon={<SearchIcon />}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowAll(false);
        }}
      />

      {isSearching && (
        <p className="text-xs text-foreground/60">
          {filtered.length} of {condoUnits.length} units
        </p>
      )}

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-foreground/50">No units match</p>
      )}

      <ul className="divide-y divide-foreground/10">
        {displayedUnits.map((unit) => {
          const isCurrent = unit.bbl === currentBbl;
          return (
            <li
              key={unit.bbl}
              className={cn(
                'py-3 pl-3 pr-1',
                isCurrent && 'border-l-2 border-l-amber-500 bg-amber-500/10'
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <Link
                  href={`/property/${unit.bbl}/overview${addressSegment ? `/${addressSegment}` : ''}`}
                  className="font-medium text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                  onClick={() => {
                    trackEvent(EventType.CONDO_UNIT_CLICK, {
                      targetBbl: unit.bbl,
                      targetUnit: unit.unit,
                      currentBbl,
                      source: 'mobile',
                    });
                  }}
                >
                  {unit.unit || unit.bbl}
                </Link>
                {unit.saleAmount ? (
                  <span className="shrink-0 text-sm tabular-nums text-foreground/80">
                    {formatCurrency(unit.saleAmount)}
                  </span>
                ) : null}
              </div>

              <div className="mt-0.5 text-xs text-foreground/60">
                {getCondoClassLabel(unit.buildingClass)}
                {unit.saleDate ? ` · Sold ${formatDate(unit.saleDate)}` : ''}
              </div>

              {unit.owner && (
                <div className="mt-0.5 truncate text-xs text-foreground/50">
                  Owner: {unit.owner}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!isSearching && !showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-md border border-foreground/15 py-2 text-sm text-foreground/70 hover:bg-foreground/5"
        >
          Show all {condoUnits.length} units ({hiddenCount} more)
        </button>
      )}
    </div>
  );
}
