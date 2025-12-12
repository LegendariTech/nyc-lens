import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileTimeline } from '../MobileTimeline';
import type { Transaction } from '../types';

// Mock MobileTimelineItem since it's tested separately
vi.mock('../MobileTimelineItem', () => ({
    MobileTimelineItem: ({ transaction, yearMarker }: { transaction: Transaction; yearMarker?: number }) => (
        <div data-testid={`mobile-timeline-item-${transaction.id}`}>
            Transaction: {transaction.type}
            {yearMarker && <div data-testid={`year-marker-${yearMarker}`}>Year: {yearMarker}</div>}
        </div>
    ),
}));

describe('MobileTimeline', () => {
    const createMockTransaction = (id: string, type: string, date: string): Transaction => ({
        id,
        date,
        type,
        docType: 'DEED, RESIDENTIAL PROPERTY',
        amount: 1000000,
        party1: ['SELLER LLC'],
        party2: ['BUYER INC'],
        party1Type: 'Seller',
        party2Type: 'Buyer',
        documentId: `DOC-${id}`,
        isDeed: true,
        isMortgage: false,
        isUccLien: false,
        isOtherDocument: false,
        partyDetails: [],
    });

    describe('Basic rendering', () => {
        it('should render empty state when no transactions', () => {
            const { container } = render(
                <MobileTimeline transactions={[]} firstTransactionOfYear={{}} />
            );

            // Should render container but no items
            const timeline = container.querySelector('.xl\\:hidden');
            expect(timeline).toBeInTheDocument();
            expect(screen.queryByTestId(/mobile-timeline-item/)).not.toBeInTheDocument();
        });

        it('should render single transaction', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];

            render(<MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            expect(screen.getByTestId('mobile-timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByText('Transaction: DEED')).toBeInTheDocument();
        });

        it('should render multiple transactions', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2025-05-10'),
                createMockTransaction('TX-003', 'DEED', '2024-12-01'),
            ];

            render(<MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            expect(screen.getByTestId('mobile-timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-timeline-item-TX-002')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-timeline-item-TX-003')).toBeInTheDocument();
            
            // Use getAllByText since there are two DEED transactions
            const deedTransactions = screen.getAllByText('Transaction: DEED');
            expect(deedTransactions).toHaveLength(2);
            expect(screen.getByText('Transaction: MTGE')).toBeInTheDocument();
        });
    });

    describe('Year markers', () => {
        it('should pass year marker to first transaction of year', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2025-05-10'),
            ];

            const firstTransactionOfYear = {
                'TX-001': 2025,
            };

            render(
                <MobileTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            // First transaction should have year marker
            expect(screen.getByTestId('year-marker-2025')).toBeInTheDocument();
            expect(screen.getByText('Year: 2025')).toBeInTheDocument();

            // Second transaction should not have year marker
            expect(screen.queryByTestId('year-marker-2024')).not.toBeInTheDocument();
        });

        it('should handle multiple year markers', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2024-12-01'),
                createMockTransaction('TX-003', 'DEED', '2023-08-15'),
            ];

            const firstTransactionOfYear = {
                'TX-001': 2025,
                'TX-002': 2024,
                'TX-003': 2023,
            };

            render(
                <MobileTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            expect(screen.getByTestId('year-marker-2025')).toBeInTheDocument();
            expect(screen.getByTestId('year-marker-2024')).toBeInTheDocument();
            expect(screen.getByTestId('year-marker-2023')).toBeInTheDocument();
        });

        it('should not pass year marker when not first of year', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2025-05-10'),
                createMockTransaction('TX-003', 'DEED', '2025-03-01'),
            ];

            const firstTransactionOfYear = {
                'TX-001': 2025, // Only first transaction has year marker
            };

            render(
                <MobileTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            // Only first transaction should have year marker
            expect(screen.getByTestId('year-marker-2025')).toBeInTheDocument();
            
            // Verify other transactions don't have markers by checking they rendered but without markers
            expect(screen.getByTestId('mobile-timeline-item-TX-002')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-timeline-item-TX-003')).toBeInTheDocument();
            expect(screen.getAllByTestId(/year-marker/).length).toBe(1);
        });
    });

    describe('Layout and styling', () => {
        it('should have mobile-only visibility class', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const timeline = container.querySelector('.xl\\:hidden');
            expect(timeline).toBeInTheDocument();
        });

        it('should have proper spacing classes', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            // Check for mt-4 and space-y-3 classes
            const timeline = container.querySelector('.mt-4.space-y-3');
            expect(timeline).toBeInTheDocument();
        });
    });

    describe('Transaction rendering order', () => {
        it('should render transactions in the order provided', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2024-12-01'),
                createMockTransaction('TX-003', 'UCC3', '2023-08-15'),
            ];

            const { container } = render(
                <MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const items = container.querySelectorAll('[data-testid^="mobile-timeline-item"]');
            expect(items.length).toBe(3);
            expect(items[0]).toHaveAttribute('data-testid', 'mobile-timeline-item-TX-001');
            expect(items[1]).toHaveAttribute('data-testid', 'mobile-timeline-item-TX-002');
            expect(items[2]).toHaveAttribute('data-testid', 'mobile-timeline-item-TX-003');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty firstTransactionOfYear object', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2024-12-01'),
            ];

            render(<MobileTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            // Should render all items without year markers
            expect(screen.getByTestId('mobile-timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-timeline-item-TX-002')).toBeInTheDocument();
            expect(screen.queryByTestId(/year-marker/)).not.toBeInTheDocument();
        });

        it('should handle transaction with invalid/missing year marker', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
            ];

            const firstTransactionOfYear = {
                'TX-999': 2025, // Year marker for non-existent transaction
            };

            render(
                <MobileTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            // Should still render the transaction without error
            expect(screen.getByTestId('mobile-timeline-item-TX-001')).toBeInTheDocument();
            // The year marker shouldn't appear since it's for TX-999
            expect(screen.queryByTestId('year-marker-2025')).not.toBeInTheDocument();
        });
    });
});

