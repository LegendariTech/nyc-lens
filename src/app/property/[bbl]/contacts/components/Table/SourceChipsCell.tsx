import { SOURCE_TO_CATEGORY, CATEGORY_LABELS, CATEGORY_CHIP_STYLES, type SourceCategory } from '../../constants/sourceCategories';
import { cn } from '@/utils/cn';

interface SourceChipsCellProps {
    value?: string[] | null;
    visibleSources?: Set<SourceCategory>;
}

/**
 * Cell renderer for displaying source categories as colored chips
 * Only shows chips for categories that are currently visible in the filter
 */
export function SourceChipsCell({ value, visibleSources }: SourceChipsCellProps) {
    const sources = value || [];
    if (sources.length === 0) return null;

    // Get unique categories for this contact's sources
    const categories = Array.from(
        new Set(
            sources
                .map(src => SOURCE_TO_CATEGORY[src])
                .filter(cat => cat !== undefined)
        )
    );

    // Filter to only show visible categories
    const visibleCategories = visibleSources
        ? categories.filter(cat => visibleSources.has(cat))
        : categories;

    if (visibleCategories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5 py-1">
            {visibleCategories.map(category => (
                <span
                    key={category}
                    className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                        CATEGORY_CHIP_STYLES[category]
                    )}
                >
                    {CATEGORY_LABELS[category]}
                </span>
            ))}
        </div>
    );
}
