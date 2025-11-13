import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobJobApplicationRow } from './types';
import { getDobJobStatusDisplay, getDobJobTypeDisplay, getDobApplicantProfessionalTitleDisplay } from '@/constants/dob';
import { formatCurrency, formatDate } from '@/utils/formatters';
import metadata from '../../metadata.json';

/**
 * Get column name from metadata
 */
function getColumnName(fieldName: string): string {
  const column = metadata.columns.find((col: { fieldName: string; name?: string }) => col.fieldName === fieldName);
  return column?.name || fieldName;
}

/**
 * Format applicant name from first and last name
 */
function formatApplicantName(row: DobJobApplicationRow): string {
  const firstName = row.applicant_s_first_name;
  const lastName = row.applicant_s_last_name;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  return 'N/A';
}

export const dobJobApplicationsColumnDefs: ColDef<DobJobApplicationRow>[] = [
  {
    field: 'job__',
    headerName: getColumnName('job__'),
    width: 140,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'pre__filing_date',
    headerName: getColumnName('pre__filing_date'),
    width: 180,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => {
      return formatDate(p.value);
    },
    filterValueGetter: (params) => {
      return formatDate(params.data?.pre__filing_date);
    },
    comparator: (valueA: Date, valueB: Date) => {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return dateB - dateA;
    },
  },
  {
    field: 'doc__',
    headerName: getColumnName('doc__'),
    width: 100,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_type',
    headerName: getColumnName('job_type'),
    width: 150,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => getDobJobTypeDisplay(p.value ?? null),
  },
  {
    field: 'job_status',
    headerName: getColumnName('job_status'),
    width: 350,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => getDobJobStatusDisplay(p.value ?? null),
  },
  {
    field: 'latest_action_date',
    headerName: getColumnName('latest_action_date'),
    width: 170,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
    comparator: (valueA: Date, valueB: Date) => {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return dateB - dateA; // Most recent first
    },
  },
  {
    field: 'applicant_license__',
    headerName: getColumnName('applicant_license__'),
    width: 120,
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'initial_cost',
    headerName: getColumnName('initial_cost'),
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => {
      if (!p.value) return 'N/A';
      // Remove $ and any other non-numeric characters except decimal point and minus sign
      const cleanValue = p.value.replace(/[^0-9.-]/g, '');
      const numValue = parseFloat(cleanValue);
      return isNaN(numValue) ? 'N/A' : formatCurrency(numValue);
    },
  },
  {
    field: 'total_est__fee',
    headerName: getColumnName('total_est__fee'),
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => {
      if (!p.value) return 'N/A';
      // Remove $ and any other non-numeric characters except decimal point and minus sign
      const cleanValue = p.value.replace(/[^0-9.-]/g, '');
      const numValue = parseFloat(cleanValue);
      return isNaN(numValue) ? 'N/A' : formatCurrency(numValue);
    },
  },
  {
    field: 'fee_status',
    headerName: getColumnName('fee_status'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    headerName: 'Applicant',
    width: 200,
    valueGetter: (params) => formatApplicantName(params.data!),
  },
  {
    field: 'applicant_professional_title',
    headerName: getColumnName('applicant_professional_title'),
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => getDobApplicantProfessionalTitleDisplay(p.value ?? null),
  },
  {
    field: 'professional_cert',
    headerName: getColumnName('professional_cert'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_s_first_name',
    headerName: 'Owner',
    valueGetter: (params) => `${params.data?.owner_s_first_name} ${params.data?.owner_s_last_name}`,
  },

  {
    field: 'owner_s_business_name',
    headerName: getColumnName('owner_s_business_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_s_house_number',
    headerName: getColumnName('owner_s_house_number'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_shouse_street_name',
    headerName: getColumnName('owner_shouse_street_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'city_',
    headerName: getColumnName('city_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'state',
    headerName: getColumnName('state'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zip',
    headerName: getColumnName('zip'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_sphone__',
    headerName: getColumnName('owner_sphone__'),
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_description',
    headerName: getColumnName('job_description'),
    width: 400,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'job_description',
  },
  {
    field: 'job_status_descrp',
    hide: true,
    headerName: getColumnName('job_status_descrp'),
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'community___board',
    headerName: getColumnName('community___board'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'cluster',
    headerName: getColumnName('cluster'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'landmarked',
    headerName: getColumnName('landmarked'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'adult_estab',
    headerName: getColumnName('adult_estab'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'loft_board',
    headerName: getColumnName('loft_board'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'city_owned',
    headerName: getColumnName('city_owned'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'little_e',
    headerName: getColumnName('little_e'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'pc_filed',
    headerName: getColumnName('pc_filed'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'efiling_filed',
    headerName: getColumnName('efiling_filed'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'plumbing',
    headerName: getColumnName('plumbing'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'mechanical',
    headerName: getColumnName('mechanical'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'boiler',
    headerName: getColumnName('boiler'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fuel_burning',
    headerName: getColumnName('fuel_burning'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fuel_storage',
    headerName: getColumnName('fuel_storage'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'standpipe',
    headerName: getColumnName('standpipe'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'sprinkler',
    headerName: getColumnName('sprinkler'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fire_alarm',
    headerName: getColumnName('fire_alarm'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'equipment',
    headerName: getColumnName('equipment'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fire_suppression',
    headerName: getColumnName('fire_suppression'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'curb_cut',
    headerName: getColumnName('curb_cut'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'other',
    headerName: getColumnName('other'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'other_description',
    headerName: getColumnName('other_description'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'paid',
    headerName: getColumnName('paid'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fully_paid',
    headerName: getColumnName('fully_paid'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'assigned',
    headerName: getColumnName('assigned'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fully_permitted',
    headerName: getColumnName('fully_permitted'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'existing_zoning_sqft',
    headerName: getColumnName('existing_zoning_sqft'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_zoning_sqft',
    headerName: getColumnName('proposed_zoning_sqft'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'horizontal_enlrgmt',
    headerName: getColumnName('horizontal_enlrgmt'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'vertical_enlrgmt',
    headerName: getColumnName('vertical_enlrgmt'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'enlargement_sq_footage',
    headerName: getColumnName('enlargement_sq_footage'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'street_frontage',
    headerName: getColumnName('street_frontage'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existingno_of_stories',
    headerName: getColumnName('existingno_of_stories'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_no_of_stories',
    headerName: getColumnName('proposed_no_of_stories'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_height',
    headerName: getColumnName('existing_height'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_height',
    headerName: getColumnName('proposed_height'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_dwelling_units',
    headerName: getColumnName('existing_dwelling_units'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'proposed_dwelling_units',
    headerName: getColumnName('proposed_dwelling_units'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'existing_occupancy',
    headerName: getColumnName('existing_occupancy'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'proposed_occupancy',
    headerName: getColumnName('proposed_occupancy'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'site_fill',
    headerName: getColumnName('site_fill'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist1',
    headerName: getColumnName('zoning_dist1'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist2',
    headerName: getColumnName('zoning_dist2'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist3',
    headerName: getColumnName('zoning_dist3'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_district_1',
    headerName: getColumnName('special_district_1'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_district_2',
    headerName: getColumnName('special_district_2'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_type',
    headerName: getColumnName('owner_type'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'non_profit',
    headerName: getColumnName('non_profit'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'dobrundate',
    headerName: getColumnName('dobrundate'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'job_s1_no',
    headerName: getColumnName('job_s1_no'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'total_construction_floor_area',
    headerName: getColumnName('total_construction_floor_area'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'withdrawal_flag',
    headerName: getColumnName('withdrawal_flag'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'signoff_date',
    headerName: getColumnName('signoff_date'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'special_action_status',
    headerName: getColumnName('special_action_status'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_action_date',
    headerName: getColumnName('special_action_date'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'building_class',
    headerName: getColumnName('building_class'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_no_good_count',
    headerName: getColumnName('job_no_good_count'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
];
