/**
 * Property Valuation Data Types
 * Based on silver.dof_property_valuation table schema
 */

export interface PropertyValuation {
  /** Uniquely identifies each assessment record */
  parid: string | null;
  /** Borough */
  boro: number | null;
  /** Block */
  block: number | null;
  /** Unique number within BORO/BLOCK */
  lot: number | null;
  easement: string | null;
  subident_reuc: string | null;
  /** Record Type */
  rectype: number | null;
  /** Four digit year */
  year: string | null;
  ident: string | null;
  subident: string | null;
  roll_section: string | null;
  /** Section Volume Number (2 digits each) */
  secvol: number | null;

  // Prior Year (PY) values
  /** Market Assessed Land Value */
  pymktland: number | null;
  /** Market Assessed Total Value */
  pymkttot: number | null;
  /** Actual Assessed Land Value */
  pyactland: number | null;
  /** Actual Assessed Total Value */
  pyacttot: number | null;
  /** Actual Exemption Total Value */
  pyactextot: number | null;
  /** Transitional Assessed Land Value */
  pytrnland: number | null;
  /** Transitional Assessed Total Value */
  pytrntot: number | null;
  /** Transitional Exemption Total Value */
  pytrnextot: number | null;
  /** Taxable Assessed Total */
  pytxbtot: number | null;
  /** Taxable Exemption Total */
  pytxbextot: number | null;
  /** Property Tax Class */
  pytaxclass: string | null;

  // Tentative (TEN) values
  /** Tentative Market Assessed Land Value */
  tenmktland: number | null;
  /** Tentative Market Assessed Total Value */
  tenmkttot: number | null;
  /** Tentative Actual Assessed Land Value */
  tenactland: number | null;
  /** Tentative Actual Assessed Total Value */
  tenacttot: number | null;
  /** Tentative Actual Exemption Total Value */
  tenactextot: number | null;
  /** Tentative Transitional Assessed Land Value */
  tentrnland: number | null;
  /** Tentative Transitional Assessed Total Value */
  tentrntot: number | null;
  /** Tentative Transitional Exemption Total Value */
  tentrnextot: number | null;
  /** Tentative Taxable Assessed Total */
  tentxbtot: number | null;
  /** Tentative Taxable Exemption Total */
  tentxbextot: number | null;
  /** Property Tax Class */
  tentaxclass: string | null;

  // Change By Notice (CBN) values
  /** Change By Notice Market Assessed Land Value */
  cbnmktland: number | null;
  /** Change By Notice Market Assessed Total Value */
  cbnmkttot: number | null;
  /** Change By Notice Actual Assessed Land Value */
  cbnactland: number | null;
  /** Change By Notice Actual Assessed Total Value */
  cbnacttot: number | null;
  /** Change By Notice Actual Exemption Total Value */
  cbnactextot: number | null;
  /** Change By Notice Transitional Assessed Land Value */
  cbntrnland: number | null;
  /** Change By Notice Transitional Assessed Total Value */
  cbntrntot: number | null;
  /** Change By Notice Transitional Exemption Total Value */
  cbntrnextot: number | null;
  /** Change By Notice Taxable Assessed Total Value */
  cbntxbtot: number | null;
  /** Change By Notice Taxable Exemption Total Value */
  cbntxbextot: number | null;
  /** Property Tax Class */
  cbntaxclass: string | null;

  // Final (FIN) values
  /** Final Market Assessed Land Value */
  finmktland: number | null;
  /** Final Market Assessed Total Value */
  finmkttot: number | null;
  /** Final Actual Assessed Land Value */
  finactland: number | null;
  /** Final Actual Assessed Total Value */
  finacttot: number | null;
  /** Final Actual Exemption Total Value */
  finactextot: number | null;
  /** Final Transitional Assessed Land Value */
  fintrnland: number | null;
  /** Final Transitional Assessed Total Value */
  fintrntot: number | null;
  /** Final Transitional Exemption Total Value */
  fintrnextot: number | null;
  /** Final Taxable Assessed Total Value */
  fintxbtot: number | null;
  /** Final Taxable Exemption Total Value */
  fintxbextot: number | null;
  /** Property Tax Class */
  fintaxclass: string | null;

  // Current (CUR) values
  /** Current Market Assessed Land Value */
  curmktland: number | null;
  /** Current Market Assessed Total Value */
  curmkttot: number | null;
  /** Current Actual Assessed Land Value */
  curactland: number | null;
  /** Current Actual Assessed Total Value */
  curacttot: number | null;
  /** Current Actual Exemption Total Value */
  curactextot: number | null;
  /** Current Transitional Assessed Land Value */
  curtrnland: number | null;
  /** Current Transitional Assessed Total Value */
  curtrntot: number | null;
  /** Current Transitional Exemption Total Value */
  curtrnextot: number | null;
  /** Current Taxable Assessed Total Value */
  curtxbtot: number | null;
  /** Current Taxable Exemption Total Value */
  curtxbextot: number | null;
  /** Property Tax Class */
  curtaxclass: string | null;

  period: number | null;
  /** Indicates that the lot will be dropped at the end of the fiscal year */
  newdrop: number | null;
  /** A building in progress */
  noav: string | null;
  /** The parcel's values are reflected in another lot */
  valref: string | null;
  /** Building Class */
  bldg_class: string | null;
  /** Owner's Name */
  owner: string | null;
  /** Zoning code from NYC Department of City Planning */
  zoning: string | null;

  // Address information
  /** The lowest house number of the property */
  housenum_lo: string | null;
  /** The highest house number of the property */
  housenum_hi: string | null;
  /** Street Name for the property */
  street_name: string | null;
  /** Postal Zip code for the property */
  zip_code: string | null;

  /** Status of the address data verification from Geosupport */
  gepsupport_rc: string | null;
  /** Street Code */
  stcode: number | null;

  // Lot dimensions
  /** Lot Frontage in feet */
  lot_frt: number | null;
  /** Lot Depth in feet */
  lot_dep: number | null;
  /** Irregular shaped lot */
  lot_irreg: string | null;

  // Building dimensions
  /** Building Frontage in feet */
  bld_frt: number | null;
  /** Building Depth in feet */
  bld_dep: number | null;
  /** Extension */
  bld_ext: string | null;
  /** The number of stories/floors for the building */
  bld_story: number | null;

  /** Corner lot indicator code */
  corner: string | null;
  /** Total Land Area */
  land_area: number | null;
  /** The Number of Buildings on the property */
  num_bldgs: number | null;

  // Year built information
  /** The year the building was constructed */
  yrbuilt: number | null;
  /** The last year of the range */
  yrbuilt_range: number | null;
  /** Year Built is an estimate */
  yrbuilt_flag: string | null;
  /** Year of alteration */
  yralt1: number | null;
  /** Last year of the alteration */
  yralt1_range: number | null;
  /** Year of second alteration */
  yralt2: number | null;
  /** Last year of the second alteration */
  yralt2_range: number | null;

  coop_apts: number | null;
  units: number | null;
  /** Contains the ident number (alpha/numeric) for REUC properties */
  reuc_ref: string | null;
  /** Apartment Number for condominium properties */
  aptno: string | null;
  /** Coop identification number */
  coop_num: number | null;

  // Community Planning Board
  /** Borough code */
  cpb_boro: number | null;
  /** Community planning board number */
  cpb_dist: number | null;

  // Apportionment information
  /** Date of the most recent apportionment */
  appt_date: Date | null;
  /** Apportionment Borough */
  appt_boro: number | null;
  /** Apportionment Block */
  appt_block: number | null;
  /** Apportionment Lot */
  appt_lot: number | null;
  /** Apportionment Easement */
  appt_ease: string | null;

  // Condo information
  /** Condo identification number */
  condo_number: number | null;
  condo_sfx1: string | null;
  /** Suffix 1 sequence number */
  condo_sfx2: number | null;
  /** Not Used */
  condo_sfx3: string | null;

  // Unit Assessment Factors
  /** Land percent of common interest in the entire condo */
  uaf_land: number | null;
  /** Building percent of common interest in the condo */
  uaf_bldg: number | null;

  // Protest information
  /** Protest code */
  protest_1: string | null;
  /** Indicates a second protest on the property */
  protest_2: string | null;
  /** Same codes as the protest indicator */
  protest_old: string | null;

  // Attorney groups
  /** Protest Attorney identification number */
  attorney_group1: number | null;
  /** Protest Attorney identification number */
  attorney_group2: string | null;
  /** Protest Attorney identification number */
  attorney_group_old: number | null;

  // Gross square footage by type
  /** Gross Square Footage of the building */
  gross_sqft: number | null;
  /** Hotel Area Gross Square Footage */
  hotel_area_gross: number | null;
  /** Office Area Gross Square Footage */
  office_area_gross: number | null;
  /** Residential Area Gross Square Footage */
  residential_area_gross: number | null;
  /** Retail Area Gross Square Footage */
  retail_area_gross: number | null;
  /** Loft Area Gross Square Footage */
  loft_area_gross: number | null;
  /** Factory Area Gross Square Footage */
  factory_area_gross: number | null;
  /** Warehouse Area Gross Square Footage */
  warehouse_area_gross: number | null;
  /** Storage Area Gross Square Footage */
  storage_area_gross: number | null;
  /** Garage Area Gross Square Footage */
  garage_area: number | null;
  /** Other Area Gross Square Footage */
  other_area_gross: number | null;

  /** REUC Description */
  reuc_description: string | null;
  /** Data extract date */
  extracrdt: Date | null;

  // Tax flags
  /** Taxable Flag */
  pytaxflag: string | null;
  /** Tentative Taxable Flag */
  tentaxflag: string | null;
  /** Change By Notice Taxable Flag */
  cbntaxflag: string | null;
  /** Final Taxable Flag */
  fintaxflag: string | null;
  /** Current Taxable Flag */
  curtaxflag: string | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}
