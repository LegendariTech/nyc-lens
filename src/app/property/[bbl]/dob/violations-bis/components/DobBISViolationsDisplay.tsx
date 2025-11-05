'use client';

import { DatasetInfoCard } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobViolationsBISTable } from '@/components/table/dob-violations-bis';
import type { DobViolationsBISResult } from '@/data/dobViolations';

interface DobBISViolationsDisplayProps {
  bbl: string;
  bisViolations: DobViolationsBISResult;
}

export function DobBISViolationsDisplay({ bbl, bisViolations }: DobBISViolationsDisplayProps) {
  // Check for errors
  if (bisViolations.error) {
    return (
      <DataTabLayout sections={[]} showSidebar={false}>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading BIS Violations Data</h3>
          <p className="text-sm text-red-600/80">{bisViolations.error}</p>
        </div>
      </DataTabLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawBISMetadata = bisViolations.metadata as any;
  const hasBISData = bisViolations.data && bisViolations.data.length > 0;

  return (
    <DataTabLayout sections={[]} showSidebar={false}>
      <div className="space-y-6">
        {bisViolations.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'Data Source Description',
                attributionLink: bisViolations.metadata.attributionLink,
                rowsUpdatedAt: bisViolations.metadata.rowsUpdatedAt?.toString(),
                agency: bisViolations.metadata.attribution,
                attachments: rawBISMetadata.metadata?.attachments,
                sourceId: bisViolations.metadata.id,
                updateFrequency: rawBISMetadata.metadata?.custom_fields?.Update?.['Update Frequency'],
              }}
              id="bis-violations-info"
              description={
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This dataset contains older civil penalties sourced from the Buildings Information System (BIS).
                  <br />
                  For newer penalties, check the <strong>Violations: DOB Now</strong> tab.
                  (Note: some violations appear in both datasets.)
                </p>
              }
            />
          </div>
        )}

        <div id="bis-violations-data">
          {!hasBISData ? (
            <div className="max-w-screen-xl">
              <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-foreground">No BIS Violations Found</h3>
                <p className="text-sm text-foreground/70">
                  No DOB violations (BIS) found for BBL {bbl}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DobViolationsBISTable data={bisViolations.data!} />
            </div>
          )}
        </div>
      </div>
    </DataTabLayout>
  );
}

