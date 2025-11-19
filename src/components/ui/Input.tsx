'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Visual style variant */
  variant?: 'default' | 'error';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Optional icon or element to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Optional icon or element to display at the end of the input */
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      startIcon,
      endIcon,
      className,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes for all inputs
    const baseClasses = cn(
      'w-full rounded-md border transition-all duration-100',
      'bg-background text-foreground',
      'placeholder:text-foreground/50',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    // Variant styles
    const variantClasses = {
      default: 'border-foreground/20 hover:border-foreground/30',
      error: 'border-destructive hover:border-destructive focus:ring-destructive',
    };

    // Size styles - adjust padding based on whether icons are present
    const sizeClasses = {
      xs: cn(
        'h-6 text-xs',
        startIcon ? 'pl-7' : 'pl-2',
        endIcon ? 'pr-7' : 'pr-2'
      ),
      sm: cn(
        'h-8 text-sm',
        startIcon ? 'pl-8' : 'pl-3',
        endIcon ? 'pr-8' : 'pr-3'
      ),
      md: cn(
        'h-10 text-base',
        startIcon ? 'pl-10' : 'pl-4',
        endIcon ? 'pr-10' : 'pr-4'
      ),
      lg: cn(
        'h-12 text-lg',
        startIcon ? 'pl-12' : 'pl-5',
        endIcon ? 'pr-12' : 'pr-5'
      ),
    };

    // Icon container size styles
    const iconSizeClasses = {
      xs: 'size-3',
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-5',
    };

    // Icon wrapper position styles
    const iconPositionClasses = {
      xs: 'px-2',
      sm: 'px-2.5',
      md: 'px-3',
      lg: 'px-4',
    };

    // If we have icons, we need to wrap the input in a relative container
    if (startIcon || endIcon) {
      return (
        <div className="relative">
          {startIcon && (
            <div
              className={cn(
                'absolute left-0 top-0 h-full flex items-center justify-center text-foreground/50',
                iconPositionClasses[size]
              )}
            >
              {typeof startIcon === 'string' ? (
                <span className={iconSizeClasses[size]}>{startIcon}</span>
              ) : (
                <div className={cn('flex items-center justify-center', iconSizeClasses[size])}>
                  {startIcon}
                </div>
              )}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[size],
              className
            )}
            disabled={disabled}
            {...props}
          />
          {endIcon && (
            <div
              className={cn(
                'absolute right-0 top-0 h-full flex items-center justify-center text-foreground/50',
                iconPositionClasses[size]
              )}
            >
              {typeof endIcon === 'string' ? (
                <span className={iconSizeClasses[size]}>{endIcon}</span>
              ) : (
                <div className={cn('flex items-center justify-center', iconSizeClasses[size])}>
                  {endIcon}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Simple input without icons
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
