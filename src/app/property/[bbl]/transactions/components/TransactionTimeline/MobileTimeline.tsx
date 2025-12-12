import { Transaction } from './types';
import { MobileTimelineItem } from './MobileTimelineItem';

interface MobileTimelineProps {
  transactions: Transaction[];
  firstTransactionOfYear: Record<string, number>;
}

export function MobileTimeline({ transactions, firstTransactionOfYear }: MobileTimelineProps) {
  return (
    <div className="xl:hidden mt-4 space-y-3">
      {transactions.map((transaction) => (
        <MobileTimelineItem
          key={transaction.id}
          transaction={transaction}
          yearMarker={firstTransactionOfYear[transaction.id]}
        />
      ))}
    </div>
  );
}

