import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileTimelineItem } from '../MobileTimelineItem';
import type { Transaction } from '../types';

// Mock MobileTransactionCard since it's tested separately
vi.mock('../MobileTransactionCard', () => ({
    MobileTransactionCard: ({ transaction }: { transaction: Transaction }) => (
        <div data-testid="mobile-transaction-card">
            Card for transaction: {transaction.type} on {transaction.date}
        </div>
    ),
}));

describe('MobileTimelineItem', () => {
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
        it('should render transaction card', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            render(<MobileTimelineItem transaction={transaction} />);

            expect(screen.getByTestId('mobile-transaction-card')).toBeInTheDocument();
            expect(screen.getByText('Card for transaction: DEED on 2025-06-16')).toBeInTheDocument();
        });

        it('should pass transaction to MobileTransactionCard', () => {
            const transaction = createMockTransaction('TX-002', 'MTGE', '2024-12-01');
            render(<MobileTimelineItem transaction={transaction} />);

            expect(screen.getByText('Card for transaction: MTGE on 2024-12-01')).toBeInTheDocument();
        });
    });

    describe('Year marker', () => {
        it('should not have id attribute when no year marker', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(<MobileTimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
        });

        it('should have year id when year marker is provided', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(
                <MobileTimelineItem transaction={transaction} yearMarker={2025} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveAttribute('id', 'year-2025');
        });

        it('should set correct year id for different years', () => {
            const transaction1 = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container: container1 } = render(
                <MobileTimelineItem transaction={transaction1} yearMarker={2025} />
            );

            const transaction2 = createMockTransaction('TX-002', 'MTGE', '2024-12-01');
            const { container: container2 } = render(
                <MobileTimelineItem transaction={transaction2} yearMarker={2024} />
            );

            const transaction3 = createMockTransaction('TX-003', 'UCC3', '2023-08-15');
            const { container: container3 } = render(
                <MobileTimelineItem transaction={transaction3} yearMarker={2023} />
            );

            expect(container1.firstChild).toHaveAttribute('id', 'year-2025');
            expect(container2.firstChild).toHaveAttribute('id', 'year-2024');
            expect(container3.firstChild).toHaveAttribute('id', 'year-2023');
        });

        it('should handle year marker of 0', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(
                <MobileTimelineItem transaction={transaction} yearMarker={0} />
            );

            // yearMarker={0} is falsy, so no id should be set
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
        });
    });

    describe('Accessibility and navigation', () => {
        it('should be navigable via year id for on-this-page sidebar', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(
                <MobileTimelineItem transaction={transaction} yearMarker={2025} />
            );

            const wrapper = container.firstChild as HTMLElement;
            const yearId = wrapper.getAttribute('id');
            expect(yearId).toBe('year-2025');

            // Verify it can be used as an anchor link target
            expect(wrapper.id).toBe('year-2025');
        });
    });

    describe('Edge cases', () => {
        it('should handle undefined yearMarker', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(
                <MobileTimelineItem transaction={transaction} yearMarker={undefined} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
            expect(screen.getByTestId('mobile-transaction-card')).toBeInTheDocument();
        });

        it('should render with minimal transaction data', () => {
            const minimalTransaction: Transaction = {
                id: 'MIN-001',
                date: '2025-01-01',
                type: 'DEED',
                docType: 'DEED',
                amount: 0,
                party1: [],
                party2: [],
                party1Type: 'Party 1',
                party2Type: 'Party 2',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
            };

            render(<MobileTimelineItem transaction={minimalTransaction} />);
            expect(screen.getByTestId('mobile-transaction-card')).toBeInTheDocument();
        });
    });

    describe('Component structure', () => {
        it('should wrap transaction card in a div', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(<MobileTimelineItem transaction={transaction} />);

            expect(container.firstChild).toBeTruthy();
            expect(container.firstChild?.nodeName).toBe('DIV');
        });

        it('should have a single child (MobileTransactionCard)', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16');
            const { container } = render(<MobileTimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.children.length).toBe(1);
        });
    });
});

