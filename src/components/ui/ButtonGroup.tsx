'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface ButtonGroupItem {
  label: string;
  subtitle?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface ButtonGroupProps {
  /** Main button label */
  label: string;
  /** Main button icon */
  icon?: React.ReactNode;
  /** Array of menu items */
  items: ButtonGroupItem[];
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function ButtonGroup({
  label,
  icon,
  items,
  variant = 'default',
  size = 'md',
  isLoading = false,
  className,
  disabled = false,
}: ButtonGroupProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const handleItemClick = (item: ButtonGroupItem) => {
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div ref={buttonRef} className="relative">
      {/* Main Button */}
      <button
        type="button"
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'rounded-r-none', // Remove right border radius for main button
          className
        )}
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(!isOpen)}
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
        {icon}
        {label}
      </button>

      {/* Dropdown Arrow Button */}
      <button
        type="button"
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'rounded-l-none border-l-0 px-2', // Remove left border radius and border
          'hover:bg-foreground/20'
        )}
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className={cn(
            'size-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-1 w-64 rounded-md border border-foreground/10 bg-background shadow-lg">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-foreground/10 focus:bg-foreground/10 focus:outline-none cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    {item.endIcon}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-foreground/60 mt-0.5">{item.subtitle}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { ButtonGroupProps, ButtonGroupItem };
