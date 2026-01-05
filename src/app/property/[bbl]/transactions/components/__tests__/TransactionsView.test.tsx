/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { TransactionsView } from '../TransactionsView';
import type { Transaction } from '../TransactionTimeline/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock child components to isolate tests
vi.mock('@/components/layout/TabControlsBar', () => ({
  TabControlsBar: ({ tableView, onTableViewChange, showTableViewToggle }: {
    tableView: boolean;
    onTableViewChange: (value: boolean) => void;
    showTableViewToggle: boolean;
  }) => (
    <div data-testid="tab-controls-bar">
      {showTableViewToggle && (
        <button
          data-testid="table-view-toggle"
          onClick={() => onTableViewChange(!tableView)}
        >
          {tableView ? 'Timeline View' : 'Table View'}
        </button>
      )}
    </div>
  ),
}));

vi.mock('../TransactionTimeline', () => ({
  TransactionTimeline: ({ transactions }: { transactions: Transaction[] }) => (
    <div data-testid="transaction-timeline">
      {transactions.length} transactions
    </div>
  ),
}));

vi.mock('@/components/table/document/DocumentTable', () => ({
  __esModule: true,
  default: () => <div data-testid="document-table">Document Table</div>,
}));

const mockTransactions: Transaction[] = [
  {
    id: '1',
    documentId: 'DOC1',
    date: '2024-01-15',
    type: 'DEED',
    docType: 'DEED',
    party1Type: 'SELLER',
    party1: ['John Doe'],
    party2Type: 'BUYER',
    party2: ['Jane Smith'],
    amount: 500000,
    classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
    isDeed: true,
    isMortgage: false,
    isUccLien: false,
    isOtherDocument: false,
  },
];

describe('TransactionsView', () => {
  describe('CSS-based Responsive Visibility', () => {
    it('renders TabControlsBar with hidden md:block class for CSS visibility', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      const controlsBar = screen.getByTestId('tab-controls-bar');
      const controlsWrapper = controlsBar.parentElement;

      // Should have CSS classes for responsive visibility
      expect(controlsWrapper).toHaveClass('hidden');
      expect(controlsWrapper).toHaveClass('md:block');
    });

    it('renders TransactionTimeline (always visible on mobile)', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      expect(screen.getByTestId('transaction-timeline')).toBeInTheDocument();
    });

    it('does not render DocumentTable by default (tableView is false)', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      expect(screen.queryByTestId('document-table')).not.toBeInTheDocument();
    });
  });

  describe('Table View Toggle', () => {
    it('shows DocumentTable when tableView is enabled', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      // Click the toggle to enable table view
      const toggle = screen.getByTestId('table-view-toggle');
      await user.click(toggle);

      // DocumentTable should now be visible
      expect(screen.getByTestId('document-table')).toBeInTheDocument();
    });

    it('DocumentTable wrapper has hidden md:block for desktop-only visibility', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      // Enable table view
      const toggle = screen.getByTestId('table-view-toggle');
      await user.click(toggle);

      const tableWrapper = screen.getByTestId('document-table').parentElement;

      // Should have CSS classes to hide on mobile
      expect(tableWrapper).toHaveClass('hidden');
      expect(tableWrapper).toHaveClass('md:block');
    });

    it('TransactionTimeline has md:hidden class when tableView is enabled', async () => {
      const user = userEvent.setup();
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      // Enable table view
      const toggle = screen.getByTestId('table-view-toggle');
      await user.click(toggle);

      const timelineWrapper = screen.getByTestId('transaction-timeline').parentElement;

      // Should be hidden on desktop when table view is enabled
      expect(timelineWrapper).toHaveClass('md:hidden');
    });

    it('TransactionTimeline does not have md:hidden when tableView is disabled', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      const timelineWrapper = screen.getByTestId('transaction-timeline').parentElement;

      // Should not have md:hidden when tableView is false
      expect(timelineWrapper).not.toHaveClass('md:hidden');
    });
  });

  describe('No JavaScript Flash (CSS-only visibility)', () => {
    /**
     * These tests verify that visibility is controlled via CSS classes
     * rather than JavaScript conditions, which prevents layout flash/shift
     * on initial render.
     */

    it('controls bar visibility uses CSS class, not conditional rendering', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      // TabControlsBar should ALWAYS be in the DOM
      // (visibility controlled by CSS, not JS condition)
      expect(screen.getByTestId('tab-controls-bar')).toBeInTheDocument();
    });

    it('timeline is always rendered (visibility controlled by CSS)', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      // Timeline should always be in the DOM
      expect(screen.getByTestId('transaction-timeline')).toBeInTheDocument();
    });
  });

  describe('BBL Parsing', () => {
    it('correctly parses BBL for DocumentTable', async () => {
      const user = userEvent.setup();

      // We'd need to inspect the DocumentTable props, but since we're mocking,
      // we just verify no errors occur with various BBL formats
      const { rerender } = render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-123-45"
        />
      );

      // Enable table view to trigger DocumentTable render
      await user.click(screen.getByTestId('table-view-toggle'));
      expect(screen.getByTestId('document-table')).toBeInTheDocument();

      // Re-render with different BBL format
      rerender(
        <TransactionsView
          transactions={mockTransactions}
          bbl="3-1-1"
        />
      );
      expect(screen.getByTestId('document-table')).toBeInTheDocument();
    });
  });

  describe('Address prop', () => {
    it('renders without address prop', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
        />
      );

      expect(screen.getByTestId('transaction-timeline')).toBeInTheDocument();
    });

    it('renders with address prop', () => {
      render(
        <TransactionsView
          transactions={mockTransactions}
          bbl="1-1-1"
          address="123 Main St"
        />
      );

      expect(screen.getByTestId('transaction-timeline')).toBeInTheDocument();
    });
  });
});
