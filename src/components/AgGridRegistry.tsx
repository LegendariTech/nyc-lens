'use client';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import {
    MasterDetailModule,
    ServerSideRowModelModule,
    SetFilterModule,
    ColumnMenuModule,
    ContextMenuModule,
    SideBarModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    LicenseManager
} from 'ag-grid-enterprise';

// Set AG Grid Enterprise license immediately
LicenseManager.setLicenseKey('Using_this_{AG_Grid}_Enterprise_key_{AG-073142}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Tyler_Technologies}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Socrata}_only_for_{38}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_{Socrata}_need_to_be_licensed___{Socrata}_has_been_granted_a_Deployment_License_Add-on_for_{2}_Production_Environments___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{14_July_2026}____[v3]_[01]_MTc4Mzk4MzYwMDAwMA==953dd63b704319b712726e8a48b3898f');

// Register all community and enterprise modules immediately
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

/**
 * Component to register AG Grid modules at the application root level.
 * This ensures all AG Grid features are available throughout the app.
 *
 * Note: Module registration now happens immediately when this module is imported,
 * not when the component mounts, to avoid timing issues.
 */
export function AgGridRegistry() {
    return null;
}

