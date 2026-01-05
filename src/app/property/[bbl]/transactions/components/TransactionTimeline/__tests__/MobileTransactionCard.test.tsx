import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileTransactionCard } from '../MobileTransactionCard';
import type { Transaction } from '../types';

// Mock PartyDetailsDialog since it's tested separately
vi.mock('../PartyDetailsDialog', () => ({
    PartyDetailsDialog: ({ open, parties }: { open: boolean; parties: unknown[] }) => {
        if (!open) return null;
        return <div data-testid="party-details-dialog">Dialog: {parties.length} parties</div>;
    },
}));

describe('MobileTransactionCard', () => {
    const mockTransaction: Transaction = {
        id: 'TX-001',
        date: '2025-06-16',
        type: 'DEED',
        docType: 'DEED, RESIDENTIAL PROPERTY',
        amount: 1000000,
        party1: ['SELLER LLC'],
        party2: ['BUYER INC'],
        party1Type: 'Seller',
        party2Type: 'Buyer',
        documentId: 'DOC-123',
        classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
        isDeed: true,
        isMortgage: false,
        isUccLien: false,
        isOtherDocument: false,
        partyDetails: [
            {
                name: 'SELLER LLC',
                type: 'Seller',
                address1: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
            },
            {
                name: 'BUYER INC',
                type: 'Buyer',
                address1: '456 Oak Ave',
                city: 'New York',
                state: 'NY',
                zip: '10002',
            },
        ],
    };

    describe('Basic rendering', () => {
        it('should render transaction card with all basic details', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            // Check for transaction type badge
            expect(screen.getByText('DEED')).toBeInTheDocument();

            // Check for formatted amount
            expect(screen.getByText('$1,000,000')).toBeInTheDocument();

            // Check for parties
            expect(screen.getByText('SELLER LLC')).toBeInTheDocument();
            expect(screen.getByText('BUYER INC')).toBeInTheDocument();

            // Check for party type labels
            expect(screen.getByText('Seller:', { exact: false })).toBeInTheDocument();
            expect(screen.getByText('Buyer:', { exact: false })).toBeInTheDocument();

            // Check for doc type
            expect(screen.getByText('DEED, RESIDENTIAL PROPERTY')).toBeInTheDocument();
        });

        it('should display formatted date', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);
            expect(screen.getByText('Jun 16, 2025')).toBeInTheDocument();
        });

        it('should render document link when documentId is present', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            const link = screen.getByRole('link', { name: /view acris document/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', 'https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=DOC-123');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should not render document link when documentId is missing', () => {
            const transactionWithoutDoc = { ...mockTransaction, documentId: undefined };
            render(<MobileTransactionCard transaction={transactionWithoutDoc} />);

            const link = screen.queryByRole('link', { name: /view acris document/i });
            expect(link).not.toBeInTheDocument();
        });
    });

    describe('Category styling', () => {
        it('should apply deed category styles', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);
            const badge = screen.getByText('DEED');

            // Check for amber styling for deeds
            expect(badge).toHaveClass('border-amber-500/50');
            expect(badge).toHaveClass('text-amber-500');
            expect(badge).toHaveClass('bg-amber-500/10');
        });

        it('should apply mortgage category styles', () => {
            const mortgageTransaction: Transaction = {
                ...mockTransaction,
                type: 'MTGE',
                isDeed: false,
                isMortgage: true,
                isUccLien: false,
                isOtherDocument: false,
            };
            render(<MobileTransactionCard transaction={mortgageTransaction} />);
            const badge = screen.getByText('MTGE');

            // Check for blue styling for mortgages
            expect(badge).toHaveClass('bg-blue-500');
            expect(badge).toHaveClass('text-white');
            expect(badge).toHaveClass('border-blue-500');
        });

        it('should apply UCC lien category styles', () => {
            const uccTransaction: Transaction = {
                ...mockTransaction,
                type: 'UCC3',
                isDeed: false,
                isMortgage: false,
                isUccLien: true,
                isOtherDocument: false,
            };
            render(<MobileTransactionCard transaction={uccTransaction} />);
            const badge = screen.getByText('UCC3');

            // Check for red styling for UCC liens
            expect(badge).toHaveClass('border-red-500/50');
            expect(badge).toHaveClass('text-red-500');
            expect(badge).toHaveClass('bg-red-500/10');
        });

        it('should apply other category styles', () => {
            const otherTransaction: Transaction = {
                ...mockTransaction,
                type: 'AGMT',
                isDeed: false,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: true,
            };
            render(<MobileTransactionCard transaction={otherTransaction} />);
            const badge = screen.getByText('AGMT');

            // Check for gray styling for other documents
            expect(badge).toHaveClass('border-gray-500/50');
            expect(badge).toHaveClass('text-gray-500');
            expect(badge).toHaveClass('bg-gray-500/10');
        });
    });

    describe('Party list expansion', () => {
        it('should show single party without expand button', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            // Should not have expand buttons for single parties
            expect(screen.queryByText(/more/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/show less/i)).not.toBeInTheDocument();
        });

        it('should show expand button for multiple parties', () => {
            const multiPartyTransaction: Transaction = {
                ...mockTransaction,
                party1: ['SELLER LLC', 'CO-SELLER INC', 'ANOTHER SELLER'],
            };
            render(<MobileTransactionCard transaction={multiPartyTransaction} />);

            // Should show first party and expand button
            expect(screen.getByText('SELLER LLC')).toBeInTheDocument();
            expect(screen.getByText('+ 2 more')).toBeInTheDocument();

            // Additional parties should not be visible yet
            expect(screen.queryByText('CO-SELLER INC')).not.toBeInTheDocument();
            expect(screen.queryByText('ANOTHER SELLER')).not.toBeInTheDocument();
        });

        it('should expand to show all parties when clicked', () => {
            const multiPartyTransaction: Transaction = {
                ...mockTransaction,
                party1: ['SELLER LLC', 'CO-SELLER INC', 'ANOTHER SELLER'],
            };
            render(<MobileTransactionCard transaction={multiPartyTransaction} />);

            // Click expand button
            const expandButton = screen.getByText('+ 2 more');
            fireEvent.click(expandButton);

            // All parties should now be visible
            expect(screen.getByText('SELLER LLC')).toBeInTheDocument();
            expect(screen.getByText('CO-SELLER INC')).toBeInTheDocument();
            expect(screen.getByText('ANOTHER SELLER')).toBeInTheDocument();

            // Button should change to "show less"
            expect(screen.getByText('- show less')).toBeInTheDocument();
            expect(screen.queryByText('+ 2 more')).not.toBeInTheDocument();
        });

        it('should collapse parties when "show less" is clicked', () => {
            const multiPartyTransaction: Transaction = {
                ...mockTransaction,
                party1: ['SELLER LLC', 'CO-SELLER INC', 'ANOTHER SELLER'],
            };
            render(<MobileTransactionCard transaction={multiPartyTransaction} />);

            // Expand first
            const expandButton = screen.getByText('+ 2 more');
            fireEvent.click(expandButton);

            // Then collapse
            const collapseButton = screen.getByText('- show less');
            fireEvent.click(collapseButton);

            // Only first party should be visible
            expect(screen.getByText('SELLER LLC')).toBeInTheDocument();
            expect(screen.queryByText('CO-SELLER INC')).not.toBeInTheDocument();
            expect(screen.queryByText('ANOTHER SELLER')).not.toBeInTheDocument();
            expect(screen.getByText('+ 2 more')).toBeInTheDocument();
        });

        it('should handle party expand button click without opening dialog', () => {
            const multiPartyTransaction: Transaction = {
                ...mockTransaction,
                party1: ['SELLER LLC', 'CO-SELLER INC'],
            };
            render(<MobileTransactionCard transaction={multiPartyTransaction} />);

            const expandButton = screen.getByText('+ 1 more');
            fireEvent.click(expandButton);

            // Dialog should not open
            expect(screen.queryByTestId('party-details-dialog')).not.toBeInTheDocument();

            // Party list should expand
            expect(screen.getByText('CO-SELLER INC')).toBeInTheDocument();
        });
    });

    describe('Party Details Dialog integration', () => {
        it('should open dialog when card is clicked', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            // Dialog should not be visible initially
            expect(screen.queryByTestId('party-details-dialog')).not.toBeInTheDocument();

            // Click on the card (not on a link or button)
            const card = screen.getByText('$1,000,000').closest('div')!;
            fireEvent.click(card);

            // Dialog should now be visible
            expect(screen.getByTestId('party-details-dialog')).toBeInTheDocument();
            expect(screen.getByText('Dialog: 2 parties')).toBeInTheDocument();
        });

        it('should not open dialog when document link is clicked', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            const link = screen.getByRole('link', { name: /view acris document/i });
            fireEvent.click(link);

            // Dialog should not open
            expect(screen.queryByTestId('party-details-dialog')).not.toBeInTheDocument();
        });

        it('should pass empty array to dialog when no party details', () => {
            const transactionNoDetails = { ...mockTransaction, partyDetails: undefined };
            render(<MobileTransactionCard transaction={transactionNoDetails} />);

            // Click card to open dialog
            const card = screen.getByText('$1,000,000').closest('div')!;
            fireEvent.click(card);

            // Dialog should show 0 parties
            expect(screen.getByText('Dialog: 0 parties')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper aria-label for document link', () => {
            render(<MobileTransactionCard transaction={mockTransaction} />);

            const link = screen.getByRole('link', { name: /view acris document DOC-123 for this deed transaction/i });
            expect(link).toBeInTheDocument();
        });

        it('should have proper button type for party expand buttons', () => {
            const multiPartyTransaction: Transaction = {
                ...mockTransaction,
                party1: ['SELLER LLC', 'CO-SELLER INC'],
            };
            render(<MobileTransactionCard transaction={multiPartyTransaction} />);

            const button = screen.getByText('+ 1 more');
            expect(button).toHaveAttribute('type', 'button');
        });
    });

    describe('Edge cases', () => {
        it('should handle zero amount transactions', () => {
            const zeroAmountTransaction: Transaction = {
                ...mockTransaction,
                amount: 0,
            };
            render(<MobileTransactionCard transaction={zeroAmountTransaction} />);

            expect(screen.getByText('$0')).toBeInTheDocument();
        });

        it('should handle undefined amount', () => {
            const undefinedAmountTransaction = {
                ...mockTransaction,
                amount: undefined,
            } as unknown as Transaction;
            render(<MobileTransactionCard transaction={undefinedAmountTransaction} />);

            // formatCurrency should handle undefined gracefully by returning 'N/A'
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });

        it('should render with empty party arrays', () => {
            const emptyPartiesTransaction: Transaction = {
                ...mockTransaction,
                party1: [],
                party2: [],
            };
            render(<MobileTransactionCard transaction={emptyPartiesTransaction} />);

            // Card should still render
            expect(screen.getByText('DEED')).toBeInTheDocument();
            expect(screen.getByText('Seller:', { exact: false })).toBeInTheDocument();
            expect(screen.getByText('Buyer:', { exact: false })).toBeInTheDocument();
        });
    });

    describe('Mobile-specific layout', () => {
        it('should have mobile-optimized padding', () => {
            const { container } = render(<MobileTransactionCard transaction={mockTransaction} />);

            // Check that the card has p-3 (mobile padding)
            const card = container.querySelector('.p-3');
            expect(card).toBeInTheDocument();
        });

        it('should have flex layout for proper spacing', () => {
            const { container } = render(<MobileTransactionCard transaction={mockTransaction} />);

            // Check that container has flex-1 pb-4 for mobile spacing
            const wrapper = container.querySelector('.flex-1.pb-4');
            expect(wrapper).toBeInTheDocument();
        });

        it('should show date with type badge on mobile', () => {
            const { container } = render(<MobileTransactionCard transaction={mockTransaction} />);

            // Check that date and badge are in a flex container with proper spacing
            const header = container.querySelector('.flex.items-center.justify-between');
            expect(header).toBeInTheDocument();
        });
    });
});

