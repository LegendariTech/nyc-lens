import { PropertyAutocomplete } from '@/components/search/PropertyAutocomplete';
import { PropertyTabsNav } from './PropertyTabsNav';
import { ReactNode } from 'react';

interface PropertyPageLayoutProps {
  bbl: string;
  activeTab: string;
  address?: string;
  children: ReactNode;
}

export function PropertyPageLayout({ bbl, activeTab, address, children }: PropertyPageLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto scroll-container focus:outline-none" tabIndex={-1}>
      {/* Search Header */}
      <div className="sticky top-0 z-50 border-b border-foreground/20 bg-background py-3 px-6">
        <div className="mx-auto max-w-screen-xl">
          <PropertyAutocomplete compact initialValue={address || ''} autoFocus={false} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-screen-xl space-y-6">
          {/* Tabs Navigation */}
          <PropertyTabsNav activeTab={activeTab} bbl={bbl} />

          {/* Tab Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

