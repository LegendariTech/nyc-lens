'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Card component variants
 */
type CardVariant = 'default' | 'elevated' | 'outlined';

/**
 * Card component props
 */
interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Visual style variant */
  variant?: CardVariant;
}

/**
 * Card container component
 *
 * A versatile container for grouping related content with consistent styling.
 * Supports three visual variants and full composition via compound components.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-foreground/10 bg-background',
          variant === 'default' && 'shadow-sm',
          variant === 'elevated' && 'shadow-md',
          variant === 'outlined' && 'shadow-none',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

/**
 * Card header component with bottom border separator
 */
export const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-foreground/10', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Card content area with consistent padding
 */
export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

/**
 * Card footer component with top border separator
 */
export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-foreground/10', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

/**
 * Card title component - semantic h3 heading
 */
export const CardTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h3'>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * Card description component for subtitle/metadata
 */
export const CardDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-foreground/70', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';
