import { Transaction } from './types';
import { MobileTransactionCard } from './MobileTransactionCard';

interface MobileTimelineItemProps {
    transaction: Transaction;
    yearMarker?: number;
}

export function MobileTimelineItem({ transaction, yearMarker }: MobileTimelineItemProps) {
    return (
        <div
            id={yearMarker ? `year-${yearMarker}` : undefined}
        >
            {/* Transaction card - full width */}
            <MobileTransactionCard transaction={transaction} />
        </div>
    );
}

