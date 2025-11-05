/**
 * Human-readable descriptions for property valuation database fields
 * Based on NYC DOF Property Valuation schema
 */
export const VALUATION_FIELD_DESCRIPTIONS: Record<string, string> = {
  // Identifiers
  'parid': 'PARID uniquely identifies each assessment record',
  'boro': 'Borough',
  'block': 'Block',
  'lot': 'Unique number within BORO/BLOCK',
  'easement': 'Easement',
  'subident_reuc': 'Sub-Ident REUC',
  'rectype': 'Record Type',
  'year': 'Four digit year',
  'ident': 'Ident',
  'subident': 'Sub-Ident',
  'roll_section': 'Roll Section',
  'secvol': 'Section Volume Number (2 Digits each)',

  // PY (Prior Year) values
  'pymktland': 'Market Assessed Land Value',
  'pymkttot': 'Market Assessed Total Value',
  'pyactland': 'Actual Assessed Land Value',
  'pyacttot': 'Actual Assessed Total Value',
  'pyactextot': 'Actual Exemption Total Value',
  'pytrnland': 'Transitional Assessed Land Value',
  'pytrntot': 'Transitional Assessed Total Value',
  'pytrnextot': 'Transitional Exemption Total Value',
  'pytxbtot': 'Taxable Assessed Total',
  'pytxbextot': 'Taxable Exemption Total',
  'pytaxflag': 'Taxable Flag',

  // TEN (Tentative) values
  'tenmktland': 'Tentative Market Assessed Land Value',
  'tenmkttot': 'Tentative Market Assessed Total Value',
  'tenactland': 'Tentative Actual Assessed Land Value',
  'tenacttot': 'Tentative Actual Assessed Total Value',
  'tenactextot': 'Tentative Actual Exemption Total Value',
  'tentrnland': 'Tentative Transitional Assessed Land Value',
  'tentrntot': 'Tentative Transitional Assessed Total Value',
  'tentrnextot': 'Tentative Transitional Exemption Total Value',
  'tentxbtot': 'Tentative Taxable Assessed Total',
  'tentxbextot': 'Tentative Taxable Exemption Total',
  'tentaxflag': 'Tentative Taxable Flag',

  // CBN (Change By Notice) values
  'cbnmktland': 'Change By Notice Market Assessed Land Value',
  'cbnmkttot': 'Change By Notice Market Assessed Total Value',
  'cbnactland': 'Change By Notice Actual Assessed Land Value',
  'cbnacttot': 'Change By Notice Actual Assessed Total Value',
  'cbnactextot': 'Change By Notice Actual Exemption Total Value',
  'cbntrnland': 'Change By Notice Transitional Assessed Land Value',
  'cbntrntot': 'Change By Notice Transitional Assessed Total Value',
  'cbntrnextot': 'Change By Notice Transitional Exemption Total Value',
  'cbntxbtot': 'Change By Notice Taxable Assessed Total Value',
  'cbntxbextot': 'Change By Notice Taxable Exemption Total Value',
  'cbntaxflag': 'Change By Notice Taxable Flag',

  // FIN (Final) values
  'finmktland': 'Final Market Assessed Land Value',
  'finmkttot': 'Final Market Assessed Total Value',
  'finactland': 'Final Actual Assessed Land Value',
  'finacttot': 'Final Actual Assessed Total Value',
  'finactextot': 'Final Actual Exemption Total Value',
  'fintrnland': 'Final Transitional Assessed Land Value',
  'fintrntot': 'Final Transitional Assessed Total Value',
  'fintrnextot': 'Final Transitional Exemption Total Value',
  'fintxbtot': 'Final Taxable Assessed Total Value',
  'fintxbextot': 'Final Taxable Exemption Total Value',
  'fintaxclass': 'Property Tax Class',
  'fintaxflag': 'Final Taxable Flag',

  // CUR (Current) values
  'curmktland': 'Current Market Assessed Land Value',
  'curmkttot': 'Current Market Assessed Total Value',
  'curactland': 'Current Actual Assessed Land Value',
  'curacttot': 'Current Actual Assessed Total Value',
  'curactextot': 'Current Actual Exemption Total Value',
  'curtrnland': 'Current Transitional Assessed Land Value',
  'curtrntot': 'Current Transitional Assessed Total Value',
  'curtrnextot': 'Current Transitional Exemption Total Value',
  'curtxbtot': 'Current Taxable Assessed Total Value',
  'curtxbextot': 'Current Taxable Exemption Total Value',
  'curtaxflag': 'Current Taxable Flag',

  // Property Details
  'period': 'Period',
  'newdrop': 'Indicates that the lot will be dropped at the end of the fiscal year',
  'noav': 'A building in progress',
  'valref': "The parcel's values are reflected in another lot",
  'bldg_class': 'Building Class',
  'owner': "Owner's Name",
  'zoning': 'Zoning code from NYC Department of City Planning',
  'housenum_lo': 'The lowest house number of the property',
  'housenum_hi': 'The highest house number of the property',
  'street_name': 'Street Name for the property',
  'zip_code': 'Postal Zip code for the property',
  'geosupport_rc': 'Status of the address data verification from Geosupport',
  'stcode': 'Street Code',

  // Land Information
  'lot_frt': 'Lot Frontage in feet',
  'lot_dep': 'Lot Depth in feet',
  'lor_irreg': 'Irregular shaped lot',
  'bld_frt': 'Building Frontage in feet',
  'bld_dep': 'Building Depth in feet',
  'bld_ext': 'Extension',
  'bld_story': 'The number of stories/floors for the building',
  'corner': 'The code to indicate a corner lot on two streets',
  'land_area': 'Total Land Area',
  'num_bldg': 'The Number of Buildings on the property',
  'yrbuilt': 'The year the building was constructed',
  'yrbuilt_range': 'The last year of the range',
  'yrbuilt_flag': 'Year Built is an estimate',
  'yralt1': 'Year of alteration',
  'yralt1_range': 'Last year of the alteration',
  'yralt2': 'Year of second alteration',
  'yralt2_range': 'Last year of the second alteration',

  // Unit Information
  'coop_apt': 'Coop Apartment',
  'units': 'Units',
  'reuc_ref': 'Contains the ident number (alpha/numeric) for REUC properties',
  'aptno': 'Apartment Number for condominium properties',
  'coop_num': 'Coop identification number',

  // Community Planning
  'cpb_boro': 'Borough code',
  'cpb_dist': 'Community planning board number',

  // Apportionment
  'appt_date': 'Date of the most recent apportionment',
  'appt_boro': 'Apportionment Borough',
  'appt_block': 'Apportionment Block',
  'appt_lot': 'Apportionment Lot',
  'appt_ease': 'Apportionment Easement',

  // Condo Information
  'condo_number': 'Condo identification number',
  'condo_sfx1': 'Condo Suffix 1',
  'condo_sfx2': 'Suffix 1 sequence number',
  'condo_sfx3': 'Not Used',
  'uaf_land': 'Land percent of common interest in the entire condo',
  'uaf_bldg': 'Building percent of common interest in the condo',

  // Protest Information
  'protest_1': 'Protest code',
  'protest_2': 'Indicates a second protest on the property',
  'protest_old': 'Same codes as the protest indicator',
  'attorney_group1': 'Protest Attorney identification number',
  'attorney_group2': 'Protest Attorney identification number',
  'attorney_group_old': 'Protest Attorney identification number',

  // Area Information
  'gross_sqft': 'Gross Square Footage of the building',
  'hotel_area_gross': 'Hotel Area Gross Square Footage',
  'office_area_gross': 'Office Area Gross Square Footage',
  'residential_area_gross': 'Residential Area Gross Square Footage',
  'retail_area_gross': 'Retail Area Gross Square Footage',
  'loft_area_gross': 'Loft Area Gross Square Footage',
  'factory_area_gross': 'Factory Area Gross Square Footage',
  'warehouse_area_gross': 'Warehouse Area Gross Square Footage',
  'storage_area_gross': 'Storage Area Gross Square Footage',
  'garage_area': 'Garage Area Gross Square Footage',
  'other_area_gross': 'Other Area Gross Square Footage',

  // REUC
  'reuc_description': 'REUC Description',

  // System Fields
  'extractdt': 'Data extract date',
  ':@computed_region_efsh_h5xi': 'Computed Region EFSH',
  ':@computed_region_f5dn_yrer': 'Computed Region F5DN',
  ':@computed_region_yeji_bk3q': 'Computed Region YEJI',
  ':@computed_region_92fq_4b7q': 'Computed Region 92FQ',
  ':@computed_region_sbqj_enih': 'Computed Region SBQJ',
  ':id': 'Record ID',
  ':created_at': 'Created At',
  ':updated_at': 'Updated At',
};

