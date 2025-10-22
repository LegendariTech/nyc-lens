'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { fetchProperties, type PropertyItem } from './propertyService';
import { PropertyResultItem } from './PropertyResultItem';

interface PropertyAutocompleteProps {
  compact?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
}

/**
 * Property-specific autocomplete component
 * 
 * Wraps the generic Autocomplete component with property search logic,
 * including fetching from Elasticsearch and navigation to property pages.
 */
export function PropertyAutocomplete({
  compact = false,
  initialValue = '',
  autoFocus = true
}: PropertyAutocompleteProps) {
  const router = useRouter();

  return (
    <Autocomplete<PropertyItem>
      compact={compact}
      initialValue={initialValue}
      autoFocus={autoFocus}
      placeholder='Try "1 Broadway" or "1 13 1"'
      maxResults={4}
      openOnFocus={true}
      getSources={({ query }) => [
        {
          sourceId: 'properties',
          async getItems() {
            return await fetchProperties(query);
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
      ]}
      renderItem={({ item, query, itemProps }) => (
        <PropertyResultItem
          key={item.id}
          item={item}
          query={query}
          compact={compact}
          itemProps={itemProps}
        />
      )}
      renderEmpty={(query) => (
        <p className="text-sm text-foreground/50">
          No properties found for &quot;{query}&quot;
        </p>
      )}
      renderHeader={
        !compact
          ? () => (
            <div className="mb-8">
              <p className="text-base text-foreground/70">
                Search by Address or BBL (Borough–Block–Lot)
              </p>
            </div>
          )
          : undefined
      }
      renderFooter={
        !compact
          ? ({ itemCount, isOpen }) =>
            isOpen && itemCount > 0 ? (
              <div className="mt-4">
                <p className="text-sm text-foreground/60">
                  Showing {itemCount} result{itemCount !== 1 ? 's' : ''}
                </p>
              </div>
            ) : null
          : undefined
      }
    />
  );
}

