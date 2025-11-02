'use client';

import { cn } from '@/utils/cn';
import { FieldTooltip } from './FieldTooltip';

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

  return (
    <div
      id={id}
      className={cn(
        'rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm',
        className
      )}
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>

      {fieldsToShow.length === 0 ? (
        <p className="text-sm text-foreground/50 italic">No data available for this section</p>
      ) : (
        <dl className="space-y-3">
          {fieldsToShow.map((field) => {
            const formattedValue = customFormatter
              ? customFormatter(field)
              : String(field.value || 'N/A');

            const fieldKey = field.fieldName || field.label;

            return (
              <div
                key={fieldKey}
                className="flex items-start gap-4 border-b border-foreground/5 py-2 last:border-b-0"
              >
                <dt className="flex min-w-[140px] items-center text-sm font-medium text-foreground/70">
                  {field.description ? (
                    <FieldTooltip description={field.description} fieldKey={fieldKey}>
                      {field.label}
                    </FieldTooltip>
                  ) : (
                    field.label
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
      )}
    </div>
  );
}
