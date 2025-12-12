'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface MobileHeaderContextValue {
  /** Content to display in the mobile header (replaces hamburger menu) */
  headerContent: ReactNode;
  /** Set the mobile header content */
  setHeaderContent: (content: ReactNode) => void;
}

const MobileHeaderContext = createContext<MobileHeaderContextValue | null>(null);

export function MobileHeaderProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);

  return (
    <MobileHeaderContext.Provider value={{ headerContent, setHeaderContent }}>
      {children}
    </MobileHeaderContext.Provider>
  );
}

export function useMobileHeader() {
  const context = useContext(MobileHeaderContext);
  if (!context) {
    throw new Error('useMobileHeader must be used within a MobileHeaderProvider');
  }
  return context;
}
