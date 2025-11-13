import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import type { DobJobApplicationRow } from './types';
import { getDobJobStatusDisplay, getDobJobTypeDisplay } from '@/constants/dob';
import { formatCurrency, formatDate } from '@/utils/formatters';

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
    field: 'pre__filing_date',
    headerName: 'FILE DATE',
    width: 180,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
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
    field: 'job__',
    headerName: 'JOB #',
    width: 140,
    pinned: 'left',
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'doc__',
    headerName: 'DOC #',
    width: 100,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_type',
    headerName: 'JOB TYPE',
    width: 150,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => getDobJobTypeDisplay(p.value ?? null),
  },
  {
    field: 'job_status',
    headerName: 'JOB STATUS',
    width: 350,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => getDobJobStatusDisplay(p.value ?? null),
  },
  {
    field: 'latest_action_date',
    headerName: 'STATUS DATE',
    width: 150,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
    comparator: (valueA: Date, valueB: Date) => {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return dateB - dateA; // Most recent first
    },
  },
  {
    field: 'applicant_license__',
    headerName: 'LIC #',
    width: 120,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'initial_cost',
    headerName: 'Initial Cost',
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
    headerName: 'Total Est Fee',
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
    headerName: 'Fee Status',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    headerName: 'APPLICANT',
    width: 200,
    valueGetter: (params) => formatApplicantName(params.data!),
  },
  {
    field: 'applicant_professional_title',
    headerName: 'Applicant Professional Title',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'professional_cert',
    headerName: 'Professional Cert',
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
    headerName: 'Owner Business Name',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_s_house_number',
    headerName: 'Owner House Number',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_shouse_street_name',
    headerName: 'Owner Street Name',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'city_',
    headerName: 'City',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'state',
    headerName: 'State',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zip',
    headerName: 'Zip',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_sphone__',
    headerName: 'Owner Phone',
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_description',
    headerName: 'Job Description',
    width: 400,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) =>
      p.value || 'N/A',
    tooltipField: 'job_description',
  },
  {
    field: 'job_status_descrp',
    hide: true,
    headerName: 'Job Status Description',
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'community___board',
    headerName: 'Community Board',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'cluster',
    headerName: 'Cluster',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'landmarked',
    headerName: 'Landmarked',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'adult_estab',
    headerName: 'Adult Establishment',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'loft_board',
    headerName: 'Loft Board',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'city_owned',
    headerName: 'City Owned',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'little_e',
    headerName: 'Little E',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'pc_filed',
    headerName: 'PC Filed',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'efiling_filed',
    headerName: 'Efiling Filed',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'plumbing',
    headerName: 'Plumbing',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'mechanical',
    headerName: 'Mechanical',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'boiler',
    headerName: 'Boiler',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fuel_burning',
    headerName: 'Fuel Burning',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fuel_storage',
    headerName: 'Fuel Storage',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'standpipe',
    headerName: 'Standpipe',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'sprinkler',
    headerName: 'Sprinkler',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fire_alarm',
    headerName: 'Fire Alarm',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'equipment',
    headerName: 'Equipment',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fire_suppression',
    headerName: 'Fire Suppression',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'curb_cut',
    headerName: 'Curb Cut',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'other',
    headerName: 'Other',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'other_description',
    headerName: 'Other Description',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'paid',
    headerName: 'Paid',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fully_paid',
    headerName: 'Fully Paid',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'assigned',
    headerName: 'Assigned',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'fully_permitted',
    headerName: 'Fully Permitted',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'existing_zoning_sqft',
    headerName: 'Existing Zoning Sqft',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_zoning_sqft',
    headerName: 'Proposed Zoning Sqft',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'horizontal_enlrgmt',
    headerName: 'Horizontal Enlargement',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'vertical_enlrgmt',
    headerName: 'Vertical Enlargement',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'enlargement_sq_footage',
    headerName: 'Enlargement Sq Footage',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'street_frontage',
    headerName: 'Street Frontage',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existingno_of_stories',
    headerName: 'Existing Stories',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_no_of_stories',
    headerName: 'Proposed Stories',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_height',
    headerName: 'Existing Height',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'proposed_height',
    headerName: 'Proposed Height',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, number>) => p.value?.toString() || 'N/A',
  },
  {
    field: 'existing_dwelling_units',
    headerName: 'Existing Dwelling Units',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'proposed_dwelling_units',
    headerName: 'Proposed Dwelling Units',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'existing_occupancy',
    headerName: 'Existing Occupancy',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'proposed_occupancy',
    headerName: 'Proposed Occupancy',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'site_fill',
    headerName: 'Site Fill',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist1',
    headerName: 'Zoning District 1',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist2',
    headerName: 'Zoning District 2',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'zoning_dist3',
    headerName: 'Zoning District 3',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_district_1',
    headerName: 'Special District 1',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_district_2',
    headerName: 'Special District 2',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'owner_type',
    headerName: 'Owner Type',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'non_profit',
    headerName: 'Non Profit',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'dobrundate',
    headerName: 'DOB Run Date',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'job_s1_no',
    headerName: 'Job S1 No',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'total_construction_floor_area',
    headerName: 'Total Construction Floor Area',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'withdrawal_flag',
    headerName: 'Withdrawal Flag',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'signoff_date',
    headerName: 'Signoff Date',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'special_action_status',
    headerName: 'Special Action Status',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'special_action_date',
    headerName: 'Special Action Date',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, Date>) => formatDate(p.value),
  },
  {
    field: 'building_class',
    headerName: 'Building Class',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
  {
    field: 'job_no_good_count',
    headerName: 'Job No Good Count',
    hide: true,
    valueFormatter: (p: ValueFormatterParams<DobJobApplicationRow, string>) => p.value || 'N/A',
  },
];
