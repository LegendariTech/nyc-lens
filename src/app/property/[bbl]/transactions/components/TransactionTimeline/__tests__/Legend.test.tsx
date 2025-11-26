import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Legend } from '../Legend';
import { describe, it, expect, vi } from 'vitest';

describe('Legend', () => {
  const defaultProps = {
    showDeeds: true,
    showMortgages: true,
    onToggleDeeds: vi.fn(),
    onToggleMortgages: vi.fn(),
    deedCount: 5,
    mortgageCount: 3,
  };

  it('renders deed and mortgage buttons with counts', () => {
    render(<Legend {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /deeds/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mortgages/i })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onToggleDeeds when deed button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend {...defaultProps} />);
    
    const deedButton = screen.getByRole('button', { name: /deeds/i });
    await user.click(deedButton);
    
    expect(defaultProps.onToggleDeeds).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleMortgages when mortgage button is clicked', async () => {
    const user = userEvent.setup();
    render(<Legend {...defaultProps} />);
    
    const mortgageButton = screen.getByRole('button', { name: /mortgages/i });
    await user.click(mortgageButton);
    
    expect(defaultProps.onToggleMortgages).toHaveBeenCalledTimes(1);
  });

  it('shows active state when showDeeds is true', () => {
    render(<Legend {...defaultProps} showDeeds={true} />);
    
    const deedButton = screen.getByRole('button', { name: /deeds/i });
    expect(deedButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows inactive state when showDeeds is false', () => {
    render(<Legend {...defaultProps} showDeeds={false} />);
    
    const deedButton = screen.getByRole('button', { name: /show deeds/i });
    expect(deedButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows active state when showMortgages is true', () => {
    render(<Legend {...defaultProps} showMortgages={true} />);
    
    const mortgageButton = screen.getByRole('button', { name: /mortgages/i });
    expect(mortgageButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows inactive state when showMortgages is false', () => {
    render(<Legend {...defaultProps} showMortgages={false} />);
    
    const mortgageButton = screen.getByRole('button', { name: /show mortgages/i });
    expect(mortgageButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('displays correct counts for zero transactions', () => {
    render(<Legend {...defaultProps} deedCount={0} mortgageCount={0} />);
    
    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(2);
  });
});

