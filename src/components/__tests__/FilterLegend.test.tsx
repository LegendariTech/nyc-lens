/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterLegend, type CategoryFilter, type CategoryMetadata } from '../FilterLegend';

// Test category types
type TestCategory = 'category-a' | 'category-b' | 'category-c';

// Mock category metadata
const mockCategoryMetadata: Record<TestCategory, CategoryMetadata> = {
  'category-a': {
    pluralLabel: 'Category A Items',
    filterBorderActive: 'border-blue-500/50',
    filterBgActive: 'bg-blue-500/10',
    filterTextActive: 'text-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500',
  },
  'category-b': {
    pluralLabel: 'Category B Items',
    filterBorderActive: 'border-green-500/50',
    filterBgActive: 'bg-green-500/10',
    filterTextActive: 'text-green-600',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500',
  },
  'category-c': {
    pluralLabel: 'Category C Items',
    filterBorderActive: 'border-red-500/50',
    filterBgActive: 'bg-red-500/10',
    filterTextActive: 'text-red-600',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500',
  },
};

// Mock filters
const mockFilters: CategoryFilter<TestCategory>[] = [
  { category: 'category-a', isVisible: true, count: 5 },
  { category: 'category-b', isVisible: false, count: 10 },
  { category: 'category-c', isVisible: true, count: 0 },
];

describe('FilterLegend', () => {
  describe('Rendering', () => {
    it('renders all category buttons', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      // Component renders buttons twice (desktop + mobile), so use getAllByRole
      const categoryAButtons = screen.getAllByRole('button', { name: /category a items/i });
      const categoryBButtons = screen.getAllByRole('button', { name: /category b items/i });
      const categoryCButtons = screen.getAllByRole('button', { name: /category c items/i });

      expect(categoryAButtons.length).toBe(2); // desktop + mobile
      expect(categoryBButtons.length).toBe(2);
      expect(categoryCButtons.length).toBe(2);
    });

    it('displays correct counts for each category', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      // Counts appear twice (desktop + mobile)
      expect(screen.getAllByText('5')).toHaveLength(2);
      expect(screen.getAllByText('10')).toHaveLength(2);
      expect(screen.getAllByText('0')).toHaveLength(2);
    });

    it('renders without toggle when not provided', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('renders with toggle when provided', () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={true}
          onToggleZeroAmount={onToggleZero}
        />
      );

      // Renders twice (desktop + mobile)
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    it('renders with custom zero amount label', () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={true}
          onToggleZeroAmount={onToggleZero}
          zeroAmountLabel="Show empty records"
        />
      );

      // Label appears twice (desktop + mobile)
      expect(screen.getAllByText('Show empty records')).toHaveLength(2);
    });

    it('renders with default zero amount label', () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={true}
          onToggleZeroAmount={onToggleZero}
        />
      );

      // Label appears twice (desktop + mobile)
      expect(screen.getAllByText('Show empty items')).toHaveLength(2);
    });
  });

  describe('Category Button States', () => {
    it('applies active styles to visible categories', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      const categoryAButton = categoryAButtons[0]; // Test desktop version
      expect(categoryAButton).toHaveClass('bg-blue-500/10');
      expect(categoryAButton).toHaveClass('text-blue-600');
      expect(categoryAButton).toHaveClass('border-blue-500/50');
    });

    it('applies inactive styles to hidden categories', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryBButtons = screen.getAllByRole('button', { name: /show category b items/i });
      const categoryBButton = categoryBButtons[0]; // Test desktop version
      expect(categoryBButton).toHaveClass('border-foreground/20');
      expect(categoryBButton).toHaveClass('bg-foreground/5');
      expect(categoryBButton).toHaveClass('text-foreground/40');
    });

    it('has correct aria-pressed for visible categories', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      categoryAButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('has correct aria-pressed for hidden categories', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryBButtons = screen.getAllByRole('button', { name: /show category b items/i });
      categoryBButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('displays colored indicator dot for visible categories', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      const categoryAButton = categoryAButtons[0]; // Test desktop version
      const dot = categoryAButton.querySelector('.w-3.h-3.rounded-full');

      expect(dot).toHaveClass('border-blue-500');
      expect(dot).toHaveClass('bg-blue-500');
    });
  });

  describe('Interactions', () => {
    it('calls onToggleCategory when category button is clicked', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      await user.click(categoryAButtons[0]); // Click desktop version

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith('category-a');
    });

    it('calls onToggleCategory with correct category', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryBButtons = screen.getAllByRole('button', { name: /show category b items/i });
      await user.click(categoryBButtons[0]); // Click desktop version

      expect(onToggle).toHaveBeenCalledWith('category-b');
    });

    it('calls onToggleZeroAmount when checkbox is clicked', async () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={false}
          onToggleZeroAmount={onToggleZero}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Click desktop version

      expect(onToggleZero).toHaveBeenCalledTimes(1);
    });

    it('reflects showZeroAmount state in checkbox', () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();

      const { rerender } = render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={false}
          onToggleZeroAmount={onToggleZero}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const checkbox = checkboxes[0] as HTMLInputElement; // Test desktop version
      expect(checkbox.checked).toBe(false);

      rerender(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={true}
          onToggleZeroAmount={onToggleZero}
        />
      );

      expect(checkbox.checked).toBe(true);
    });

    it('supports keyboard interaction on category buttons', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      categoryAButtons[0].focus();
      await user.keyboard('{Enter}');

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith('category-a');
    });
  });

  describe('Accessibility', () => {
    it('has focus-visible styles on category buttons', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      const categoryAButton = categoryAButtons[0]; // Test desktop version
      expect(categoryAButton).toHaveClass('focus-visible:outline-none');
      expect(categoryAButton).toHaveClass('focus-visible:ring-2');
      expect(categoryAButton).toHaveClass('focus-visible:ring-blue-500');
    });

    it('is keyboard accessible', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      await user.tab();
      const firstButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      // Desktop button should get focus first
      expect(firstButtons[0]).toHaveFocus();
    });

    it('has proper aria-label that changes based on state', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      // Visible category should say "Hide" (rendered twice - desktop + mobile)
      expect(screen.getAllByRole('button', { name: /hide category a items/i })).toHaveLength(2);

      // Hidden category should say "Show" (rendered twice - desktop + mobile)
      expect(screen.getAllByRole('button', { name: /show category b items/i })).toHaveLength(2);
    });

    it('hides indicator dot from screen readers', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty filters array', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={[]}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders with single filter', () => {
      const onToggle = vi.fn();
      const singleFilter: CategoryFilter<TestCategory>[] = [
        { category: 'category-a', isVisible: true, count: 5 },
      ];

      render(
        <FilterLegend
          filters={singleFilter}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      // Single filter still renders twice (desktop + mobile)
      expect(screen.getAllByRole('button', { name: /category a items/i })).toHaveLength(2);
      expect(screen.queryByRole('button', { name: /category b items/i })).not.toBeInTheDocument();
    });

    it('handles categories with zero count', () => {
      const onToggle = vi.fn();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryCButtons = screen.getAllByRole('button', { name: /hide category c items/i });
      expect(categoryCButtons).toHaveLength(2); // desktop + mobile
      // Count '0' appears twice (desktop + mobile)
      expect(screen.getAllByText('0')).toHaveLength(2);
    });

    it('handles rapid category toggles', async () => {
      const onToggle = vi.fn();
      const user = userEvent.setup();
      render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const categoryAButtons = screen.getAllByRole('button', { name: /hide category a items/i });
      const categoryAButton = categoryAButtons[0]; // Test desktop version
      await user.click(categoryAButton);
      await user.click(categoryAButton);
      await user.click(categoryAButton);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });

    it('handles all categories hidden', () => {
      const onToggle = vi.fn();
      const allHiddenFilters: CategoryFilter<TestCategory>[] = [
        { category: 'category-a', isVisible: false, count: 5 },
        { category: 'category-b', isVisible: false, count: 10 },
        { category: 'category-c', isVisible: false, count: 0 },
      ];

      render(
        <FilterLegend
          filters={allHiddenFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('handles all categories visible', () => {
      const onToggle = vi.fn();
      const allVisibleFilters: CategoryFilter<TestCategory>[] = [
        { category: 'category-a', isVisible: true, count: 5 },
        { category: 'category-b', isVisible: true, count: 10 },
        { category: 'category-c', isVisible: true, count: 0 },
      ];

      render(
        <FilterLegend
          filters={allVisibleFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('renders separator when toggle is present', () => {
      const onToggle = vi.fn();
      const onToggleZero = vi.fn();
      const { container } = render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
          showZeroAmount={true}
          onToggleZeroAmount={onToggleZero}
        />
      );

      const separator = container.querySelector('.h-6.w-px.bg-foreground\\/20');
      expect(separator).toBeInTheDocument();
    });
  });

  describe('Responsive Layouts', () => {
    it('renders desktop layout with proper classes', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const desktopLayout = container.querySelector('.hidden.xl\\:flex');
      expect(desktopLayout).toBeInTheDocument();
    });

    it('renders mobile layout with proper classes', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <FilterLegend
          filters={mockFilters}
          categoryMetadata={mockCategoryMetadata}
          onToggleCategory={onToggle}
        />
      );

      const mobileLayout = container.querySelector('.xl\\:hidden');
      expect(mobileLayout).toBeInTheDocument();
    });
  });
});
