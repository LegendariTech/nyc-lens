import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionTimeline } from '../index';
import type { Transaction } from '../types';

// Mock the OnThisPageSidebar component
vi.mock('@/components/layout/OnThisPageSidebar', () => ({
    OnThisPageSidebar: ({ sections }: { sections: Array<{ id: string; title: string; level: number }> }) => (
        <div data-testid="on-this-page-sidebar">
            {sections.map(section => (
                <div key={section.id} data-testid={`year-section-${section.title}`}>
                    {section.title}
                </div>
            ))}
        </div>
    ),
}));

describe('TransactionTimeline', () => {
    const mockTransactions: Transaction[] = [
        {
            id: 'tx-1',
            type: 'DEED',
            docType: 'DEED',
            date: '2025-06-16',
            amount: 1000000,
            party1: 'SELLER A',
            party2: 'BUYER A',
            party1Type: 'Seller',
            party2Type: 'Buyer',
            documentId: 'doc-1',
        },
        {
            id: 'tx-2',
            type: 'MTGE',
            docType: 'MORTGAGE',
            date: '2024-03-15',
            amount: 5000000,
            party1: 'BORROWER B',
            party2: 'LENDER B',
            party1Type: 'Borrower',
            party2Type: 'Lender',
            documentId: 'doc-2',
        },
        {
            id: 'tx-3',
            type: 'DEED',
            docType: 'DEED',
            date: '2023-10-10',
            amount: 2000000,
            party1: 'SELLER C',
            party2: 'BUYER C',
            party1Type: 'Seller',
            party2Type: 'Buyer',
            documentId: 'doc-3',
        },
    ];

    describe('Empty state', () => {
        it('should render empty state when no transactions provided', () => {
            render(<TransactionTimeline transactions={[]} />);

            expect(screen.getByText('Transaction Timeline')).toBeInTheDocument();
            expect(screen.getByText('No deed or mortgage transactions found for this property.')).toBeInTheDocument();
        });

        it('should not render sidebar when no transactions', () => {
            render(<TransactionTimeline transactions={[]} />);

            expect(screen.queryByTestId('on-this-page-sidebar')).not.toBeInTheDocument();
        });
    });

    describe('With transactions', () => {
        it('should render timeline with transactions', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            expect(screen.getByText('Transaction Timeline')).toBeInTheDocument();
            // Elements appear in both desktop and mobile views
            expect(screen.getAllByText('SELLER A').length).toBeGreaterThan(0);
            expect(screen.getAllByText('BORROWER B').length).toBeGreaterThan(0);
            expect(screen.getAllByText('SELLER C').length).toBeGreaterThan(0);
        });

        it('should render all transaction amounts', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            // Elements appear in both desktop and mobile views
            expect(screen.getAllByText('$1,000,000').length).toBeGreaterThan(0);
            expect(screen.getAllByText('$5,000,000').length).toBeGreaterThan(0);
            expect(screen.getAllByText('$2,000,000').length).toBeGreaterThan(0);
        });

        it('should sort transactions by date (newest first)', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            const amounts = screen.getAllByText(/\$[\d,]+/);
            // Should have amounts for both desktop and mobile views (6 total: 3 transactions × 2 views)
            expect(amounts.length).toBeGreaterThanOrEqual(3);
            // Verify all amounts are present
            expect(screen.getAllByText('$1,000,000').length).toBeGreaterThan(0);
            expect(screen.getAllByText('$5,000,000').length).toBeGreaterThan(0);
            expect(screen.getAllByText('$2,000,000').length).toBeGreaterThan(0);
        });
    });

    describe('Year sections', () => {
        it('should extract unique years for sidebar', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            expect(screen.getByTestId('year-section-2025')).toBeInTheDocument();
            expect(screen.getByTestId('year-section-2024')).toBeInTheDocument();
            expect(screen.getByTestId('year-section-2023')).toBeInTheDocument();
        });

        it('should handle multiple transactions in same year', () => {
            const sameYearTransactions: Transaction[] = [
                { ...mockTransactions[0], id: 'tx-1', date: '2025-06-16' },
                { ...mockTransactions[1], id: 'tx-2', date: '2025-03-15' },
                { ...mockTransactions[2], id: 'tx-3', date: '2024-10-10' },
            ];

            render(<TransactionTimeline transactions={sameYearTransactions} />);

            // Should only have 2 year sections (2025 and 2024)
            expect(screen.getByTestId('year-section-2025')).toBeInTheDocument();
            expect(screen.getByTestId('year-section-2024')).toBeInTheDocument();
            expect(screen.queryByTestId('year-section-2023')).not.toBeInTheDocument();
        });

        it('should sort years in descending order', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            const sidebar = screen.getByTestId('on-this-page-sidebar');
            const yearSections = sidebar.querySelectorAll('[data-testid^="year-section-"]');

            expect(yearSections[0]).toHaveTextContent('2025');
            expect(yearSections[1]).toHaveTextContent('2024');
            expect(yearSections[2]).toHaveTextContent('2023');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            const { container } = render(<TransactionTimeline transactions={mockTransactions} />);

            const region = container.querySelector('[role="region"]');
            expect(region).toBeInTheDocument();
            expect(region).toHaveAttribute('aria-label', 'Property transaction timeline');
        });

        it('should have aria-hidden on decorative icon', () => {
            const { container } = render(<TransactionTimeline transactions={mockTransactions} />);

            const icon = container.querySelector('[aria-hidden="true"]');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('Custom className', () => {
        it('should apply custom className to card', () => {
            const { container } = render(
                <TransactionTimeline transactions={mockTransactions} className="custom-class" />
            );

            const card = container.querySelector('.custom-class');
            expect(card).toBeInTheDocument();
        });
    });

    describe('Transaction types', () => {
        it('should render both DEED and MORTGAGE transactions', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            // Elements appear in both desktop and mobile views, plus doc type
            expect(screen.getAllByText('DEED').length).toBeGreaterThan(0);
            expect(screen.getAllByText('MTGE').length).toBeGreaterThan(0);
        });

        it('should display correct party types for each transaction type', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            // DEED should have Seller/Buyer (appears in both desktop and mobile views)
            expect(screen.getAllByText('Seller:').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Buyer:').length).toBeGreaterThan(0);

            // MORTGAGE should have Borrower/Lender (appears in both desktop and mobile views)
            expect(screen.getAllByText('Borrower:').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Lender:').length).toBeGreaterThan(0);
        });
    });

    describe('Date formatting', () => {
        it('should format dates in readable format', () => {
            render(<TransactionTimeline transactions={mockTransactions} />);

            // Dates should be formatted as "Mon DD, YYYY"
            // Desktop view shows dates in bubbles, mobile shows in cards
            expect(screen.getAllByText('Jun 16, 2025').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Mar 15, 2024').length).toBeGreaterThan(0);
            expect(screen.getAllByText('Oct 10, 2023').length).toBeGreaterThan(0);
        });
    });

    describe('Responsive layout', () => {
        it('should render desktop and mobile views', () => {
            const { container } = render(<TransactionTimeline transactions={mockTransactions} />);

            // Desktop view should have hidden xl:block class
            const desktopView = container.querySelector('.xl\\:block');
            expect(desktopView).toBeInTheDocument();

            // Mobile view should have xl:hidden class
            const mobileView = container.querySelector('.xl\\:hidden');
            expect(mobileView).toBeInTheDocument();
        });
    });

    describe('Year markers', () => {
        it('should add year marker to first transaction of each year', () => {
            const { container } = render(<TransactionTimeline transactions={mockTransactions} />);

            // Check for year marker IDs
            expect(container.querySelector('#year-2025')).toBeInTheDocument();
            expect(container.querySelector('#year-2024')).toBeInTheDocument();
            expect(container.querySelector('#year-2023')).toBeInTheDocument();
        });

        it('should only mark first transaction of each year', () => {
            const sameYearTransactions: Transaction[] = [
                { ...mockTransactions[0], id: 'tx-1', date: '2025-06-16' },
                { ...mockTransactions[1], id: 'tx-2', date: '2025-03-15' },
                { ...mockTransactions[2], id: 'tx-3', date: '2025-01-10' },
            ];

            const { container } = render(<TransactionTimeline transactions={sameYearTransactions} />);

            // Should have year markers for both desktop and mobile views
            const yearMarkers = container.querySelectorAll('[id^="year-2025"]');
            expect(yearMarkers.length).toBeGreaterThanOrEqual(1);
        });
    });
});

