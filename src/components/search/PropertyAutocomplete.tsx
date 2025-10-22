'use client';

import { createAutocomplete } from '@algolia/autocomplete-core';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { fetchProperties, type PropertyItem } from './propertyService';
import { PropertyResultItem } from './PropertyResultItem';

interface PropertyAutocompleteProps {
  compact?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
}

export function PropertyAutocomplete({ compact = false, initialValue = '', autoFocus = true }: PropertyAutocompleteProps) {
  const router = useRouter();
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
    query: initialValue,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const autocomplete = useRef(
    createAutocomplete<PropertyItem>({
      autoFocus,
      initialState: {
        query: initialValue,
      },
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
            onSelect({ item }) {
              // Navigate to property page with BBL format and address in query string
              const bbl = `${item.borough}-${item.block}-${item.lot}`;
              const address = encodeURIComponent(item.address);
              router.push(`/property/${bbl}?address=${address}`);
            },
          },
        ];
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

  return (
    <div className={cn(
      'w-full',
      !compact && 'mx-auto max-w-2xl'
    )}>
      {!compact && (
        <div className="mb-8">
          <p className="text-base text-foreground/70">
            Search by Address or BBL (Borough–Block–Lot)
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
                'rounded-full border border-foreground/20 px-6 py-3',
                'text-foreground text-base',
                'focus:outline-none focus:ring-2 focus:ring-foreground/50',
                'placeholder:text-foreground/40',
                compact ? 'w-96' : 'w-full'
              )}
              placeholder='Try "1 Broadway" or "1 13 1"'
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
                    {items.map((item) => (
                      <PropertyResultItem
                        key={item.id}
                        item={item}
                        query={autocompleteState.query}
                        compact={compact}
                        itemProps={
                          autocomplete.getItemProps({
                            item,
                            source: collection.source as never,
                          }) as unknown as React.LiHTMLAttributes<HTMLLIElement>
                        }
                      />
                    ))}
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

