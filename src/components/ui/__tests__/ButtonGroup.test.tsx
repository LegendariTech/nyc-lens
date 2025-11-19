import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonGroup } from '../ButtonGroup';

describe('ButtonGroup', () => {
  const mockItems = [
    {
      label: 'Option 1',
      onClick: vi.fn(),
    },
    {
      label: 'Option 2',
      subtitle: 'With subtitle',
      onClick: vi.fn(),
    },
    {
      label: 'Option 3',
      onClick: vi.fn(),
    },
  ];

  beforeEach(() => {
    mockItems.forEach(item => item.onClick.mockClear());
  });

  describe('Basic Rendering', () => {
    it('renders main button with label', () => {
      render(<ButtonGroup label="Actions" items={mockItems} />);
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('renders as two buttons', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });

    it('renders dropdown arrow button', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);
      const arrows = container.querySelectorAll('svg path[d*="M19 9l-7 7-7-7"]');
      expect(arrows.length).toBeGreaterThan(0);
    });

    it('does not show dropdown menu initially', () => {
      render(<ButtonGroup label="Actions" items={mockItems} />);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown Interaction', () => {
    it('shows dropdown menu when main button is clicked', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('shows dropdown menu when arrow button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);

      const buttons = container.querySelectorAll('button');
      const arrowButton = buttons[1];
      await user.click(arrowButton);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('toggles dropdown menu on subsequent clicks', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} />);

      const mainButton = screen.getByText('Actions');

      // Open
      await user.click(mainButton);
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      // Close
      await user.click(mainButton);
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <ButtonGroup label="Actions" items={mockItems} />
          <div data-testid="outside">Outside element</div>
        </div>
      );

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      const outside = screen.getByTestId('outside');
      await user.click(outside);

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });

    it('calls onClick handler when menu item is clicked', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      const option1 = screen.getByText('Option 1');
      await user.click(option1);

      expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('closes dropdown after item is clicked', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      const option1 = screen.getByText('Option 1');
      await user.click(option1);

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Menu Items', () => {
    it('renders items with subtitles', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.getByText('With subtitle')).toBeInTheDocument();
    });

    it('renders items with icons', async () => {
      const user = userEvent.setup();
      const itemsWithIcons = [
        {
          label: 'Edit',
          icon: <span data-testid="edit-icon">✏️</span>,
          onClick: vi.fn(),
        },
        {
          label: 'Delete',
          icon: <span data-testid="delete-icon">🗑️</span>,
          onClick: vi.fn(),
        },
      ];

      render(<ButtonGroup label="Actions" items={itemsWithIcons} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('renders items with endIcons', async () => {
      const user = userEvent.setup();
      const itemsWithEndIcons = [
        {
          label: 'Premium',
          endIcon: <span data-testid="premium-badge">⭐</span>,
          onClick: vi.fn(),
        },
      ];

      render(<ButtonGroup label="Actions" items={itemsWithEndIcons} />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.getByTestId('premium-badge')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} variant="default" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('bg-foreground/10');
    });

    it('renders primary variant', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} variant="primary" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('bg-primary');
    });

    it('renders secondary variant', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} variant="secondary" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('border-border');
    });

    it('renders ghost variant', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} variant="ghost" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('bg-transparent');
    });

    it('renders outline variant', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} variant="outline" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('border-border');
    });
  });

  describe('Sizes', () => {
    it('renders xs size', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} size="xs" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('h-6');
      expect(mainButton.className).toContain('text-xs');
    });

    it('renders sm size', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} size="sm" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('h-8');
      expect(mainButton.className).toContain('text-sm');
    });

    it('renders md size (default)', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} size="md" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('h-10');
      expect(mainButton.className).toContain('text-base');
    });

    it('renders lg size', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} size="lg" />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('h-12');
      expect(mainButton.className).toContain('text-lg');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading=true', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} isLoading />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('disables buttons when isLoading=true', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} isLoading />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('does not show dropdown when loading', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} isLoading />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables buttons when disabled=true', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} disabled />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('does not show dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<ButtonGroup label="Actions" items={mockItems} disabled />);

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('renders main button with icon', () => {
      render(
        <ButtonGroup
          label="Actions"
          icon={<span data-testid="main-icon">📋</span>}
          items={mockItems}
        />
      );
      expect(screen.getByTestId('main-icon')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <ButtonGroup label="Actions" items={mockItems} className="custom-class" />
      );
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('custom-class');
    });
  });

  describe('Dropdown Arrow Animation', () => {
    it('rotates arrow when dropdown is open', async () => {
      const user = userEvent.setup();
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);

      const arrow = container.querySelector('svg.transition-transform');
      expect(arrow?.className).not.toContain('rotate-180');

      const mainButton = screen.getByText('Actions');
      await user.click(mainButton);

      expect(arrow?.className).toContain('rotate-180');
    });
  });

  describe('Styling', () => {
    it('applies rounded-r-none to main button', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);
      const mainButton = container.querySelectorAll('button')[0];
      expect(mainButton.className).toContain('rounded-r-none');
    });

    it('applies rounded-l-none to arrow button', () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);
      const arrowButton = container.querySelectorAll('button')[1];
      expect(arrowButton.className).toContain('rounded-l-none');
    });
  });
});
