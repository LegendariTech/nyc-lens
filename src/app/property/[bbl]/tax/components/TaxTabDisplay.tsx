'use client';

import { useState, useEffect } from 'react';
import { TaxTable } from './Table/TaxTable';
import { AgGridProvider } from '@/components/table/AgGridProvider';
import { transformValuationToTaxRows } from './utils';
import { AssessmentDetail } from './AssessmentDetail';
import { RawDataView } from './RawDataView';
import { TabControlsBar } from '@/components/layout';
import { Card, CardContent, Input, Select } from '@/components/ui';
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
    <>
      <AgGridProvider />
      <div className="space-y-4">
      {/* Tab Controls */}
      <TabControlsBar
        showRawViewToggle
        rawView={rawView}
        onRawViewChange={setRawView}
      >
        {rawView && (
          <div className="w-64">
            <Input
              type="text"
              size="sm"
              placeholder="Search by field name or value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              endIcon={
                <button
                  onClick={() => setSearchQuery('')}
                  className={`text-foreground/50 hover:text-foreground transition-opacity ${
                    searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-label="Clear search"
                  tabIndex={searchQuery ? 0 : -1}
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            />
          </div>
        )}
      </TabControlsBar>

      {rawView ? (
        /* Raw Data View */
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Raw Property Valuation Data
              </h3>
              <Select
                size="sm"
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-auto"
              >
                {valuationData.map((v) => (
                  <option key={v.year} value={v.year || ''}>
                    Year {v.year || 'N/A'}
                  </option>
                ))}
              </Select>
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
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Assessment Detail - Show above table */}
          {selectedValuation && (
            <AssessmentDetail valuation={selectedValuation} bbl={bbl} />
          )}

          {/* Tax History Table */}
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Property Tax History
              </h3>
              <p className="text-sm text-foreground/70 mb-4">
                Historical property valuation and tax data for BBL {bbl} ({taxRows.length} years).
                {!selectedValuation && ' Click on a row to view detailed assessment information.'}
              </p>

              <TaxTable data={taxRows} onRowClick={handleRowClick} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </>
  );
}

