'use client';

import type { PropertyValuation } from '@/types/valuation';
import { VALUATION_FIELD_DESCRIPTIONS } from './valuationFieldDescriptions';
import {
  resolveTaxableFlag,
  resolveCondoSuffix,
  resolveBuildingExtension,
  resolveEasement,
} from '@/utils/taxCodes';
import { formatCurrency } from '@/utils/formatters';

// Fields that contain currency values and should be formatted as USD
const CURRENCY_FIELDS = new Set([
  // PY (Prior Year) values
  'pymktland', 'pymkttot', 'pyactland', 'pyacttot', 'pyactextot',
  'pytrnland', 'pytrntot', 'pytrnextot', 'pytxbtot', 'pytxbextot',

  // TEN (Tentative) values
  'tenmktland', 'tenmkttot', 'tenactland', 'tenacttot', 'tenactextot',
  'tentrnland', 'tentrntot', 'tentrnextot', 'tentxbtot', 'tentxbextot',

  // CBN (Change By Notice) values
  'cbnmktland', 'cbnmkttot', 'cbnactland', 'cbnacttot', 'cbnactextot',
  'cbntrnland', 'cbntrntot', 'cbntrnextot', 'cbntxbtot', 'cbntxbextot',

  // FIN (Final) values
  'finmktland', 'finmkttot', 'finactland', 'finacttot', 'finactextot',
  'fintrnland', 'fintrntot', 'fintrnextot', 'fintxbtot', 'fintxbextot',

  // CUR (Current) values
  'curmktland', 'curmkttot', 'curactland', 'curacttot', 'curactextot',
  'curtrnland', 'curtrntot', 'curtrnextot', 'curtxbtot', 'curtxbextot',
]);

interface RawDataViewProps {
  data: PropertyValuation[];
  searchQuery: string;
}

export function RawDataView({ data, searchQuery }: RawDataViewProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/60">
        No valuation data available
      </div>
    );
  }

  // Get all unique fields from the data
  const allFields = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Filter fields based on search query
  const getFilteredFields = (valuation: PropertyValuation) => {
    if (!searchQuery.trim()) {
      return allFields;
    }

    const query = searchQuery.toLowerCase();
    return allFields.filter(field => {
      const value = valuation[field as keyof PropertyValuation];
      const description = VALUATION_FIELD_DESCRIPTIONS[field];
      const fieldName = (description || field).toLowerCase();
      const fieldValue = String(value || '').toLowerCase();

      return fieldName.includes(query) || fieldValue.includes(query);
    });
  };

  return (
    <div className="space-y-8 overflow-visible">
      {data.map((valuation, index) => {
        const filteredFields = getFilteredFields(valuation);

        // Skip year if no fields match the search
        if (filteredFields.length === 0) {
          return null;
        }

        return (
          <div key={valuation.year || index} className="space-y-4">
            <h4 className="text-base font-semibold text-foreground border-b border-foreground/10 pb-2">
              Year: {valuation.year}
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 overflow-visible">
              {filteredFields.map(field => {
                const value = valuation[field as keyof PropertyValuation];
                const description = VALUATION_FIELD_DESCRIPTIONS[field];

                // Skip if value is null or undefined
                if (value === null || value === undefined) {
                  return null;
                }

                // Format value based on field type
                let displayValue = String(value);

                // Apply currency formatting for currency fields
                if (CURRENCY_FIELDS.has(field)) {
                  displayValue = formatCurrency(value);
                }
                // Apply code resolution for specific fields
                else if (field === 'pytaxflag' || field === 'tentaxflag' || field === 'cbntaxflag' ||
                  field === 'fintaxflag' || field === 'curtaxflag') {
                  displayValue = `${value} (${resolveTaxableFlag(String(value))})`;
                } else if (field === 'condo_sfx1') {
                  displayValue = `${value} (${resolveCondoSuffix(String(value))})`;
                } else if (field === 'bld_ext') {
                  displayValue = `${value} (${resolveBuildingExtension(String(value))})`;
                } else if (field === 'easement') {
                  displayValue = `${value} (${resolveEasement(String(value))})`;
                }

                return (
                  <div
                    key={field}
                    className="flex flex-col gap-1 py-2 border-b border-foreground/5"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-foreground">
                        {description || field}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-foreground/70 break-all">
                        {displayValue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

