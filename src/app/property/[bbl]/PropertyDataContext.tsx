'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PlutoData } from '@/data/pluto';
import type { AcrisRecord } from '@/types/acris';

interface PropertyDataContextValue {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  bbl: string;
}

const PropertyDataContext = createContext<PropertyDataContextValue | null>(null);

interface PropertyDataProviderProps {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  bbl: string;
  children: ReactNode;
}

/**
 * Client Component that provides shared property data (PLUTO & ACRIS) to all pages
 * within the [bbl] route via React Context.
 *
 * This prevents duplicate fetches - the layout fetches once, and all pages can access the data.
 */
export function PropertyDataProvider({
  plutoData,
  propertyData,
  bbl,
  children,
}: PropertyDataProviderProps) {
  return (
    <PropertyDataContext.Provider value={{ plutoData, propertyData, bbl }}>
      {children}
    </PropertyDataContext.Provider>
  );
}

/**
 * Hook to access shared property data from the PropertyDataProvider.
 * Must be used within a Client Component that's a descendant of PropertyDataProvider.
 *
 * @throws {Error} If used outside PropertyDataProvider
 */
export function usePropertyData() {
  const context = useContext(PropertyDataContext);
  if (!context) {
    throw new Error('usePropertyData must be used within PropertyDataProvider');
  }
  return context;
}
