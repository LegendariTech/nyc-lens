'use client';

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { RowClassParams, FilterChangedEvent } from 'ag-grid-community';
import { SideBarModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { SignedOut, SignUpButton, useAuth } from '@clerk/nextjs';
import '@/components/AgGridRegistry';
import { myTheme } from '@/components/table/theme';
import { trackEvent, debounce } from '@/utils/trackEvent';
import { EventType } from '@/types/events';
import { getCondoUnitColumnDefs } from './condoColumnDefs';
import { CondoUnitsMobileList } from './CondoUnitsMobileList';
import type { CondoUnitSummary } from '../utils';

ModuleRegistry.registerModules([AllCommunityModule, SideBarModule, ColumnsToolPanelModule]);

interface CondoUnitsPanelProps {
  condoUnits: CondoUnitSummary[];
  currentBbl: string;
  addressSegment?: string;
}

export function CondoUnitsPanel({ condoUnits, currentBbl, addressSegment }: CondoUnitsPanelProps) {
  // isLoaded is false during SSR and initial hydration, true once Clerk
  // initialises on the client.  Using it as a gate means the first render
  // always produces the "signed-out" (blurred) markup on both server and
  // client, avoiding hydration mismatches.  Once Clerk loads, the columns
  // and mobile list update to the real auth state in a single re-render.
  const { isLoaded, isSignedIn } = useAuth();
  const isAuthed = isLoaded && !!isSignedIn;

  const columnDefs = useMemo(
    () => getCondoUnitColumnDefs(isAuthed),
    [isAuthed]
  );

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
    debounce((query: string, resultCount: number, totalCount: number, bbl: string) => {
      trackEvent(EventType.CONDO_UNIT_SEARCH, {
        query,
        resultCount,
        totalCount,
        source: 'desktop',
        currentBbl: bbl,
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
        trackFilterDebounced(query, event.api.getDisplayedRowCount(), condoUnits.length, currentBbl);
      }
    },
    [trackFilterDebounced, condoUnits.length, currentBbl]
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
    () => ({ onUnitClick: handleUnitClick, addressSegment }),
    [handleUnitClick, addressSegment]
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Condo Units ({condoUnits.length})
      </h2>

      <SignedOut>
        <div className="flex items-center justify-center rounded-md border border-foreground/10 bg-foreground/5 py-3">
          <SignUpButton mode="modal">
            <button
              type="button"
              onClick={() => trackEvent(EventType.SIGN_IN_PROMPT_CLICK, { location: 'condo_units', bbl: currentBbl })}
              className="px-5 py-2.5 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-lg cursor-pointer"
            >
              Sign up for free to view
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* Desktop: ag-Grid table */}
      <div className="hidden md:block w-full relative">
        <div className="ag-theme-quartz-dark" style={{ width: '100%', height: 500 }}>
          <AgGridReact<CondoUnitSummary>
            theme={myTheme}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
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
        <CondoUnitsMobileList condoUnits={condoUnits} currentBbl={currentBbl} addressSegment={addressSegment} isSignedIn={isAuthed} />
      </div>
    </div>
  );
}
