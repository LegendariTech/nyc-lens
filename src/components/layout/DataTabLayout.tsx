'use client';

import { OnThisPageSidebar } from './OnThisPageSidebar';
import { cn } from '@/utils/cn';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface DataTabLayoutProps {
  sections?: Section[];
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function DataTabLayout({
  sections,
  children,
  showSidebar = true,
  className
}: DataTabLayoutProps) {
  return (
    <div className={cn(
      'grid gap-6 pb-[100vh]',
      showSidebar && sections ? 'xl:grid-cols-[1fr_256px]' : 'grid-cols-1',
      className
    )}>
      {/* Tab Content */}
      <div className="space-y-4 min-w-0">
        {children}
      </div>

      {/* On This Page Sidebar */}
      {showSidebar && sections && <OnThisPageSidebar sections={sections} />}
    </div>
  );
}
