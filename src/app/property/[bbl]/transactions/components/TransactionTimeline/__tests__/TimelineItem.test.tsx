import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineItem } from '../TimelineItem';
import { TIMELINE_CONFIG } from '../constants';
import type { Transaction } from '../types';

// Mock child components
vi.mock('../DateBubble', () => ({
    DateBubble: ({ date, categoryMetadata }: { date: string; categoryMetadata: { key: string } }) => (
        <div data-testid={`date-bubble-${date}`}>
            Date: {date}, Category: {categoryMetadata.key}
        </div>
    ),
}));

vi.mock('../ConnectorLine', () => ({
    ConnectorLine: ({ categoryMetadata }: { categoryMetadata: { key: string } }) => (
        <div data-testid={`connector-line-${categoryMetadata.key}`}>
            Connector: {categoryMetadata.key}
        </div>
    ),
}));

vi.mock('../TransactionCard', () => ({
    TransactionCard: ({ transaction }: { transaction: Transaction }) => (
        <div data-testid={`transaction-card-${transaction.id}`}>
            Card: {transaction.type}
        </div>
    ),
}));

describe('TimelineItem', () => {
    const createMockTransaction = (id: string, type: string, date: string, isDeed: boolean): Transaction => ({
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
        isDeed,
        isMortgage: !isDeed,
        isUccLien: false,
        isOtherDocument: false,
        partyDetails: [],
    });

    describe('Basic rendering', () => {
        it('should render timeline item with all components', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            render(<TimelineItem transaction={transaction} />);

            expect(screen.getByTestId('date-bubble-2025-06-16')).toBeInTheDocument();
            expect(screen.getByTestId('connector-line-deed')).toBeInTheDocument();
            expect(screen.getByTestId('transaction-card-TX-001')).toBeInTheDocument();
        });

        it('should pass categoryMetadata to DateBubble and ConnectorLine', () => {
            const deedTransaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { rerender } = render(<TimelineItem transaction={deedTransaction} />);

            // Check via testid which includes the category key - connector-line-deed confirms category was passed
            expect(screen.getByTestId('date-bubble-2025-06-16')).toBeInTheDocument();
            expect(screen.getByTestId('connector-line-deed')).toBeInTheDocument();

            const mortgageTransaction = createMockTransaction('TX-002', 'MTGE', '2025-05-10', false);
            rerender(<TimelineItem transaction={mortgageTransaction} />);

            // Check via testid - connector-line-mortgage confirms category was passed
            expect(screen.getByTestId('date-bubble-2025-05-10')).toBeInTheDocument();
            expect(screen.getByTestId('connector-line-mortgage')).toBeInTheDocument();
        });
    });

    describe('Layout and styling', () => {
        it('should have relative positioning and flex layout', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('relative');
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('items-center');
        });

        it('should have minimum height from config', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveStyle({
                minHeight: `${TIMELINE_CONFIG.ITEM_MIN_HEIGHT}px`,
            });
        });

        it('should have date bubble container with correct width', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const dateBubbleContainer = container.querySelector('.shrink-0');
            expect(dateBubbleContainer).toBeInTheDocument();
            expect(dateBubbleContainer).toHaveStyle({
                width: `${TIMELINE_CONFIG.DATE_BUBBLE_WIDTH}px`,
            });
        });

        it('should have transaction card container with flex-1', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const cardContainer = container.querySelector('.flex-1.min-w-0.pr-4');
            expect(cardContainer).toBeInTheDocument();
        });
    });

    describe('Year markers', () => {
        it('should not have id attribute when no year marker', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
        });

        it('should have year id when year marker is provided', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(
                <TimelineItem transaction={transaction} yearMarker={2025} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveAttribute('id', 'year-2025');
        });

        it('should set correct year id for different years', () => {
            const transaction1 = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container: container1 } = render(
                <TimelineItem transaction={transaction1} yearMarker={2025} />
            );

            const transaction2 = createMockTransaction('TX-002', 'MTGE', '2024-12-01', false);
            const { container: container2 } = render(
                <TimelineItem transaction={transaction2} yearMarker={2024} />
            );

            const transaction3 = createMockTransaction('TX-003', 'UCC3', '2023-08-15', false);
            const { container: container3 } = render(
                <TimelineItem transaction={transaction3} yearMarker={2023} />
            );

            expect(container1.firstChild).toHaveAttribute('id', 'year-2025');
            expect(container2.firstChild).toHaveAttribute('id', 'year-2024');
            expect(container3.firstChild).toHaveAttribute('id', 'year-2023');
        });
    });

    describe('Component structure', () => {
        it('should have three main sections: date bubble, connector, card', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.children.length).toBe(3);

            // Date bubble container
            expect(wrapper.children[0]).toHaveClass('shrink-0');
            // Connector container
            expect(wrapper.children[1]).toHaveClass('-ml-1');
            // Card container
            expect(wrapper.children[2]).toHaveClass('flex-1');
        });

        it('should render DateBubble in first section', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            render(<TimelineItem transaction={transaction} />);

            expect(screen.getByTestId('date-bubble-2025-06-16')).toBeInTheDocument();
        });

        it('should render ConnectorLine in second section', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            render(<TimelineItem transaction={transaction} />);

            expect(screen.getByTestId('connector-line-deed')).toBeInTheDocument();
        });

        it('should render TransactionCard in third section', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            render(<TimelineItem transaction={transaction} />);

            expect(screen.getByTestId('transaction-card-TX-001')).toBeInTheDocument();
        });
    });

    describe('Date bubble container', () => {
        it('should have correct classes for date bubble container', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const dateBubbleContainer = container.querySelector('.relative.flex.items-center.justify-center.shrink-0');
            expect(dateBubbleContainer).toBeInTheDocument();
        });

        it('should use DATE_BUBBLE_WIDTH from config', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const dateBubbleContainer = container.querySelector('.shrink-0') as HTMLElement;
            expect(dateBubbleContainer.style.width).toBe(`${TIMELINE_CONFIG.DATE_BUBBLE_WIDTH}px`);
        });
    });

    describe('Connector line container', () => {
        it('should have correct classes for connector container', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const connectorContainer = container.querySelector('.-ml-1.flex.items-center');
            expect(connectorContainer).toBeInTheDocument();
        });
    });

    describe('Transaction card container', () => {
        it('should have correct classes for card container', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(<TimelineItem transaction={transaction} />);

            const cardContainer = container.querySelector('.flex-1.min-w-0.pr-4');
            expect(cardContainer).toBeInTheDocument();
        });
    });

    describe('Accessibility and navigation', () => {
        it('should be navigable via year id for on-this-page sidebar', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(
                <TimelineItem transaction={transaction} yearMarker={2025} />
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
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(
                <TimelineItem transaction={transaction} yearMarker={undefined} />
            );

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
            expect(screen.getByTestId('transaction-card-TX-001')).toBeInTheDocument();
        });

        it('should handle yearMarker of 0', () => {
            const transaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            const { container } = render(
                <TimelineItem transaction={transaction} yearMarker={0} />
            );

            // yearMarker={0} is falsy, so no id should be set
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).not.toHaveAttribute('id');
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
                classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
                isDeed: true,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: false,
            };

            render(<TimelineItem transaction={minimalTransaction} />);
            expect(screen.getByTestId('transaction-card-MIN-001')).toBeInTheDocument();
            expect(screen.getByTestId('date-bubble-2025-01-01')).toBeInTheDocument();
        });
    });

    describe('Category-based styling', () => {
        it('should pass deed categoryMetadata to child components for deed transactions', () => {
            const deedTransaction = createMockTransaction('TX-001', 'DEED', '2025-06-16', true);
            render(<TimelineItem transaction={deedTransaction} />);

            // Check via testid - connector-line-deed confirms category was passed to ConnectorLine
            // date-bubble testid confirms DateBubble received the date
            expect(screen.getByTestId('connector-line-deed')).toBeInTheDocument();
            expect(screen.getByTestId('date-bubble-2025-06-16')).toBeInTheDocument();
        });

        it('should pass mortgage categoryMetadata to child components for mortgage transactions', () => {
            const mortgageTransaction = createMockTransaction('TX-002', 'MTGE', '2025-05-10', false);
            render(<TimelineItem transaction={mortgageTransaction} />);

            // Check via testid - connector-line-mortgage confirms category was passed to ConnectorLine
            // date-bubble testid confirms DateBubble received the date
            expect(screen.getByTestId('connector-line-mortgage')).toBeInTheDocument();
            expect(screen.getByTestId('date-bubble-2025-05-10')).toBeInTheDocument();
        });

        it('should pass ucc-lien categoryMetadata to child components for UCC lien transactions', () => {
            const uccTransaction: Transaction = {
                ...createMockTransaction('TX-003', 'UCC3', '2025-04-01', false),
                isUccLien: true,
                isMortgage: false,
            };
            render(<TimelineItem transaction={uccTransaction} />);

            expect(screen.getByTestId('connector-line-ucc-lien')).toBeInTheDocument();
            expect(screen.getByTestId('date-bubble-2025-04-01')).toBeInTheDocument();
        });

        it('should pass other categoryMetadata to child components for other transactions', () => {
            const otherTransaction: Transaction = {
                ...createMockTransaction('TX-004', 'OTHER', '2025-03-01', false),
                isDeed: false,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: true,
            };
            render(<TimelineItem transaction={otherTransaction} />);

            expect(screen.getByTestId('connector-line-other')).toBeInTheDocument();
            expect(screen.getByTestId('date-bubble-2025-03-01')).toBeInTheDocument();
        });
    });
});

