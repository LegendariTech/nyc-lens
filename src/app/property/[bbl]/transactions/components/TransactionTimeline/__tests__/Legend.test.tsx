import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Legend } from '../Legend';
import { describe, it, expect, vi } from 'vitest';
import type { DocumentCategory } from '../types';

describe('Legend', () => {
  const mockOnToggleCategory = vi.fn();

  const defaultFilters = [
    { category: 'deed' as DocumentCategory, isVisible: true, count: 5 },
    { category: 'mortgage' as DocumentCategory, isVisible: true, count: 3 },
    { category: 'ucc-lien' as DocumentCategory, isVisible: false, count: 2 },
    { category: 'other' as DocumentCategory, isVisible: false, count: 1 },
  ];

  beforeEach(() => {
    mockOnToggleCategory.mockClear();
  });

  it('renders all category buttons with counts', () => {
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    // Check desktop version (hidden xl:flex)
    const desktopButtons = screen.getAllByRole('button', { name: /deeds/i });
    expect(desktopButtons.length).toBeGreaterThan(0);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onToggleCategory with deed when deed button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const deedButtons = screen.getAllByRole('button', { name: /deeds/i });
    await user.click(deedButtons[0]);

    expect(mockOnToggleCategory).toHaveBeenCalledWith('deed');
  });

  it('calls onToggleCategory with mortgage when mortgage button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const mortgageButtons = screen.getAllByRole('button', { name: /mortgages/i });
    await user.click(mortgageButtons[0]);

    expect(mockOnToggleCategory).toHaveBeenCalledWith('mortgage');
  });

  it('calls onToggleCategory with ucc-lien when UCC button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const uccButtons = screen.getAllByRole('button', { name: /ucc.*liens/i });
    await user.click(uccButtons[0]);

    expect(mockOnToggleCategory).toHaveBeenCalledWith('ucc-lien');
  });

  it('calls onToggleCategory with other when other button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const otherButtons = screen.getAllByRole('button', { name: /other documents/i });
    await user.click(otherButtons[0]);

    expect(mockOnToggleCategory).toHaveBeenCalledWith('other');
  });

  it('shows active state for visible categories', () => {
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const deedButtons = screen.getAllByRole('button', { name: /deeds/i });
    const mortgageButtons = screen.getAllByRole('button', { name: /mortgages/i });

    expect(deedButtons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(mortgageButtons[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows inactive state for hidden categories', () => {
    render(<Legend filters={defaultFilters} onToggleCategory={mockOnToggleCategory} />);

    const uccButtons = screen.getAllByRole('button', { name: /show ucc.*liens/i });
    const otherButtons = screen.getAllByRole('button', { name: /show other documents/i });

    expect(uccButtons[0]).toHaveAttribute('aria-pressed', 'false');
    expect(otherButtons[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('displays correct counts for zero transactions', () => {
    const zeroFilters = defaultFilters.map(f => ({ ...f, count: 0 }));
    render(<Legend filters={zeroFilters} onToggleCategory={mockOnToggleCategory} />);

    // There are both desktop and mobile versions of each button, so we get 8 elements
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(8);
  });
});

