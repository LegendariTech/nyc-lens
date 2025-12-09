"use client";

import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { RowHeightParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { myTheme } from '@/components/table/theme';
import { ownerContactsColumnDefs } from './columnDefs';
import type { OwnerContactRow } from './types';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule]);

interface ContactsTableProps {
    data: OwnerContactRow[];
}

export function ContactsTable({ data }: ContactsTableProps) {
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

        const baseHeight = 25; // Base height for single item
        const heightPerItem = 20; // Height per additional item (address or phone)

        // Count addresses (split by newlines)
        let addressCount = 0;
        const address = row.owner_address;
        if (address) {
            const addressLines = address.split('\n').filter(line => line && line.trim());
            addressCount = addressLines.length;
        }

        // Count phones (split by newlines)
        let phoneCount = 0;
        const phone = row.owner_phone || row.owner_phone_2;
        if (phone) {
            const phoneLines = phone.split('\n').filter(line => line && line.trim());
            phoneCount = phoneLines.length;
        }

        // Use the maximum count (addresses or phones) to determine height
        const maxItemCount = Math.max(addressCount, phoneCount, 1); // At least 1 for empty cells

        // Calculate height: baseHeight + (itemCount * heightPerItem)
        // For 1 item: 25 + (1 * 20) = 45px
        // For 6 items: 25 + (6 * 20) = 145px
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
                    columnDefs={ownerContactsColumnDefs}
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
