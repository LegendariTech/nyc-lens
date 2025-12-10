'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardContent } from '@/components/ui/Card';
import { OnThisPageSidebar } from '@/components/layout/OnThisPageSidebar';
import { DesktopTimeline } from './DesktopTimeline';
import { MobileTimeline } from './MobileTimeline';
import { FilterLegend } from '@/components/FilterLegend';
import type { Transaction, DocumentCategory } from './types';
import { getTransactionCategory, CATEGORY_METADATA } from './utils';

// Re-export types for consumers

interface TransactionTimelineProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionTimeline({ transactions, className }: TransactionTimelineProps) {
  // Filter state - by default show only deeds and mortgages
  const [visibleCategories, setVisibleCategories] = useState<Set<DocumentCategory>>(
    new Set(['deed', 'mortgage'])
  );

  // State for showing/hiding zero amount documents (default: hide them)
  const [showZeroAmount, setShowZeroAmount] = useState(false);

  // Toggle category visibility
  const toggleCategory = (category: DocumentCategory) => {
    setVisibleCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Toggle zero amount filter
  const toggleZeroAmount = () => {
    setShowZeroAmount(prev => !prev);
  };

  // Count transactions by category (respecting the zero amount filter)
  const categoryCounts = useMemo(() => {
    return transactions
      .filter(t => {
        // Apply the same amount filter as sortedTransactions
        return showZeroAmount || (t.amount && t.amount > 0);
      })
      .reduce(
        (acc, t) => {
          const category = getTransactionCategory(t);
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {} as Record<DocumentCategory, number>
      );
  }, [transactions, showZeroAmount]);

  // Create filter data for Legend component
  const filters = useMemo(() => {
    const categories: DocumentCategory[] = ['deed', 'mortgage', 'ucc-lien', 'other'];
    return categories.map(category => ({
      category,
      isVisible: visibleCategories.has(category),
      count: categoryCounts[category] || 0,
    }));
  }, [visibleCategories, categoryCounts]);

  // Sort and filter transactions by date (newest first), category, and amount
  const sortedTransactions = useMemo(
    () => [...transactions]
      .filter(t => {
        const category = getTransactionCategory(t);
        const categoryMatch = visibleCategories.has(category);

        // Filter by amount if showZeroAmount is false
        console.log(t.amount);
        const amountMatch = showZeroAmount || (t.amount && t.amount > 0);

        return categoryMatch && amountMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, visibleCategories, showZeroAmount]
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

  // Empty state - no transactions at all
  if (transactions.length === 0) {
    return (
      <Card className={className}>
        <CardContent>
          <p className="text-sm text-foreground/70">
            No transactions found for this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex xl:gap-6">
      {/* Main timeline content */}
      <Card className={cn('flex-1 min-w-0 xl:border xl:shadow-sm border-none shadow-none', className)} role="region" aria-label="Property transaction timeline">
        <CardContent className="p-3 xl:p-6">
          {/* Legend with filters */}
          <FilterLegend
            filters={filters}
            categoryMetadata={CATEGORY_METADATA}
            onToggleCategory={toggleCategory}
            showZeroAmount={showZeroAmount}
            onToggleZeroAmount={toggleZeroAmount}
            zeroAmountLabel="Show $0 documents"
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

