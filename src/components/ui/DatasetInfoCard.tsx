'use client';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { formatTimestamp } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface DatasetAttachment {
  filename: string;
  assetId: string;
  name: string;
}

interface DatasetMetadata {
  name: string;
  attributionLink?: string;
  rowsUpdatedAt?: string;
  agency?: string;
  attachments?: DatasetAttachment[];
  sourceId?: string;
}

interface DatasetInfoCardProps {
  metadata: DatasetMetadata;
  description?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  id?: string;
  customMetadataItems?: React.ReactNode;
}

export function DatasetInfoCard({
  metadata,
  description,
  defaultOpen = false,
  className,
  id,
  customMetadataItems
}: DatasetInfoCardProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn(
        'rounded-lg border border-foreground/10 bg-background shadow-sm',
        className
      )}
      id={id}
    >
      <CollapsibleTrigger className="w-full px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">{metadata.name}</h3>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 py-3">
          {/* Custom Description */}
          {description && (
            <div className="mb-6">
              {typeof description === 'string' ? (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {description}
                </p>
              ) : (
                description
              )}
            </div>
          )}

          {/* Dataset Metadata Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metadata.rowsUpdatedAt && (
              <div>
                <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Data Last Updated</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{formatTimestamp(metadata.rowsUpdatedAt)}</dd>
              </div>
            )}

            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Update Frequency</dt>
              <dd className="mt-1 text-sm text-foreground">Quarterly</dd>
            </div>

            {metadata.attributionLink && (
              <div>
                <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Source Link</dt>
                <dd className="mt-1">
                  <a
                    href={metadata.attributionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground underline hover:text-foreground/80"
                  >
                    View Source Data
                  </a>
                </dd>
              </div>
            )}

            {metadata.agency && (
            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Agency</dt>
                <dd className="mt-1 text-sm text-foreground">{metadata.agency}</dd>
            </div>
            )}

            {metadata.attachments && metadata.attachments.length > 0 && metadata.sourceId && (
            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Attachments</dt>
              <dd className="mt-1 text-xs text-foreground">
                <div className="space-y-1">
                    {metadata.attachments.map((attachment) => (
                      <div key={attachment.assetId}>
                    <a
                          href={`https://data.cityofnewyork.us/api/views/${metadata.sourceId}/files/${attachment.assetId}?download=true&filename=${attachment.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline hover:text-foreground/80"
                    >
                          {attachment.name}
                    </a>
                  </div>
                    ))}
                </div>
              </dd>
            </div>
            )}

            {/* Custom metadata items */}
            {customMetadataItems}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
