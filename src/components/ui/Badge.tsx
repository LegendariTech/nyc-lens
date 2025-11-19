'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Visual style variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base classes for all badges
    const baseClasses = cn(
      'inline-flex items-center justify-center gap-1',
      'rounded-full font-medium',
      'transition-colors duration-100'
    );

    // Variant styles
    const variantClasses = {
      default: 'bg-foreground/10 text-foreground',
      success: 'bg-green-500/15 text-green-700 dark:text-green-400',
      warning: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
      error: 'bg-destructive/15 text-destructive',
      info: 'bg-accent/15 text-accent',
    };

    // Size styles
    const sizeClasses = {
      sm: 'h-5 px-2 text-xs',
      md: 'h-6 px-2.5 text-sm',
      lg: 'h-7 px-3 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
