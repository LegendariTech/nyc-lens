import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';
import { createRef } from 'react';

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('renders badge with text', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="default" data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-foreground/10');
      expect(badge.className).toContain('text-foreground');
    });

    it('renders success variant', () => {
      render(<Badge variant="success" data-testid="badge">Success</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-green-500/15');
      expect(badge.className).toContain('text-green-700');
    });

    it('renders warning variant', () => {
      render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-yellow-500/15');
      expect(badge.className).toContain('text-yellow-700');
    });

    it('renders error variant', () => {
      render(<Badge variant="error" data-testid="badge">Error</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-destructive/15');
      expect(badge.className).toContain('text-destructive');
    });

    it('renders info variant', () => {
      render(<Badge variant="info" data-testid="badge">Info</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-accent/15');
      expect(badge.className).toContain('text-accent');
    });
  });

  describe('Sizes', () => {
    it('renders sm size', () => {
      render(<Badge size="sm" data-testid="badge">Small</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('h-5');
      expect(badge.className).toContain('text-xs');
    });

    it('renders md size (default)', () => {
      render(<Badge size="md" data-testid="badge">Medium</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('h-6');
      expect(badge.className).toContain('text-sm');
    });

    it('renders lg size', () => {
      render(<Badge size="lg" data-testid="badge">Large</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('h-7');
      expect(badge.className).toContain('text-base');
    });
  });

  describe('Content', () => {
    it('renders text content', () => {
      render(<Badge>Simple Text</Badge>);
      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('renders with icon and text', () => {
      render(
        <Badge data-testid="badge">
          <svg data-testid="icon" className="size-3" />
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('renders with only icon', () => {
      render(
        <Badge data-testid="badge">
          <svg data-testid="icon" className="size-3" />
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders with numbers', () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('can access ref properties', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Badge ref={ref} data-testid="badge">Badge</Badge>);
      expect(ref.current?.textContent).toBe('Badge');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Badge className="custom-class" data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('custom-class');
    });

    it('merges custom className with base classes', () => {
      render(<Badge className="ml-2" data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('ml-2');
      expect(badge.className).toContain('inline-flex');
    });

    it('accepts arbitrary HTML attributes', () => {
      render(
        <Badge
          data-testid="badge"
          aria-label="Status badge"
          title="Tooltip text"
        >
          Badge
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('aria-label', 'Status badge');
      expect(badge).toHaveAttribute('title', 'Tooltip text');
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Badge aria-label="Active status" data-testid="badge">Active</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'Active status');
    });

    it('supports role attribute', () => {
      render(<Badge role="status" data-testid="badge">Status</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('role', 'status');
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('inline-flex');
      expect(badge.className).toContain('rounded-full');
      expect(badge.className).toContain('font-medium');
    });

    it('applies transition classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('transition-colors');
    });
  });

  describe('Variant and Size Combinations', () => {
    it('renders small success badge', () => {
      render(<Badge variant="success" size="sm" data-testid="badge">Small Success</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-green-500/15');
      expect(badge.className).toContain('h-5');
    });

    it('renders large error badge', () => {
      render(<Badge variant="error" size="lg" data-testid="badge">Large Error</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-destructive/15');
      expect(badge.className).toContain('h-7');
    });

    it('renders medium warning badge', () => {
      render(<Badge variant="warning" size="md" data-testid="badge">Medium Warning</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-yellow-500/15');
      expect(badge.className).toContain('h-6');
    });
  });
});
