'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface DobTabNavProps {
  bbl: string;
  activeSubTab?: string;
}

export function DobTabNav({ bbl, activeSubTab }: DobTabNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default to violations-dob-now if no sub-tab is specified
  const currentTab = activeSubTab || 'violations-dob-now';

  const handleTabClick = (value: string) => {
    // Build path-based URL with subtab
    const newPath = `/property/${bbl}/dob/${value}`;

    // Preserve search params (like address)
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;

    // Update URL
    router.push(fullPath, { scroll: false });
  };

  const tabs = [
    { value: 'violations-dob-now', label: 'Violations: DOB Now' },
    { value: 'violations-bis', label: 'Violations: BIS' },
    { value: 'permit-issuance', label: 'Permit Issuance' },
    { value: 'certificate-of-occupancy', label: 'Certificate of Occupancy' },
    { value: 'complaints', label: 'Complaints' },
  ];

  return (
    <div className="inline-flex h-10 items-center justify-start gap-1 rounded-md bg-foreground/5 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`
            inline-flex items-center justify-center gap-2
            whitespace-nowrap rounded-sm px-3 py-1.5
            text-sm font-medium transition-all
            cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${currentTab === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

