'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/utils/cn';

export interface FieldTooltipProps {
  /**
   * The description/content to show in the tooltip
   */
  description: string;
  /**
   * Unique identifier for this tooltip (used for state management)
   */
  fieldKey: string;
  /**
   * Children to render (typically the label or trigger element)
   */
  children?: React.ReactNode;
  /**
   * Additional className for the trigger wrapper
   */
  className?: string;
  /**
   * Whether to show as an inline icon (vs wrapping the children)
   */
  asIcon?: boolean;
}

/**
 * FieldTooltip - A reusable tooltip component for field descriptions
 * 
 * Features:
 * - Auto-positions tooltip based on available space (uses Radix UI Tooltip)
 * - Mobile: Click to open, click outside to close
 * - Desktop: Hover to open with configurable delays
 * - Supports HTML content in descriptions
 * - Accessible and responsive
 * - Prevents clipping by parent overflow containers
 * 
 * @example
 * ```tsx
 * <FieldTooltip description="This is a description" fieldKey="owner-name">
 *   Owner Name
 * </FieldTooltip>
 * ```
 * 
 * @example As Icon
 * ```tsx
 * <div className="flex items-center gap-1">
 *   Owner Name
 *   <FieldTooltip description="This is a description" fieldKey="owner-name" asIcon />
 * </div>
 * ```
 */
export function FieldTooltip({
  description,
  fieldKey,
  children,
  className,
  asIcon = false,
}: FieldTooltipProps) {
  // If no description, just render children (or nothing in icon mode)
  if (!description) {
    return asIcon ? null : <>{children}</>;
  }

  // Icon-only mode
  if (asIcon) {
    return (
      <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={100}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <button
              type="button"
              className="text-foreground/40 hover:text-foreground/60 transition-colors cursor-help inline-flex items-center"
              aria-label={`Information about ${fieldKey}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className={cn(
                'prose prose-sm z-[100] max-h-[60vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-600 bg-black p-4 text-sm text-white shadow-lg',
                '[&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1',
                'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade',
                'data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade',
                'data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade',
                'data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
              )}
              sideOffset={8}
              collisionPadding={16}
            >
              <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  }

  // Wrapper mode - wraps children
  return (
    <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span className={cn('cursor-help inline-flex', className)}>
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={cn(
              'prose prose-sm z-[100] max-h-[60vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-600 bg-black p-4 text-sm text-white shadow-lg',
              '[&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1',
              'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade',
              'data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade',
              'data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade',
              'data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
            )}
            sideOffset={8}
            collisionPadding={16}
          >
            <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
