'use client';

import { DatasetInfoCard } from '@/components/ui';
import { DataTabLayout } from '@/components/layout';
import { DobJobApplicationsTable } from './Table';
import { DobJobNowApplicationsTable } from './TableNow';
import type { DobJobApplicationsResult, DobJobApplicationsNowResult } from '@/data/dobJobs';
import Link from 'next/link';

interface DobJobApplicationsDisplayProps {
  bbl: string;
  jobApplications: DobJobApplicationsResult;
  jobApplicationsNow: DobJobApplicationsNowResult;
}

export function DobJobApplicationsDisplay({ bbl, jobApplications, jobApplicationsNow }: DobJobApplicationsDisplayProps) {
  // Check for errors
  if (jobApplications.error || jobApplicationsNow.error) {
    return (
      <DataTabLayout sections={[]} showSidebar={false}>
        <div className="space-y-4">
          {jobApplications.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading BIS Job Applications Data</h3>
              <p className="text-sm text-red-600/80">{jobApplications.error}</p>
            </div>
          )}
          {jobApplicationsNow.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading DOB NOW Job Applications Data</h3>
              <p className="text-sm text-red-600/80">{jobApplicationsNow.error}</p>
            </div>
          )}
        </div>
      </DataTabLayout>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawJobApplicationsMetadata = jobApplications.metadata as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawJobApplicationsNowMetadata = jobApplicationsNow.metadata as any;
  const hasJobApplicationsData = jobApplications.data && jobApplications.data.length > 0;
  const hasJobApplicationsNowData = jobApplicationsNow.data && jobApplicationsNow.data.length > 0;

  return (
    <DataTabLayout sections={[]} showSidebar={false}>
      <div className="space-y-6">
        {jobApplications.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'BIS Jobs: Data Source Information',
                attributionLink: jobApplications.metadata.attributionLink,
                rowsUpdatedAt: jobApplications.metadata.rowsUpdatedAt?.toString(),
                agency: jobApplications.metadata.attribution,
                attachments: rawJobApplicationsMetadata.metadata?.attachments,
                sourceId: jobApplications.metadata.id,
                updateFrequency: rawJobApplicationsMetadata.metadata?.custom_fields?.Update?.['Update Frequency'],
              }}
              id="job-applications-info"
              description={
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This dataset contains all job applications submitted through the Borough Offices, through eFiling, or through the HUB, which have a &quot;Latest Action Date&quot; since January 1, 2000.
                  <br />
                  This dataset does not include jobs submitted through DOB NOW.
                  <br />
                  <br />
                  <strong>Note:</strong> Some jobs may appear in both datasets.
                </p>
              }
            />
          </div>
        )}

        <div id="job-applications-data">
          {!hasJobApplicationsData ? (
            <div className="max-w-screen-xl">
              <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-foreground">No BIS Job Applications Found</h3>
                <p className="text-sm text-foreground/70">
                  No DOB job applications (BIS) found for BBL {bbl}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DobJobApplicationsTable data={jobApplications.data!} />
            </div>
          )}
        </div>

        {jobApplicationsNow.metadata && (
          <div className="max-w-screen-xl">
            <DatasetInfoCard
              metadata={{
                name: 'DOB NOW Jobs: Data Source Information',
                attributionLink: jobApplicationsNow.metadata.attributionLink,
                rowsUpdatedAt: jobApplicationsNow.metadata.rowsUpdatedAt?.toString(),
                agency: jobApplicationsNow.metadata.attribution,
                attachments: rawJobApplicationsNowMetadata.metadata?.attachments,
                sourceId: jobApplicationsNow.metadata.id,
                updateFrequency: rawJobApplicationsNowMetadata.metadata?.custom_fields?.Update?.['Update Frequency'],
              }}
              id="job-applications-now-info"
              description={
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This dataset contains all job applications submitted through DOB NOW (Build), which is the online portal for DOB permit applications.
                  <br />
                  <br />
                  <strong>Note:</strong> Some jobs may appear in both datasets.
                </p>
              }
            />
          </div>
        )}

        <div id="job-applications-now-data">
          {!hasJobApplicationsNowData ? (
            <div className="max-w-screen-xl">
              <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-foreground">No DOB NOW Job Applications Found</h3>
                <p className="text-sm text-foreground/70">
                  No DOB NOW job applications found for BBL {bbl}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DobJobNowApplicationsTable data={jobApplicationsNow.data!} />
            </div>
          )}
        </div>
      </div>
    </DataTabLayout>
  );
}
