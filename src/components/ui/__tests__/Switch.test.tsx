/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders switch component', () => {
      render(<Switch aria-label="Toggle setting" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders with default size (md)', () => {
      render(<Switch aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-6');
      expect(switchElement).toHaveClass('w-11');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Switch ref={ref} aria-label="Toggle" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Sizes', () => {
    it('renders sm size', () => {
      render(<Switch size="sm" aria-label="Small toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-5');
      expect(switchElement).toHaveClass('w-9');
    });

    it('renders md size (default)', () => {
      render(<Switch size="md" aria-label="Medium toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-6');
      expect(switchElement).toHaveClass('w-11');
    });

    it('renders lg size', () => {
      render(<Switch size="lg" aria-label="Large toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-7');
      expect(switchElement).toHaveClass('w-14');
    });
  });

  describe('States', () => {
    it('is unchecked by default', () => {
      render(<Switch aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('can be checked initially', () => {
      render(<Switch defaultChecked aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('can be controlled with checked prop', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={() => { }} aria-label="Toggle" />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} onCheckedChange={() => { }} aria-label="Toggle" />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('applies checked styles', () => {
      render(<Switch defaultChecked aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('data-[state=checked]:bg-primary');
    });

    it('applies unchecked styles', () => {
      render(<Switch aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-foreground/30');
    });
  });

  describe('Disabled State', () => {
    it('can be disabled', () => {
      render(<Switch disabled aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Switch disabled aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed');
      expect(switchElement).toHaveClass('disabled:opacity-50');
    });

    it('does not toggle when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch disabled onCheckedChange={handleChange} aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('toggles on click', async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('calls onCheckedChange when toggled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('supports keyboard interaction (Space)', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('supports keyboard interaction (Enter)', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('can be focused', async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      await user.tab();

      expect(switchElement).toHaveFocus();
    });
  });

  describe('Controlled Component', () => {
    it('works as controlled component', async () => {
      const ControlledSwitch = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <div>
            <Switch checked={checked} onCheckedChange={setChecked} aria-label="Toggle" />
            <span data-testid="status">{checked ? 'On' : 'Off'}</span>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<ControlledSwitch />);

      expect(screen.getByTestId('status')).toHaveTextContent('Off');

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(screen.getByTestId('status')).toHaveTextContent('On');
    });

    it('respects external state changes', () => {
      const { rerender } = render(
        <Switch checked={false} onCheckedChange={() => { }} aria-label="Toggle" />
      );

      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true} onCheckedChange={() => { }} aria-label="Toggle" />);

      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Switch className="custom-class" aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('custom-class');
    });

    it('accepts aria-label', () => {
      render(<Switch aria-label="Enable notifications" />);
      expect(screen.getByRole('switch', { name: /enable notifications/i })).toBeInTheDocument();
    });

    it('accepts aria-labelledby', () => {
      render(
        <div>
          <label id="switch-label">Dark Mode</label>
          <Switch aria-labelledby="switch-label" />
        </div>
      );
      expect(screen.getByRole('switch', { name: /dark mode/i })).toBeInTheDocument();
    });

    it('accepts data attributes', () => {
      render(<Switch data-testid="custom-switch" aria-label="Toggle" />);
      expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
    });

    it('accepts id prop', () => {
      render(<Switch id="my-switch" aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('id', 'my-switch');
    });
  });

  describe('Accessibility', () => {
    it('has proper switch role', () => {
      render(<Switch aria-label="Toggle" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked attribute', () => {
      render(<Switch defaultChecked aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('updates aria-checked when toggled', async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('has focus-visible styles', () => {
      render(<Switch aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('focus-visible:outline-none');
      expect(switchElement).toHaveClass('focus-visible:ring-2');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" />);

      await user.tab();
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveFocus();
    });

    it('requires accessible name', () => {
      // This test verifies that the component works with aria-label
      render(<Switch aria-label="Accessible switch" />);
      expect(screen.getByRole('switch', { name: /accessible switch/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid toggles', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle" />);

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('combines size and custom className', () => {
      render(<Switch size="lg" className="custom-class" aria-label="Toggle" />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('h-7'); // lg size
      expect(switchElement).toHaveClass('custom-class');
    });
  });
});

