import { cn } from '@/utils/cn';
import type { DocumentCategory } from './types';
import { CATEGORY_METADATA } from './utils';

interface CategoryFilter {
    category: DocumentCategory;
    isVisible: boolean;
    count: number;
}

interface LegendProps {
    filters: CategoryFilter[];
    onToggleCategory: (category: DocumentCategory) => void;
    showZeroAmount?: boolean;
    onToggleZeroAmount?: () => void;
}

export function Legend({ filters, onToggleCategory, showZeroAmount = true, onToggleZeroAmount }: LegendProps) {
    return (
        <div className="pb-4 border-b border-foreground/10">
            {/* Desktop layout: single row with wrapping */}
            <div className="hidden xl:flex xl:flex-wrap items-center gap-3">
                {filters.map(({ category, isVisible, count }) => {
                    const metadata = CATEGORY_METADATA[category];

                    return (
                        <button
                            key={category}
                            onClick={() => onToggleCategory(category)}
                            className={cn(
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                'border hover:shadow-sm cursor-pointer shrink-0',
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
                            <span className={cn(
                                'text-xs px-1.5 py-0.5 rounded',
                                isVisible ? metadata.filterBgActive : 'bg-foreground/10'
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* Separator - desktop only */}
                <div className="h-6 w-px bg-foreground/20 shrink-0" />

                {/* Zero amount toggle - inline on desktop */}
                {onToggleZeroAmount && (
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-foreground/5 transition-all">
                        <input
                            type="checkbox"
                            checked={showZeroAmount}
                            onChange={onToggleZeroAmount}
                            className="w-4 h-4 rounded border-foreground/30 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-foreground/70">Show $0 documents</span>
                    </label>
                )}
            </div>

            {/* Mobile layout: scrollable buttons with checkbox below */}
            <div className="xl:hidden space-y-6">
                <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 -mb-2">
                    {filters.map(({ category, isVisible, count }) => {
                        const metadata = CATEGORY_METADATA[category];

                        return (
                            <button
                                key={category}
                                onClick={() => onToggleCategory(category)}
                                className={cn(
                                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                    'border hover:shadow-sm cursor-pointer shrink-0',
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
                                <span className={cn(
                                    'text-xs px-1.5 py-0.5 rounded',
                                    isVisible ? metadata.filterBgActive : 'bg-foreground/10'
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
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
                        <span className="text-foreground/70">Show $0 documents</span>
                    </label>
                )}
            </div>
        </div>
    );
}


