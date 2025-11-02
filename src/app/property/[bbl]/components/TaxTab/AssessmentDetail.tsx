'use client';

import { formatAssessmentYear } from '@/components/table/tax';
import { getTaxableStatusDate } from '@/constants/taxRates';
import type { PropertyValuation } from '@/types/valuation';
import { AssessmentHeader } from './AssessmentComponents';
import {
  OwnerPropertyInfo,
  LandInfo,
  BuildingInfo,
  AssessmentInfo,
} from './AssessmentSections';

interface AssessmentDetailProps {
  valuation: PropertyValuation;
  bbl: string;
}

export function AssessmentDetail({ valuation, bbl }: AssessmentDetailProps) {
  const assessmentYear = formatAssessmentYear(valuation.year);
  const taxableStatusDate = getTaxableStatusDate(valuation.year);

  return (
    <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm space-y-6">
      <AssessmentHeader assessmentYear={assessmentYear} taxableStatusDate={taxableStatusDate} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OwnerPropertyInfo valuation={valuation} bbl={bbl} />
        <div className="space-y-4">
          <LandInfo valuation={valuation} />
          <BuildingInfo valuation={valuation} />
        </div>
      </div>

      <AssessmentInfo valuation={valuation} />

      <div className="border-t border-foreground/10 pt-4">
        <p className="text-xs text-foreground/60 italic">
          Note: For more information about how property taxes are calculated, visit{' '}
          <a
            href="http://nyc.gov/assessments"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            nyc.gov/assessments
          </a>
        </p>
      </div>
    </div>
  );
}

