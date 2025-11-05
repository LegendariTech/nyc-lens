'use client';

import type { PropertyValuation } from '@/types/valuation';
import { formatTaxYear } from './utils';
import { AssessmentTable, TaxableAssessmentCard, InfoField, InfoRow, InfoSection } from './AssessmentComponents';
import {
  formatPropertyAddress,
  formatBuildingClass,
  formatLotShape,
  formatCorner,
  getExtensionValue,
  getAssessmentTableRows,
  getTaxableAssessedValue,
} from './utils';
import { ASSESSMENT_FIELD_DESCRIPTIONS } from './const';

interface OwnerPropertyInfoProps {
  valuation: PropertyValuation;
  bbl: string;
}

export function OwnerPropertyInfo({ valuation, bbl }: OwnerPropertyInfoProps) {
  return (
    <div className="space-y-4">
      <InfoField
        label="Owner Name"
        value={<span className="font-semibold">{valuation.owner}</span>}
        description={ASSESSMENT_FIELD_DESCRIPTIONS.ownerName}
      />
      <InfoField
        label="Property Address"
        value={formatPropertyAddress(valuation)}
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
        value={formatBuildingClass(valuation.bldg_class)}
        description={ASSESSMENT_FIELD_DESCRIPTIONS.buildingClass}
      />
    </div>
  );
}

interface LandInfoProps {
  valuation: PropertyValuation;
}

export function LandInfo({ valuation }: LandInfoProps) {
  return (
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
        value={formatLotShape(valuation.lot_irreg)}
        description={ASSESSMENT_FIELD_DESCRIPTIONS.lotShape}
      />
      <InfoRow
        label="Corner"
        value={formatCorner(valuation.corner)}
        description={ASSESSMENT_FIELD_DESCRIPTIONS.corner}
      />
      <InfoRow
        label="Number of Buildings"
        value={valuation.num_bldgs}
        format="number"
        description={ASSESSMENT_FIELD_DESCRIPTIONS.numBuildings}
      />
    </InfoSection>
  );
}

interface BuildingInfoProps {
  valuation: PropertyValuation;
}

export function BuildingInfo({ valuation }: BuildingInfoProps) {
  return (
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
        value={getExtensionValue(valuation.bld_ext)}
        description={ASSESSMENT_FIELD_DESCRIPTIONS.extension}
      />
    </InfoSection>
  );
}

interface AssessmentInfoProps {
  valuation: PropertyValuation;
}

export function AssessmentInfo({ valuation }: AssessmentInfoProps) {
  return (
    <div className="border-t border-foreground/10 pt-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Information</h3>
      <AssessmentTable rows={getAssessmentTableRows(valuation)} />
      <TaxableAssessmentCard
        taxYear={formatTaxYear(valuation.year)}
        amount={getTaxableAssessedValue(valuation)}
      />
    </div>
  );
}

