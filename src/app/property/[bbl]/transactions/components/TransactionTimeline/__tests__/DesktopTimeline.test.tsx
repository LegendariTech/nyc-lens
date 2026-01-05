import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopTimeline } from '../DesktopTimeline';
import { TIMELINE_CONFIG } from '../constants';
import type { Transaction } from '../types';

// Mock child components
vi.mock('../TimelineItem', () => ({
    TimelineItem: ({ transaction, yearMarker }: { transaction: Transaction; yearMarker?: number }) => (
        <div data-testid={`timeline-item-${transaction.id}`}>
            Transaction: {transaction.type}
            {yearMarker && <div data-testid={`year-marker-${yearMarker}`}>Year: {yearMarker}</div>}
        </div>
    ),
}));

vi.mock('../TimelineAxis', () => ({
    TimelineAxis: () => <div data-testid="timeline-axis">Timeline Axis</div>,
}));

describe('DesktopTimeline', () => {
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
        classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
        isDeed: true,
        isMortgage: false,
        isUccLien: false,
        isOtherDocument: false,
        partyDetails: [],
    });

    describe('Basic rendering', () => {
        it('should render empty timeline with axis only', () => {
            const { container } = render(
                <DesktopTimeline transactions={[]} firstTransactionOfYear={{}} />
            );

            // Should render timeline axis
            expect(screen.getByTestId('timeline-axis')).toBeInTheDocument();

            // Should not render any items
            expect(screen.queryByTestId(/timeline-item/)).not.toBeInTheDocument();

            // Should have bottom spacer
            const spacer = container.querySelector(`[style*="${TIMELINE_CONFIG.BOTTOM_SPACER_HEIGHT}"]`);
            expect(spacer).toBeInTheDocument();
        });

        it('should render single transaction with axis', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];

            render(<DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            expect(screen.getByTestId('timeline-axis')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByText('Transaction: DEED')).toBeInTheDocument();
        });

        it('should render multiple transactions', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2025-05-10'),
                createMockTransaction('TX-003', 'UCC3', '2024-12-01'),
            ];

            render(<DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            expect(screen.getByTestId('timeline-axis')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-TX-002')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-TX-003')).toBeInTheDocument();
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
                <DesktopTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            expect(screen.getByTestId('year-marker-2025')).toBeInTheDocument();
            expect(screen.getByText('Year: 2025')).toBeInTheDocument();
        });

        it('should handle multiple year markers', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2024-12-01'),
                createMockTransaction('TX-003', 'UCC3', '2023-08-15'),
            ];

            const firstTransactionOfYear = {
                'TX-001': 2025,
                'TX-002': 2024,
                'TX-003': 2023,
            };

            render(
                <DesktopTimeline
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
                createMockTransaction('TX-003', 'UCC3', '2025-03-01'),
            ];

            const firstTransactionOfYear = {
                'TX-001': 2025, // Only first has marker
            };

            render(
                <DesktopTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            expect(screen.getByTestId('year-marker-2025')).toBeInTheDocument();
            expect(screen.getAllByTestId(/year-marker/).length).toBe(1);
        });
    });

    describe('Layout and styling', () => {
        it('should have desktop-only visibility class', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const timeline = container.querySelector('.hidden.xl\\:block');
            expect(timeline).toBeInTheDocument();
        });

        it('should have proper spacing classes', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            // Check for py-8 on outer container
            const outerContainer = container.querySelector('.hidden.xl\\:block.py-8');
            expect(outerContainer).toBeInTheDocument();

            // Check for space-y-8 on items container
            const itemsContainer = container.querySelector('.space-y-8');
            expect(itemsContainer).toBeInTheDocument();
        });

        it('should have relative positioning', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const relativeContainer = container.querySelector('.relative');
            expect(relativeContainer).toBeInTheDocument();
        });
    });

    describe('Bottom spacer', () => {
        it('should render bottom spacer for scroll behavior', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const spacer = container.querySelector(`[style*="${TIMELINE_CONFIG.BOTTOM_SPACER_HEIGHT}"]`);
            expect(spacer).toBeInTheDocument();
        });

        it('should use correct spacer height from config', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const spacer = container.querySelector(`[style*="height"]`) as HTMLElement;
            expect(spacer?.style.height).toBe(TIMELINE_CONFIG.BOTTOM_SPACER_HEIGHT);
        });

        it('should render spacer even with no transactions', () => {
            const { container } = render(
                <DesktopTimeline transactions={[]} firstTransactionOfYear={{}} />
            );

            const spacer = container.querySelector(`[style*="${TIMELINE_CONFIG.BOTTOM_SPACER_HEIGHT}"]`);
            expect(spacer).toBeInTheDocument();
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
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            const items = container.querySelectorAll('[data-testid^="timeline-item"]');
            expect(items.length).toBe(3);
            expect(items[0]).toHaveAttribute('data-testid', 'timeline-item-TX-001');
            expect(items[1]).toHaveAttribute('data-testid', 'timeline-item-TX-002');
            expect(items[2]).toHaveAttribute('data-testid', 'timeline-item-TX-003');
        });
    });

    describe('Timeline axis rendering', () => {
        it('should render timeline axis before items', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];
            const { container } = render(
                <DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />
            );

            // Axis should appear before items in DOM
            expect(container.innerHTML.indexOf('timeline-axis')).toBeLessThan(
                container.innerHTML.indexOf('timeline-item-TX-001')
            );
        });

        it('should render single timeline axis for all transactions', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2025-05-10'),
                createMockTransaction('TX-003', 'UCC3', '2024-12-01'),
            ];

            render(<DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            const axes = screen.getAllByTestId('timeline-axis');
            expect(axes.length).toBe(1);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty firstTransactionOfYear object', () => {
            const transactions = [
                createMockTransaction('TX-001', 'DEED', '2025-06-16'),
                createMockTransaction('TX-002', 'MTGE', '2024-12-01'),
            ];

            render(<DesktopTimeline transactions={transactions} firstTransactionOfYear={{}} />);

            expect(screen.getByTestId('timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.getByTestId('timeline-item-TX-002')).toBeInTheDocument();
            expect(screen.queryByTestId(/year-marker/)).not.toBeInTheDocument();
        });

        it('should handle transaction with invalid/missing year marker', () => {
            const transactions = [createMockTransaction('TX-001', 'DEED', '2025-06-16')];

            const firstTransactionOfYear = {
                'TX-999': 2025, // Year marker for non-existent transaction
            };

            render(
                <DesktopTimeline
                    transactions={transactions}
                    firstTransactionOfYear={firstTransactionOfYear}
                />
            );

            expect(screen.getByTestId('timeline-item-TX-001')).toBeInTheDocument();
            expect(screen.queryByTestId('year-marker-2025')).not.toBeInTheDocument();
        });
    });
});

