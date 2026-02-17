'use client';

import { useEffect } from 'react';

/**
 * Provider component that registers ag-Grid modules when mounted.
 * Import this component at the top level of any page that uses ag-Grid tables.
 *
 * This ensures ag-Grid is only loaded on pages that actually need it,
 * reducing bundle size for pages without tables (like the overview page).
 *
 * Usage in a page component:
 * ```tsx
 * import { AgGridProvider } from '@/components/table/AgGridProvider';
 *
 * export default function MyPage() {
 *   return (
 *     <>
 *       <AgGridProvider />
 *       <MyTableComponent />
 *     </>
 *   );
 * }
 * ```
 */
export function AgGridProvider() {
  useEffect(() => {
    // Dynamically import and register ag-Grid modules only when this component mounts
    import('@/components/AgGridRegistry').then(() => {
      // Module registration happens as a side effect of importing AgGridRegistry
    });
  }, []);

  return null;
}
