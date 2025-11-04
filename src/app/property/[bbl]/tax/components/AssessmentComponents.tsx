'use client';

import { formatCurrency } from '@/utils/formatters';
import { FieldTooltip } from '@/components/ui';
import type { ReactNode } from 'react';

/**
 * Simple info field with label and value
 */
interface InfoFieldProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
  description?: string;
}

export function InfoField({ label, value, mono = false, description }: InfoFieldProps) {
  return (
    <div>
      <dt className="text-xs font-medium text-foreground/60 uppercase tracking-wide mb-1">
        {description ? (
          <FieldTooltip description={description} fieldKey={`info-${label}`}>
            {label}
          </FieldTooltip>
        ) : (
          label
        )}
      </dt>
      <dd className={`text-sm text-foreground ${mono ? 'font-mono' : ''}`}>
        {value || 'N/A'}
      </dd>
    </div>
  );
}

/**
 * Inline info row with label on left, value on right
 */
interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  format?: 'currency' | 'number' | 'text';
  description?: string;
}

export function InfoRow({ label, value, format = 'text', description }: InfoRowProps) {
  let displayValue: string;

  if (value === null || value === undefined) {
    displayValue = 'N/A';
  } else if (format === 'currency') {
    displayValue = formatCurrency(typeof value === 'number' ? value : null);
  } else if (format === 'number' && typeof value === 'number') {
    displayValue = value % 1 === 0 ? Math.round(value).toLocaleString() : value.toLocaleString();
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex justify-between text-sm">
      <dt className="text-foreground/60">
        {description ? (
          <FieldTooltip description={description} fieldKey={`row-${label}`}>
            {label}
          </FieldTooltip>
        ) : (
          label
        )}
      </dt>
      <dd className="font-medium text-foreground">{displayValue}</dd>
    </div>
  );
}

/**
 * Bordered section with title and content
 */
interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

export function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <div className="border-l-2 border-foreground/10 pl-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

/**
 * Assessment header with year and status date
 */
interface AssessmentHeaderProps {
  assessmentYear: string;
  taxableStatusDate: string;
}

export function AssessmentHeader({ assessmentYear, taxableStatusDate }: AssessmentHeaderProps) {
  return (
    <div className="border-b border-foreground/10 pb-4">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {assessmentYear} Final Assessment
      </h2>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">Final Assessment Roll for</span>
          <span className="font-semibold text-foreground">{assessmentYear} | City of New York</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Taxable Status Date</span>
          <span className="font-semibold text-foreground">{taxableStatusDate}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Assessment values table
 */
interface AssessmentTableRow {
  description: string;
  landValue: number | null;
  totalValue: number | null;
  tooltip?: string;
}

interface AssessmentTableProps {
  rows: AssessmentTableRow[];
}

export function AssessmentTable({ rows }: AssessmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/10">
            <th className="text-left py-2 px-3 text-foreground/60 font-medium">Description</th>
            <th className="text-right py-2 px-3 text-foreground/60 font-medium">Land</th>
            <th className="text-right py-2 px-3 text-foreground/60 font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/5">
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="py-2 px-3 text-foreground/80">
                {row.tooltip ? (
                  <FieldTooltip
                    description={row.tooltip}
                    fieldKey={`assessment-${row.description}-${index}`}
                  >
                    {row.description}
                  </FieldTooltip>
                ) : (
                  row.description
                )}
              </td>
              <td className="py-2 px-3 text-right font-medium text-foreground">
                {formatCurrency(row.landValue)}
              </td>
              <td className="py-2 px-3 text-right font-medium text-foreground">
                {formatCurrency(row.totalValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Highlighted taxable/billable assessment value card
 */
interface TaxableAssessmentCardProps {
  taxYear: string;
  amount: number | null;
}

export function TaxableAssessmentCard({ taxYear, amount }: TaxableAssessmentCardProps) {
  return (
    <div className="mt-6 bg-foreground/5 rounded-lg p-4">
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-foreground/80">
          Subject To Adjustments, {taxYear} Taxes Will Be Based On
        </span>
        <span className="text-xl font-bold text-foreground">{formatCurrency(amount)}</span>
      </div>
    </div>
  );
}

