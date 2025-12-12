'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { fetchProperties, type PropertyItem } from './propertyService';
import { PropertyResultItem } from './PropertyResultItem';
import { findMatchInText } from './textMatcher';

interface PropertyAutocompleteProps {
  compact?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  searchField?: 'address' | 'address_with_unit';
  /** Custom className for the input element */
  inputClassName?: string;
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
  autoFocus = true,
  searchField = 'address_with_unit',
  inputClassName,
}: PropertyAutocompleteProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to find the matched address (address_with_unit or AKA)
  const getMatchedAddress = (item: PropertyItem, query: string): string => {
    // First check if address_with_unit matches
    const addressWithUnitMatch = findMatchInText(item.address_with_unit, query);
    if (addressWithUnitMatch !== null) {
      return item.address_with_unit;
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

    // Fallback to address_with_unit
    return item.address_with_unit;
  };

  // Helper to determine the target path based on current location
  const getTargetPath = (bbl: string): string => {
    // If we're already on a property page, preserve the current tab/section
    if (pathname?.startsWith('/property/')) {
      // Extract the path after the BBL (e.g., /transactions, /tax, /dob/jobs-filings)
      const currentBblMatch = pathname.match(/^\/property\/[^/]+(\/.*)?$/);
      if (currentBblMatch && currentBblMatch[1]) {
        // Keep the same page/tab for the new property
        return `/property/${bbl}${currentBblMatch[1]}`;
      }
    }

    // Default to base property page (which redirects to transactions)
    return `/property/${bbl}`;
  };

  return (
    <Autocomplete<PropertyItem>
      compact={compact}
      initialValue={initialValue}
      autoFocus={autoFocus}
      placeholder='Try "1 Broadway" or "1 13 1"'
      maxResults={400}
      openOnFocus={true}
      inputClassName={inputClassName}
      getSources={({ query }) => [
        {
          sourceId: 'properties',
          async getItems() {
            const items = await fetchProperties(query, searchField);
            // Add matched address to each item
            return items.map(item => ({
              ...item,
              matchedAddress: getMatchedAddress(item, query)
            }));
          },
          getItemInputValue({ item }) {
            return item.matchedAddress || item.address_with_unit;
          },
          onSelect({ item }) {
            // Navigate to property page with BBL format and matched address in query string
            const bbl = `${item.borough}-${item.block}-${item.lot}`;
            const address = encodeURIComponent(item.matchedAddress || item.address_with_unit);
            const targetPath = getTargetPath(bbl);
            router.push(`${targetPath}?address=${address}`);
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

