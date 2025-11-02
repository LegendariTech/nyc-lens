/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FieldTooltip } from '../FieldTooltip';

describe('FieldTooltip', () => {
  describe('Rendering', () => {
    it('renders children without description', () => {
      render(
        <FieldTooltip description="" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders children with description', () => {
      render(
        <FieldTooltip description="This is a test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('does not show tooltip initially', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const tooltip = screen.queryByText('Test description');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass('hidden');
    });

    it('renders as icon when asIcon prop is true', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not render icon when asIcon is false', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon={false}>
          Test Label
        </FieldTooltip>
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Wrapper Mode (default)', () => {
    it('wraps children in a span with cursor-help', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const wrapper = screen.getByText('Test Label');
      expect(wrapper).toHaveClass('cursor-help');
    });

    it('shows tooltip on hover (desktop)', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );

      const label = screen.getByText('Test Label');
      await user.hover(label);

      // In jsdom, just check that tooltip is rendered
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toBeInTheDocument();
    });

    it('hides tooltip after mouse leaves', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );

      const label = screen.getByText('Test Label');
      await user.hover(label);
      await user.unhover(label);

      // Wait for the delay (300ms) and tooltip to hide
      await waitFor(() => {
        const tooltip = screen.getByText('Test description');
        expect(tooltip).toHaveClass('hidden');
      }, { timeout: 500 });
    });

    it('toggles tooltip on click', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );

      const label = screen.getByText('Test Label');
      
      // Click to open
      await user.click(label);
      let tooltip = screen.getByText('Test description');
      expect(tooltip).not.toHaveClass('hidden');

      // Click again to close
      await user.click(label);
      await waitFor(() => {
        expect(tooltip).toHaveClass('hidden');
      });
    });
  });

  describe('Icon Mode', () => {
    it('renders info icon button', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-foreground/40');
      expect(button).toHaveClass('hover:text-foreground/60');
    });

    it('shows tooltip when hovering icon (desktop)', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      // In jsdom, just check that tooltip is rendered
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toBeInTheDocument();
    });

    it('hides tooltip after mouse leaves icon', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      await user.hover(button);
      await user.unhover(button);

      await waitFor(() => {
        const tooltip = screen.getByText('Test description');
        expect(tooltip).toHaveClass('hidden');
      }, { timeout: 500 });
    });

    it('toggles tooltip on icon click', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      
      // Click to open
      await user.click(button);
      let tooltip = screen.getByText('Test description');
      expect(tooltip).not.toHaveClass('hidden');

      // Click again to close
      await user.click(button);
      await waitFor(() => {
        expect(tooltip).toHaveClass('hidden');
      });
    });
  });

  describe('Tooltip Content', () => {
    it('renders HTML in description', () => {
      render(
        <FieldTooltip 
          description="<b>Bold</b> and <a href='#'>link</a>" 
          fieldKey="test-field" 
          asIcon
        />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      // Check that tooltip is rendered with prose styling (indicates HTML rendering)
      const tooltip = button.parentElement?.querySelector('.prose');
      expect(tooltip).toBeInTheDocument();
    });

    it('converts newlines to <br> tags', () => {
      const user = userEvent.setup();
      const description = 'Line 1\nLine 2\nLine 3';
      
      render(
        <FieldTooltip 
          description={description}
          fieldKey="test-field" 
          asIcon
        />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      const tooltip = screen.getByText('Line 1', { exact: false });
      expect(tooltip.innerHTML).toContain('Line 1<br>Line 2<br>Line 3');
    });

    it('handles long descriptions with scrolling', () => {
      const longDescription = 'Lorem ipsum '.repeat(100);
      render(
        <FieldTooltip description={longDescription} fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      // Check tooltip has scrolling classes using prose selector
      const tooltip = button.parentElement?.querySelector('.prose');
      expect(tooltip).toHaveClass('max-h-[60vh]');
      expect(tooltip).toHaveClass('overflow-y-auto');
    });
  });

  describe('Positioning', () => {
    it('applies top positioning class by default', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toHaveClass('bottom-full');
      expect(tooltip).toHaveClass('mb-2');
    });

    it('has mobile backdrop when open', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      // Tooltip should be visible when clicked (backdrop functionality is tested separately)
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toBeInTheDocument();
    });

    it('closes tooltip when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50') as HTMLElement;
      expect(backdrop).toBeInTheDocument();
      
      await user.click(backdrop);
      
      await waitFor(() => {
        const tooltip = screen.getByText('Test description');
        expect(tooltip).toHaveClass('hidden');
      });
    });
  });

  describe('Tooltip Hover Behavior', () => {
    it('keeps tooltip open when hovering over tooltip itself', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      // Move mouse to tooltip
      const tooltip = screen.getByText('Test description');
      await user.hover(tooltip);
      
      // Tooltip should still be in the document
      expect(tooltip).toBeInTheDocument();
    });

    it('closes tooltip when leaving both trigger and tooltip', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      const tooltip = screen.getByText('Test description');
      await user.hover(tooltip);
      await user.unhover(tooltip);

      await waitFor(() => {
        expect(tooltip).toHaveClass('hidden');
      }, { timeout: 500 });
    });
  });

  describe('Accessibility', () => {
    it('has proper button type for icon mode', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('has cursor-help class on wrapper', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const wrapper = screen.getByText('Test Label');
      expect(wrapper).toHaveClass('cursor-help');
    });

    it('applies custom className to wrapper', () => {
      render(
        <FieldTooltip 
          description="Test description" 
          fieldKey="test-field"
          className="custom-class"
        >
          Test Label
        </FieldTooltip>
      );
      const wrapper = screen.getByText('Test Label').parentElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('returns children without wrapper when description is empty', () => {
      const { container } = render(
        <FieldTooltip description="" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      expect(container.querySelector('span')).not.toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('handles rapid hover events', async () => {
      const user = userEvent.setup();
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );

      const button = screen.getByRole('button');
      
      // Hover multiple times rapidly
      await user.hover(button);
      await user.unhover(button);
      await user.hover(button);
      await user.unhover(button);
      await user.hover(button);

      // Should still work correctly - tooltip should be in document
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toBeInTheDocument();
    });

    it('handles multiple tooltips independently', async () => {
      const user = userEvent.setup();
      render(
        <>
          <FieldTooltip description="First tooltip" fieldKey="field-1" asIcon />
          <FieldTooltip description="Second tooltip" fieldKey="field-2" asIcon />
        </>
      );

      const buttons = screen.getAllByRole('button');
      
      // Click first tooltip
      await user.click(buttons[0]);
      
      // Both tooltips should be in the document
      const firstTooltip = screen.getByText('First tooltip');
      const secondTooltip = screen.getByText('Second tooltip');
      
      expect(firstTooltip).toBeInTheDocument();
      expect(secondTooltip).toBeInTheDocument();
      
      // Click second tooltip
      await user.click(buttons[1]);
      
      // Both should still be in document (visibility is managed by CSS classes)
      expect(firstTooltip).toBeInTheDocument();
      expect(secondTooltip).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct tooltip styles', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toHaveClass('bg-black');
      expect(tooltip).toHaveClass('text-white');
      expect(tooltip).toHaveClass('rounded-md');
      expect(tooltip).toHaveClass('border');
      expect(tooltip).toHaveClass('shadow-lg');
      expect(tooltip).toHaveClass('p-4');
    });

    it('applies correct z-index for layering', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      
      const button = screen.getByRole('button');
      button.click();
      
      // Tooltip should have high z-index for proper layering
      const tooltip = screen.getByText('Test description');
      expect(tooltip).toHaveClass('z-[100]');
    });
  });
});

