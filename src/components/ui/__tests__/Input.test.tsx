import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';
import { createRef } from 'react';

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('renders input element', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('accepts and displays value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('renders with default type="text"', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('accepts custom type prop', () => {
      render(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Input variant="default" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-foreground/20');
    });

    it('renders error variant', () => {
      render(<Input variant="error" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-destructive');
    });
  });

  describe('Sizes', () => {
    it('renders xs size', () => {
      render(<Input size="xs" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('h-6');
      expect(input.className).toContain('text-xs');
    });

    it('renders sm size', () => {
      render(<Input size="sm" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('h-8');
      expect(input.className).toContain('text-sm');
    });

    it('renders md size (default)', () => {
      render(<Input size="md" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('h-10');
      expect(input.className).toContain('text-base');
    });

    it('renders lg size', () => {
      render(<Input size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('h-12');
      expect(input.className).toContain('text-lg');
    });
  });

  describe('Icons', () => {
    it('renders with start icon', () => {
      render(
        <Input
          startIcon={<span data-testid="start-icon">🔍</span>}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      const input = screen.getByTestId('input');
      expect(input.className).toMatch(/pl-\d+/);
    });

    it('renders with end icon', () => {
      render(
        <Input
          endIcon={<span data-testid="end-icon">✕</span>}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      const input = screen.getByTestId('input');
      expect(input.className).toMatch(/pr-\d+/);
    });

    it('renders with both start and end icons', () => {
      render(
        <Input
          startIcon={<span data-testid="start-icon">🔍</span>}
          endIcon={<span data-testid="end-icon">✕</span>}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('adjusts padding when icons are present', () => {
      const { rerender } = render(<Input size="md" data-testid="input" />);
      const inputWithoutIcon = screen.getByTestId('input');
      expect(inputWithoutIcon.className).toContain('pl-4');

      rerender(<Input size="md" startIcon="🔍" data-testid="input" />);
      const inputWithIcon = screen.getByTestId('input');
      expect(inputWithIcon.className).toContain('pl-10');
    });
  });

  describe('State', () => {
    it('renders disabled state', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input.className).toContain('disabled:opacity-50');
    });

    it('applies focus styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus:ring-2');
      expect(input.className).toContain('focus:ring-primary');
    });
  });

  describe('User Interactions', () => {
    it('handles onChange event', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('can focus input via ref', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} data-testid="input" />);

      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Input className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('custom-class');
    });

    it('accepts arbitrary HTML attributes', () => {
      render(
        <Input
          data-testid="input"
          aria-label="Custom label"
          maxLength={10}
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('accepts name attribute', () => {
      render(<Input name="username" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('name', 'username');
    });

    it('accepts required attribute', () => {
      render(<Input required data-testid="input" />);
      expect(screen.getByTestId('input')).toBeRequired();
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Search" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-label', 'Search');
    });

    it('supports aria-describedby', () => {
      render(<Input aria-describedby="helper-text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('supports aria-invalid for error state', () => {
      render(<Input variant="error" aria-invalid data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid');
    });
  });
});
