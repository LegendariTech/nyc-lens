'use client';

import { DatasetInfoCard } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobViolationsTable } from '@/components/table/dob-violations';
import { DobViolationsBISTable } from '@/components/table/dob-violations-bis';
import type { DobSafetyViolationsResult, DobViolationsBISResult } from '@/data/dobViolations';

interface ViolationsDisplayProps {
  bbl: string;
  safetyViolations: DobSafetyViolationsResult;
  bisViolations: DobViolationsBISResult;
}

export function ViolationsDisplay({ bbl, safetyViolations, bisViolations }: ViolationsDisplayProps) {
  // Check for errors
  const hasErrors = safetyViolations.error || bisViolations.error;
  
  if (hasErrors) {
    return (
      <DataTabLayout sections={[]} showSidebar={false}>
        {safetyViolations.error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 mb-4">
            <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Safety Violations Data</h3>
            <p className="text-sm text-red-600/80">{safetyViolations.error}</p>
          </div>
        )}
        {bisViolations.error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading BIS Violations Data</h3>
            <p className="text-sm text-red-600/80">{bisViolations.error}</p>
          </div>
        )}
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
      {/* Safety Violations Section */}
      <div className="space-y-6 mb-8">
        {safetyViolations.metadata && (
          <DatasetInfoCard
            metadata={{
              name: safetyViolations.metadata.name,
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
                {safetyViolations.metadata.description}
              </p>
            }
          />
        )}

        <div id="safety-violations-data">
          {!hasSafetyData ? (
            <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">No Safety Violations Found</h3>
              <p className="text-sm text-foreground/70">
                No DOB safety violations found for BBL {bbl}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Safety Violations ({safetyViolations.data?.length || 0})
                </h3>
              </div>
              <DobViolationsTable data={safetyViolations.data!} />
            </div>
          )}
        </div>
      </div>

      {/* BIS Violations Section */}
      <div className="space-y-6">
        {bisViolations.metadata && (
          <DatasetInfoCard
            metadata={{
              name: bisViolations.metadata.name,
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
                {bisViolations.metadata.description}
              </p>
            }
          />
        )}

        <div id="bis-violations-data">
          {!hasBISData ? (
            <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">No BIS Violations Found</h3>
              <p className="text-sm text-foreground/70">
                No DOB violations (BIS) found for BBL {bbl}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  BIS Violations ({bisViolations.data?.length || 0})
                </h3>
              </div>
              <DobViolationsBISTable data={bisViolations.data!} />
            </div>
          )}
        </div>
      </div>
    </DataTabLayout>
  );
}

