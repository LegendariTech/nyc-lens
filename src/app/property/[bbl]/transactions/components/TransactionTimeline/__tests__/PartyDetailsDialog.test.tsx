import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PartyDetailsDialog } from '../PartyDetailsDialog';
import type { PartyDetail } from '../types';

describe('PartyDetailsDialog', () => {
    const mockOnOpenChange = vi.fn();

    const mockParties: PartyDetail[] = [
        {
            name: 'JOHN DOE',
            type: 'BUYER',
            address1: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
        },
        {
            name: 'JANE SMITH',
            type: 'SELLER',
            address1: '456 Oak Ave',
            address2: 'Apt 2B',
            city: 'Brooklyn',
            state: 'NY',
            zip: '11201',
        },
        {
            name: 'ACME CORPORATION',
            type: 'LENDER',
            address1: '789 Business Blvd',
            city: 'Manhattan',
            state: 'NY',
            zip: '10004',
        },
        {
            name: 'INTERNATIONAL BUYER LLC',
            type: 'BUYER',
            address1: '100 Foreign St',
            city: 'Toronto',
            state: 'ON',
            zip: 'M5H 2N2',
            country: 'Canada',
        },
    ];

    beforeEach(() => {
        mockOnOpenChange.mockClear();
    });

    describe('Dialog rendering', () => {
        it('should not render when closed', () => {
            render(
                <PartyDetailsDialog
                    open={false}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.queryByText('Transaction Parties')).not.toBeInTheDocument();
        });

        it('should render when open', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('Transaction Parties')).toBeInTheDocument();
        });

        it('should display transaction type and date', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="MORTGAGE"
                    transactionDate="2025-06-16"
                />
            );

            expect(screen.getByText(/MORTGAGE/)).toBeInTheDocument();
            expect(screen.getByText(/June 16, 2025/)).toBeInTheDocument();
        });
    });

    describe('Party display', () => {
        it('should render all parties as cards', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
            expect(screen.getByText('ACME CORPORATION')).toBeInTheDocument();
            expect(screen.getByText('INTERNATIONAL BUYER LLC')).toBeInTheDocument();
        });

        it('should display party types', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getAllByText('BUYER')).toHaveLength(2);
            expect(screen.getByText('SELLER')).toBeInTheDocument();
            expect(screen.getByText('LENDER')).toBeInTheDocument();
        });

        it('should display single-line addresses when only address1 exists', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('123 Main St, New York, NY, 10001')).toBeInTheDocument();
            expect(screen.getByText('789 Business Blvd, Manhattan, NY, 10004')).toBeInTheDocument();
        });

        it('should display single-line addresses when both address1 and address2 exist', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            // Address should be concatenated on single line
            expect(screen.getByText('456 Oak Ave, Apt 2B, Brooklyn, NY, 11201')).toBeInTheDocument();
        });

        it('should display country when not US', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('100 Foreign St, Toronto, ON, M5H 2N2, Canada')).toBeInTheDocument();
        });

        it('should not display US/USA country', () => {
            const usParties: PartyDetail[] = [
                {
                    name: 'US PARTY',
                    type: 'BUYER',
                    address1: '123 USA St',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'US',
                },
                {
                    name: 'USA PARTY',
                    type: 'SELLER',
                    address1: '456 America Ave',
                    city: 'Brooklyn',
                    state: 'NY',
                    zip: '11201',
                    country: 'USA',
                },
            ];

            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={usParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.queryByText('US')).not.toBeInTheDocument();
            expect(screen.queryByText('USA')).not.toBeInTheDocument();
        });
    });

    describe('Empty states', () => {
        it('should show empty state when no parties', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={[]}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('No party information available.')).toBeInTheDocument();
        });

        it('should show "No address available" when party has no address', () => {
            const partiesWithoutAddress: PartyDetail[] = [
                {
                    name: 'NO ADDRESS PARTY',
                    type: 'BUYER',
                },
            ];

            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={partiesWithoutAddress}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.getByText('No address available')).toBeInTheDocument();
        });
    });

    describe('Search functionality', () => {
        it('should render search input when parties exist', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            expect(searchInput).toBeInTheDocument();
        });

        it('should not render search input when no parties', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={[]}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            expect(screen.queryByPlaceholderText('Search by name, type, or address...')).not.toBeInTheDocument();
        });

        it('should filter parties by name', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'john');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.queryByText('JANE SMITH')).not.toBeInTheDocument();
            expect(screen.queryByText('ACME CORPORATION')).not.toBeInTheDocument();
        });

        it('should filter parties by type', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'lender');

            expect(screen.getByText('ACME CORPORATION')).toBeInTheDocument();
            expect(screen.queryByText('JOHN DOE')).not.toBeInTheDocument();
            expect(screen.queryByText('JANE SMITH')).not.toBeInTheDocument();
        });

        it('should filter parties by city', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'brooklyn');

            expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
            expect(screen.queryByText('JOHN DOE')).not.toBeInTheDocument();
        });

        it('should filter parties by address', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'main st');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.queryByText('JANE SMITH')).not.toBeInTheDocument();
        });

        it('should filter parties by zip code', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, '10001');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.queryByText('JANE SMITH')).not.toBeInTheDocument();
        });

        it('should filter parties by state', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'ON');

            expect(screen.getByText('INTERNATIONAL BUYER LLC')).toBeInTheDocument();
            expect(screen.queryByText('JOHN DOE')).not.toBeInTheDocument();
        });

        it('should filter parties by country', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'canada');

            expect(screen.getByText('INTERNATIONAL BUYER LLC')).toBeInTheDocument();
            expect(screen.queryByText('JOHN DOE')).not.toBeInTheDocument();
        });

        it('should be case-insensitive', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'JOHN');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();

            await user.clear(searchInput);
            await user.type(searchInput, 'john');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();

            await user.clear(searchInput);
            await user.type(searchInput, 'JoHn');

            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
        });

        it('should show empty search state when no matches', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            await user.type(searchInput, 'nonexistent party');

            expect(screen.getByText('No parties match your search.')).toBeInTheDocument();
            expect(screen.queryByText('JOHN DOE')).not.toBeInTheDocument();
        });

        it('should show all parties when search is cleared', async () => {
            const user = userEvent.setup();
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');

            // Type search
            await user.type(searchInput, 'john');
            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.queryByText('JANE SMITH')).not.toBeInTheDocument();

            // Clear search
            await user.clear(searchInput);

            // All parties should be visible again
            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
            expect(screen.getByText('ACME CORPORATION')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have search icon', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            const searchInput = screen.getByPlaceholderText('Search by name, type, or address...');
            const container = searchInput.parentElement;
            expect(container?.querySelector('svg')).toBeInTheDocument();
        });
    });

    describe('Card layout', () => {
        it('should render multiple party cards', () => {
            render(
                <PartyDetailsDialog
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    parties={mockParties}
                    transactionType="DEED"
                    transactionDate="2025-01-15"
                />
            );

            // Verify all 4 parties are rendered
            expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
            expect(screen.getByText('JANE SMITH')).toBeInTheDocument();
            expect(screen.getByText('ACME CORPORATION')).toBeInTheDocument();
            expect(screen.getByText('INTERNATIONAL BUYER LLC')).toBeInTheDocument();
        });
    });
});

