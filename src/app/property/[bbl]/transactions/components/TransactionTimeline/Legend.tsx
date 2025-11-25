import { cn } from '@/utils/cn';

interface LegendProps {
  showDeeds: boolean;
  showMortgages: boolean;
  onToggleDeeds: () => void;
  onToggleMortgages: () => void;
  deedCount: number;
  mortgageCount: number;
}

export function Legend({
  showDeeds,
  showMortgages,
  onToggleDeeds,
  onToggleMortgages,
  deedCount,
  mortgageCount,
}: LegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-foreground/10">
      <span className="text-sm font-medium text-foreground/70">Filter:</span>
      
      {/* Deeds toggle */}
      <button
        onClick={onToggleDeeds}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          'border hover:shadow-sm',
          showDeeds
            ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/60'
        )}
        aria-pressed={showDeeds}
        aria-label={`${showDeeds ? 'Hide' : 'Show'} deeds`}
      >
        <span
          className={cn(
            'w-3 h-3 rounded-full border-2',
            showDeeds
              ? 'border-amber-500 bg-amber-500'
              : 'border-foreground/30 bg-transparent'
          )}
          aria-hidden="true"
        />
        <span>Deeds</span>
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded',
          showDeeds ? 'bg-amber-500/20' : 'bg-foreground/10'
        )}>
          {deedCount}
        </span>
      </button>

      {/* Mortgages toggle */}
      <button
        onClick={onToggleMortgages}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          'border hover:shadow-sm',
          showMortgages
            ? 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400'
            : 'border-foreground/20 bg-foreground/5 text-foreground/40 hover:text-foreground/60'
        )}
        aria-pressed={showMortgages}
        aria-label={`${showMortgages ? 'Hide' : 'Show'} mortgages`}
      >
        <span
          className={cn(
            'w-3 h-3 rounded-full border-2',
            showMortgages
              ? 'border-blue-500 bg-blue-500'
              : 'border-foreground/30 bg-transparent'
          )}
          aria-hidden="true"
        />
        <span>Mortgages</span>
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded',
          showMortgages ? 'bg-blue-500/20' : 'bg-foreground/10'
        )}>
          {mortgageCount}
        </span>
      </button>
    </div>
  );
}

