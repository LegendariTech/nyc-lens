import type { ICellRendererParams } from 'ag-grid-community';
import type { OwnerContactRow } from './types';
import { CATEGORY_METADATA } from '../utils';
import { cn } from '@/utils/cn';

/**
 * Cell renderer component for category chips
 * Uses Tailwind classes for proper dark mode support
 */
export function CategoryChip(props: ICellRendererParams<OwnerContactRow>) {
    if (!props.data || !props.data.category) return null;

    const category = props.data.category;
    const metadata = CATEGORY_METADATA[category];

    return (
        <span
            title={metadata.label}
            className={cn(
                'inline-block px-1.5 py-0.5 rounded text-[11px] font-medium',
                'border cursor-default leading-tight',
                metadata.filterBorderActive,
                metadata.filterBgActive,
                metadata.filterTextActive
            )}
        >
            {metadata.abbreviation}
        </span>
    );
}
