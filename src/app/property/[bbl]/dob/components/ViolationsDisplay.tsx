'use client';

import { DatasetInfoCard } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobViolationsTable } from '@/components/table/dob-violations';
import type { DobViolation } from '@/types/dob';
import type { DatasourceMetadata } from '../../utils/datasourceDisplay';

interface ViolationsDisplayProps {
  bbl: string;
  data: DobViolation[] | null;
  metadata: DatasourceMetadata | null;
  error?: string;
}

export function ViolationsDisplay({ bbl, data, metadata, error }: ViolationsDisplayProps) {
  // Generate sections for "On This Page" sidebar
  const sidebarSections = [
    { id: 'dataset-info', title: 'Dataset Information', level: 1 },
    { id: 'violations-data', title: 'Violations', level: 1 }
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Violations Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMetadata = metadata as any;

  return (
    <DataTabLayout sections={sidebarSections}>
      {/* Dataset Attribution */}
      {metadata && (
        <DatasetInfoCard
          metadata={{
            name: metadata.name,
            attributionLink: metadata.attributionLink,
            rowsUpdatedAt: metadata.rowsUpdatedAt?.toString(),
            agency: metadata.attribution,
            attachments: rawMetadata.metadata?.attachments,
            sourceId: metadata.id,
          }}
          id="dataset-info"
          description={
            <p className="text-sm text-foreground/80 leading-relaxed">
              {metadata.description}
            </p>
          }
        />
      )}

      {/* Data Display */}
      <div id="violations-data">
        {!data || data.length === 0 ? (
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-foreground">No Violations Found</h3>
            <p className="text-sm text-foreground/70">
              No DOB violations found for BBL {bbl}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Violations ({data.length})
              </h3>
            </div>
            <DobViolationsTable data={data} />
          </div>
        )}
      </div>
    </DataTabLayout>
  );
}

