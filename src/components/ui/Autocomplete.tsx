'use client';

import React from 'react';
import { createAutocomplete, type AutocompleteSource } from '@algolia/autocomplete-core';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Base item interface that all autocomplete items must extend
 */
export interface BaseAutocompleteItem {
  id: string;
  [key: string]: unknown;
}

/**
 * Generic autocomplete props
 */
export interface AutocompleteProps<TItem extends BaseAutocompleteItem> {
  /** Fetch items based on query */
  getSources: (params: { query: string }) => Array<AutocompleteSource<TItem>>;

  /** Render individual result item */
  renderItem: (params: {
    item: TItem;
    query: string;
    itemProps: React.LiHTMLAttributes<HTMLLIElement>;
  }) => React.ReactNode;

  /** Optional: Render empty state when no results */
  renderEmpty?: (query: string) => React.ReactNode;

  /** Optional: Render header/description above input */
  renderHeader?: () => React.ReactNode;

  /** Optional: Render footer below results */
  renderFooter?: (params: { itemCount: number; isOpen: boolean }) => React.ReactNode;

  /** Compact mode (smaller width and padding) */
  compact?: boolean;

  /** Initial input value */
  initialValue?: string;

  /** Auto focus input on mount */
  autoFocus?: boolean;

  /** Placeholder text */
  placeholder?: string;

  /** Custom input className */
  inputClassName?: string;

  /** Custom panel className */
  panelClassName?: string;

  /** Custom container className */
  containerClassName?: string;

  /** Open dropdown on focus */
  openOnFocus?: boolean;

  /** Maximum number of results to display */
  maxResults?: number;

  /** Callback when input value changes */
  onInputChange?: (value: string) => void;

  /** Callback when dropdown opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Generic Autocomplete Component
 * 
 * A flexible, reusable autocomplete component built on @algolia/autocomplete-core.
 * Can be used with any data source and custom rendering logic.
 * 
 * @example
 * ```tsx
 * <Autocomplete
 *   getSources={({ query }) => [{
 *     sourceId: 'users',
 *     getItems: () => fetchUsers(query),
 *     onSelect: ({ item }) => navigate(`/user/${item.id}`)
 *   }]}
 *   renderItem={({ item, query, itemProps }) => (
 *     <li {...itemProps}>{item.name}</li>
 *   )}
 *   placeholder="Search users..."
 * />
 * ```
 */
export function Autocomplete<TItem extends BaseAutocompleteItem>({
  getSources,
  renderItem,
  renderEmpty,
  renderHeader,
  renderFooter,
  compact = false,
  initialValue = '',
  autoFocus = true,
  placeholder = 'Search...',
  inputClassName,
  panelClassName,
  containerClassName,
  openOnFocus = true,
  maxResults,
  onInputChange,
  onOpenChange,
}: AutocompleteProps<TItem>) {
  const [autocompleteState, setAutocompleteState] = useState<{
    collections: Array<{
      source: Record<string, unknown>;
      items: TItem[];
    }>;
    isOpen: boolean;
    query: string;
  }>({
    collections: [],
    isOpen: false,
    query: initialValue,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const autocomplete = useRef(
    createAutocomplete<TItem>({
      autoFocus,
      initialState: {
        query: initialValue,
      },
      onStateChange({ state }) {
        setAutocompleteState(state as typeof autocompleteState);
        onInputChange?.(state.query);
        onOpenChange?.(state.isOpen);
      },
      openOnFocus,
      getSources({ query }) {
        const sources = getSources({ query });

        // Apply maxResults if specified
        if (maxResults) {
          return sources.map(source => ({
            ...source,
            getItems: async () => {
              const items = await source.getItems();
              return items.slice(0, maxResults);
            },
          }));
        }

        return sources;
      },
    })
  ).current;

  useEffect(() => {
    if (!formRef.current || !inputRef.current) {
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

  const totalItems = autocompleteState.collections.reduce(
    (sum, collection) => sum + collection.items.length,
    0
  );

  return (
    <div className={cn(
      'w-full',
      !compact && 'mx-auto max-w-2xl',
      containerClassName
    )}>
      {renderHeader?.()}

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
                'rounded-full border border-foreground/20 px-6 py-3',
                'text-foreground text-base',
                'focus:outline-none focus:ring-2 focus:ring-foreground/50',
                'placeholder:text-foreground/40',
                compact ? 'w-96' : 'w-full',
                inputClassName
              )}
              placeholder={placeholder}
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
              compact ? 'w-96' : 'w-full',
              panelClassName
            )}
          >
            {autocompleteState.collections.map((collection) => {
              const { items } = collection;
              const sourceId = collection.source.sourceId as string;

              if (items.length === 0 && renderEmpty) {
                return (
                  <div
                    key={sourceId}
                    className="px-4 py-8 text-center"
                  >
                    {renderEmpty(autocompleteState.query)}
                  </div>
                );
              }

              if (items.length === 0) {
                return (
                  <div
                    key={sourceId}
                    className="px-4 py-8 text-center"
                  >
                    <p className="text-sm text-foreground/50">
                      No results found
                    </p>
                  </div>
                );
              }

              return (
                <div key={sourceId}>
                  <ul
                    {...(autocomplete.getListProps() as unknown as React.HTMLAttributes<HTMLUListElement>)}
                  >
                    {items.map((item) => (
                      <React.Fragment key={item.id}>
                        {renderItem({
                          item,
                          query: autocompleteState.query,
                          itemProps: autocomplete.getItemProps({
                            item,
                            source: collection.source as never,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>,
                        })}
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renderFooter?.({ itemCount: totalItems, isOpen: autocompleteState.isOpen })}
    </div>
  );
}

