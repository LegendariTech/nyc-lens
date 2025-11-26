import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionCard } from '../TransactionCard';
import type { Transaction } from '../types';

describe('TransactionCard', () => {
    const mockDeedTransaction: Transaction = {
        id: 'deed-123',
        type: 'DEED',
        docType: 'DEED',
        date: '2025-06-16',
        amount: 1000000,
        party1: ['SELLER LLC'],
        party2: ['BUYER INC'],
        party1Type: 'Seller',
        party2Type: 'Buyer',
        documentId: 'deed-123',
        classCodeDescription: 'DEEDS AND OTHER CONVEYANCES',
        isDeed: true,
        isMortgage: false,
        isUccLien: false,
        isOtherDocument: false,
    };

    const mockMortgageTransaction: Transaction = {
        id: 'mtge-456',
        type: 'MTGE',
        docType: 'MORTGAGE',
        date: '2023-10-10',
        amount: 10403747,
        party1: ['BORROWER CORP'],
        party2: ['LENDER BANK'],
        party1Type: 'Borrower',
        party2Type: 'Lender',
        documentId: 'mtge-456',
        classCodeDescription: 'MORTGAGES & INSTRUMENTS',
        isDeed: false,
        isMortgage: true,
        isUccLien: false,
        isOtherDocument: false,
    };

    describe('DEED transactions', () => {
        it('should render deed transaction with correct styling', () => {
            const { container } = render(<TransactionCard transaction={mockDeedTransaction} />);

            const deedBadges = screen.getAllByText('DEED');
            expect(deedBadges.length).toBeGreaterThan(0);
            expect(screen.getByText('$1,000,000')).toBeInTheDocument();

            // Check for amber border (deed color)
            const card = container.querySelector('.border-amber-500\\/40');
            expect(card).toBeInTheDocument();
        });

        it('should display seller and buyer labels', () => {
            render(<TransactionCard transaction={mockDeedTransaction} />);

            expect(screen.getByText('Seller:')).toBeInTheDocument();
            expect(screen.getByText('SELLER LLC')).toBeInTheDocument();
            expect(screen.getByText('Buyer:')).toBeInTheDocument();
            expect(screen.getByText('BUYER INC')).toBeInTheDocument();
        });
    });

    describe('MORTGAGE transactions', () => {
        it('should render mortgage transaction with correct styling', () => {
            const { container } = render(<TransactionCard transaction={mockMortgageTransaction} />);

            expect(screen.getByText('MTGE')).toBeInTheDocument();
            expect(screen.getByText('$10,403,747')).toBeInTheDocument();

            // Check for blue border (mortgage color)
            const card = container.querySelector('.border-blue-500\\/40');
            expect(card).toBeInTheDocument();
        });

        it('should display borrower and lender labels', () => {
            render(<TransactionCard transaction={mockMortgageTransaction} />);

            expect(screen.getByText('Borrower:')).toBeInTheDocument();
            expect(screen.getByText('BORROWER CORP')).toBeInTheDocument();
            expect(screen.getByText('Lender:')).toBeInTheDocument();
            expect(screen.getByText('LENDER BANK')).toBeInTheDocument();
        });
    });

    describe('UCC LIEN transactions', () => {
        it('should render UCC lien transaction with correct styling', () => {
            const mockUccTransaction: Transaction = {
                ...mockDeedTransaction,
                id: 'ucc-789',
                type: 'UCC3',
                docType: 'UCC3 FINANCING STATEMENT',
                classCodeDescription: 'UCC AND FEDERAL LIENS',
                isDeed: false,
                isMortgage: false,
                isUccLien: true,
                isOtherDocument: false,
            };

            const { container } = render(<TransactionCard transaction={mockUccTransaction} />);

            expect(screen.getByText('UCC3')).toBeInTheDocument();

            // Check for red border (UCC lien color)
            const card = container.querySelector('.border-red-500\\/40');
            expect(card).toBeInTheDocument();
        });
    });

    describe('OTHER DOCUMENTS transactions', () => {
        it('should render other document transaction with correct styling', () => {
            const mockOtherTransaction: Transaction = {
                ...mockDeedTransaction,
                id: 'other-999',
                type: 'CERT',
                docType: 'CERTIFICATE',
                classCodeDescription: 'OTHER DOCUMENTS',
                isDeed: false,
                isMortgage: false,
                isUccLien: false,
                isOtherDocument: true,
            };

            const { container } = render(<TransactionCard transaction={mockOtherTransaction} />);

            expect(screen.getByText('CERT')).toBeInTheDocument();

            // Check for gray border (other document color)
            const card = container.querySelector('.border-gray-500\\/40');
            expect(card).toBeInTheDocument();
        });
    });

    describe('Document type display', () => {
        it('should display document type description', () => {
            render(<TransactionCard transaction={mockDeedTransaction} />);

            expect(screen.getByText('Doc Type:')).toBeInTheDocument();
            const deedTexts = screen.getAllByText('DEED');
            expect(deedTexts.length).toBeGreaterThanOrEqual(2); // Badge + Doc Type
        });

        it('should display complex document type descriptions', () => {
            const transaction: Transaction = {
                ...mockMortgageTransaction,
                docType: 'ASSIGNMENT OF LEASES AND RENTS',
            };

            render(<TransactionCard transaction={transaction} />);

            expect(screen.getByText('ASSIGNMENT OF LEASES AND RENTS')).toBeInTheDocument();
        });
    });

    describe('Document link', () => {
        it('should render link to ACRIS document when documentId is provided', () => {
            render(<TransactionCard transaction={mockDeedTransaction} />);

            const link = screen.getByRole('link', { name: /view acris document/i });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', 'https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=deed-123');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should not render link when documentId is missing', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                documentId: undefined,
            };

            render(<TransactionCard transaction={transaction} />);

            const link = screen.queryByRole('link', { name: /view acris document/i });
            expect(link).not.toBeInTheDocument();
        });

        it('should have proper accessibility attributes', () => {
            render(<TransactionCard transaction={mockDeedTransaction} />);

            const link = screen.getByRole('link', { name: /view acris document/i });
            expect(link).toHaveAttribute('aria-label', 'View ACRIS document deed-123 for this deed transaction');
            expect(link).toHaveAttribute('title', 'View ACRIS Document');
        });
    });

    describe('Amount formatting', () => {
        it('should format large amounts with commas', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                amount: 125000000,
            };

            render(<TransactionCard transaction={transaction} />);

            expect(screen.getByText('$125,000,000')).toBeInTheDocument();
        });

        it('should format small amounts correctly', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                amount: 1,
            };

            render(<TransactionCard transaction={transaction} />);

            expect(screen.getByText('$1')).toBeInTheDocument();
        });
    });

    describe('Party names', () => {
        it('should handle long party names', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                party1: ['VERY LONG COMPANY NAME LLC WITH MANY WORDS AND CHARACTERS'],
                party2: ['ANOTHER EXTREMELY LONG BUSINESS NAME INCORPORATED'],
            };

            render(<TransactionCard transaction={transaction} />);

            expect(screen.getByText('VERY LONG COMPANY NAME LLC WITH MANY WORDS AND CHARACTERS')).toBeInTheDocument();
            expect(screen.getByText('ANOTHER EXTREMELY LONG BUSINESS NAME INCORPORATED')).toBeInTheDocument();
        });

        it('should handle multiple parties with show more button', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                party1: ['PARTY A', 'PARTY B', 'PARTY C'],
                party2: ['PARTY X', 'PARTY Y'],
            };

            render(<TransactionCard transaction={transaction} />);

            // First party should be visible
            expect(screen.getByText('PARTY A')).toBeInTheDocument();
            expect(screen.getByText('PARTY X')).toBeInTheDocument();

            // Should show "show more" buttons
            expect(screen.getByText('+ 2 more')).toBeInTheDocument();
            expect(screen.getByText('+ 1 more')).toBeInTheDocument();
        });

        it('should handle unknown parties', () => {
            const transaction: Transaction = {
                ...mockDeedTransaction,
                party1: ['Unknown'],
                party2: ['Unknown'],
            };

            render(<TransactionCard transaction={transaction} />);

            const unknownTexts = screen.getAllByText('Unknown');
            expect(unknownTexts).toHaveLength(2);
        });
    });

    describe('Card styling', () => {
        it('should have proper card structure with shadow', () => {
            const { container } = render(<TransactionCard transaction={mockDeedTransaction} />);

            const card = container.querySelector('.shadow-md');
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass('rounded-lg');
            expect(card).toHaveClass('bg-card');
        });
    });
});

