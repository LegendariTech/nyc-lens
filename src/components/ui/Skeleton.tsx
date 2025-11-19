'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Visual variant */
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'default',
      animation = 'pulse',
      className,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = cn(
      'bg-foreground/10',
      animation === 'pulse' && 'animate-pulse',
      animation === 'wave' && 'animate-shimmer bg-gradient-to-r from-foreground/10 via-foreground/20 to-foreground/10 bg-[length:200%_100%]'
    );

    // Variant styles
    const variantClasses = {
      default: 'rounded-md',
      text: 'h-4 w-full rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
