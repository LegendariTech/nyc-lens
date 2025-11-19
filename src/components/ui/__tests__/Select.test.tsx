import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';
import { createRef } from 'react';

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('renders select element with options', () => {
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('accepts and displays selected value', () => {
      render(
        <Select value="2" onChange={() => {}} data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );
      const select = screen.getByTestId('select') as HTMLSelectElement;
      expect(select.value).toBe('2');
    });

    it('renders with default first option selected', () => {
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );
      const select = screen.getByTestId('select') as HTMLSelectElement;
      expect(select.value).toBe('1');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <Select variant="default" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('border-foreground/20');
    });

    it('renders error variant', () => {
      render(
        <Select variant="error" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('border-destructive');
    });
  });

  describe('Sizes', () => {
    it('renders xs size', () => {
      render(
        <Select size="xs" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('h-6');
      expect(select.className).toContain('text-xs');
    });

    it('renders sm size', () => {
      render(
        <Select size="sm" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('h-8');
      expect(select.className).toContain('text-sm');
    });

    it('renders md size (default)', () => {
      render(
        <Select size="md" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('h-10');
      expect(select.className).toContain('text-base');
    });

    it('renders lg size', () => {
      render(
        <Select size="lg" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('h-12');
      expect(select.className).toContain('text-lg');
    });
  });

  describe('State', () => {
    it('renders disabled state', () => {
      render(
        <Select disabled data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select).toBeDisabled();
      expect(select.className).toContain('disabled:opacity-50');
    });

    it('applies focus styles', () => {
      render(
        <Select data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('focus:ring-2');
      expect(select.className).toContain('focus:ring-primary');
    });
  });

  describe('User Interactions', () => {
    it('handles onChange event', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Select onChange={handleChange} data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );

      const select = screen.getByTestId('select');
      await user.selectOptions(select, '2');

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(
        <Select onFocus={handleFocus} data-testid="select">
          <option>Test</option>
        </Select>
      );

      const select = screen.getByTestId('select');
      await user.click(select);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(
        <Select onBlur={handleBlur} data-testid="select">
          <option>Test</option>
        </Select>
      );

      const select = screen.getByTestId('select');
      await user.click(select);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('updates value when option is selected', async () => {
      const user = userEvent.setup();
      render(
        <Select data-testid="select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>
      );

      const select = screen.getByTestId('select') as HTMLSelectElement;
      expect(select.value).toBe('1');

      await user.selectOptions(select, '3');
      expect(select.value).toBe('3');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLSelectElement>();
      render(
        <Select ref={ref}>
          <option>Test</option>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it('can focus select via ref', () => {
      const ref = createRef<HTMLSelectElement>();
      render(
        <Select ref={ref} data-testid="select">
          <option>Test</option>
        </Select>
      );

      ref.current?.focus();
      expect(screen.getByTestId('select')).toHaveFocus();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(
        <Select className="custom-class" data-testid="select">
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select.className).toContain('custom-class');
    });

    it('accepts arbitrary HTML attributes', () => {
      render(
        <Select
          data-testid="select"
          aria-label="Custom label"
        >
          <option>Test</option>
        </Select>
      );
      const select = screen.getByTestId('select');
      expect(select).toHaveAttribute('aria-label', 'Custom label');
    });

    it('accepts name attribute', () => {
      render(
        <Select name="country" data-testid="select">
          <option>Test</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toHaveAttribute('name', 'country');
    });

    it('accepts required attribute', () => {
      render(
        <Select required data-testid="select">
          <option>Test</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toBeRequired();
    });

    it('accepts multiple attribute', () => {
      render(
        <Select multiple data-testid="select">
          <option>Test 1</option>
          <option>Test 2</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toHaveAttribute('multiple');
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <Select aria-label="Select option" data-testid="select">
          <option>Test</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toHaveAttribute('aria-label', 'Select option');
    });

    it('supports aria-describedby', () => {
      render(
        <Select aria-describedby="helper-text" data-testid="select">
          <option>Test</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('supports aria-invalid for error state', () => {
      render(
        <Select variant="error" aria-invalid data-testid="select">
          <option>Test</option>
        </Select>
      );
      expect(screen.getByTestId('select')).toHaveAttribute('aria-invalid');
    });

    it('renders with proper form association', () => {
      render(
        <form data-testid="form">
          <Select name="test-select" data-testid="select">
            <option>Test</option>
          </Select>
        </form>
      );
      const form = screen.getByTestId('form') as HTMLFormElement;
      const select = screen.getByTestId('select');
      expect(form.elements).toContain(select);
    });
  });

  describe('Option Groups', () => {
    it('renders optgroup elements', () => {
      const { container } = render(
        <Select data-testid="select">
          <optgroup label="Group 1">
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </optgroup>
          <optgroup label="Group 2">
            <option value="3">Option 3</option>
          </optgroup>
        </Select>
      );
      const optgroups = container.querySelectorAll('optgroup');
      expect(optgroups).toHaveLength(2);
      expect(optgroups[0]).toHaveAttribute('label', 'Group 1');
      expect(optgroups[1]).toHaveAttribute('label', 'Group 2');
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });
});
