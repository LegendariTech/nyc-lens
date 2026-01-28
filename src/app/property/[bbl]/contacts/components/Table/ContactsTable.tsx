"use client";

import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { RowHeightParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule, SetFilterModule } from 'ag-grid-enterprise';
import { myTheme } from '@/components/table/theme';
import { getOwnerContactsColumnDefs } from './columnDefs';
import type { OwnerContactRow } from './types';
import type { SourceCategory } from '../../constants/sourceCategories';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule, SetFilterModule]);

interface ContactsTableProps {
    data: OwnerContactRow[];
    visibleSources?: Set<SourceCategory>;
}

export function ContactsTable({ data, visibleSources }: ContactsTableProps) {
    const columnDefs = useMemo(
        () => getOwnerContactsColumnDefs(visibleSources),
        [visibleSources]
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            resizable: true,
            filter: false,
        }),
        []
    );

    // Calculate row height based on number of items (addresses/phones) in cells
    // For 6 addresses, target height is ~145px
    // Formula: baseHeight + (itemCount * heightPerItem)
    // For 6 items = 145px: baseHeight + (6 * heightPerItem) = 145
    // Using baseHeight = 25px, heightPerItem = 20px: 25 + (6 * 20) = 145px
    const getRowHeight = useCallback((params: RowHeightParams<OwnerContactRow>): number => {
        const row = params.data;
        if (!row) return 42; // Default row height

        const baseHeight = 30; // Base height for single item
        const heightPerItem = 24; // Height per additional item (address, phone, or business name)

        // Count addresses
        let addressCount = 0;
        const address = row.owner_full_address as string | string[] | null;
        if (address) {
            if (typeof address === 'string') {
                const addressLines = address.split('\n').filter((line: string) => line && line.trim());
                addressCount = addressLines.length;
            } else if (Array.isArray(address)) {
                addressCount = address.filter(addr => addr && addr.trim()).length;
            }
        }

        // Count phones
        let phoneCount = 0;
        const phone = row.owner_phone as string | string[] | null;
        if (phone && typeof phone === 'string') {
            const phoneLines: string[] = phone.split('\n').filter((line: string) => line && line.trim());
            phoneCount = phoneLines.length;
        }

        // Count full names
        let fullNameCount = 0;
        const fullName = row.owner_full_name as string | string[] | null;
        if (fullName) {
            if (typeof fullName === 'string') {
                const fullNameLines: string[] = fullName.split('\n').filter((line: string) => line && line.trim());
                fullNameCount = fullNameLines.length;
            } else if (Array.isArray(fullName)) {
                fullNameCount = fullName.filter(name => name && name.trim()).length;
            }
        }

        // Count business names
        let businessNameCount = 0;
        const businessName = row.owner_business_name as string | string[] | null;
        if (businessName && typeof businessName === 'string') {
            const businessNameLines: string[] = businessName.split('\n').filter((line: string) => line && line.trim());
            businessNameCount = businessNameLines.length;
        }

        // Use the maximum count (addresses, phones, full names, or business names) to determine height
        const maxItemCount = Math.max(addressCount, phoneCount, fullNameCount, businessNameCount, 1); // At least 1 for empty cells

        // Calculate height: baseHeight + (itemCount * heightPerItem)
        // For 1 item: 30 + (1 * 24) = 54px
        // For 6 items: 30 + (6 * 24) = 174px
        const calculatedHeight = baseHeight + (maxItemCount * heightPerItem);

        return calculatedHeight;
    }, []);

    return (
        <div className="w-full relative">
            <style dangerouslySetInnerHTML={{
                __html: `
        .ag-theme-quartz-dark .ag-cell {
          display: flex !important;
          align-items: flex-start !important;
          vertical-align: top !important;
        }
        .ag-theme-quartz-dark .category-cell {
          display: flex !important;
          align-items: flex-start !important;
          justify-content: center !important;
          padding-top: 8px !important;
          padding-bottom: 0 !important;
        }
        .ag-theme-quartz-dark .multiline-cell {
          line-height: 1.5 !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
          white-space: pre-line !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
        }
        .contacts-ag-grid {
          width: 100% !important;
          max-width: none !important;
        }
      `}} />
            <div className="ag-theme-quartz-dark contacts-ag-grid" style={{ width: '100%', maxWidth: 'none' }}>
                <AgGridReact<OwnerContactRow>
                    theme={myTheme}
                    domLayout="autoHeight"
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    rowData={data}
                    suppressCellFocus={true}
                    getRowHeight={getRowHeight}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 25, 50, 100]}
                    sideBar={{
                        toolPanels: [
                            {
                                id: 'columns',
                                labelDefault: 'Columns',
                                labelKey: 'columns',
                                iconKey: 'columns',
                                toolPanel: 'agColumnsToolPanel',
                                toolPanelParams: {
                                    suppressRowGroups: true,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true,
                                },
                            },
                        ],
                        defaultToolPanel: '',
                    }}
                />
            </div>
        </div>
    );
}
