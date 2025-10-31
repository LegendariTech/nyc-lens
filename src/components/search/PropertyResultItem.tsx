import { cn } from '@/utils/cn';
import type { PropertyItem } from './propertyService';
import { HighlightedText } from './HighlightedText';
import { formatCurrency, formatDate } from './formatters';
import { useViewport } from '@/components/layout/ViewportContext';
import { findMatchInText } from './textMatcher';
import { getBuildingClassCategory } from '@/constants/building';

interface PropertyResultItemProps {
  item: PropertyItem;
  query: string;
  compact?: boolean;
  itemProps: React.LiHTMLAttributes<HTMLLIElement>;
}

/**
 * Individual property result item in autocomplete dropdown
 */
export function PropertyResultItem({
  item,
  query,
  compact = false,
  itemProps,
}: PropertyResultItemProps) {
  const { isMobile } = useViewport();

  // Use pre-computed matched address if available, otherwise compute it
  const displayAddress = item.matchedAddress || (() => {
    // First check if main address matches
    const mainAddressMatch = findMatchInText(item.address, query);

    // If main address matches, use it
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

    // Fallback to main address if nothing matched
    return item.address;
  })();

  return (
    <li
      {...itemProps}
      className={cn(
        'cursor-pointer border-b border-foreground/5 transition-colors last:border-b-0',
        'hover:bg-foreground/5',
        'aria-selected:bg-foreground/10',
        compact ? 'px-3 py-2' : 'px-4 py-3'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="text-base leading-5 text-foreground">
            <HighlightedText text={displayAddress} query={query} />
          </div>
          <div className="text-sm leading-5 text-foreground/60">
            BBL: {item.borough}-{item.block}-{item.lot}
          </div>
          {/* Sale Information - hidden on mobile */}
          {!isMobile && item.sale_document_date && item.sale_document_amount && (
            <div className="text-sm leading-5 text-foreground/70">
              Sold {formatDate(item.sale_document_date)} for{' '}
              {formatCurrency(item.sale_document_amount)}
            </div>
          )}
          {/* Building Class Category - hidden on mobile */}
          {!isMobile && item.avroll_building_class && (
            <div className="text-sm leading-5 text-foreground/70">
              {getBuildingClassCategory(item.avroll_building_class)}
            </div>
          )}
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
}

