/**
 * Property Valuation Data Types
 * Based on silver.dof_property_valuation table schema
 */

export interface PropertyValuation {
  parid: string | null;
  boro: number | null;
  block: number | null;
  lot: number | null;
  easement: string | null;
  subident_reuc: string | null;
  rectype: number | null;
  year: string | null;
  ident: string | null;
  subident: string | null;
  roll_section: string | null;
  secvol: number | null;

  // Prior Year (PY) values
  pymktland: number | null;
  pymkttot: number | null;
  pyactland: number | null;
  pyacttot: number | null;
  pyactextot: number | null;
  pytrnland: number | null;
  pytrntot: number | null;
  pytrnextot: number | null;
  pytxbtot: number | null;
  pytxbextot: number | null;
  pytaxclass: string | null;

  // Tentative (TEN) values
  tenmktland: number | null;
  tenmkttot: number | null;
  tenactland: number | null;
  tenacttot: number | null;
  tenactextot: number | null;
  tentrnland: number | null;
  tentrntot: number | null;
  tentrnextot: number | null;
  tentxbtot: number | null;
  tentxbextot: number | null;
  tentaxclass: string | null;

  // Condo Billable Notice (CBN) values
  cbnmktland: number | null;
  cbnmkttot: number | null;
  cbnactland: number | null;
  cbnacttot: number | null;
  cbnactextot: number | null;
  cbntrnland: number | null;
  cbntrntot: number | null;
  cbntrnextot: number | null;
  cbntxbtot: number | null;
  cbntxbextot: number | null;
  cbntaxclass: string | null;

  // Final (FIN) values
  finmktland: number | null;
  finmkttot: number | null;
  finactland: number | null;
  finacttot: number | null;
  finactextot: number | null;
  fintrnland: number | null;
  fintrntot: number | null;
  fintrnextot: number | null;
  fintxbtot: number | null;
  fintxbextot: number | null;
  fintaxclass: string | null;

  // Current (CUR) values
  curmktland: number | null;
  curmkttot: number | null;
  curactland: number | null;
  curacttot: number | null;
  curactextot: number | null;
  curtrnland: number | null;
  curtrntot: number | null;
  curtrnextot: number | null;
  curtxbtot: number | null;
  curtxbextot: number | null;
  curtaxclass: string | null;

  period: number | null;
  newdrop: number | null;
  noav: string | null;
  valref: string | null;
  bldg_class: string | null;
  owner: string | null;
  zoning: string | null;

  // Address information
  housenum_lo: string | null;
  housenum_hi: string | null;
  street_name: string | null;
  zip_code: string | null;

  gepsupport_rc: string | null;
  stcode: number | null;

  // Lot dimensions
  lot_frt: number | null;
  lot_dep: number | null;
  lot_irreg: string | null;

  // Building dimensions
  bld_frt: number | null;
  bld_dep: number | null;
  bld_ext: string | null;
  bld_story: number | null;

  corner: string | null;
  land_area: number | null;
  num_bldgs: number | null;

  // Year built information
  yrbuilt: number | null;
  yrbuilt_range: number | null;
  yrbuilt_flag: string | null;
  yralt1: number | null;
  yralt1_range: number | null;
  yralt2: number | null;
  yralt2_range: number | null;

  coop_apts: number | null;
  units: number | null;
  reuc_ref: string | null;
  aptno: string | null;
  coop_num: number | null;

  // Community Planning Board
  cpb_boro: number | null;
  cpb_dist: number | null;

  // Appointment information
  appt_date: Date | null;
  appt_boro: number | null;
  appt_block: number | null;
  appt_lot: number | null;
  appt_ease: string | null;

  // Condo information
  condo_number: number | null;
  condo_sfx1: string | null;
  condo_sfx2: number | null;
  condo_sfx3: string | null;

  // Unit Assessment Factors
  uaf_land: number | null;
  uaf_bldg: number | null;

  // Protest information
  protest_1: string | null;
  protest_2: string | null;
  protest_old: string | null;

  // Attorney groups
  attorney_group1: number | null;
  attorney_group2: string | null;
  attorney_group_old: number | null;

  // Gross square footage by type
  gross_sqft: number | null;
  hotel_area_gross: number | null;
  office_area_gross: number | null;
  residential_area_gross: number | null;
  retail_area_gross: number | null;
  loft_area_gross: number | null;
  factory_area_gross: number | null;
  warehouse_area_gross: number | null;
  storage_area_gross: number | null;
  garage_area: number | null;
  other_area_gross: number | null;

  reuc_description: string | null;
  extracrdt: Date | null;

  // Tax flags
  pytaxflag: string | null;
  tentaxflag: string | null;
  cbntaxflag: string | null;
  fintaxflag: string | null;
  curtaxflag: string | null;

  // Metadata fields (prefixed with [:])
  ':id': string | null;
  ':version': string | null;
  ':created_at': Date | null;
  ':updated_at': Date | null;
}

