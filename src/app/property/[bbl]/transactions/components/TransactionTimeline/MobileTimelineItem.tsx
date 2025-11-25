import { Transaction } from './types';
import { TimelineDot } from './TimelineDot';
import { MobileTransactionCard } from './MobileTransactionCard';

interface MobileTimelineItemProps {
    transaction: Transaction;
    yearMarker?: number;
}

export function MobileTimelineItem({ transaction, yearMarker }: MobileTimelineItemProps) {
    const { isDeed } = transaction;

    return (
        <div
            id={yearMarker ? `year-${yearMarker}` : undefined}
            className="flex gap-3"
        >
            {/* Timeline dot */}
            <TimelineDot isDeed={isDeed} />

            {/* Transaction card */}
            <div className="flex-1">
                <MobileTransactionCard transaction={transaction} />
            </div>
        </div>
    );
}

