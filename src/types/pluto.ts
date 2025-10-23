/**
 * PLUTO (Primary Land Use Tax Lot Output) data types
 * Based on NYC Department of City Planning data
 */

export interface PlutoRecord {
  // Basic identifiers
  borough: string;
  block: string;
  lot: string;
  bbl: string;
  address: string;
  zipcode: string;

  // Geographic & Administrative
  cd: number; // Community District
  ct2010: number; // Census Tract 2010
  cb2010: number; // Census Block 2010
  schooldist: number;
  council: number;
  firecomp: string;
  policeprct: number;
  healtharea: number;
  sanitboro: number;
  sanitsub: string;

  // Zoning
  zonedist1: string | null;
  zonedist2: string | null;
  zonedist3: string | null;
  zonedist4: string | null;
  overlay1: string | null;
  overlay2: string | null;
  spdist1: string | null;
  spdist2: string | null;
  spdist3: string | null;
  ltdheight: string | null;
  splitzone: boolean;

  // Building information
  bldgclass: string;
  landuse: number;
  easements: number;
  ownertype: string | null;
  ownername: string;

  // Area measurements (square feet)
  lotarea: string;
  bldgarea: string;
  comarea: string;
  resarea: string;
  officearea: string;
  retailarea: string;
  garagearea: string;
  strgearea: string;
  factryarea: string;
  otherarea: string;
  areasource: number;

  // Building details
  numbldgs: number;
  numfloors: string;
  unitsres: number;
  unitstotal: number;
  lotfront: string;
  lotdepth: string;
  bldgfront: string;
  bldgdepth: string;
  ext: string;
  proxcode: number;
  irrlotcode: boolean;
  lottype: number;
  bsmtcode: number;

  // Assessment & valuation
  assessland: string;
  assesstot: string;
  exempttot: string;

  // Historic information
  yearbuilt: number;
  yearalter1: number;
  yearalter2: number;
  histdist: string | null;
  landmark: string | null;

  // Floor Area Ratio (FAR)
  builtfar: string;
  residfar: string;
  commfar: string;
  facilfar: string;

  // Additional identifiers
  borocode: number;
  condono: string | null;
  tract2010: number;

  // Coordinates
  xcoord: string;
  ycoord: string;
  latitude: number;
  longitude: number;

  // Map references
  zonemap: string;
  zmcode: string | null;
  sanborn: string;
  taxmap: number;
  edesignum: string | null;
  appbbl: string | null;
  appdate: string | null;
  plutomapid: number;

  // Version & metadata
  version: string;
  sanitdistrict: number;
  healthcenterdistrict: number;
  firm07_flag: string | null;
  pfirm15_flag: string | null;

  // Date fields
  rpaddate: string | null;
  dcasdate: string | null;
  zoningdate: string | null;
  landmkdate: string | null;
  basempdate: string | null;
  masdate: string | null;
  polidate: string | null;
  edesigdate: string | null;

  // Geometry & notes
  geom: string | null;
  dcpedited: string | null;
  notes: string | null;

  // Census 2020
  bct2020: string;
  bctcb2020: string;

  // System fields
  ':id': string;
  ':version': string;
  ':created_at': string;
  ':updated_at': string;
}

/**
 * Land Use codes
 */
export const LAND_USE_CODES: Record<number, string> = {
  1: 'One & Two Family Buildings',
  2: 'Multi-Family Walk-Up Buildings',
  3: 'Multi-Family Elevator Buildings',
  4: 'Mixed Residential & Commercial Buildings',
  5: 'Commercial & Office Buildings',
  6: 'Industrial & Manufacturing',
  7: 'Transportation & Utility',
  8: 'Public Facilities & Institutions',
  9: 'Open Space & Outdoor Recreation',
  10: 'Parking Facilities',
  11: 'Vacant Land',
};

/**
 * Borough codes
 */
export const BOROUGH_CODES: Record<string, string> = {
  MN: 'Manhattan',
  BX: 'Bronx',
  BK: 'Brooklyn',
  QN: 'Queens',
  SI: 'Staten Island',
};

/**
 * Building class categories
 */
export const BUILDING_CLASS_CATEGORIES: Record<string, string> = {
  A: 'One Family Dwellings',
  B: 'Two Family Dwellings',
  C: 'Walk-Up Apartments',
  D: 'Elevator Apartments',
  E: 'Warehouses',
  F: 'Factory and Industrial Buildings',
  G: 'Garages and Gasoline Stations',
  H: 'Hotels',
  I: 'Hospitals and Health Facilities',
  J: 'Theatres',
  K: 'Store Buildings',
  L: 'Loft Buildings',
  M: 'Churches, Synagogues, etc.',
  N: 'Asylums and Homes',
  O: 'Office Buildings',
  P: 'Places of Public Assembly, Indoor',
  Q: 'Places of Public Assembly, Outdoor',
  R: 'Condominiums',
  S: 'Residence, Multiple Use',
  T: 'Transportation Facilities',
  U: 'Utility Bureau Properties',
  V: 'Miscellaneous',
  W: 'Educational Structures',
  Y: 'Selected Government Installations',
  Z: 'Miscellaneous',
};

