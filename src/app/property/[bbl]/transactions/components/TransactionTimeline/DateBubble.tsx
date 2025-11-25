import { cn } from '@/utils/cn';
import { formatDate } from './utils';

interface DateBubbleProps {
  date: string;
  isDeed: boolean;
}

export function DateBubble({ date, isDeed }: DateBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-[3px] px-3 py-1 bg-card',
        isDeed
          ? 'border-amber-500 text-amber-500'
          : 'border-blue-500 text-blue-500'
      )}
    >
      <span className="text-xs font-semibold whitespace-nowrap">
        {formatDate(date)}
      </span>
    </div>
  );
}

