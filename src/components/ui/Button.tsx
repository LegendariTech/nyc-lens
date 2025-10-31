'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'default',
    size = 'md',
    isLoading = false,
    className,
    children,
    disabled,
    type = 'button',
    ...props
  }, ref) => {
    // Base classes for all buttons
    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2',
      'rounded-md font-medium transition-all duration-100 cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
    );

    // Variant styles with hover and active states
    const variantClasses = {
      default: 'bg-foreground/10 text-foreground hover:bg-foreground/20 active:bg-foreground/30 active:scale-[0.98]',
      primary: 'bg-primary text-primary-foreground hover:opacity-90 active:opacity-80 active:scale-[0.98]',
      secondary: 'border border-border bg-background text-foreground hover:bg-foreground/5 active:bg-foreground/10 active:scale-[0.98]',
      ghost: 'bg-transparent text-foreground hover:bg-foreground/10 active:bg-foreground/20 active:scale-[0.98]',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800',
      outline: 'border border-border bg-transparent text-foreground hover:bg-foreground/10 active:bg-foreground/20 active:scale-[0.98]',
    };

    // Size styles
    const sizeClasses = {
      xs: 'h-6 px-3 text-xs',
      sm: 'h-8 px-4 text-sm',
      md: 'h-10 px-6 text-base',
      lg: 'h-12 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };

