'use client';

import { useState, useRef, useCallback } from 'react';
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
  children: React.ReactNode;
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
 * - Auto-positions tooltip (top/bottom) based on available space
 * - Mobile: Click to open with backdrop, click backdrop to close
 * - Desktop: Hover to open with delay before closing
 * - Supports HTML content in descriptions
 * - Accessible and responsive
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
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const tooltipHeight = window.innerHeight * 0.6; // max-h-[60vh]

    // Position below if not enough space above
    const newPosition = spaceAbove < tooltipHeight && spaceBelow > spaceAbove ? 'bottom' : 'top';
    setTooltipPosition(newPosition);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Only handle click on mobile (touch devices)
    // On desktop, hover handles the tooltip
    e.preventDefault();

    // Toggle: if already open, close it; otherwise open it
    if (openTooltip === fieldKey) {
      setOpenTooltip(null);
    } else {
      calculatePosition(e.currentTarget);
      setOpenTooltip(fieldKey);
    }
  }, [openTooltip, fieldKey, calculatePosition]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    calculatePosition(e.currentTarget);
    setHoveredTooltip(fieldKey);
  }, [fieldKey, calculatePosition]);

  const handleMouseLeave = useCallback(() => {
    // Set a delay before hiding the tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredTooltip(null);
    }, 300); // 300ms delay
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    // Clear hide timeout when mouse enters tooltip
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    // Hide tooltip when mouse leaves tooltip area
    setHoveredTooltip(null);
  }, []);

  const handleBackdropClick = useCallback(() => {
    setOpenTooltip(null);
  }, []);

  if (!description) {
    return <>{children}</>;
  }

  // Icon-only mode
  if (asIcon) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          className="text-foreground/40 hover:text-foreground/60 transition-colors cursor-help"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
        
        {/* Backdrop for mobile */}
        {openTooltip === fieldKey && (
          <div
            className="fixed inset-0 z-[90] bg-black/50 md:hidden"
            onClick={handleBackdropClick}
          />
        )}
        
        {/* Tooltip */}
        <div
          className={cn(
            'prose prose-xs absolute left-0 z-[100] max-h-[60vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-600 bg-black p-4 text-xs text-white shadow-lg',
            '[&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1',
            tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            // Mobile: show when clicked (openTooltip state)
            // Desktop: show on hover (hoveredTooltip state)
            openTooltip === fieldKey ? 'block md:hidden' : hoveredTooltip === fieldKey ? 'hidden md:block' : 'hidden'
          )}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }}
        />
      </div>
    );
  }

  // Wrapper mode - wraps children
  return (
    <span className={cn('group relative', className)}>
      <span
        className="cursor-help"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      
      {/* Backdrop for mobile */}
      {openTooltip === fieldKey && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 md:hidden"
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Tooltip */}
      <div
        className={cn(
          'prose prose-xs absolute left-0 z-[100] max-h-[60vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-600 bg-black p-4 text-xs text-white shadow-lg',
          '[&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1',
          tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          // Mobile: show when clicked (openTooltip state)
          // Desktop: show on hover (hoveredTooltip state)
          openTooltip === fieldKey ? 'block md:hidden' : hoveredTooltip === fieldKey ? 'hidden md:block' : 'hidden'
        )}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
        dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }}
      />
    </span>
  );
}


