import { cn } from '@/utils/cn';
import { formatDate } from './utils';
import type { CategoryMetadata, DocumentCategory } from './types';

interface DateBubbleProps {
  date: string;
  categoryMetadata: CategoryMetadata;
}

const categoryStyles: Record<DocumentCategory, string> = {
  deed: 'border-amber-500 text-amber-500',
  mortgage: 'border-blue-500 text-blue-500',
  'ucc-lien': 'border-red-500 text-red-500',
  other: 'border-gray-500 text-gray-500',
};

export function DateBubble({ date, categoryMetadata }: DateBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-[3px] px-3 py-1 bg-card',
        categoryStyles[categoryMetadata.key]
      )}
    >
      <span className="text-xs font-semibold whitespace-nowrap">
        {formatDate(date)}
      </span>
    </div>
  );
}

