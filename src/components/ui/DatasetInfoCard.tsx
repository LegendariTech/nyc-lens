'use client';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { formatTimestamp } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { useState } from 'react';

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
  updateFrequency?: string;
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
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        'group/card rounded-xl transition-all duration-300',
        isOpen
          ? 'border border-accent/20 bg-gradient-to-br from-accent/[0.03] to-accent/[0.05] shadow-sm'
          : 'border border-accent/30 bg-gradient-to-r from-accent/[0.08] to-accent/[0.12] shadow-sm hover:shadow-md hover:border-accent/40 hover:from-accent/[0.12] hover:to-accent/[0.16]',
        className
      )}
      id={id}
    >
      <CollapsibleTrigger 
        className={cn(
          'w-full transition-all duration-300',
          isOpen 
            ? 'px-6 py-4'
            : 'px-5 py-3 hover:px-6'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icon/Badge - always visible */}
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover/card:bg-accent/20">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-base font-semibold text-left text-foreground">
            {metadata.name}
          </h2>

          {/* Quick metadata preview when collapsed */}
          {!isOpen && metadata.rowsUpdatedAt && (
            <div className="ml-auto flex items-center gap-2 text-xs text-foreground/70">
              <span className="hidden sm:inline">Updated {formatTimestamp(metadata.rowsUpdatedAt)}</span>
              <div className="h-1 w-1 rounded-full bg-accent/40 hidden sm:block" />
              <span className="hidden md:inline">{metadata.agency || 'NYC Open Data'}</span>
            </div>
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-6 pb-4 pt-2">
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

            {metadata.updateFrequency && (
              <div>
                <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Update Frequency</dt>
                <dd className="mt-1 text-sm text-foreground">{metadata.updateFrequency}</dd>
              </div>
            )}

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
