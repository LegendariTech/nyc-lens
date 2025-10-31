'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface DataField {
  label: string;
  value: unknown;
  description?: string;
  fieldName?: string;
  format?: string;
  link?: string; // Optional URL to make the field value clickable
}

interface DataFieldCardProps {
  title: string;
  fields: DataField[];
  hideEmptyFields?: boolean;
  className?: string;
  id?: string;
  customFormatter?: (field: DataField) => string;
  customEmptyCheck?: (field: DataField) => boolean;
}

export function DataFieldCard({
  title,
  fields,
  hideEmptyFields = false,
  className,
  id,
  customFormatter,
  customEmptyCheck
}: DataFieldCardProps) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<Record<string, 'top' | 'bottom'>>({});
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Filter out fields with no value based on hideEmptyFields prop
  const fieldsToShow = !hideEmptyFields
    ? fields
    : fields.filter((field) => {
      // Use custom empty check if provided
      if (customEmptyCheck) {
        return !customEmptyCheck(field);
      }
      // Default empty check
      return field.value !== null && field.value !== '' && field.value !== undefined;
    });

  // Hide section completely if no fields to show
  if (fieldsToShow.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      className={cn(
        'rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm',
        className
      )}
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>

      <dl className="space-y-3">
        {fieldsToShow.map((field) => {
          const formattedValue = customFormatter
            ? customFormatter(field)
            : String(field.value || 'N/A');

          const fieldKey = field.fieldName || field.label;
          const position = tooltipPosition[fieldKey] || 'top';

          const calculatePosition = (element: HTMLElement) => {
            const rect = element.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            const tooltipHeight = window.innerHeight * 0.6; // max-h-[60vh]

            // Position below if not enough space above
            const newPosition = spaceAbove < tooltipHeight && spaceBelow > spaceAbove ? 'bottom' : 'top';
            setTooltipPosition(prev => ({ ...prev, [fieldKey]: newPosition }));
          };

          const handleLabelClick = (e: React.MouseEvent<HTMLSpanElement>) => {
            if (!field.description) return;

            // Only handle click on mobile (touch devices)
            // On desktop, hover handles the tooltip
            e.preventDefault();

            // Toggle: if already open, close it; otherwise open it
            if (openTooltip === fieldKey) {
              setOpenTooltip(null);
            } else {
              calculatePosition(e.currentTarget);
              setOpenTooltip(fieldKey);
            }
          };

          const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
            if (!field.description) return;

            // Clear any pending hide timeout
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }

            calculatePosition(e.currentTarget);
            setHoveredTooltip(fieldKey);
          };

          const handleMouseLeave = () => {
            if (!field.description) return;

            // Set a delay before hiding the tooltip
            hideTimeoutRef.current = setTimeout(() => {
              setHoveredTooltip(null);
            }, 300); // 300ms delay
          };

          const handleTooltipMouseEnter = () => {
            // Clear hide timeout when mouse enters tooltip
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          };

          const handleTooltipMouseLeave = () => {
            // Hide tooltip when mouse leaves tooltip area
            setHoveredTooltip(null);
          };

          return (
            <div
              key={fieldKey}
              className="flex items-start gap-4 border-b border-foreground/5 py-2 last:border-b-0"
            >
              <dt className="group relative flex min-w-[140px] items-center text-sm font-medium text-foreground/70">
                <span
                  className="cursor-help"
                  onClick={handleLabelClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {field.label}
                </span>
                {field.description && (
                  <>
                    {/* Backdrop for mobile - click to close */}
                    {openTooltip === fieldKey && (
                      <div
                        className="fixed inset-0 z-[90] bg-black/50 md:hidden"
                        onClick={() => setOpenTooltip(null)}
                      />
                    )}
                    {/* Tooltip */}
                    <div
                      className={cn(
                        'prose prose-xs absolute left-0 z-[100] max-h-[60vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-600 bg-black p-4 text-xs text-white shadow-lg [&_a]:text-blue-300 [&_a]:underline [&_a]:hover:text-blue-200 [&_b]:font-semibold [&_p]:my-1 sm:w-96',
                        position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
                        // Mobile: show when clicked (openTooltip state)
                        // Desktop: show on hover (hoveredTooltip state)
                        openTooltip === fieldKey ? 'block md:hidden' : hoveredTooltip === fieldKey ? 'hidden md:block' : 'hidden'
                      )}
                      onMouseEnter={handleTooltipMouseEnter}
                      onMouseLeave={handleTooltipMouseLeave}
                      dangerouslySetInnerHTML={{ __html: field.description.replace(/\n/g, '<br>') }}
                    />
                  </>
                )}
              </dt>
              <dd className="flex-1 text-right text-sm text-foreground">
                {field.link ? (
                  <a
                    href={field.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline hover:text-foreground/80"
                  >
                    {formattedValue}
                  </a>
                ) : (
                  formattedValue
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
