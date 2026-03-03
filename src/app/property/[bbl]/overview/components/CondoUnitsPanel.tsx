'use client';

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { RowClassParams, FilterChangedEvent } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import '@/components/AgGridRegistry';
import { myTheme } from '@/components/table/theme';
import { trackEvent, debounce } from '@/utils/trackEvent';
import { EventType } from '@/types/events';
import { condoUnitColumnDefs } from './condoColumnDefs';
import { CondoUnitsMobileList } from './CondoUnitsMobileList';
import type { CondoUnitSummary } from '../utils';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule]);

interface CondoUnitsPanelProps {
  condoUnits: CondoUnitSummary[];
  currentBbl: string;
}

export function CondoUnitsPanel({ condoUnits, currentBbl }: CondoUnitsPanelProps) {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  const getRowClass = useCallback(
    (params: RowClassParams<CondoUnitSummary>) =>
      params.data?.bbl === currentBbl ? 'current-condo-unit' : undefined,
    [currentBbl]
  );

  const trackFilterDebounced = useRef(
    debounce((query: string, resultCount: number, totalCount: number) => {
      trackEvent(EventType.CONDO_UNIT_SEARCH, {
        query,
        resultCount,
        totalCount,
        source: 'desktop',
        currentBbl,
      });
    }, 1500)
  ).current;

  useEffect(() => {
    return () => { trackFilterDebounced.cancel(); };
  }, [trackFilterDebounced]);

  const onFilterChanged = useCallback(
    (event: FilterChangedEvent<CondoUnitSummary>) => {
      const filterModel = event.api.getFilterModel();
      const unitFilter = filterModel?.unit;
      const query = unitFilter?.filter as string | undefined;
      if (query && query.length >= 2) {
        trackFilterDebounced(query, event.api.getDisplayedRowCount(), condoUnits.length);
      }
    },
    [trackFilterDebounced, condoUnits.length]
  );

  const handleUnitClick = useCallback(
    (unit: CondoUnitSummary) => {
      trackEvent(EventType.CONDO_UNIT_CLICK, {
        targetBbl: unit.bbl,
        targetUnit: unit.unit,
        currentBbl,
        source: 'desktop',
      });
    },
    [currentBbl]
  );

  const gridContext = useMemo(
    () => ({ onUnitClick: handleUnitClick }),
    [handleUnitClick]
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Condo Units ({condoUnits.length})
      </h2>

      {/* Desktop: ag-Grid table */}
      <div className="hidden md:block w-full relative">
        <style dangerouslySetInnerHTML={{
          __html: `
          .ag-theme-quartz-dark .current-condo-unit {
            background-color: rgba(245, 158, 11, 0.15) !important;
          }
          .ag-theme-quartz-dark .ag-cell {
            user-select: text !important;
            -webkit-user-select: text !important;
          }
        `}} />
        <div className="ag-theme-quartz-dark" style={{ width: '100%', height: 500 }}>
          <AgGridReact<CondoUnitSummary>
            theme={myTheme}
            defaultColDef={defaultColDef}
            columnDefs={condoUnitColumnDefs}
            rowData={condoUnits}
            getRowClass={getRowClass}
            context={gridContext}
            onFilterChanged={onFilterChanged}
            enableCellTextSelection={true}
            suppressCellFocus={true}
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

      {/* Mobile: searchable list */}
      <div className="md:hidden">
        <CondoUnitsMobileList condoUnits={condoUnits} currentBbl={currentBbl} />
      </div>
    </div>
  );
}
