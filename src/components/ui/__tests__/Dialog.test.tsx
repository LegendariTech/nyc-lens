import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../Dialog';
import { Button } from '../Button';

describe('Dialog', () => {
  it('renders trigger and opens dialog when clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open Dialog');
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when DialogClose is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button>Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    });
  });

  it('renders with description', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });
  });

  it('renders with footer', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  it('can be controlled with open prop', async () => {
    const { rerender } = render(
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();

    rerender(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await waitFor(() => {
      expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange callback', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('hides close button when showClose is false', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent showClose={false}>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('applies custom className to DialogContent', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent className="custom-class" data-testid="dialog-content">
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const content = screen.getByTestId('dialog-content');
      expect(content).toHaveClass('custom-class');
    });
  });

  it('applies custom className to DialogHeader', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="custom-header" data-testid="dialog-header">
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const header = screen.getByTestId('dialog-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  it('applies custom className to DialogFooter', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter className="custom-footer" data-testid="dialog-footer">
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const footer = screen.getByTestId('dialog-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  it('applies custom className to DialogTitle', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="custom-title">Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const title = screen.getByText('Test Dialog');
      expect(title).toHaveClass('custom-title');
    });
  });

  it('applies custom className to DialogDescription', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription className="custom-description">Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open Dialog'));

    await waitFor(() => {
      const description = screen.getByText('Description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('size variants', () => {
    it('applies small size correctly', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent size="sm" data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Small Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const content = screen.getByTestId('dialog-content');
        expect(content).toHaveClass('max-w-sm');
      });
    });

    it('applies medium size correctly (default)', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Medium Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const content = screen.getByTestId('dialog-content');
        expect(content).toHaveClass('max-w-md');
      });
    });

    it('applies large size correctly', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent size="lg" data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Large Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const content = screen.getByTestId('dialog-content');
        expect(content).toHaveClass('max-w-lg');
      });
    });

    it('applies extra-large size correctly', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent size="xl" data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Extra Large Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const content = screen.getByTestId('dialog-content');
        expect(content).toHaveClass('max-w-xl');
      });
    });

    it('applies full size correctly', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent size="full" data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Full Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const content = screen.getByTestId('dialog-content');
        expect(content).toHaveClass('max-w-full');
      });
    });
  });

  describe('composition', () => {
    it('composes all dialog components together', async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();

      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Dialog</DialogTitle>
              <DialogDescription>This is a complete dialog example</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Dialog content goes here</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAction}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByText('Complete Dialog')).toBeInTheDocument();
        expect(screen.getByText('This is a complete dialog example')).toBeInTheDocument();
        expect(screen.getByText('Dialog content goes here')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);

      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should not have accessibility violations', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessible Dialog</DialogTitle>
              <DialogDescription>This is an accessible dialog</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <button>Close</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByText('Accessible Dialog')).toBeInTheDocument();
      });

      // Test the dialog portal content separately to avoid aria-hidden-focus violations on the trigger
      const dialog = screen.getByRole('dialog');
      const results = await axe(dialog);
      expect(results.violations).toEqual([]);
    });

    it('has proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ARIA Dialog</DialogTitle>
              <DialogDescription>Dialog with ARIA attributes</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText('ARIA Dialog')).toBeInTheDocument();
      });
    });

    it('traps focus within dialog', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Focus Trap Dialog</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <button>First Button</button>
              <button>Second Button</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Focus Trap Dialog')).toBeInTheDocument();
      });

      // Tab through elements
      await user.tab();
      await user.tab();
      await user.tab();

      // Focus should remain within the dialog
      const focusedElement = document.activeElement;
      const dialog = screen.getByRole('dialog');
      expect(dialog.contains(focusedElement)).toBe(true);
    });

    it('returns focus to trigger when closed', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Focus Return Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText('Open Dialog');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Focus Return Dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Focus Return Dialog')).not.toBeInTheDocument();
      });

      // Focus should return to trigger
      expect(document.activeElement).toBe(trigger);
    });
  });
});

