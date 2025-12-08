import { cn } from '@/utils/cn';

/**
 * Metadata required for each category in the legend
 */
export interface CategoryMetadata {
  pluralLabel: string;
  filterBorderActive: string;
  filterBgActive: string;
  filterTextActive: string;
  borderColor: string;
  bgColor: string;
}

/**
 * Category filter data
 */
export interface CategoryFilter<T extends string> {
  category: T;
  isVisible: boolean;
  count: number;
}

/**
 * Props for the FilterLegend component
 */
interface FilterLegendProps<T extends string> {
  filters: CategoryFilter<T>[];
  categoryMetadata: Record<T, CategoryMetadata>;
  onToggleCategory: (category: T) => void;
  showZeroAmount?: boolean;
  onToggleZeroAmount?: () => void;
  zeroAmountLabel?: string;
}

/**
 * Reusable filter legend component with category chips and optional toggle
 *
 * @example
 * ```tsx
 * <FilterLegend
 *   filters={filters}
 *   categoryMetadata={CATEGORY_METADATA}
 *   onToggleCategory={toggleCategory}
 *   showZeroAmount={showZero}
 *   onToggleZeroAmount={toggleZero}
 *   zeroAmountLabel="Show $0 documents"
 * />
 * ```
 */
export function FilterLegend<T extends string>({
  filters,
  categoryMetadata,
  onToggleCategory,
  showZeroAmount,
  onToggleZeroAmount,
  zeroAmountLabel = 'Show empty items',
}: FilterLegendProps<T>) {
  const renderButton = (category: T, isVisible: boolean, count: number) => {
    const metadata = categoryMetadata[category];

    return (
      <button
        key={category}
        onClick={() => onToggleCategory(category)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          'border hover:shadow-sm cursor-pointer shrink-0',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          isVisible
            ? `${metadata.filterBorderActive} ${metadata.filterBgActive} ${metadata.filterTextActive} hover:opacity-80 hover:shadow-md`
            : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/70 hover:bg-foreground/10 hover:shadow-md'
        )}
        aria-pressed={isVisible}
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${metadata.pluralLabel.toLowerCase()}`}
      >
        <span
          className={cn(
            'w-3 h-3 rounded-full border-2',
            isVisible
              ? `${metadata.borderColor} ${metadata.bgColor}`
              : 'border-foreground/30 bg-transparent'
          )}
          aria-hidden="true"
        />
        <span>{metadata.pluralLabel}</span>
        <span
          className={cn(
            'text-xs px-1.5 py-0.5 rounded',
            isVisible ? metadata.filterBgActive : 'bg-foreground/10'
          )}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="pb-4 border-b border-foreground/10">
      {/* Desktop layout: single row with wrapping */}
      <div className="hidden xl:flex xl:flex-wrap items-center gap-3">
        {filters.map(({ category, isVisible, count }) =>
          renderButton(category, isVisible, count)
        )}

        {/* Separator and toggle - desktop only */}
        {onToggleZeroAmount && (
          <>
            <div className="h-6 w-px bg-foreground/20 shrink-0" />
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-foreground/5 transition-all">
              <input
                type="checkbox"
                checked={showZeroAmount}
                onChange={onToggleZeroAmount}
                className="w-4 h-4 rounded border-foreground/30 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-foreground/70">{zeroAmountLabel}</span>
            </label>
          </>
        )}
      </div>

      {/* Mobile layout: scrollable buttons with optional checkbox below */}
      <div className="xl:hidden space-y-6">
        <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 -mb-2">
          {filters.map(({ category, isVisible, count }) =>
            renderButton(category, isVisible, count)
          )}
        </div>

        {/* Zero amount toggle - below on mobile */}
        {onToggleZeroAmount && (
          <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-foreground/5 transition-all rounded-md pt-5">
            <input
              type="checkbox"
              checked={showZeroAmount}
              onChange={onToggleZeroAmount}
              className="w-4 h-4 rounded border-foreground/30 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-foreground/70">{zeroAmountLabel}</span>
          </label>
        )}
      </div>
    </div>
  );
}
