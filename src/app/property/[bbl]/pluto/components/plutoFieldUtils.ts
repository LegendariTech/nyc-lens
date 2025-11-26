import {
  getFieldMetadata,
  type DatasourceMetadata,
} from '../../utils/datasourceDisplay';
import { getBoroughName, getCommunityDistrictName } from '@/constants/nyc';
import { getBuildingClassCategory } from '@/constants/building';
import { getLandUseDescription } from '@/constants/landUse';
import { type DataField } from '@/components/ui';
import { formatValue } from '@/utils/formatters';

/**
 * Determine whether a PLUTO field should be considered empty.
 * Treats zero values as empty except for specified exceptions.
 */
export function isPlutoFieldEmpty(field: DataField): boolean {
  const value = field.value;

  if (value === null || value === '' || value === undefined) {
    return true;
  }

  const isZero = value === 0 || value === '0';
  if (isZero) {
    const exceptions = ['exempttot', 'easements'];
    if (field.fieldName && exceptions.includes(field.fieldName)) {
      return false;
    }

    return true;
  }

  return false;
}

/**
 * Format PLUTO-specific fields with metadata-aware enhancements.
 */
export function formatPlutoField(field: DataField, metadata: DatasourceMetadata | null): string {
  if (!metadata) {
    return String(field.value ?? 'N/A');
  }

  if (field.fieldName === 'bbl' && typeof field.value === 'string') {
    return parseFloat(field.value).toFixed(0);
  }

  const columnMetadata = getFieldMetadata(metadata, field.fieldName || '');
  let formattedValue = formatValue(
    field.value as string | number | boolean | null | undefined,
    columnMetadata,
    field.format as 'number' | 'currency' | 'percentage' | 'year' | undefined
  );

  if (field.fieldName === 'cd' && typeof field.value === 'number') {
    const districtName = getCommunityDistrictName(field.value);
    formattedValue = `${formattedValue} - ${districtName}`;
  } else if (field.fieldName === 'council' && typeof field.value === 'number') {
    formattedValue = `${formattedValue} - Council District ${field.value}`;
  } else if (field.fieldName === 'landuse' && typeof field.value === 'number') {
    const landUseDescription = getLandUseDescription(field.value);
    formattedValue = `${formattedValue} - ${landUseDescription}`;
  } else if (field.fieldName === 'borough' && typeof field.value === 'string') {
    const boroughName = getBoroughName(field.value);
    formattedValue = `${field.value} (${boroughName})`;
  } else if (field.fieldName === 'bldgclass' && typeof field.value === 'string') {
    const buildingCategory = getBuildingClassCategory(field.value);
    formattedValue = `${formattedValue} - ${buildingCategory}`;
  }

  return formattedValue;
}

