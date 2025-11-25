import { cn } from '@/utils/cn';

interface TimelineDotProps {
    isDeed: boolean;
}

export function TimelineDot({ isDeed }: TimelineDotProps) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    'w-3 h-3 rounded-full border-2',
                    isDeed
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-blue-500 bg-blue-500'
                )}
            />
            <div className="w-0.5 flex-1 bg-foreground/20 mt-2" />
        </div>
    );
}

