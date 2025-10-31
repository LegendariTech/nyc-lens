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

