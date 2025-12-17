'use client';

import { useState } from 'react';
import { TabControlsBar } from '@/components/layout/TabControlsBar';
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

    // Parse BBL for DocumentTable
    const bblParts = bbl.split('-');
    const [borough, block, lot] = bblParts;

    return (
        <div className="space-y-4">
            {/* Controls Bar - hidden on mobile via CSS (no JS flash) */}
            <div className="hidden md:block">
                <TabControlsBar
                    showTableViewToggle={true}
                    tableView={tableView}
                    onTableViewChange={setTableView}
                />
            </div>

            {/* Table View - only on desktop when enabled */}
            {tableView && (
                <div className="hidden md:block rounded-lg border border-foreground/10 bg-card">
                    <DocumentTable
                        data={{
                            borough,
                            block,
                            lot,
                            address,
                        }}
                    />
                </div>
            )}

            {/* Timeline - always on mobile, conditional on desktop */}
            <div className={tableView ? 'md:hidden' : undefined}>
                <TransactionTimeline transactions={transactions} />
            </div>
        </div>
    );
}

