'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { OnThisPageSidebar } from '@/components/layout/OnThisPageSidebar';
import { ClockIcon } from './icons';
import { DesktopTimeline } from './DesktopTimeline';
import { MobileTimeline } from './MobileTimeline';
import { Legend } from './Legend';
import type { Transaction } from './types';

// Re-export types for consumers

interface TransactionTimelineProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionTimeline({ transactions, className }: TransactionTimelineProps) {
  // Filter state
  const [showDeeds, setShowDeeds] = useState(true);
  const [showMortgages, setShowMortgages] = useState(true);

  // Count deeds and mortgages
  const { deedCount, mortgageCount } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.isDeed) acc.deedCount++;
        if (t.isMortgage) acc.mortgageCount++;
        return acc;
      },
      { deedCount: 0, mortgageCount: 0 }
    );
  }, [transactions]);

  // Sort and filter transactions by date (newest first) and type
  const sortedTransactions = useMemo(
    () => [...transactions]
      .filter(t => {
        if (!showDeeds && t.isDeed) return false;
        if (!showMortgages && t.isMortgage) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, showDeeds, showMortgages]
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
          {/* Legend with filters */}
          <Legend
            showDeeds={showDeeds}
            showMortgages={showMortgages}
            onToggleDeeds={() => setShowDeeds(!showDeeds)}
            onToggleMortgages={() => setShowMortgages(!showMortgages)}
            deedCount={deedCount}
            mortgageCount={mortgageCount}
          />

          {/* Timeline content */}
          {sortedTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-foreground/70">
                No transactions match the selected filters.
              </p>
            </div>
          ) : (
            <>
              <DesktopTimeline
                transactions={sortedTransactions}
                firstTransactionOfYear={firstTransactionOfYear}
              />
              <MobileTimeline
                transactions={sortedTransactions}
                firstTransactionOfYear={firstTransactionOfYear}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* On This Page sidebar */}
      <OnThisPageSidebar sections={yearSections} className="w-48" />
    </div>
  );
}

