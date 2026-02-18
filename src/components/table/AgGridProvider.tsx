'use client';

// Import and register ag-Grid modules immediately when this module is imported
// This happens before React renders, ensuring modules are available
import '@/components/AgGridRegistry';

/**
 * Provider component that ensures ag-Grid modules are registered.
 * Import this component at the top level of any page that uses ag-Grid tables.
 *
 * This ensures ag-Grid is only loaded on pages that actually need it,
 * reducing bundle size for pages without tables (like the overview page).
 *
 * Module registration happens at import time (top-level side effect),
 * not during React render, so modules are available immediately.
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
  // Module registration already happened at import time
  // This component just serves as a marker/import trigger
  return null;
}
