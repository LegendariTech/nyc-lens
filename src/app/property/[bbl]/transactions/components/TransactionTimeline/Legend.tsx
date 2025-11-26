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
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-foreground/10">
            <span className="text-sm font-medium text-foreground/70">Filter:</span>

            {filters.map(({ category, isVisible, count }) => {
                const metadata = CATEGORY_METADATA[category];

                return (
                    <button
                        key={category}
                        onClick={() => onToggleCategory(category)}
                        className={cn(
                            'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                            'border hover:shadow-sm',
                            isVisible
                                ? `${metadata.filterBorderActive} ${metadata.filterBgActive} ${metadata.filterTextActive}`
                                : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/60'
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

            {/* Separator */}
            <div className="h-6 w-px bg-foreground/20" />

            {/* Zero amount toggle */}
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
    );
}


