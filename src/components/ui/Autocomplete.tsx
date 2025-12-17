'use client';

import React from 'react';
import { createAutocomplete, type AutocompleteSource } from '@algolia/autocomplete-core';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

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

  /** Accessible label for the input (for screen readers) */
  ariaLabel?: string;

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
  ariaLabel,
  panelClassName,
  containerClassName,
  openOnFocus = true,
  maxResults,
  onInputChange,
  onOpenChange,
}: AutocompleteProps<TItem>) {
  // Use React's useId for stable SSR/client IDs
  const id = useId();

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
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autocomplete = useRef(
    createAutocomplete<TItem>({
      id,
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
            getItems: async (params) => {
              const items = await source.getItems(params);
              // getItems can return TItem[] | TItem[][] | RequesterDescription<TItem>
              // We only slice if it's an array
              if (Array.isArray(items)) {
                return items.flat().slice(0, maxResults) as TItem[];
              }
              return items;
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

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

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
              aria-label={ariaLabel}
              onBlur={() => {
                // Clear any existing blur timeout
                if (blurTimeoutRef.current) {
                  clearTimeout(blurTimeoutRef.current);
                }
                // Delay closing to allow clicks on panel items to register
                blurTimeoutRef.current = setTimeout(() => {
                  // Only close if focus hasn't moved to panel
                  if (!panelRef.current?.contains(document.activeElement)) {
                    autocomplete.setIsOpen(false);
                  }
                  blurTimeoutRef.current = null;
                }, 200);
              }}
              className={cn(
                'rounded-md border border-foreground/20 py-3 pl-6',
                autocompleteState.query ? 'pr-10' : 'pr-6',
                'text-foreground text-base',
                'focus:outline-none focus:ring-2 focus:ring-foreground/50',
                'placeholder:text-foreground/40',
                compact ? 'w-96' : 'w-full',
                inputClassName
              )}
              placeholder={placeholder}
              type="text"
            />
            {autocompleteState.query && (
              <button
                type="button"
                onClick={() => {
                  autocomplete.setQuery('');
                  autocomplete.refresh();
                  inputRef.current?.focus();
                }}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'flex h-5 w-5 items-center justify-center rounded-full',
                  'text-foreground/40 hover:text-foreground/70',
                  'transition-colors'
                )}
                aria-label="Clear input"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
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

