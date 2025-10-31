'use client';

import { OnThisPageSidebar } from './OnThisPageSidebar';
import { cn } from '@/utils/cn';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface DataTabLayoutProps {
  sections: Section[];
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
    <div className={cn('space-y-6 xl:pr-64 pb-[100vh]', className)}>
      {/* On This Page Sidebar */}
      {showSidebar && <OnThisPageSidebar sections={sections} />}

      {/* Tab Content */}
      {children}
    </div>
  );
}
