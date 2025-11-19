import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../Collapsible';
import { createRef } from 'react';

describe('Collapsible', () => {
  describe('Basic Rendering', () => {
    it('renders collapsible with trigger and content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('renders trigger as button element', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('renders content', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Open/Close Functionality', () => {
    it('is closed by default', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      // Content should not be expanded when closed
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('can be opened by default with defaultOpen', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByText('Content')).toBeVisible();
    });

    it('toggles open/close when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Content')).toBeVisible();
      });

      // Click to close
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('calls onOpenChange when toggled', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByText('Toggle');
      await user.click(trigger);

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Controlled Mode', () => {
    it('can be controlled with open prop', () => {
      const { rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content')).toBeVisible();
    });
  });

  describe('Chevron Icon', () => {
    it('renders chevron icon in trigger', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const chevron = container.querySelector('svg');
      expect(chevron).toBeInTheDocument();
    });

    it('rotates chevron when open', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      const chevron = container.querySelector('svg');

      // Chevron rotation is controlled by data-state attribute on the parent group
      expect(chevron?.className).toContain('transition-transform');
      expect(chevron?.className).toContain('group-data-[state=open]:rotate-180');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });
  });

  describe('Styling', () => {
    it('applies base trigger classes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.className).toContain('flex');
      expect(trigger.className).toContain('w-full');
      expect(trigger.className).toContain('cursor-pointer');
    });

    it('applies base content classes', () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );
      const content = container.querySelector('[data-testid="content"]');
      expect(content?.className).toContain('overflow-hidden');
      expect(content?.className).toContain('transition-all');
    });

    it('applies animation classes', () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );
      const content = container.querySelector('[data-testid="content"]');
      expect(content?.className).toContain('data-[state=open]:animate-collapsible-down');
      expect(content?.className).toContain('data-[state=closed]:animate-collapsible-up');
    });

    it('applies hover styles to trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.className).toContain('hover:bg-foreground/5');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className on trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger" data-testid="trigger">
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.className).toContain('custom-trigger');
    });

    it('accepts custom className on content', () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content" data-testid="content">
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );
      const content = container.querySelector('[data-testid="content"]');
      expect(content?.className).toContain('custom-content');
    });

    it('accepts arbitrary props on trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger" aria-label="Toggle content">
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-label', 'Toggle content');
    });
  });

  describe('Disabled State', () => {
    it('can be disabled', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeDisabled();
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Should remain closed (aria-expanded stays false)
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('applies disabled styling', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.className).toContain('disabled:opacity-50');
      expect(trigger.className).toContain('disabled:pointer-events-none');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref on trigger', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Collapsible>
          <CollapsibleTrigger ref={ref}>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref on content', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent ref={ref}>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded');
    });

    it('updates aria-expanded when toggled', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('can be navigated with keyboard', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByText('Toggle');

      // Tab to focus
      await user.tab();
      expect(trigger).toHaveFocus();

      // Press Enter to toggle
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeVisible();
      });
    });
  });

  describe('Complex Content', () => {
    it('renders nested components', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>
              <h3>Heading</h3>
              <p>Paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders JSX in trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>
            <span>Toggle</span>
            <span data-testid="badge">New</span>
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByText('Toggle')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toBeInTheDocument();
    });
  });
});
