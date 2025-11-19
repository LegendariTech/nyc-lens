'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> {
  /** Visual style variant */
  variant?: 'default' | 'error';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base classes for all selects
    const baseClasses = cn(
      'w-full rounded-md border transition-all duration-100',
      'bg-background text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Add some right padding for the dropdown arrow
      'appearance-none bg-[length:16px] bg-[right_0.5rem_center] bg-no-repeat',
      // Custom dropdown arrow using a data URI
      'bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E\')]'
    );

    // Variant styles
    const variantClasses = {
      default: 'border-foreground/20 hover:border-foreground/30',
      error: 'border-destructive hover:border-destructive focus:ring-destructive',
    };

    // Size styles
    const sizeClasses = {
      xs: 'h-6 text-xs pl-2 pr-7',
      sm: 'h-8 text-sm pl-3 pr-8',
      md: 'h-10 text-base pl-4 pr-10',
      lg: 'h-12 text-lg pl-5 pr-12',
    };

    return (
      <select
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
