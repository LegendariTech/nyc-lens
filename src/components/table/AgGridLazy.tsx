'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import type { AgGridReactProps } from 'ag-grid-react';

/**
 * Lazy-loaded ag-Grid wrapper that only loads ag-Grid modules when needed.
 * This prevents ag-Grid from being bundled on pages that don't use tables.
 *
 * Usage:
 * ```tsx
 * import { AgGridLazy } from '@/components/table/AgGridLazy';
 *
 * <AgGridLazy
 *   columnDefs={columnDefs}
 *   rowData={rowData}
 *   // ... other ag-Grid props
 * />
 * ```
 */
export function AgGridLazy(props: AgGridReactProps) {
  const [AgGridReact, setAgGridReact] = useState<ComponentType<AgGridReactProps> | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Dynamically import ag-Grid modules and register them
    Promise.all([
      import('ag-grid-react'),
      import('ag-grid-community'),
      import('ag-grid-enterprise'),
    ]).then(([
      { AgGridReact: AgGridReactComponent },
      { ModuleRegistry, AllCommunityModule },
      {
        MasterDetailModule,
        ServerSideRowModelModule,
        SetFilterModule,
        ColumnMenuModule,
        ContextMenuModule,
        SideBarModule,
        ColumnsToolPanelModule,
        FiltersToolPanelModule,
        LicenseManager,
      },
    ]) => {
      if (!mounted) return;

      // Set license key (only once)
      if (!isRegistered) {
        LicenseManager.setLicenseKey('Using_this_{AG_Grid}_Enterprise_key_{AG-073142}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Tyler_Technologies}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Socrata}_only_for_{38}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_{Socrata}_need_to_be_licensed___{Socrata}_has_been_granted_a_Deployment_License_Add-on_for_{2}_Production_Environments___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{14_July_2026}____[v3]_[01]_MTc4Mzk4MzYwMDAwMA==953dd63b704319b712726e8a48b3898f');

        // Register all modules
        ModuleRegistry.registerModules([
          AllCommunityModule,
          MasterDetailModule,
          ServerSideRowModelModule,
          SetFilterModule,
          ColumnMenuModule,
          ContextMenuModule,
          SideBarModule,
          ColumnsToolPanelModule,
          FiltersToolPanelModule,
        ]);

        setIsRegistered(true);
      }

      setAgGridReact(() => AgGridReactComponent);
    });

    return () => {
      mounted = false;
    };
  }, [isRegistered]);

  if (!AgGridReact) {
    return (
      <div className="flex items-center justify-center h-96 bg-foreground/5 rounded-md">
        <div className="text-sm text-foreground/70">Loading table...</div>
      </div>
    );
  }

  return <AgGridReact {...props} />;
}
