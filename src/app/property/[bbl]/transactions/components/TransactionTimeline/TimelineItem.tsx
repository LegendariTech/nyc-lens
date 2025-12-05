import { Transaction } from './types';
import { DateBubble } from './DateBubble';
import { TransactionCard } from './TransactionCard';
import { ConnectorLine } from './ConnectorLine';
import { TIMELINE_CONFIG } from './constants';
import { getCategoryMetadata } from './utils';

interface TimelineItemProps {
    transaction: Transaction;
    yearMarker?: number;
}

export function TimelineItem({ transaction, yearMarker }: TimelineItemProps) {
    const categoryMetadata = getCategoryMetadata(transaction);

    return (
        <div
            id={yearMarker ? `year-${yearMarker}` : undefined}
            className="relative flex items-center"
            style={{ minHeight: `${TIMELINE_CONFIG.ITEM_MIN_HEIGHT}px` }}
        >
            {/* Date bubble - positioned so the vertical line goes through its center */}
            <div
                className="relative flex items-center justify-center shrink-0"
                style={{ width: `${TIMELINE_CONFIG.DATE_BUBBLE_WIDTH}px` }}
            >
                <DateBubble date={transaction.date} categoryMetadata={categoryMetadata} />
            </div>

            {/* Connector line - connected to middle of card */}
            <div className="-ml-1 flex items-center">
                <ConnectorLine categoryMetadata={categoryMetadata} />
            </div>

            {/* Transaction card */}
            <div className="flex-1 min-w-0 pr-4">
                <TransactionCard transaction={transaction} />
            </div>
        </div>
    );
}

