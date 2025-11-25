'use client';

import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { OnThisPageSidebar } from '@/components/layout/OnThisPageSidebar';

// Icon component for the card header
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Document icon for the transaction cards
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type TransactionType = 'DEED' | 'MORTGAGE';

export interface Transaction {
  id: string;
  type: TransactionType;
  docType: string;
  date: string;
  amount: number;
  party1: string;
  party2: string;
  party1Type: string;
  party2Type: string;
  documentId?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const isDeed = transaction.type === 'DEED';

  return (
    <div
      className={cn(
        'w-[340px] rounded-lg border bg-card p-3 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]',
        isDeed ? 'border-amber-500/40' : 'border-blue-500/40'
      )}
    >
      <div className="space-y-2">
        {/* Header with badge and amount */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border',
              isDeed
                ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                : 'bg-blue-500 text-white border-blue-500'
            )}
          >
            {transaction.type}
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        {/* Party information */}
        <div className="space-y-1 text-[11px]">
          <div className="flex items-start gap-1">
            <span className="text-foreground/50 shrink-0">{transaction.party1Type}:</span>
            <span className="font-medium text-foreground">{transaction.party1}</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-foreground/50 shrink-0">{transaction.party2Type}:</span>
            <span className="font-medium text-foreground">{transaction.party2}</span>
          </div>
          <div className="flex items-start gap-1 pt-1 border-t border-foreground/10">
            <span className="text-foreground/50 shrink-0">Doc Type:</span>
            <span className="font-medium text-foreground">{transaction.docType}</span>
          </div>
        </div>

        {/* Document icon */}
        {transaction.documentId && (
          <div className="flex justify-end pt-1">
            <DocumentIcon className="w-3 h-3 text-foreground/40 hover:text-foreground/70 cursor-pointer transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}

interface TransactionTimelineProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionTimeline({ transactions, className }: TransactionTimelineProps) {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Extract unique years from transactions for "On This Page" navigation
  const yearSections = useMemo(() => {
    const years = new Set<number>();
    sortedTransactions.forEach(t => {
      const year = new Date(t.date).getFullYear();
      years.add(year);
    });
    return Array.from(years)
      .sort((a, b) => b - a) // Sort descending (newest first)
      .map(year => ({
        id: `year-${year}`,
        title: year.toString(),
        level: 1,
      }));
  }, [sortedTransactions]);

  // Track which transactions are the first of their year
  const firstTransactionOfYear = useMemo(() => {
    const seen = new Set<number>();
    const result: Record<string, number> = {};
    sortedTransactions.forEach(t => {
      const year = new Date(t.date).getFullYear();
      if (!seen.has(year)) {
        seen.add(year);
        result[t.id] = year;
      }
    });
    return result;
  }, [sortedTransactions]);

  if (sortedTransactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <ClockIcon className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Transaction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            No deed or mortgage transactions found for this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex xl:gap-6">
      {/* Main timeline content */}
      <Card className={cn('flex-1 min-w-0', className)}>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <ClockIcon className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Transaction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop view - extra bottom space allows last item to scroll to top */}
          <div className="hidden xl:block relative py-8" style={{ minHeight: `calc(${Math.max(600, sortedTransactions.length * 160)}px + 60vh)` }}>
            {/* Central timeline - stops before the extra scroll space */}
            <div className="absolute left-1/2 top-8 w-0.5 bg-foreground/20 -translate-x-1/2" style={{ height: `${Math.max(560, sortedTransactions.length * 160 - 40)}px` }} />

            {/* Timeline content */}
            <div className="relative w-full max-w-5xl mx-auto">
              {sortedTransactions.map((transaction, index) => {
                const isDeed = transaction.type === 'DEED';
                const isLeft = isDeed; // Deeds on left, mortgages on right
                const topPosition = 40 + index * 160;
                const yearForThisTransaction = firstTransactionOfYear[transaction.id];

                return (
                  <div key={transaction.id}>
                    {/* Year marker (invisible anchor for scrolling) */}
                    {yearForThisTransaction && (
                      <div
                        id={`year-${yearForThisTransaction}`}
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: `${topPosition - 30}px` }}
                      />
                    )}

                    {/* Date bubble on timeline */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-10"
                      style={{ top: `${topPosition}px` }}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-full border-[3px] px-3 py-1 bg-card',
                          isDeed
                            ? 'border-amber-500 text-amber-500'
                            : 'border-blue-500 text-blue-500'
                        )}
                      >
                        <span className="text-xs font-semibold whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>

                    {/* Dashed line from card to date bubble */}
                    <svg
                      className="absolute"
                      style={{
                        [isLeft ? 'right' : 'left']: '50%',
                        top: `${topPosition + 12}px`,
                        width: '80px',
                        height: '2px',
                        [isLeft ? 'marginRight' : 'marginLeft']: '55px',
                      }}
                    >
                      <line
                        x1="0"
                        y1="1"
                        x2="80"
                        y2="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className={isDeed ? 'text-amber-500/50' : 'text-blue-500/50'}
                      />
                      <circle
                        cx={isLeft ? '80' : '0'}
                        cy="1"
                        r="3"
                        fill="currentColor"
                        className={isDeed ? 'text-amber-500' : 'text-blue-500'}
                      />
                    </svg>

                    {/* Transaction card */}
                    <div
                      className="absolute"
                      style={{
                        top: `${topPosition - 20}px`,
                        [isLeft ? 'right' : 'left']: 'calc(50% + 135px)',
                      }}
                    >
                      <TransactionCard transaction={transaction} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile view - extra bottom space allows last item to scroll to top */}
          <div className="xl:hidden space-y-4 py-4">
            {sortedTransactions.map((transaction) => {
              const isDeed = transaction.type === 'DEED';
              const yearForThisTransaction = firstTransactionOfYear[transaction.id];

              return (
                <div key={transaction.id} className="flex gap-3">
                  {/* Year marker for mobile */}
                  {yearForThisTransaction && (
                    <div id={`year-${yearForThisTransaction}-mobile`} className="sr-only" />
                  )}

                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2',
                        isDeed
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-blue-500 bg-blue-500'
                      )}
                    />
                    <div className="w-0.5 flex-1 bg-foreground/20 mt-2" />
                  </div>

                  {/* Transaction card */}
                  <div className="flex-1 pb-4">
                    <div
                      className={cn(
                        'rounded-lg border bg-card p-3 shadow-md',
                        isDeed ? 'border-amber-500/40' : 'border-blue-500/40'
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase border',
                              isDeed
                                ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                                : 'bg-blue-500 text-white border-blue-500'
                            )}
                          >
                            {transaction.type}
                          </span>
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              isDeed ? 'text-amber-500' : 'text-blue-500'
                            )}
                          >
                            {formatDate(transaction.date)}
                          </span>
                        </div>

                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(transaction.amount)}
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-start gap-1">
                            <span className="text-foreground/50 shrink-0">{transaction.party1Type}:</span>
                            <span className="font-medium text-foreground">
                              {transaction.party1}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-foreground/50 shrink-0">{transaction.party2Type}:</span>
                            <span className="font-medium text-foreground">
                              {transaction.party2}
                            </span>
                          </div>
                          <div className="flex items-start gap-1 pt-1 border-t border-foreground/10">
                            <span className="text-foreground/50 shrink-0">Doc Type:</span>
                            <span className="font-medium text-foreground">
                              {transaction.docType}
                            </span>
                          </div>
                        </div>

                        {transaction.documentId && (
                          <div className="flex justify-end pt-1">
                            <DocumentIcon className="w-4 h-4 text-foreground/40 hover:text-foreground/70 cursor-pointer transition-colors" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* On This Page sidebar */}
      <OnThisPageSidebar sections={yearSections} className="w-48" />
    </div>
  );
}
