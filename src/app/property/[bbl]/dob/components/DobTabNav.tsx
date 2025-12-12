'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { cn } from '@/utils/cn';

interface DobTabNavProps {
  bbl: string;
  activeSubTab?: string;
}

export function DobTabNav({ bbl, activeSubTab }: DobTabNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Default to violations if no sub-tab is specified
  const serverTab = activeSubTab || 'violations';

  // Optimistic state - auto-syncs to serverTab when transition completes
  const [optimisticTab, setOptimisticTab] = useOptimistic(serverTab);

  const tabs = [
    { value: 'jobs-filings', label: 'Jobs' },
    { value: 'violations', label: 'Violations' },
    { value: 'permit-issuance', label: 'Permit Issuance' },
    { value: 'certificate-of-occupancy', label: 'Certificate of Occupancy' },
    { value: 'complaints', label: 'Complaints' },
  ];

  const handleTabClick = (tabValue: string) => {
    // Immediately update visual state
    setOptimisticTab(tabValue);

    const path = `/property/${bbl}/dob/${tabValue}`;
    const params = searchParams.toString();
    const fullPath = params ? `${path}?${params}` : path;

    // Wrap navigation in transition for non-blocking update
    startTransition(() => {
      router.push(fullPath, { scroll: false });
    });
  };

  return (
    <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = optimisticTab === tab.value;
        const isLoading = isPending && isActive && serverTab !== tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'whitespace-nowrap rounded-sm px-3 py-1.5',
              'text-sm font-medium transition-all',
              'cursor-pointer shrink-0',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
            )}
          >
            {isLoading && (
              <svg
                className="size-3 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
