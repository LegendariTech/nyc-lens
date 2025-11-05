'use client';

import { DatasetInfoCard } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobViolationsTable } from './Table';
import type { DobSafetyViolationsResult } from '@/data/dobViolations';

interface DobSafetyViolationsDisplayProps {
  bbl: string;
  safetyViolations: DobSafetyViolationsResult;
}

export function DobSafetyViolationsDisplay({ bbl, safetyViolations }: DobSafetyViolationsDisplayProps) {
  // Check for errors
  if (safetyViolations.error) {
    return (
      <DataTabLayout sections={[]} showSidebar={false}>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Safety Violations Data</h3>
          <p className="text-sm text-red-600/80">{safetyViolations.error}</p>
        </div>
      </DataTabLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSafetyMetadata = safetyViolations.metadata as any;
  const hasSafetyData = safetyViolations.data && safetyViolations.data.length > 0;

  return (
    <DataTabLayout sections={[]} showSidebar={false}>
      <div className="space-y-6">
        {safetyViolations.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'Data Source Information',
                attributionLink: safetyViolations.metadata.attributionLink,
                rowsUpdatedAt: safetyViolations.metadata.rowsUpdatedAt?.toString(),
                agency: safetyViolations.metadata.attribution,
                attachments: rawSafetyMetadata.metadata?.attachments,
                sourceId: safetyViolations.metadata.id,
                updateFrequency: rawSafetyMetadata.metadata?.custom_fields?.Update?.['Update Frequency'],
              }}
              id="safety-violations-info"
              description={
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This dataset contains recent civil penalties recorded or paid in DOB NOW.
                  <br />
                  For older penalties, check the <strong>Violations: BIS</strong> tab.
                  (Note: some violations appear in both datasets.)
                </p>
              }
            />
          </div>
        )}

        <div id="safety-violations-data">
          {!hasSafetyData ? (
            <div className="max-w-screen-xl">
              <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Violations Found</h3>
                <p className="text-sm text-foreground/70">
                  No DOB violations found for BBL {bbl}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DobViolationsTable data={safetyViolations.data!} />
            </div>
          )}
        </div>
      </div>
    </DataTabLayout>
  );
}

