'use client';

import { getBuildingClassDescription } from '@/constants/building';
import { formatAssessmentYear, formatTaxYear } from '@/components/table/tax';
import { getTaxableStatusDate } from '@/constants/taxRates';
import type { PropertyValuation } from '@/types/valuation';
import {
  AssessmentHeader,
  AssessmentTable,
  InfoField,
  InfoRow,
  InfoSection,
  TaxableAssessmentCard,
} from './AssessmentComponents';
import { ASSESSMENT_FIELD_DESCRIPTIONS } from './assessmentFieldDescriptions';

interface AssessmentDetailProps {
  valuation: PropertyValuation;
  bbl: string;
}

export function AssessmentDetail({ valuation, bbl }: AssessmentDetailProps) {
  const assessmentYear = formatAssessmentYear(valuation.year);
  const taxableStatusDate = getTaxableStatusDate(valuation.year);

  // Prepare assessment table data
  const assessmentTableRows = [
    {
      description: 'Estimated Market Value',
      landValue: valuation.finmktland,
      totalValue: valuation.finmkttot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.estimatedMarketValue,
    },
    {
      description: 'Market Assessed Value',
      landValue: valuation.finactland,
      totalValue: valuation.finacttot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.marketAssessedValue,
    },
    {
      description: 'Market Value Exemption',
      landValue: valuation.finactextot,
      totalValue: valuation.finactextot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.marketValueExemption,
    },
    {
      description: 'Transitional Assessed Value',
      landValue: valuation.fintrnland,
      totalValue: valuation.fintrntot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.transitionalAssessedValue,
    },
    {
      description: 'Transitional Value Exemption',
      landValue: valuation.fintrnextot,
      totalValue: valuation.fintrnextot,
      tooltip: ASSESSMENT_FIELD_DESCRIPTIONS.transitionalValueExemption,
    },
  ];

  // Format property address
  const propertyAddress = valuation.housenum_lo && valuation.street_name
    ? `${valuation.housenum_lo} ${valuation.street_name}${valuation.zip_code ? ` # ${valuation.zip_code}` : ''}`
    : 'N/A';

  // Format building class
  const buildingClass = valuation.bldg_class
    ? `${valuation.bldg_class} - ${getBuildingClassDescription(valuation.bldg_class)}`
    : 'N/A';

  return (
    <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm space-y-6">
      {/* Header */}
      <AssessmentHeader assessmentYear={assessmentYear} taxableStatusDate={taxableStatusDate} />

      {/* Owner and Property Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <InfoField
            label="Owner Name"
            value={<span className="font-semibold">{valuation.owner}</span>}
            description={ASSESSMENT_FIELD_DESCRIPTIONS.ownerName}
          />
          <InfoField
            label="Property Address"
            value={propertyAddress}
            description={ASSESSMENT_FIELD_DESCRIPTIONS.propertyAddress}
          />
          <InfoField
            label="BBL"
            value={bbl}
            mono
            description={ASSESSMENT_FIELD_DESCRIPTIONS.bbl}
          />
          <InfoField
            label="Tax Class"
            value={<span className="font-semibold">{valuation.fintaxclass}</span>}
            description={ASSESSMENT_FIELD_DESCRIPTIONS.taxClass}
          />
          <InfoField
            label="Building Class"
            value={buildingClass}
            description={ASSESSMENT_FIELD_DESCRIPTIONS.buildingClass}
          />
        </div>

        {/* Right Column - Land & Building Information */}
        <div className="space-y-4">
          <InfoSection title="Land Information">
            <InfoRow
              label="Frontage (feet)"
              value={valuation.lot_frt}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.lotFrontage}
            />
            <InfoRow
              label="Depth (feet)"
              value={valuation.lot_dep}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.lotDepth}
            />
            <InfoRow
              label="Land Area (sqft)"
              value={valuation.land_area}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.landArea}
            />
            <InfoRow
              label="Regular / Irregular"
              value={valuation.lot_irreg || 'Regular'}
              description={ASSESSMENT_FIELD_DESCRIPTIONS.lotShape}
            />
            <InfoRow
              label="Corner"
              value={valuation.corner || 'No'}
              description={ASSESSMENT_FIELD_DESCRIPTIONS.corner}
            />
            <InfoRow
              label="Number of Buildings"
              value={valuation.num_bldgs}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.numBuildings}
            />
          </InfoSection>

          <InfoSection title="Building Size">
            <InfoRow
              label="Frontage (feet)"
              value={valuation.bld_frt}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.buildingFrontage}
            />
            <InfoRow
              label="Depth (feet)"
              value={valuation.bld_dep}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.buildingDepth}
            />
            <InfoRow
              label="Stories"
              value={valuation.bld_story}
              format="number"
              description={ASSESSMENT_FIELD_DESCRIPTIONS.stories}
            />
            <InfoRow
              label="Extension"
              value={valuation.bld_ext || 'N'}
              description={ASSESSMENT_FIELD_DESCRIPTIONS.extension}
            />
          </InfoSection>
        </div>
      </div>

      {/* Assessment Information */}
      <div className="border-t border-foreground/10 pt-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Information</h3>

        <AssessmentTable rows={assessmentTableRows} />

        <TaxableAssessmentCard
          taxYear={formatTaxYear(valuation.year)}
          amount={valuation.fintxbtot ? valuation.fintxbtot - (valuation.fintxbextot || 0) : null}
        />
      </div>

      {/* Note */}
      <div className="border-t border-foreground/10 pt-4">
        <p className="text-xs text-foreground/60 italic">
          Note: For more information about how your property taxes are calculated, visit{' '}
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

