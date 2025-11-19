'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';

interface DobTabNavProps {
  bbl: string;
  activeSubTab?: string;
}

export function DobTabNav({ bbl, activeSubTab }: DobTabNavProps) {
  const searchParams = useSearchParams();

  // Default to violations if no sub-tab is specified
  const currentTab = activeSubTab || 'violations';

  const tabs = [
    { value: 'jobs-filings', label: 'Jobs' },
    { value: 'violations', label: 'Violations' },
    { value: 'permit-issuance', label: 'Permit Issuance' },
    { value: 'certificate-of-occupancy', label: 'Certificate of Occupancy' },
    { value: 'complaints', label: 'Complaints' },
  ];

  // Helper to build URL with preserved search params
  const buildUrl = (tabValue: string) => {
    const path = `/property/${bbl}/dob/${tabValue}`;
    const params = searchParams.toString();
    return params ? `${path}?${params}` : path;
  };

  return (
    <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.value;

        return (
          <Link
            key={tab.value}
            href={buildUrl(tab.value)}
            scroll={false}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'whitespace-nowrap rounded-sm px-3 py-1.5',
              'text-sm font-medium transition-all',
              'cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
