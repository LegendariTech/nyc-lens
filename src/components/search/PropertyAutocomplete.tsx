'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { fetchProperties, type PropertyItem } from './propertyService';
import { PropertyResultItem } from './PropertyResultItem';
import { findMatchInText } from './textMatcher';
import { buildPropertyUrl } from '@/utils/urlSlug';
import { getBoroughDisplayName } from '@/constants/nyc';

interface PropertyAutocompleteProps {
  compact?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
  searchField?: 'address' | 'address_with_unit';
  /** Custom className for the input element */
  inputClassName?: string;
  /** Accessible label for the input (for screen readers) */
  ariaLabel?: string;
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
  ariaLabel,
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

  // Helper to determine the target tab based on current location
  const getTargetTab = (): string => {
    // If we're already on a property page, extract just the tab name (not address)
    if (pathname?.startsWith('/property/')) {
      // Match pattern: /property/[bbl]/[tab]/[optional-address]
      // Extract the tab part (overview, contacts, transactions, etc.)
      const parts = pathname.split('/');
      if (parts.length >= 4) {
        const tab = parts[3]; // e.g., "overview", "contacts", "tax"

        // Handle DOB sub-routes (e.g., /property/1-13-1/dob/violations/...)
        if (tab === 'dob' && parts.length >= 5) {
          return `dob/${parts[4]}`; // e.g., "dob/violations"
        }

        return tab;
      }
    }

    // Default to overview page
    return 'overview';
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
      ariaLabel={ariaLabel}
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
            // Navigate to property page with BBL format and SEO-friendly address slug
            const bbl = `${item.borough}-${item.block}-${item.lot}`;
            const matchedAddress = item.matchedAddress || item.address_with_unit;

            // Extract borough name for URL (Manhattan → "New York" for addresses)
            const boroughName = getBoroughDisplayName(item.borough);

            // Get current tab (without address)
            const tab = getTargetTab();

            // Build SEO-friendly URL with address slug
            const url = buildPropertyUrl(bbl, tab, {
              street: matchedAddress,
              borough: boroughName,
              state: 'NY',
              zip: item.zip_code
            });

            router.push(url);
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

