'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { fetchProperties, type PropertyItem } from './propertyService';
import { PropertyResultItem } from './PropertyResultItem';
import { findMatchInText } from './textMatcher';

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

  // Helper to find the matched address (main or AKA)
  const getMatchedAddress = (item: PropertyItem, query: string): string => {
    // First check if main address matches
    const mainAddressMatch = findMatchInText(item.address, query);
    if (mainAddressMatch !== null) {
      return item.address;
    }

    // Otherwise, check all AKA addresses for matches
    const akaMatches = item.aka
      .map(aka => ({
        address: aka,
        match: findMatchInText(aka, query)
      }))
      .filter(result => result.match !== null);

    // If we have AKA matches, use the first one
    if (akaMatches.length > 0) {
      return akaMatches[0].address;
    }

    // Fallback to main address
    return item.address;
  };

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
            const items = await fetchProperties(query);
            // Add matched address to each item
            return items.map(item => ({
              ...item,
              matchedAddress: getMatchedAddress(item, query)
            }));
          },
          getItemInputValue({ item }) {
            return item.matchedAddress || item.address;
          },
          onSelect({ item }) {
            // Navigate to property page with BBL format and matched address in query string
            const bbl = `${item.borough}-${item.block}-${item.lot}`;
            const address = encodeURIComponent(item.matchedAddress || item.address);
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

