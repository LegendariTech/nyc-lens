import { cn } from '@/utils/cn';
import { Transaction } from './types';
import { formatCurrency, getCategoryMetadata } from './utils';
import { DocumentIcon } from './icons';
import { useState } from 'react';
import { PartyDetailsDialog } from './PartyDetailsDialog';

interface TransactionCardProps {
    transaction: Transaction;
}

interface PartyListProps {
    parties: string[];
}

function PartyList({ parties }: PartyListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (parties.length <= 1) {
        return (
            <div className="font-medium text-foreground flex flex-col">
                {parties.map((name, index) => (
                    <span key={index}>{name}</span>
                ))}
            </div>
        );
    }

    return (
        <div className="font-medium text-foreground">
            <div className="flex flex-wrap items-center gap-1">
                <span>{parties[0]}</span>
                <button
                    // prevent default click event
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-foreground/60 hover:text-foreground transition-colors text-xs cursor-pointer"
                    type="button"
                >
                    {isExpanded ? '- show less' : `+ ${parties.length - 1} more`}
                </button>
            </div>
            {isExpanded && (
                <div className="flex flex-col mt-1">
                    {parties.slice(1).map((name, index) => (
                        <span key={index + 1}>{name}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const categoryMetadata = getCategoryMetadata(transaction);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't open dialog if clicking on the document link
        if ((e.target as HTMLElement).closest('a')) {
            return;
        }
        setDialogOpen(true);
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className={cn(
                    'relative w-full max-w-md rounded-lg border bg-card p-3 shadow-md cursor-pointer',
                    'hover:shadow-lg hover:border-foreground/20 transition-all',
                    `${categoryMetadata.borderColor}/40`
                )}
            >
                <div className="space-y-2">
                    {/* Header with badge and amount */}
                    <div className="flex items-center justify-between gap-2">
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border',
                                categoryMetadata.key === 'deed'
                                    ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                                    : categoryMetadata.key === 'mortgage'
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : categoryMetadata.key === 'ucc-lien'
                                            ? 'border-red-500/50 text-red-500 bg-red-500/10'
                                            : 'border-gray-500/50 text-gray-500 bg-gray-500/10'
                            )}
                        >
                            {transaction.type}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                            {formatCurrency(transaction.amount)}
                        </span>
                    </div>

                    {/* Party information - for deeds, show buyer (party2) first */}
                    <div className="space-y-1 text-[11px]">
                        <div className="flex items-start gap-1">
                            <span className="text-foreground/50 shrink-0">
                                {transaction.isDeed ? transaction.party2Type : transaction.party1Type}:
                            </span>
                            <PartyList parties={transaction.isDeed ? transaction.party2 : transaction.party1} />
                        </div>
                        <div className="flex items-start gap-1">
                            <span className="text-foreground/50 shrink-0">
                                {transaction.isDeed ? transaction.party1Type : transaction.party2Type}:
                            </span>
                            <PartyList parties={transaction.isDeed ? transaction.party1 : transaction.party2} />
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

            {/* Party Details Dialog */}
            <PartyDetailsDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                parties={transaction.partyDetails || []}
                transactionType={transaction.type}
                transactionDate={transaction.date}
            />
        </>
    );
}

