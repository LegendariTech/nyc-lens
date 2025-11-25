import { cn } from '@/utils/cn';
import { Transaction } from './types';
import { formatCurrency } from './utils';
import { DocumentIcon } from './icons';

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const { isDeed } = transaction;

    return (
        <div
            className={cn(
                'relative w-full max-w-md rounded-lg border bg-card p-3 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]',
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
            </div>

            {/* Document icon - positioned absolutely at bottom right */}
            {transaction.documentId && (
                <a
                    href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${transaction.documentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-1 right-2 p-1 rounded hover:bg-foreground/10 transition-colors group"
                    title="View ACRIS Document"
                    aria-label={`View ACRIS document ${transaction.documentId} for this ${transaction.type.toLowerCase()} transaction`}
                >
                    <DocumentIcon className="w-4 h-4 text-foreground/60 group-hover:text-foreground transition-colors" />
                </a>
            )}
        </div>
    );
}

