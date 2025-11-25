import type { Meta, StoryObj } from '@storybook/react';
import { TransactionTimeline } from './index';
import type { Transaction } from './types';

// Helper to add computed fields based on document type
const enrichTransactions = (txs: Omit<Transaction, 'classCodeDescription' | 'isDeed' | 'isMortgage'>[]): Transaction[] => {
    return txs.map(tx => {
        const isDeed = tx.type === 'DEED';
        const isMortgage = tx.type === 'MORTGAGE' || tx.type === 'MTGE';
        return {
            ...tx,
            classCodeDescription: isDeed
                ? 'DEEDS AND OTHER CONVEYANCES'
                : isMortgage
                    ? 'MORTGAGES & INSTRUMENTS'
                    : 'OTHER DOCUMENTS',
            isDeed,
            isMortgage,
        };
    });
};

const meta = {
    title: 'Features/Property/TransactionTimeline',
    component: TransactionTimeline,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Displays a chronological timeline of property transactions including deeds and mortgages. Responsive design with desktop and mobile views.',
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TransactionTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample transaction data
const sampleTransactions: Transaction[] = enrichTransactions([
    {
        id: '1',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 1250000,
        party1: 'SMITH, JOHN & JANE',
        party2: 'JOHNSON, ROBERT',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2023061500001',
    },
    {
        id: '2',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 1000000,
        party1: 'SMITH, JOHN & JANE',
        party2: 'CHASE BANK USA, N.A.',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2023061500002',
    },
    {
        id: '3',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2020-03-20T00:00:00.000Z',
        amount: 950000,
        party1: 'JOHNSON, ROBERT',
        party2: 'WILLIAMS, SARAH',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2020032000001',
    },
    {
        id: '4',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2020-03-20T00:00:00.000Z',
        amount: 760000,
        party1: 'JOHNSON, ROBERT',
        party2: 'WELLS FARGO BANK, N.A.',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2020032000002',
    },
    {
        id: '5',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2018-11-10T00:00:00.000Z',
        amount: 825000,
        party1: 'WILLIAMS, SARAH',
        party2: 'BROWN, MICHAEL & LISA',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2018111000001',
    },
]);

const multiYearTransactions: Transaction[] = enrichTransactions([
    {
        id: '1',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2024-01-15T00:00:00.000Z',
        amount: 1500000,
        party1: 'ANDERSON, EMILY',
        party2: 'SMITH, JOHN & JANE',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2024011500001',
    },
    {
        id: '2',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2024-01-15T00:00:00.000Z',
        amount: 1200000,
        party1: 'ANDERSON, EMILY',
        party2: 'BANK OF AMERICA, N.A.',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2024011500002',
    },
    {
        id: '3',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 1250000,
        party1: 'SMITH, JOHN & JANE',
        party2: 'JOHNSON, ROBERT',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2023061500001',
    },
    {
        id: '4',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 1000000,
        party1: 'SMITH, JOHN & JANE',
        party2: 'CHASE BANK USA, N.A.',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2023061500002',
    },
    {
        id: '5',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2022-09-10T00:00:00.000Z',
        amount: 1100000,
        party1: 'JOHNSON, ROBERT',
        party2: 'WILLIAMS, SARAH',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2022091000001',
    },
    {
        id: '6',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2020-03-20T00:00:00.000Z',
        amount: 950000,
        party1: 'WILLIAMS, SARAH',
        party2: 'BROWN, MICHAEL & LISA',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2020032000001',
    },
    {
        id: '7',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2020-03-20T00:00:00.000Z',
        amount: 760000,
        party1: 'WILLIAMS, SARAH',
        party2: 'WELLS FARGO BANK, N.A.',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2020032000002',
    },
    {
        id: '8',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2018-11-10T00:00:00.000Z',
        amount: 825000,
        party1: 'BROWN, MICHAEL & LISA',
        party2: 'DAVIS, CHRISTOPHER',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2018111000001',
    },
    {
        id: '9',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2015-05-22T00:00:00.000Z',
        amount: 675000,
        party1: 'DAVIS, CHRISTOPHER',
        party2: 'MARTINEZ, CARLOS & MARIA',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2015052200001',
    },
]);

const singleTransaction: Transaction[] = enrichTransactions([
    {
        id: '1',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 1250000,
        party1: 'SMITH, JOHN & JANE',
        party2: 'JOHNSON, ROBERT',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2023061500001',
    },
]);

const longPartyNames: Transaction[] = enrichTransactions([
    {
        id: '1',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 2500000,
        party1: 'THE METROPOLITAN REAL ESTATE INVESTMENT TRUST AND HOLDINGS LLC',
        party2: 'INTERNATIONAL PROPERTY DEVELOPMENT CORPORATION OF NEW YORK',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2023061500001',
    },
    {
        id: '2',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2023-06-15T00:00:00.000Z',
        amount: 2000000,
        party1: 'THE METROPOLITAN REAL ESTATE INVESTMENT TRUST AND HOLDINGS LLC',
        party2: 'JPMORGAN CHASE BANK, NATIONAL ASSOCIATION',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2023061500002',
    },
]);

const highValueTransactions: Transaction[] = enrichTransactions([
    {
        id: '1',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2023-12-01T00:00:00.000Z',
        amount: 25000000,
        party1: 'LUXURY PROPERTIES LLC',
        party2: 'MANHATTAN HOLDINGS CORP',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2023120100001',
    },
    {
        id: '2',
        type: 'MORTGAGE',
        docType: 'MORTGAGE',
        date: '2023-12-01T00:00:00.000Z',
        amount: 18750000,
        party1: 'LUXURY PROPERTIES LLC',
        party2: 'GOLDMAN SACHS BANK USA',
        party1Type: 'BORROWER',
        party2Type: 'LENDER',
        documentId: 'FT_2023120100002',
    },
    {
        id: '3',
        type: 'DEED',
        docType: 'DEED, BARGAIN AND SALE',
        date: '2019-08-15T00:00:00.000Z',
        amount: 18500000,
        party1: 'MANHATTAN HOLDINGS CORP',
        party2: 'EMPIRE STATE REALTY GROUP',
        party1Type: 'BUYER',
        party2Type: 'SELLER',
        documentId: 'FT_2019081500001',
    },
]);

/**
 * Default timeline with multiple transactions across different years
 */
export const Default: Story = {
    args: {
        transactions: sampleTransactions,
    },
};

/**
 * Timeline with no transactions (empty state)
 */
export const Empty: Story = {
    args: {
        transactions: [],
    },
};

/**
 * Timeline with a single transaction
 */
export const SingleTransaction: Story = {
    args: {
        transactions: singleTransaction,
    },
};

/**
 * Timeline spanning multiple years with year navigation
 */
export const MultipleYears: Story = {
    args: {
        transactions: multiYearTransactions,
    },
    parameters: {
        docs: {
            description: {
                story: 'Timeline with transactions spanning multiple years. Year markers help users navigate through the timeline.',
            },
        },
    },
};

/**
 * Timeline with long party names to test text wrapping
 */
export const LongPartyNames: Story = {
    args: {
        transactions: longPartyNames,
    },
    parameters: {
        docs: {
            description: {
                story: 'Tests how the timeline handles long party names (corporations, trusts, etc.) with proper text wrapping.',
            },
        },
    },
};

/**
 * Timeline with high-value commercial transactions
 */
export const HighValueTransactions: Story = {
    args: {
        transactions: highValueTransactions,
    },
    parameters: {
        docs: {
            description: {
                story: 'Commercial property transactions with high dollar amounts to test currency formatting.',
            },
        },
    },
};

/**
 * Timeline with only deed transactions
 */
export const DeedsOnly: Story = {
    args: {
        transactions: sampleTransactions.filter(t => t.type === 'DEED'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Timeline showing only deed transactions (property sales).',
            },
        },
    },
};

/**
 * Timeline with only mortgage transactions
 */
export const MortgagesOnly: Story = {
    args: {
        transactions: sampleTransactions.filter(t => t.type === 'MORTGAGE'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Timeline showing only mortgage transactions (financing).',
            },
        },
    },
};

/**
 * Timeline with custom className for styling
 */
export const CustomStyling: Story = {
    args: {
        transactions: sampleTransactions,
        className: 'shadow-lg border-2 border-blue-500/20',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates how custom className can be applied to style the timeline container.',
            },
        },
    },
};

/**
 * Timeline in mobile viewport
 */
export const MobileViewport: Story = {
    args: {
        transactions: sampleTransactions,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Timeline displayed in a mobile viewport to test responsive behavior. The component automatically switches to mobile layout based on screen size.',
            },
        },
    },
};

/**
 * Timeline in tablet viewport
 */
export const TabletViewport: Story = {
    args: {
        transactions: sampleTransactions,
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Timeline displayed in a tablet viewport. Shows the transition between mobile and desktop layouts.',
            },
        },
    },
};

/**
 * Timeline with recent transactions (last 2 years)
 */
export const RecentTransactions: Story = {
    args: {
        transactions: multiYearTransactions.filter(t => {
            const year = new Date(t.date).getFullYear();
            return year >= 2023;
        }),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows only recent transactions from the last 2 years.',
            },
        },
    },
};

/**
 * Timeline with transactions on the same date
 */
export const SameDateTransactions: Story = {
    args: {
        transactions: enrichTransactions([
            {
                id: '1',
                type: 'DEED',
                docType: 'DEED, BARGAIN AND SALE',
                date: '2023-06-15T00:00:00.000Z',
                amount: 1250000,
                party1: 'SMITH, JOHN & JANE',
                party2: 'JOHNSON, ROBERT',
                party1Type: 'BUYER',
                party2Type: 'SELLER',
                documentId: 'FT_2023061500001',
            },
            {
                id: '2',
                type: 'MORTGAGE',
                docType: 'MORTGAGE',
                date: '2023-06-15T00:00:00.000Z',
                amount: 1000000,
                party1: 'SMITH, JOHN & JANE',
                party2: 'CHASE BANK USA, N.A.',
                party1Type: 'BORROWER',
                party2Type: 'LENDER',
                documentId: 'FT_2023061500002',
            },
            {
                id: '3',
                type: 'MORTGAGE',
                docType: 'SATISFACTION OF MORTGAGE',
                date: '2023-06-15T00:00:00.000Z',
                amount: 750000,
                party1: 'JOHNSON, ROBERT',
                party2: 'WELLS FARGO BANK, N.A.',
                party1Type: 'BORROWER',
                party2Type: 'LENDER',
                documentId: 'FT_2023061500003',
            },
        ]),
    },
    parameters: {
        docs: {
            description: {
                story: 'Multiple transactions occurring on the same date (common during property closings).',
            },
        },
    },
};

/**
 * Timeline with year anchor highlight demonstration
 */
export const YearAnchorHighlight: Story = {
    args: {
        transactions: multiYearTransactions,
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the prominent glow animation when clicking year links in the "On This Page" sidebar. The entire transaction item (card, connector line, and date bubble) glows with a green highlight effect. Try clicking the year links in the sidebar to see the animation.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div>
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                        <strong>💡 Tip:</strong> Click on the year links in the "On This Page" sidebar on the right to see the prominent glow animation on the first transaction of that year.
                    </p>
                </div>
                <Story />
            </div>
        ),
    ],
};

/**
 * Interactive legend with filtering
 */
export const InteractiveLegend: Story = {
    args: {
        transactions: sampleTransactions,
    },
    parameters: {
        docs: {
            description: {
                story: 'The legend at the top shows color indicators for deeds (amber) and mortgages (blue). Click on the legend items to filter the timeline by transaction type. The count badges show the total number of each type.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div>
                <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                        <strong>🎨 Legend:</strong> Use the filter buttons at the top to show/hide deeds and mortgages. The color indicators help you quickly identify transaction types in the timeline.
                    </p>
                </div>
                <Story />
            </div>
        ),
    ],
};

