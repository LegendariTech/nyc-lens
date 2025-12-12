import { PropertyAutocomplete } from '@/components/search/PropertyAutocomplete';
import { PropertyTabsNav } from './PropertyTabsNav';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PropertyPageLayoutProps {
  bbl: string;
  activeTab: string;
  address?: string;
  maxWidth?: 'xl' | 'full';
  children: ReactNode;
}

export function PropertyPageLayout({ bbl, activeTab, address, maxWidth = 'xl', children }: PropertyPageLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto scroll-container focus:outline-none" tabIndex={-1}>
      {/* Search Header - hidden on mobile (search is in top nav bar) */}
      <div className="hidden md:block sticky top-0 z-50 border-b border-foreground/20 bg-background py-3 px-4">
        <div className={cn(maxWidth === 'xl' ? 'max-w-screen-xl' : 'w-full')}>
          <PropertyAutocomplete compact initialValue={address || ''} autoFocus={false} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className={cn('space-y-4', maxWidth === 'xl' ? 'max-w-screen-xl' : 'w-full')}>
          {/* Tabs Navigation */}
          <PropertyTabsNav activeTab={activeTab} bbl={bbl} />

          {/* Tab Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

