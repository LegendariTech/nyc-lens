'use client';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { formatTimestamp } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface DatasetMetadata {
  name: string;
  attributionLink?: string;
  rowsUpdatedAt?: string;
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
                    View on NYC Open Data
                  </a>
                </dd>
              </div>
            )}

            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Agency</dt>
              <dd className="mt-1 text-sm text-foreground">Department of City Planning (DCP)</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Attachments</dt>
              <dd className="mt-1 text-xs text-foreground">
                <div className="space-y-1">
                  <div>
                    <a
                      href="https://data.cityofnewyork.us/api/views/64uk-42ks/files/6c2721bc-bf0a-496c-8cfa-80183b7c4bd5?download=true&filename=pluto_datadictionary.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline hover:text-foreground/80"
                    >
                      PLUTO Data Dictionary (PDF)
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://data.cityofnewyork.us/api/views/64uk-42ks/files/25d91358-f511-4bb8-9d35-daf5b3fd4303?download=true&filename=pluto_readme.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline hover:text-foreground/80"
                    >
                      PLUTO README (PDF)
                    </a>
                  </div>
                </div>
              </dd>
            </div>

            {/* Custom metadata items */}
            {customMetadataItems}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
