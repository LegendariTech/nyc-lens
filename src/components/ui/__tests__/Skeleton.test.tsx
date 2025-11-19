import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../Skeleton';
import { createRef } from 'react';

describe('Skeleton', () => {
  describe('Basic Rendering', () => {
    it('renders skeleton element', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.tagName).toBe('DIV');
    });

    it('has aria-busy and aria-live attributes', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Skeleton variant="default" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-md');
    });

    it('renders text variant', () => {
      render(<Skeleton variant="text" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('h-4');
      expect(skeleton.className).toContain('w-full');
      expect(skeleton.className).toContain('rounded');
    });

    it('renders circular variant', () => {
      render(<Skeleton variant="circular" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-full');
    });

    it('renders rectangular variant', () => {
      render(<Skeleton variant="rectangular" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-none');
    });
  });

  describe('Animations', () => {
    it('renders pulse animation by default', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('animate-pulse');
    });

    it('renders wave animation', () => {
      render(<Skeleton animation="wave" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('animate-shimmer');
      expect(skeleton.className).toContain('bg-gradient-to-r');
    });

    it('renders without animation', () => {
      render(<Skeleton animation="none" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).not.toContain('animate-pulse');
      expect(skeleton.className).not.toContain('animate-shimmer');
    });
  });

  describe('Custom Sizing', () => {
    it('accepts custom width class', () => {
      render(<Skeleton className="w-32" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('w-32');
    });

    it('accepts custom height class', () => {
      render(<Skeleton className="h-32" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('h-32');
    });

    it('accepts multiple custom classes', () => {
      render(<Skeleton className="w-64 h-16 mx-auto" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('w-64');
      expect(skeleton.className).toContain('h-16');
      expect(skeleton.className).toContain('mx-auto');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('can access ref properties', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Skeleton ref={ref} data-testid="skeleton" />);
      expect(ref.current?.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Skeleton className="custom-class" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('custom-class');
    });

    it('merges custom className with base classes', () => {
      render(<Skeleton className="bg-red-500" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('bg-red-500');
      // Note: Tailwind will handle the class priority
    });

    it('accepts arbitrary HTML attributes', () => {
      render(
        <Skeleton
          data-testid="skeleton"
          title="Loading content"
          role="status"
        />
      );
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('title', 'Loading content');
      expect(skeleton).toHaveAttribute('role', 'status');
    });
  });

  describe('Styling', () => {
    it('applies base background class', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('bg-foreground/10');
    });

    it('applies rounded corners for default variant', () => {
      render(<Skeleton variant="default" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-md');
    });
  });

  describe('Variant and Animation Combinations', () => {
    it('renders text variant with pulse animation', () => {
      render(<Skeleton variant="text" animation="pulse" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('h-4');
      expect(skeleton.className).toContain('animate-pulse');
    });

    it('renders circular variant with wave animation', () => {
      render(<Skeleton variant="circular" animation="wave" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-full');
      expect(skeleton.className).toContain('animate-shimmer');
    });

    it('renders rectangular variant with no animation', () => {
      render(<Skeleton variant="rectangular" animation="none" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-none');
      expect(skeleton.className).not.toContain('animate-pulse');
      expect(skeleton.className).not.toContain('animate-shimmer');
    });
  });

  describe('Common Use Cases', () => {
    it('renders avatar skeleton', () => {
      render(<Skeleton variant="circular" className="h-12 w-12" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('rounded-full');
      expect(skeleton.className).toContain('h-12');
      expect(skeleton.className).toContain('w-12');
    });

    it('renders text line skeleton', () => {
      render(<Skeleton variant="text" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('h-4');
      expect(skeleton.className).toContain('w-full');
    });

    it('renders card skeleton', () => {
      render(<Skeleton className="h-64 w-full" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton.className).toContain('h-64');
      expect(skeleton.className).toContain('w-full');
      expect(skeleton.className).toContain('rounded-md');
    });
  });
});
