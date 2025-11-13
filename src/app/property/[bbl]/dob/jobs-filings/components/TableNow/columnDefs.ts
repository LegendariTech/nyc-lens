import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobJobNowApplicationRow } from './types';
import { getDobJobTypeDisplay } from '@/constants/dob';
import { formatCurrency, formatDate } from '@/utils/formatters';
import metadata from '../../now-metadata.json';

/**
 * Get column name from metadata
 */
function getColumnName(fieldName: string): string {
  const column = metadata.columns.find((col: { fieldName: string; name?: string }) => col.fieldName === fieldName);
  return column?.name || fieldName;
}

/**
 * Format applicant name from first, middle, and last name
 */
function formatApplicantName(row: DobJobNowApplicationRow): string {
  const firstName = row.applicant_first_name;
  const middleInitial = row.applicants_middle_initial;
  const lastName = row.applicant_last_name;

  const parts = [];
  if (firstName) parts.push(firstName);
  if (middleInitial) parts.push(middleInitial);
  if (lastName) parts.push(lastName);

  return parts.length > 0 ? parts.join(' ') : 'N/A';
}

/**
 * Format filing representative name from first, middle, and last name
 */
function formatFilingRepName(row: DobJobNowApplicationRow): string {
  const firstName = row.filing_representative_first_name;
  const middleInitial = row.filing_representative_middle_initial;
  const lastName = row.filing_representative_last_name;

  const parts = [];
  if (firstName) parts.push(firstName);
  if (middleInitial) parts.push(middleInitial);
  if (lastName) parts.push(lastName);

  return parts.length > 0 ? parts.join(' ') : 'N/A';
}

export const dobJobNowApplicationsColumnDefs: ColDef<DobJobNowApplicationRow>[] = [
  {
    field: 'job_filing_number',
    headerName: getColumnName('job_filing_number'),
    width: 160,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_date',
    headerName: getColumnName('filing_date'),
    width: 180,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, Date>) => {
      return formatDate(p.value);
    },
    filterValueGetter: (params) => {
      return formatDate(params.data?.filing_date);
    },
    comparator: (valueA: Date, valueB: Date) => {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return dateB - dateA;
    },
  },
  {
    field: 'job_type',
    headerName: getColumnName('job_type'),
    width: 150,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => getDobJobTypeDisplay(p.value ?? null),
  },
  {
    field: 'filing_status',
    headerName: getColumnName('filing_status'),
    width: 200,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'current_status_date',
    headerName: getColumnName('current_status_date'),
    width: 150,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, Date>) => formatDate(p.value),
    comparator: (valueA: Date, valueB: Date) => {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return dateB - dateA;
    },
  },
  {
    field: 'applicant_license',
    headerName: getColumnName('applicant_license'),
    width: 120,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    headerName: 'APPLICANT',
    width: 200,
    valueGetter: (params) => formatApplicantName(params.data!),
  },
  {
    field: 'initial_cost',
    headerName: getColumnName('initial_cost'),
    width: 140,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => {
      if (!p.value) return 'N/A';
      return formatCurrency(p.value);
    },
  },
  {
    field: 'house_no',
    headerName: getColumnName('house_no'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'street_name',
    headerName: getColumnName('street_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'borough',
    headerName: getColumnName('borough'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'block',
    headerName: getColumnName('block'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'lot',
    headerName: getColumnName('lot'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'bin',
    headerName: getColumnName('bin'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'commmunity_board',
    headerName: getColumnName('commmunity_board'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'work_on_floor',
    headerName: getColumnName('work_on_floor'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'apt_condo_no_s',
    headerName: getColumnName('apt_condo_no_s'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'applicant_professional_title',
    headerName: getColumnName('applicant_professional_title'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'applicant_first_name',
    headerName: getColumnName('applicant_first_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'applicants_middle_initial',
    headerName: getColumnName('applicants_middle_initial'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'applicant_last_name',
    headerName: getColumnName('applicant_last_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_s_business_name',
    headerName: getColumnName('owner_s_business_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_s_street_name',
    headerName: getColumnName('owner_s_street_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'city',
    headerName: getColumnName('city'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'state',
    headerName: getColumnName('state'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zip',
    headerName: getColumnName('zip'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    headerName: 'Filing Representative',
    hide: true,
    valueGetter: (params) => formatFilingRepName(params.data!),
  },
  {
    field: 'filing_representative_first_name',
    headerName: getColumnName('filing_representative_first_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_middle_initial',
    headerName: getColumnName('filing_representative_middle_initial'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_last_name',
    headerName: getColumnName('filing_representative_last_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_business_name',
    headerName: getColumnName('filing_representative_business_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_street_name',
    headerName: getColumnName('filing_representative_street_name'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_city',
    headerName: getColumnName('filing_representative_city'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_state',
    headerName: getColumnName('filing_representative_state'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'filing_representative_zip',
    headerName: getColumnName('filing_representative_zip'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'sprinkler_work_type',
    headerName: getColumnName('sprinkler_work_type'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'plumbing_work_type',
    headerName: getColumnName('plumbing_work_type'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'total_construction_floor_area',
    headerName: getColumnName('total_construction_floor_area'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'review_building_code',
    headerName: getColumnName('review_building_code'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'little_e',
    headerName: getColumnName('little_e'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'unmapped_cco_street',
    headerName: getColumnName('unmapped_cco_street'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'request_legalization',
    headerName: getColumnName('request_legalization'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'includes_permanent_removal',
    headerName: getColumnName('includes_permanent_removal'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'in_compliance_with_nycecc',
    headerName: getColumnName('in_compliance_with_nycecc'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'exempt_from_nycecc',
    headerName: getColumnName('exempt_from_nycecc'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'building_type',
    headerName: getColumnName('building_type'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'existing_stories',
    headerName: getColumnName('existing_stories'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_height',
    headerName: getColumnName('existing_height'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_dwelling_units',
    headerName: getColumnName('existing_dwelling_units'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_no_of_stories',
    headerName: getColumnName('proposed_no_of_stories'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_height',
    headerName: getColumnName('proposed_height'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_dwelling_units',
    headerName: getColumnName('proposed_dwelling_units'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'specialinspectionrequirement',
    headerName: getColumnName('specialinspectionrequirement'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_inspection_agency_number',
    headerName: getColumnName('special_inspection_agency_number'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'progressinspectionrequirement',
    headerName: getColumnName('progressinspectionrequirement'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'built_1_information_value',
    headerName: getColumnName('built_1_information_value'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'built_2_information_value',
    headerName: getColumnName('built_2_information_value'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'built_2_a_information_value',
    headerName: getColumnName('built_2_a_information_value'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'built_2_b_information_value',
    headerName: getColumnName('built_2_b_information_value'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'standpipe',
    headerName: getColumnName('standpipe'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'antenna',
    headerName: getColumnName('antenna'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'curb_cut',
    headerName: getColumnName('curb_cut'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'sign',
    headerName: getColumnName('sign'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fence',
    headerName: getColumnName('fence'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'scaffold',
    headerName: getColumnName('scaffold'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'shed',
    headerName: getColumnName('shed'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'postcode',
    headerName: getColumnName('postcode'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'latitude',
    headerName: getColumnName('latitude'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'longitude',
    headerName: getColumnName('longitude'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'council_district',
    headerName: getColumnName('council_district'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'census_tract',
    headerName: getColumnName('census_tract'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'bbl',
    headerName: getColumnName('bbl'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'nta',
    headerName: getColumnName('nta'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'first_permit_date',
    headerName: getColumnName('first_permit_date'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'boiler_equipment_work_type_',
    headerName: getColumnName('boiler_equipment_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'earth_work_work_type_',
    headerName: getColumnName('earth_work_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'foundation_work_type_',
    headerName: getColumnName('foundation_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'general_construction_work_type_',
    headerName: getColumnName('general_construction_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'mechanical_systems_work_type_',
    headerName: getColumnName('mechanical_systems_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'place_of_assembly_work_type_',
    headerName: getColumnName('place_of_assembly_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'protection_mechanical_methods_work_type_',
    headerName: getColumnName('protection_mechanical_methods_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'sidewalk_shed_work_type_',
    headerName: getColumnName('sidewalk_shed_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'structural_work_type_',
    headerName: getColumnName('structural_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'support_of_excavation_work_type_',
    headerName: getColumnName('support_of_excavation_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'temporary_place_of_assembly_work_type_',
    headerName: getColumnName('temporary_place_of_assembly_work_type_'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'approved_date',
    headerName: getColumnName('approved_date'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'signoff_date',
    headerName: getColumnName('signoff_date'),
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobNowApplicationRow, Date>) => formatDate(p.value),
  },
];

