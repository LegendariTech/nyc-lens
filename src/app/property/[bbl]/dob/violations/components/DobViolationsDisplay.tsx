'use client';

import { DatasetInfoCard, Card, CardContent } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobViolationsTable } from './TableNow';
import { DobViolationsBISTable } from './TableBIS';
import type { DobSafetyViolationsResult, DobViolationsBISResult } from '@/data/dobViolations';

interface DobViolationsDisplayProps {
  bbl: string;
  safetyViolations: DobSafetyViolationsResult;
  bisViolations: DobViolationsBISResult;
}

export function DobViolationsDisplay({ bbl, safetyViolations, bisViolations }: DobViolationsDisplayProps) {
  // Check for errors
  if (safetyViolations.error || bisViolations.error) {
    return (
      <DataTabLayout sections={[]} showSidebar={false}>
        <div className="space-y-4">
          {safetyViolations.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading DOB NOW Violations Data</h3>
              <p className="text-sm text-red-600/80">{safetyViolations.error}</p>
            </div>
          )}
          {bisViolations.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading BIS Violations Data</h3>
              <p className="text-sm text-red-600/80">{bisViolations.error}</p>
            </div>
          )}
        </div>
      </DataTabLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSafetyMetadata = safetyViolations.metadata as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawBISMetadata = bisViolations.metadata as any;
  const hasSafetyData = safetyViolations.data && safetyViolations.data.length > 0;
  const hasBISData = bisViolations.data && bisViolations.data.length > 0;

  return (
    <DataTabLayout sections={[]} showSidebar={false}>
      <div className="space-y-6">
        {safetyViolations.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'Violations: DOB NOW',
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
                </p>
              }
            />
          </div>
        )}

        <div id="safety-violations-data">
          {!hasSafetyData ? (
            <div className="max-w-screen-xl">
              <Card>
                <CardContent>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No DOB NOW Violations Found</h3>
                  <p className="text-sm text-foreground/70">
                    No DOB NOW violations found for BBL {bbl}.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <DobViolationsTable data={safetyViolations.data!} />
            </div>
          )}
        </div>

        {bisViolations.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'Violations: BIS',
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
                </p>
              }
            />
          </div>
        )}

        <div id="bis-violations-data">
          {!hasBISData ? (
            <div className="max-w-screen-xl">
              <Card>
                <CardContent>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No BIS Violations Found</h3>
                  <p className="text-sm text-foreground/70">
                    No DOB violations (BIS) found for BBL {bbl}.
                  </p>
                </CardContent>
              </Card>
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

