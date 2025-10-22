import { cn } from '@/lib/utils';
import type { PropertyItem } from './propertyService';
import { HighlightedText } from './HighlightedText';
import { formatCurrency, formatDate } from './formatters';

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
            <HighlightedText text={item.address} query={query} />
          </div>
          <div className="text-sm leading-5 text-foreground/60">
            BBL: {item.borough}-{item.block}-{item.lot}
          </div>
          {/* Sale Information */}
          {item.sale_document_date && item.sale_document_amount && (
            <div className="text-sm leading-5 text-foreground/70">
              Sold {formatDate(item.sale_document_date)} for{' '}
              {formatCurrency(item.sale_document_amount)}
            </div>
          )}
          {item.buyer_name && (
            <div className="text-sm leading-5 text-foreground/70">
              Owner: {item.buyer_name}
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

