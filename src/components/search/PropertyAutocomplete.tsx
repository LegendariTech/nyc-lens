'use client';

import { createAutocomplete } from '@algolia/autocomplete-core';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AcrisRecord } from '@/types/acris';
import { findMatchInText } from './textMatcher';

interface PropertyItem {
  id: string;
  address: string;
  borough: string;
  block: string;
  lot: string;
  aka: string[];
  [key: string]: string | string[]; // Index signature for BaseItem constraint
}

// Fetch properties from Elasticsearch
async function fetchProperties(query: string): Promise<PropertyItem[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const payload = {
      request: {
        startRow: 0,
        endRow: 10, // Limit to 10 results for autocomplete
        rowGroupCols: [],
        valueCols: [],
        pivotCols: [],
        pivotMode: false,
        groupKeys: [],
        filterModel: {
          address: {
            filterType: 'text',
            type: 'startsWith',
            filter: query,
          },
        },
        sortModel: [],
      },
    };

    const res = await fetch('/api/acris/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data = (await res.json()) as { rows: AcrisRecord[]; total: number };

    return data.rows.map((row) => ({
      id: row.id,
      address: row.address,
      borough: row.borough,
      block: row.block,
      lot: row.lot,
      aka: row.aka || [],
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Highlight matching text in the address
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query || !text) {
    return <>{text}</>;
  }

  const match = findMatchInText(text, query);

  // If no match found, return text as is (light)
  if (!match) {
    return <span className="font-light text-foreground/60">{text}</span>;
  }

  const beforeMatch = text.slice(0, match.start);
  const matchedText = text.slice(match.start, match.start + match.length);
  const afterMatch = text.slice(match.start + match.length);

  return (
    <>
      <span className="font-light text-foreground/60">{beforeMatch}</span>
      <span className="font-bold">{matchedText}</span>
      <span className="font-light text-foreground/60">{afterMatch}</span>
    </>
  );
}

// Find which AKA address matches the query and determine display strategy
function getAddressDisplay(item: PropertyItem, query: string): {
  primaryAddress: string;
  secondaryAddress: string;
  otherCount: number;
  isSwapped: boolean;
} | null {
  if (!query || !item.aka || item.aka.length === 0) {
    return null;
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Check if main address starts with query
  const mainAddressMatches = item.address.toLowerCase().startsWith(normalizedQuery);

  // If main address matches, no need to swap or show AKA
  if (mainAddressMatches) {
    return null;
  }

  // Find AKA address that matches the query
  const matchingAka = item.aka.find(aka =>
    aka.toLowerCase().includes(normalizedQuery)
  );

  if (!matchingAka) {
    return null;
  }

  // Swap: show matched AKA as primary, official address as secondary
  const totalAkas = item.aka.length;
  const otherCount = totalAkas - 1; // Subtract the matched one

  return {
    primaryAddress: matchingAka,
    secondaryAddress: item.address,
    otherCount,
    isSwapped: true,
  };
}

interface PropertyAutocompleteProps {
  compact?: boolean;
}

export function PropertyAutocomplete({ compact = false }: PropertyAutocompleteProps) {
  const [autocompleteState, setAutocompleteState] = useState<{
    collections: Array<{
      source: Record<string, unknown>;
      items: PropertyItem[];
    }>;
    isOpen: boolean;
    query: string;
  }>({
    collections: [],
    isOpen: false,
    query: '',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const autocomplete = useRef(
    createAutocomplete<PropertyItem>({
      autoFocus: true,
      onStateChange({ state }) {
        setAutocompleteState(state as typeof autocompleteState);
      },
      openOnFocus: true,
      getSources({ query }) {
        return [
          {
            sourceId: 'properties',
            async getItems() {
              const results = await fetchProperties(query);
              // Limit to 4 items in all modes
              return results.slice(0, 4);
            },
            getItemInputValue({ item }) {
              return item.address;
            },
          },
        ];
      },
    })
  ).current;

  useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return;
    }

    const { onSubmit, onReset } = autocomplete.getFormProps({
      inputElement: inputRef.current,
    });

    const form = formRef.current;
    form.addEventListener('submit', onSubmit);
    form.addEventListener('reset', onReset);

    return () => {
      form.removeEventListener('submit', onSubmit);
      form.removeEventListener('reset', onReset);
    };
  }, [autocomplete]);

  return (
    <div className={cn(
      'w-full',
      !compact && 'mx-auto max-w-2xl'
    )}>
      {!compact && (
        <div className="mb-8">
          <p className="text-base text-foreground/70">
            You can search by Address or BBL (Borough–Block–Lot)
          </p>
        </div>
      )}

      <div className="relative">
        <form ref={formRef} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              {...(autocomplete.getInputProps({
                inputElement: inputRef.current,
              }) as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
              onBlur={() => {
                // Delay closing to allow clicks on panel items to register
                setTimeout(() => {
                  // Only close if focus hasn't moved to panel
                  if (!panelRef.current?.contains(document.activeElement)) {
                    autocomplete.setIsOpen(false);
                  }
                }, 200);
              }}
              className={cn(
                'rounded-lg border border-foreground/20 px-4 py-3',
                'bg-background text-foreground text-base',
                'focus:outline-none focus:ring-2 focus:ring-foreground/50',
                'placeholder:text-foreground/40',
                compact ? 'w-96' : 'w-full'
              )}
              placeholder='Try "45 Broadway" or "1-2469-22"'
            />

          </div>
        </form>

        {autocompleteState.isOpen && (
          <div
            ref={panelRef}
            {...(autocomplete.getPanelProps() as unknown as React.HTMLAttributes<HTMLDivElement>)}
            className={cn(
              'absolute top-full z-50 mt-2',
              'rounded-lg border border-foreground/20',
              'bg-background shadow-lg',
              'overflow-hidden',
              compact ? 'w-96' : 'w-full'
            )}
          >
            {autocompleteState.collections.map((collection) => {
              const { items } = collection;
              const sourceId = collection.source.sourceId as string;

              if (items.length === 0) {
                return (
                  <div
                    key={sourceId}
                    className="px-4 py-8 text-center"
                  >
                    <p className="text-sm text-foreground/50">
                      No properties found
                    </p>
                  </div>
                );
              }

              return (
                <div key={sourceId}>
                  <ul
                    {...(autocomplete.getListProps() as unknown as React.HTMLAttributes<HTMLUListElement>)}
                  >
                    {items.map((item) => {
                      const displayInfo = getAddressDisplay(item, autocompleteState.query);

                      // Determine what to show
                      const primaryAddress = displayInfo?.primaryAddress || item.address;
                      const hasSecondaryInfo = displayInfo !== null;

                      return (
                        <li
                          key={item.id}
                          {...(autocomplete.getItemProps({
                            item,
                            source: collection.source as never,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>)}
                          className={cn(
                            'cursor-pointer border-b border-foreground/5 transition-colors last:border-b-0',
                            'hover:bg-foreground/5',
                            'aria-selected:bg-foreground/10',
                            compact ? 'px-3 py-2' : 'px-4 py-3'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-foreground">
                                <HighlightedText
                                  text={primaryAddress}
                                  query={autocompleteState.query}
                                />
                              </div>
                              {hasSecondaryInfo && displayInfo && (
                                <div className="mt-0.5 text-sm text-foreground/70">
                                  Also known as: <HighlightedText
                                    text={displayInfo.secondaryAddress}
                                    query={autocompleteState.query}
                                  />
                                  {displayInfo.otherCount > 0 && (
                                    <span> and {displayInfo.otherCount} other{displayInfo.otherCount !== 1 ? 's' : ''}</span>
                                  )}
                                </div>
                              )}
                              <div className="mt-1 text-sm text-foreground/60">
                                BBL: {item.borough}-{item.block}-{item.lot}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-foreground/30"
                              >
                                <path
                                  d="M6 4l4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Results summary */}
      {!compact && autocompleteState.isOpen && autocompleteState.collections.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-foreground/60">
            Showing {autocompleteState.collections[0]?.items.length || 0} results
          </p>
        </div>
      )}
    </div>
  );
}

