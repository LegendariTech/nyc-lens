import { Transaction } from './types';
import { TimelineDot } from './TimelineDot';
import { MobileTransactionCard } from './MobileTransactionCard';

interface MobileTimelineItemProps {
    transaction: Transaction;
    yearMarker?: number;
}

export function MobileTimelineItem({ transaction, yearMarker }: MobileTimelineItemProps) {
    const isDeed = transaction.type === 'DEED';

    return (
        <div className="flex gap-3">
            {/* Year marker for mobile */}
            {yearMarker && (
                <div id={`year-${yearMarker}-mobile`} className="sr-only" />
            )}

            {/* Timeline dot */}
            <TimelineDot isDeed={isDeed} />

            {/* Transaction card */}
            <MobileTransactionCard transaction={transaction} />
        </div>
    );
}

