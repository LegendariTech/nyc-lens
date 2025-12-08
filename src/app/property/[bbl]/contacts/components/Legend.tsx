import { cn } from '@/utils/cn';
import type { ContactCategory } from './types';
import { CATEGORY_METADATA } from './utils';

interface CategoryFilter {
    category: ContactCategory;
    isVisible: boolean;
    count: number;
}

interface LegendProps {
    filters: CategoryFilter[];
    onToggleCategory: (category: ContactCategory) => void;
}

export function Legend({ filters, onToggleCategory }: LegendProps) {
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

            {/* Mobile layout: scrollable buttons */}
            <div className="xl:hidden">
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
            </div>
        </div>
    );
}
