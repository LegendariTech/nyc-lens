/**
 * DOB Safety Violations Data Types
 * Based on silver.dob_safety_violation table schema (DOB NOW)
 */
export interface DobSafetyViolation {
  bin: string | null;
  violation_issue_date: string | null;
  violation_number: string | null;
  violation_type: string | null;
  violation_remarks: string | null;
  violation_status: string | null;
  device_number: string | null;
  device_type: string | null;
  cycle_end_date: string | null;
  borough: string | null;
  block: number | null;
  lot: number | null;
  house_number: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  community_board: number | null;
  council_district: number | null;
  bbl: number | null;
  census_tract_2020_: number | null;
  neighborhood_tabulation_area_nta_2020_: string | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

/**
 * DOB Violations Data Types (BIS)
 * Based on silver.dob_violation table schema (Buildings Information System)
 */
export interface DobViolationBIS {
  isn_dob_bis_viol: string | null;
  boro: string | null;
  bin: string | null;
  block: string | null;
  lot: string | null;
  issue_date: string | null;
  violation_type_code: string | null;
  violation_number: string | null;
  house_number: string | null;
  street: string | null;
  disposition_date: string | null;
  disposition_comments: string | null;
  device_number: string | null;
  description: string | null;
  ecb_number: string | null;
  number: string | null;
  violation_category: string | null;
  violation_type: string | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

/**
 * DOB Job Application Filing Data Types
 * Based on silver.dob_job_application_filling table schema
 */
export interface DobJobApplicationFiling {
  job__: string | null;
  doc__: string | null;
  borough: string | null;
  house__: string | null;
  street_name: string | null;
  block: string | null;
  lot: string | null;
  bin__: string | null;
  job_type: string | null;
  job_status: string | null;
  job_status_descrp: string | null;
  latest_action_date: Date | null;
  building_type: string | null;
  community___board: string | null;
  cluster: string | null;
  landmarked: string | null;
  adult_estab: string | null;
  loft_board: string | null;
  city_owned: string | null;
  little_e: string | null;
  pc_filed: string | null;
  efiling_filed: string | null;
  plumbing: string | null;
  mechanical: string | null;
  boiler: string | null;
  fuel_burning: string | null;
  fuel_storage: string | null;
  standpipe: string | null;
  sprinkler: string | null;
  fire_alarm: string | null;
  equipment: string | null;
  fire_suppression: string | null;
  curb_cut: string | null;
  other: string | null;
  other_description: string | null;
  applicant_s_first_name: string | null;
  applicant_s_last_name: string | null;
  applicant_professional_title: string | null;
  applicant_license__: string | null;
  professional_cert: string | null;
  pre__filing_date: Date | null;
  paid: string | null;
  fully_paid: string | null;
  assigned: string | null;
  approved: string | null;
  fully_permitted: string | null;
  initial_cost: string | null;
  total_est__fee: string | null;
  fee_status: string | null;
  existing_zoning_sqft: number | null;
  proposed_zoning_sqft: number | null;
  horizontal_enlrgmt: string | null;
  vertical_enlrgmt: string | null;
  enlargement_sq_footage: number | null;
  street_frontage: number | null;
  existingno_of_stories: number | null;
  proposed_no_of_stories: number | null;
  existing_height: number | null;
  proposed_height: number | null;
  existing_dwelling_units: string | null;
  proposed_dwelling_units: string | null;
  existing_occupancy: string | null;
  proposed_occupancy: string | null;
  site_fill: string | null;
  zoning_dist1: string | null;
  zoning_dist2: string | null;
  zoning_dist3: string | null;
  special_district_1: string | null;
  special_district_2: string | null;
  owner_type: string | null;
  non_profit: string | null;
  owner_s_first_name: string | null;
  owner_s_last_name: string | null;
  owner_s_business_name: string | null;
  owner_s_house_number: string | null;
  owner_shouse_street_name: string | null;
  city_: string | null;
  state: string | null;
  zip: string | null;
  owner_sphone__: string | null;
  job_description: string | null;
  dobrundate: Date | null;
  job_s1_no: string | null;
  total_construction_floor_area: string | null;
  withdrawal_flag: string | null;
  signoff_date: Date | null;
  special_action_status: string | null;
  special_action_date: Date | null;
  building_class: string | null;
  job_no_good_count: string | null;
  gis_latitude: number | null;
  gis_longitude: number | null;
  gis_council_district: string | null;
  gis_census_tract: string | null;
  gis_nta_name: string | null;
  gis_bin: string | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

/**
 * DOB NOW Job Application Filing Data Types
 * Based on silver.dob_job_application_filling_now table schema
 */
export interface DobJobApplicationFilingNow {
  job_filing_number: string | null;
  filing_status: string | null;
  house_no: string | null;
  street_name: string | null;
  borough: string | null;
  block: string | null;
  lot: string | null;
  bin: string | null;
  commmunity_board: string | null;
  work_on_floor: string | null;
  apt_condo_no_s: string | null;
  applicant_professional_title: string | null;
  applicant_license: string | null;
  applicant_first_name: string | null;
  applicants_middle_initial: string | null;
  applicant_last_name: string | null;
  owner_s_business_name: string | null;
  owner_s_street_name: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  filing_representative_first_name: string | null;
  filing_representative_middle_initial: string | null;
  filing_representative_last_name: string | null;
  filing_representative_business_name: string | null;
  filing_representative_street_name: string | null;
  filing_representative_city: string | null;
  filing_representative_state: string | null;
  filing_representative_zip: string | null;
  sprinkler_work_type: string | null;
  plumbing_work_type: string | null;
  initial_cost: number | null;
  total_construction_floor_area: number | null;
  review_building_code: string | null;
  little_e: string | null;
  unmapped_cco_street: string | null;
  request_legalization: string | null;
  includes_permanent_removal: string | null;
  in_compliance_with_nycecc: string | null;
  exempt_from_nycecc: string | null;
  building_type: string | null;
  existing_stories: number | null;
  existing_height: number | null;
  existing_dwelling_units: number | null;
  proposed_no_of_stories: number | null;
  proposed_height: number | null;
  proposed_dwelling_units: number | null;
  specialinspectionrequirement: string | null;
  special_inspection_agency_number: string | null;
  progressinspectionrequirement: string | null;
  built_1_information_value: string | null;
  built_2_information_value: string | null;
  built_2_a_information_value: string | null;
  built_2_b_information_value: string | null;
  standpipe: string | null;
  antenna: string | null;
  curb_cut: string | null;
  sign: string | null;
  fence: string | null;
  scaffold: string | null;
  shed: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  council_district: number | null;
  census_tract: string | null;
  bbl: string | null;
  nta: string | null;
  filing_date: Date | null;
  current_status_date: Date | null;
  first_permit_date: Date | null;
  boiler_equipment_work_type_: string | null;
  earth_work_work_type_: string | null;
  foundation_work_type_: string | null;
  general_construction_work_type_: string | null;
  mechanical_systems_work_type_: string | null;
  place_of_assembly_work_type_: string | null;
  protection_mechanical_methods_work_type_: string | null;
  sidewalk_shed_work_type_: string | null;
  structural_work_type_: string | null;
  support_of_excavation_work_type_: string | null;
  temporary_place_of_assembly_work_type_: string | null;
  job_type: string | null;
  approved_date: Date | null;
  signoff_date: Date | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

