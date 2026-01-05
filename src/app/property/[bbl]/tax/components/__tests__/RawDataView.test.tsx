/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RawDataView } from '../RawDataView';
import type { PropertyValuation } from '@/types/valuation';

// Mock the formatCurrency function
vi.mock('@/utils/formatters', () => ({
  formatCurrency: vi.fn((value: number) => `$${value.toLocaleString()}`),
}));

describe('RawDataView', () => {
  const mockValuation: PropertyValuation = {
    year: '2024',
    finmkttot: 500000,
    finmktland: 200000,
    pymkttot: 450000,
    pymktland: 180000,
    boro: 1,
    block: 1234,
    lot: 56,
  } as PropertyValuation;

  it('renders valuation data', () => {
    render(<RawDataView data={[mockValuation]} searchQuery="" />);
    expect(screen.getByText('Year: 2024')).toBeInTheDocument();
  });

  it('formats currency fields correctly', () => {
    render(<RawDataView data={[mockValuation]} searchQuery="" />);

    // Check that currency values are formatted
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$200,000')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<RawDataView data={[]} searchQuery="" />);
    expect(screen.getByText('No valuation data available')).toBeInTheDocument();
  });

  it('filters fields based on search query', () => {
    render(<RawDataView data={[mockValuation]} searchQuery="market" />);

    // Should show market-related fields
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    expect(screen.getByText('$200,000')).toBeInTheDocument();
  });
});

