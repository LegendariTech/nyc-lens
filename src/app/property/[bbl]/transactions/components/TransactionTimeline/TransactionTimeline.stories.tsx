import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TransactionTimeline } from './index';
import type { Transaction } from './types';

// Type for transaction data before enrichment
type RawTransaction = Omit<Transaction, 'classCodeDescription' | 'isDeed' | 'isMortgage' | 'isUccLien' | 'isOtherDocument' | 'party1' | 'party2'> & {
    party1: string;
    party2: string;
};

// Helper to add computed fields based on document type
const enrichTransactions = (txs: RawTransaction[]): Transaction[] => {
    return txs.map(tx => {
        const isDeed = tx.type === 'DEED';
        const isMortgage = tx.type === 'MORTGAGE' || tx.type === 'MTGE';
        const isUcc = tx.type.startsWith('UCC') || tx.type.includes('LIEN');
        const isOther = !isDeed && !isMortgage && !isUcc;

        return {
            ...tx,
            // Convert party strings to arrays
            party1: [tx.party1],
            party2: [tx.party2],
            classCodeDescription: isDeed
                ? 'DEEDS AND OTHER CONVEYANCES'
                : isMortgage
                    ? 'MORTGAGES & INSTRUMENTS'
                    : isUcc
                        ? 'UCC AND FEDERAL LIENS'
                        : 'OTHER DOCUMENTS',
            isDeed,
            isMortgage,
            isUccLien: isUcc,
            isOtherDocument: isOther,
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
                        <strong>💡 Tip:</strong> Click on the year links in the &quot;On This Page&quot; sidebar on the right to see the prominent glow animation on the first transaction of that year.
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

/**
 * All document categories including UCC liens and other documents
 */
export const AllDocumentCategories: Story = {
    args: {
        transactions: enrichTransactions([
            {
                id: '1',
                type: 'DEED',
                docType: 'DEED, BARGAIN AND SALE',
                date: '2024-06-15T00:00:00.000Z',
                amount: 1500000,
                party1: 'SMITH, JOHN',
                party2: 'JONES, MARY',
                party1Type: 'Buyer',
                party2Type: 'Seller',
                documentId: 'FT_2024061500001',
            },
            {
                id: '2',
                type: 'MORTGAGE',
                docType: 'MORTGAGE',
                date: '2024-06-15T00:00:00.000Z',
                amount: 1200000,
                party1: 'SMITH, JOHN',
                party2: 'CHASE BANK USA, N.A.',
                party1Type: 'Borrower',
                party2Type: 'Lender',
                documentId: 'FT_2024061500002',
            },
            {
                id: '3',
                type: 'UCC3',
                docType: 'UCC3 FINANCING STATEMENT',
                date: '2023-03-10T00:00:00.000Z',
                amount: 500000,
                party1: 'ABC CORPORATION',
                party2: 'XYZ FINANCE LLC',
                party1Type: 'Debtor',
                party2Type: 'Secured Party',
                documentId: 'FT_2023031000001',
            },
            {
                id: '4',
                type: 'CERT',
                docType: 'CERTIFICATE',
                date: '2023-01-20T00:00:00.000Z',
                amount: 100000,
                party1: 'PROPERTY MANAGEMENT LLC',
                party2: 'NYC DEPARTMENT OF BUILDINGS',
                party1Type: 'Applicant',
                party2Type: 'Agency',
                documentId: 'FT_2023012000001',
            },
            {
                id: '5',
                type: 'DEED',
                docType: 'DEED, BARGAIN AND SALE',
                date: '2022-09-05T00:00:00.000Z',
                amount: 1250000,
                party1: 'JONES, MARY',
                party2: 'BROWN, ROBERT',
                party1Type: 'Buyer',
                party2Type: 'Seller',
                documentId: 'FT_2022090500001',
            },
        ]),
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates all four document categories: Deeds (amber), Mortgages (blue), UCC & Liens (red), and Other Documents (gray). By default, only Deeds and Mortgages are shown. Use the filter buttons to show/hide each category.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div>
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-foreground/80 mb-2">
                        <strong>📋 All Categories:</strong> This timeline includes all four document types:
                    </p>
                    <ul className="text-sm text-foreground/70 space-y-1 ml-4">
                        <li>🟡 <strong>Deeds</strong> (amber) - Property transfers and conveyances</li>
                        <li>🔵 <strong>Mortgages</strong> (blue) - Loans and financing instruments</li>
                        <li>🔴 <strong>UCC & Liens</strong> (red) - Uniform Commercial Code filings and liens</li>
                        <li>⚪ <strong>Other Documents</strong> (gray) - Certificates, declarations, etc.</li>
                    </ul>
                    <p className="text-sm text-foreground/60 mt-2">
                        <em>Tip: By default, only Deeds and Mortgages are visible. Click the filter buttons to show UCC & Liens and Other Documents.</em>
                    </p>
                </div>
                <Story />
            </div>
        ),
    ],
};

/**
 * UCC and Lien documents only
 */
export const UccLiensOnly: Story = {
    args: {
        transactions: enrichTransactions([
            {
                id: '1',
                type: 'UCC3',
                docType: 'UCC3 FINANCING STATEMENT',
                date: '2024-03-15T00:00:00.000Z',
                amount: 750000,
                party1: 'MANUFACTURING CO LLC',
                party2: 'EQUIPMENT FINANCE CORP',
                party1Type: 'Debtor',
                party2Type: 'Secured Party',
                documentId: 'FT_2024031500001',
            },
            {
                id: '2',
                type: 'UCC1',
                docType: 'UCC1 FINANCING STATEMENT',
                date: '2023-11-20T00:00:00.000Z',
                amount: 500000,
                party1: 'TECH STARTUP INC',
                party2: 'VENTURE CAPITAL PARTNERS',
                party1Type: 'Debtor',
                party2Type: 'Secured Party',
                documentId: 'FT_2023112000001',
            },
            {
                id: '3',
                type: 'LIEN',
                docType: 'FEDERAL TAX LIEN',
                date: '2022-08-10T00:00:00.000Z',
                amount: 250000,
                party1: 'DELINQUENT COMPANY LLC',
                party2: 'INTERNAL REVENUE SERVICE',
                party1Type: 'Taxpayer',
                party2Type: 'Creditor',
                documentId: 'FT_2022081000001',
            },
        ]),
    },
    parameters: {
        docs: {
            description: {
                story: 'Timeline showing only UCC filings and liens (shown in red). These are financial instruments and claims against property.',
            },
        },
    },
};

/**
 * Other documents only
 */
export const OtherDocumentsOnly: Story = {
    args: {
        transactions: enrichTransactions([
            {
                id: '1',
                type: 'CERT',
                docType: 'CERTIFICATE OF OCCUPANCY',
                date: '2024-05-12T00:00:00.000Z',
                amount: 150000,
                party1: 'PROPERTY DEVELOPERS LLC',
                party2: 'NYC DEPARTMENT OF BUILDINGS',
                party1Type: 'Applicant',
                party2Type: 'Issuing Agency',
                documentId: 'FT_2024051200001',
            },
            {
                id: '2',
                type: 'DECL',
                docType: 'DECLARATION OF RESTRICTIONS',
                date: '2023-09-08T00:00:00.000Z',
                amount: 50000,
                party1: 'HOMEOWNERS ASSOCIATION',
                party2: 'PROPERTY OWNERS',
                party1Type: 'Declarant',
                party2Type: 'Affected Parties',
                documentId: 'FT_2023090800001',
            },
            {
                id: '3',
                type: 'AGMT',
                docType: 'EASEMENT AGREEMENT',
                date: '2022-04-15T00:00:00.000Z',
                amount: 75000,
                party1: 'UTILITY COMPANY',
                party2: 'LANDOWNER',
                party1Type: 'Grantee',
                party2Type: 'Grantor',
                documentId: 'FT_2022041500001',
            },
        ]),
    },
    parameters: {
        docs: {
            description: {
                story: 'Timeline showing miscellaneous documents (shown in gray) such as certificates, declarations, and agreements.',
            },
        },
    },
};

