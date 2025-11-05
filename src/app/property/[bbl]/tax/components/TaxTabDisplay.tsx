'use client';

import { useState, useEffect } from 'react';
import { TaxTable } from './Table/TaxTable';
import { transformValuationToTaxRows } from './utils';
import { AssessmentDetail } from './AssessmentDetail';
import { RawDataView } from './RawDataView';
import { TabControlsBar } from '@/components/layout';
import type { PropertyValuation } from '@/types/valuation';

interface TaxTabDisplayProps {
  valuationData: PropertyValuation[];
  bbl: string;
}

export function TaxTabDisplay({ valuationData, bbl }: TaxTabDisplayProps) {
  // Set latest year as default
  const latestYear = valuationData.length > 0 ? valuationData[0].year : null;
  const [selectedYear, setSelectedYear] = useState<string | null>(latestYear);
  const [rawView, setRawView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update selected year when data changes or when switching to raw view
  useEffect(() => {
    if (latestYear && !selectedYear) {
      setSelectedYear(latestYear);
    }
  }, [latestYear, selectedYear]);

  // When switching to raw view, ensure a year is selected
  useEffect(() => {
    if (rawView && !selectedYear && latestYear) {
      setSelectedYear(latestYear);
    }
  }, [rawView, selectedYear, latestYear]);

  const taxRows = transformValuationToTaxRows(valuationData);
  const selectedValuation = selectedYear
    ? valuationData.find(v => v.year === selectedYear)
    : null;

  const handleRowClick = (year: string) => {
    setSelectedYear(year === selectedYear ? null : year);
  };

  return (
    <div className="space-y-4">
      {/* Tab Controls */}
      <TabControlsBar
        showRawViewToggle
        rawView={rawView}
        onRawViewChange={setRawView}
      >
        {rawView && (
          <div className="relative flex items-center h-full">
            <input
              type="text"
              placeholder="Search by field name or value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-8 px-3 py-0 text-sm border border-foreground/20 rounded-md bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                aria-label="Clear search"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </TabControlsBar>

      {rawView ? (
        /* Raw Data View */
        <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Raw Property Valuation Data
            </h3>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 text-sm border border-foreground/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {valuationData.map((v) => (
                <option key={v.year} value={v.year || ''}>
                  Year {v.year || 'N/A'}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-foreground/70 mb-4">
            Complete raw property valuation data from the database for BBL {bbl}.
            {searchQuery && ` Filtering by: "${searchQuery}"`}
          </p>
          {selectedValuation ? (
            <RawDataView data={[selectedValuation]} searchQuery={searchQuery} />
          ) : (
            <div className="text-center py-8 text-foreground/60">
              Please select a year to view raw data
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Assessment Detail - Show above table */}
          {selectedValuation && (
            <AssessmentDetail valuation={selectedValuation} bbl={bbl} />
          )}

          {/* Tax History Table */}
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Property Tax History
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              Historical property valuation and tax data for BBL {bbl} ({taxRows.length} years).
              {!selectedValuation && ' Click on a row to view detailed assessment information.'}
            </p>

            <TaxTable data={taxRows} onRowClick={handleRowClick} />
          </div>
        </>
      )}
    </div>
  );
}

