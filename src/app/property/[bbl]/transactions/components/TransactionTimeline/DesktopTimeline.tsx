import { Transaction } from './types';
import { TimelineItem } from './TimelineItem';
import { TimelineAxis } from './TimelineAxis';
import { TIMELINE_CONFIG } from './constants';

interface DesktopTimelineProps {
    transactions: Transaction[];
    firstTransactionOfYear: Record<string, number>;
}

export function DesktopTimeline({ transactions, firstTransactionOfYear }: DesktopTimelineProps) {
    return (
        <div className="hidden xl:block py-8">
            {/* Timeline with flexbox layout */}
            <div className="relative">
                {/* Vertical timeline axis */}
                <TimelineAxis />

                {/* Timeline items */}
                <div className="space-y-8">
                    {transactions.map((transaction) => (
                        <TimelineItem
                            key={transaction.id}
                            transaction={transaction}
                            yearMarker={firstTransactionOfYear[transaction.id]}
                        />
                    ))}

                    {/* Bottom spacer to allow scrolling last item to top */}
                    <div style={{ height: TIMELINE_CONFIG.BOTTOM_SPACER_HEIGHT }} />
                </div>
            </div>
        </div>
    );
}

