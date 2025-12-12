'use client';

import { useState } from 'react';
import { TabControlsBar } from '@/components/layout/TabControlsBar';
import { useViewport } from '@/components/layout/ViewportContext';
import { TransactionTimeline } from './TransactionTimeline';
import DocumentTable from '@/components/table/document/DocumentTable';
import type { Transaction } from './TransactionTimeline/types';

interface TransactionsViewProps {
    transactions: Transaction[];
    bbl: string;
    address?: string;
}

export function TransactionsView({ transactions, bbl, address }: TransactionsViewProps) {
    const [tableView, setTableView] = useState(false);
    const { isMobile } = useViewport();

    // Parse BBL for DocumentTable
    const bblParts = bbl.split('-');
    const [borough, block, lot] = bblParts;

    return (
        <div className="space-y-4">
            {/* Controls Bar - hidden on mobile (table view not useful on small screens) */}
            {!isMobile && (
                <TabControlsBar
                    showTableViewToggle={true}
                    tableView={tableView}
                    onTableViewChange={setTableView}
                />
            )}

            {/* Content - always show timeline on mobile */}
            {tableView && !isMobile ? (
                <div className="rounded-lg border border-foreground/10 bg-card">
                    <DocumentTable
                        data={{
                            borough,
                            block,
                            lot,
                            address,
                        }}
                    />
                </div>
            ) : (
                <TransactionTimeline transactions={transactions} />
            )}
        </div>
    );
}

