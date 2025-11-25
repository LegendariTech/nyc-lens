'use client';

import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { OnThisPageSidebar } from '@/components/layout/OnThisPageSidebar';
import { ClockIcon } from './icons';
import { DesktopTimeline } from './DesktopTimeline';
import { MobileTimeline } from './MobileTimeline';
import type { Transaction } from './types';

// Re-export types for consumers

interface TransactionTimelineProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionTimeline({ transactions, className }: TransactionTimelineProps) {
  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(
    () => [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [transactions]
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

  // Empty state
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
      <Card className={cn('flex-1 min-w-0', className)} role="region" aria-label="Property transaction timeline">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500" aria-hidden="true">
            <ClockIcon className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Transaction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <DesktopTimeline
            transactions={sortedTransactions}
            firstTransactionOfYear={firstTransactionOfYear}
          />
          <MobileTimeline
            transactions={sortedTransactions}
            firstTransactionOfYear={firstTransactionOfYear}
          />
        </CardContent>
      </Card>

      {/* On This Page sidebar */}
      <OnThisPageSidebar sections={yearSections} className="w-48" />
    </div>
  );
}

