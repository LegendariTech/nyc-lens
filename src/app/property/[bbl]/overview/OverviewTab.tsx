'use client';

import { Card, CardContent } from '@/components/ui';
import { getBuildingClassCategory } from '@/constants/building';
import { PlutoData } from '@/data/pluto';
import { AcrisRecord } from '@/types/acris';
import { DocumentWithParties } from '@/data/acris';
import { TransactionTimeline, Transaction } from './components/TransactionTimeline';

interface OverviewTabProps {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  transactions: DocumentWithParties[];
  error?: string;
  bbl?: string;
}

function formatNumber(value: number | string | boolean | null | undefined, options?: { decimals?: number; treatZeroAsNull?: boolean }): string {
  if (value === null || value === undefined || typeof value === 'boolean') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  if (options?.treatZeroAsNull && num === 0) return '—';
  const decimals = options?.decimals ?? 0;
  return decimals === 0 ? Math.round(num).toLocaleString() : num.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

function InfoRow({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  let displayValue = '—';
  if (value !== null && value !== undefined && value !== '') {
    displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  }
  return (
    <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-foreground/60">{label}</span>
      <span className="text-sm font-medium text-foreground">{displayValue}</span>
    </div>
  );
}

export function OverviewTab({ plutoData, propertyData, transactions, error, bbl }: OverviewTabProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  // Use whichever data source is available
  const data = plutoData || propertyData;

  if (!data) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-foreground/70">No data available for this property.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract address
  const address = plutoData?.address || propertyData?.address || '—';
  const zipcode = plutoData?.zipcode;

  // Building class with fallback
  const bldgclass = plutoData?.bldgclass || propertyData?.avroll_building_class;
  const bldgclassStr = typeof bldgclass === 'string' ? bldgclass : (typeof bldgclass === 'number' ? bldgclass.toString() : null);
  const buildingClassDisplay = bldgclassStr ? `${bldgclassStr} - ${getBuildingClassCategory(bldgclassStr)}` : '—';

  // Building dimensions (format as integers)
  const bldgfront = plutoData?.bldgfront;
  const bldgdepth = plutoData?.bldgdepth;
  const formatDimension = (val: string | number | boolean | null | undefined) => {
    if (val === null || val === undefined || typeof val === 'boolean') return null;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? null : Math.round(num);
  };
  const frontFt = formatDimension(bldgfront);
  const depthFt = formatDimension(bldgdepth);
  const buildingDimensions = (frontFt && depthFt)
    ? `${frontFt} ft × ${depthFt} ft`
    : '—';

  // Year altered (use most recent)
  const yearLastAltered = plutoData?.yearalter2 ?? plutoData?.yearalter1 ?? null;

  return (
    <div className="space-y-6">
      {/* Property Information Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Address Header */}
          <div className="mb-6 pb-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{address}</h2>
            {zipcode && (
              <p className="text-sm text-foreground/60 mt-1">New York, NY {zipcode}</p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div>
              <InfoRow label="BBL" value={bbl} />
              <InfoRow label="Building Class" value={buildingClassDisplay} />
              <InfoRow label="Year Built" value={formatNumber(plutoData?.yearbuilt, { treatZeroAsNull: true })} />
              <InfoRow label="Year Last Altered" value={formatNumber(yearLastAltered, { treatZeroAsNull: true })} />
              <InfoRow
                label="Building Area"
                value={plutoData?.bldgarea != null ? `${formatNumber(plutoData.bldgarea)} sq ft` : '—'}
              />
            </div>

            {/* Right Column */}
            <div>
              <InfoRow label="Building Dimensions" value={buildingDimensions} />
              <InfoRow label="Buildings on Lot" value={formatNumber(plutoData?.numbldgs)} />
              <InfoRow
                label="Stories"
                value={formatNumber(plutoData?.numfloors ?? propertyData?.avroll_building_story)}
              />
              <InfoRow
                label="Lot Area"
                value={plutoData?.lotarea != null ? `${formatNumber(plutoData.lotarea)} sq ft` : '—'}
              />
              <InfoRow
                label="Residential Units"
                value={formatNumber(plutoData?.unitsres ?? propertyData?.avroll_units)}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Transaction Timeline */}
      <TransactionTimeline
        transactions={transactions.map((t): Transaction => ({
          id: t.documentId,
          type: t.documentType === 'DEED' ? 'DEED' : 'MORTGAGE',
          docType: t.docTypeDescription,
          date: t.documentDate,
          amount: t.documentAmount,
          party1: t.fromParty,
          party2: t.toParty,
          party1Type: t.party1Type,
          party2Type: t.party2Type,
          documentId: t.documentId,
        }))}
      />
    </div>
  );
}
