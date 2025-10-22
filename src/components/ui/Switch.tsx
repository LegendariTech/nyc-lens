'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /** Size variant of the switch */
  size?: 'sm' | 'md' | 'lg';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: {
      root: 'h-5 w-9',
      thumb: 'size-4 data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5',
    },
    md: {
      root: 'h-6 w-11',
      thumb: 'size-5 data-[state=checked]:translate-x-5.5 data-[state=unchecked]:translate-x-0.5',
    },
    lg: {
      root: 'h-7 w-14',
      thumb: 'size-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0.5',
    },
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground/30',
        sizeClasses[size].root,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
          sizeClasses[size].thumb
        )}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = 'Switch';

export { Switch };

