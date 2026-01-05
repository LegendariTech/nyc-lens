import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../Alert';
import { createRef } from 'react';

describe('Alert', () => {
  describe('Basic Rendering', () => {
    it('renders alert with message', () => {
      render(<Alert>Test message</Alert>);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders with role="alert"', () => {
      render(<Alert data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('role', 'alert');
    });

    it('renders as div element', () => {
      render(<Alert data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.tagName).toBe('DIV');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Alert variant="default" data-testid="alert">Default</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('bg-foreground/5');
      expect(alert.className).toContain('border-foreground/20');
    });

    it('renders success variant', () => {
      render(<Alert variant="success" data-testid="alert">Success</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('bg-green-500/10');
      expect(alert.className).toContain('border-green-500/20');
    });

    it('renders warning variant', () => {
      render(<Alert variant="warning" data-testid="alert">Warning</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('bg-yellow-500/10');
      expect(alert.className).toContain('border-yellow-500/20');
    });

    it('renders error variant', () => {
      render(<Alert variant="error" data-testid="alert">Error</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('bg-destructive/10');
      expect(alert.className).toContain('border-destructive/20');
    });

    it('renders info variant', () => {
      render(<Alert variant="info" data-testid="alert">Info</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('bg-accent/10');
      expect(alert.className).toContain('border-accent/20');
    });
  });

  describe('Icons', () => {
    it('renders default icon for default variant', () => {
      const { container } = render(<Alert variant="default">Message</Alert>);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders default icon for success variant', () => {
      const { container } = render(<Alert variant="success">Message</Alert>);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom icon', () => {
      render(
        <Alert icon={<span data-testid="custom-icon">🔔</span>}>
          Message
        </Alert>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders without icon when icon={null}', () => {
      const { container } = render(<Alert icon={null}>Message</Alert>);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Title', () => {
    it('renders with title', () => {
      render(<Alert title="Alert Title">Message content</Alert>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Message content')).toBeInTheDocument();
    });

    it('renders title with proper styling', () => {
      render(<Alert title="Title">Content</Alert>);
      const title = screen.getByText('Title');
      expect(title.className).toContain('font-semibold');
      expect(title.className).toContain('text-sm');
    });

    it('renders without title', () => {
      render(<Alert>Message only</Alert>);
      expect(screen.getByText('Message only')).toBeInTheDocument();
    });
  });

  describe('Dismissible', () => {
    it('does not render dismiss button by default', () => {
      render(<Alert>Message</Alert>);
      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });

    it('renders dismiss button when dismissible=true', () => {
      render(<Alert dismissible>Message</Alert>);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('hides alert when dismissed', async () => {
      const user = userEvent.setup();
      render(<Alert dismissible data-testid="alert">Message</Alert>);

      const dismissButton = screen.getByLabelText('Dismiss alert');
      await user.click(dismissButton);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('calls onDismiss callback when dismissed', async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={handleDismiss}>
          Message
        </Alert>
      );

      const dismissButton = screen.getByLabelText('Dismiss alert');
      await user.click(dismissButton);

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Message</Alert>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('can access ref properties', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Alert ref={ref} data-testid="alert">Message</Alert>);
      expect(ref.current?.getAttribute('role')).toBe('alert');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Alert className="custom-class" data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('custom-class');
    });

    it('merges custom className with base classes', () => {
      render(<Alert className="mt-4" data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('mt-4');
      expect(alert.className).toContain('flex');
    });

    it('accepts arbitrary HTML attributes', () => {
      render(
        <Alert
          data-testid="alert"
          aria-label="Custom alert"
          id="test-alert"
        >
          Message
        </Alert>
      );
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('aria-label', 'Custom alert');
      expect(alert).toHaveAttribute('id', 'test-alert');
    });
  });

  describe('Content', () => {
    it('renders text content', () => {
      render(<Alert>Simple text message</Alert>);
      expect(screen.getByText('Simple text message')).toBeInTheDocument();
    });

    it('renders JSX content', () => {
      render(
        <Alert>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </Alert>
      );
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('renders with links', () => {
      render(
        <Alert>
          Message with <a href="/test">link</a>
        </Alert>
      );
      const link = screen.getByText('link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });
  });

  describe('Styling', () => {
    it('applies base styling classes', () => {
      render(<Alert data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('flex');
      expect(alert.className).toContain('rounded-lg');
      expect(alert.className).toContain('border');
      expect(alert.className).toContain('p-4');
    });

    it('applies transition classes', () => {
      render(<Alert data-testid="alert">Message</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.className).toContain('transition-all');
    });
  });

  describe('Complete Examples', () => {
    it('renders success alert with title and dismiss button', () => {
      render(
        <Alert variant="success" title="Success!" dismissible>
          Your changes have been saved.
        </Alert>
      );
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('renders error alert with custom icon', () => {
      render(
        <Alert
          variant="error"
          title="Error"
          icon={<span data-testid="error-icon">⚠️</span>}
        >
          Something went wrong.
        </Alert>
      );
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('renders info alert without icon', () => {
      render(
        <Alert variant="info" icon={null}>
          This is an informational message.
        </Alert>
      );
      expect(screen.getByText('This is an informational message.')).toBeInTheDocument();
      const { container } = render(<Alert variant="info" icon={null}>Message</Alert>);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });
});
