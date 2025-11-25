import { cn } from '@/utils/cn';
import { Transaction } from './types';
import { formatCurrency, formatDate } from './utils';
import { DocumentIcon } from './icons';

interface MobileTransactionCardProps {
  transaction: Transaction;
}

export function MobileTransactionCard({ transaction }: MobileTransactionCardProps) {
  const isDeed = transaction.type === 'DEED';

  return (
    <div className="flex-1 pb-4">
      <div
        className={cn(
          'relative rounded-lg border bg-card p-3 shadow-md',
          isDeed ? 'border-amber-500/40' : 'border-blue-500/40'
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase border',
                isDeed
                  ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                  : 'bg-blue-500 text-white border-blue-500'
              )}
            >
              {transaction.type}
            </span>
            <span
              className={cn(
                'text-xs font-semibold',
                isDeed ? 'text-amber-500' : 'text-blue-500'
              )}
            >
              {formatDate(transaction.date)}
            </span>
          </div>

          <div className="text-lg font-bold text-foreground">
            {formatCurrency(transaction.amount)}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-start gap-1">
              <span className="text-foreground/50 shrink-0">{transaction.party1Type}:</span>
              <span className="font-medium text-foreground">
                {transaction.party1}
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-foreground/50 shrink-0">{transaction.party2Type}:</span>
              <span className="font-medium text-foreground">
                {transaction.party2}
              </span>
            </div>
            <div className="flex items-start gap-1 pt-1 border-t border-foreground/10">
              <span className="text-foreground/50 shrink-0">Doc Type:</span>
              <span className="font-medium text-foreground">
                {transaction.docType}
              </span>
            </div>
          </div>
        </div>

        {/* Document icon - positioned absolutely at bottom right */}
        {transaction.documentId && (
          <a
            href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${transaction.documentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 p-1 rounded hover:bg-foreground/10 transition-colors group"
            title="View ACRIS Document"
            aria-label={`View ACRIS document ${transaction.documentId} for this ${transaction.type.toLowerCase()} transaction`}
          >
            <DocumentIcon className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors" />
          </a>
        )}
      </div>
    </div>
  );
}

