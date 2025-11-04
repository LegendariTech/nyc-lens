import { type SectionDefinition } from '../../utils/datasourceDisplay';
import { type PlutoData } from '@/data/pluto';
import {
  getCommunityDistrictUrl,
  getCouncilDistrictUrl,
  getZoningDistrictUrl,
} from '@/constants/nyc';

/**
 * PLUTO section definitions for data display
 * These define the structure and organization of PLUTO data fields
 */
export const plutoSections: SectionDefinition<PlutoData>[] = [
  {
    title: 'Basic Information',
    fields: [
      { label: 'Address', fieldName: 'address' },
      { label: 'Borough', fieldName: 'borough' },
      { label: 'Block', fieldName: 'block' },
      { label: 'Lot', fieldName: 'lot' },
      { label: 'BBL', fieldName: 'bbl' },
      { label: 'ZIP Code', fieldName: 'zipcode' },
      { label: 'Borough Code', fieldName: 'borocode' },
      { label: 'Condominium Number', fieldName: 'condono' },
    ],
  },
  {
    title: 'Building Information',
    fields: [
      { label: 'Building Class', fieldName: 'bldgclass' },
      { label: 'Year Built', fieldName: 'yearbuilt' },
      { label: 'Year Altered 1', fieldName: 'yearalter1' },
      { label: 'Year Altered 2', fieldName: 'yearalter2' },
      { label: 'Number of Buildings', fieldName: 'numbldgs' },
      { label: 'Number of Floors', fieldName: 'numfloors', format: 'number' },
      { label: 'Building Area (sq ft)', fieldName: 'bldgarea', format: 'number' },
      { label: 'Residential Units', fieldName: 'unitsres' },
      { label: 'Total Units', fieldName: 'unitstotal' },
      { label: 'Extension', fieldName: 'ext' },
      { label: 'Basement Code', fieldName: 'bsmtcode' },
    ],
  },
  {
    title: 'Geographic & Administrative',
    fields: [
      {
        label: 'Community District',
        fieldName: 'cd',
        link: (data) => getCommunityDistrictUrl(data.cd as number) || undefined
      },
      {
        label: 'Council District',
        fieldName: 'council',
        link: (data) => getCouncilDistrictUrl(data.council as number) || undefined
      },
      { label: 'Census Tract 2010', fieldName: 'ct2010' },
      { label: 'Census Block 2010', fieldName: 'cb2010' },
      { label: 'Census Tract 2020', fieldName: 'tract2010' },
      { label: 'School District', fieldName: 'schooldist' },
      { label: 'Police Precinct', fieldName: 'policeprct' },
      { label: 'Fire Company', fieldName: 'firecomp' },
      { label: 'Health Area', fieldName: 'healtharea' },
      { label: 'Health Center District', fieldName: 'healthcenterdistrict' },
      { label: 'Sanitation Borough', fieldName: 'sanitboro' },
      { label: 'Sanitation Subsection', fieldName: 'sanitsub' },
      { label: 'Sanitation District', fieldName: 'sanitdistrict' },
    ],
  },
  {
    title: 'Area Breakdown',
    fields: [
      { label: 'Lot Area (sq ft)', fieldName: 'lotarea', format: 'number' },
      { label: 'Lot Frontage', fieldName: 'lotfront', format: 'number' },
      { label: 'Lot Depth', fieldName: 'lotdepth', format: 'number' },
      { label: 'Building Frontage', fieldName: 'bldgfront', format: 'number' },
      { label: 'Building Depth', fieldName: 'bldgdepth', format: 'number' },
      { label: 'Commercial Area (sq ft)', fieldName: 'comarea', format: 'number' },
      { label: 'Residential Area (sq ft)', fieldName: 'resarea', format: 'number' },
      { label: 'Office Area (sq ft)', fieldName: 'officearea', format: 'number' },
      { label: 'Retail Area (sq ft)', fieldName: 'retailarea', format: 'number' },
      { label: 'Garage Area (sq ft)', fieldName: 'garagearea', format: 'number' },
      { label: 'Storage Area (sq ft)', fieldName: 'strgearea', format: 'number' },
      { label: 'Factory Area (sq ft)', fieldName: 'factryarea', format: 'number' },
      { label: 'Other Area (sq ft)', fieldName: 'otherarea', format: 'number' },
      { label: 'Area Source', fieldName: 'areasource' },
    ],
  },
  {
    title: 'Ownership & Assessment',
    fields: [
      { label: 'Owner Name', fieldName: 'ownername' },
      { label: 'Owner Type', fieldName: 'ownertype' },
      { label: 'Assessed Land Value', fieldName: 'assessland', format: 'currency' },
      { label: 'Total Assessed Value', fieldName: 'assesstot', format: 'currency' },
      { label: 'Exempt Total', fieldName: 'exempttot', format: 'currency' },
      { label: 'Easements', fieldName: 'easements' },
    ],
  },
  {
    title: 'Floor Area Ratio (FAR)',
    fields: [
      { label: 'Built FAR', fieldName: 'builtfar', format: 'number' },
      { label: 'Residential FAR', fieldName: 'residfar', format: 'number' },
      { label: 'Commercial FAR', fieldName: 'commfar', format: 'number' },
      { label: 'Facility FAR', fieldName: 'facilfar', format: 'number' },
    ],
  },
  {
    title: 'Land Use & Zoning',
    fields: [
      { label: 'Land Use', fieldName: 'landuse' },
      {
        label: 'Zoning District 1',
        fieldName: 'zonedist1',
        link: (data) => getZoningDistrictUrl(data.zonedist1 as string) || undefined
      },
      {
        label: 'Zoning District 2',
        fieldName: 'zonedist2',
        link: (data) => getZoningDistrictUrl(data.zonedist2 as string) || undefined
      },
      {
        label: 'Zoning District 3',
        fieldName: 'zonedist3',
        link: (data) => getZoningDistrictUrl(data.zonedist3 as string) || undefined
      },
      {
        label: 'Zoning District 4',
        fieldName: 'zonedist4',
        link: (data) => getZoningDistrictUrl(data.zonedist4 as string) || undefined
      },
      { label: 'Commercial Overlay 1', fieldName: 'overlay1' },
      { label: 'Commercial Overlay 2', fieldName: 'overlay2' },
      { label: 'Special District 1', fieldName: 'spdist1' },
      { label: 'Special District 2', fieldName: 'spdist2' },
      { label: 'Special District 3', fieldName: 'spdist3' },
      { label: 'Limited Height District', fieldName: 'ltdheight' },
      { label: 'Split Zone', fieldName: 'splitzone' },
      { label: 'Zoning Map', fieldName: 'zonemap' },
      { label: 'Zoning Map Code', fieldName: 'zmcode' },
    ],
  },
  {
    title: 'Administrative Dates',
    fields: [
      { label: 'RPAD Date', fieldName: 'rpaddate' },
      { label: 'DCAS Date', fieldName: 'dcasdate' },
      { label: 'Zoning Date', fieldName: 'zoningdate' },
      { label: 'Landmark Date', fieldName: 'landmkdate' },
      { label: 'Basement Date', fieldName: 'basempdate' },
      { label: 'MAS Date', fieldName: 'masdate' },
      { label: 'Police Date', fieldName: 'polidate' },
      { label: 'Edition Designation Date', fieldName: 'edesigdate' },
    ],
  },
  {
    title: 'Historic & Landmark',
    fields: [
      { label: 'Historic District', fieldName: 'histdist' },
      { label: 'Landmark', fieldName: 'landmark' },
    ],
  },
  {
    title: 'Census 2020',
    fields: [
      { label: 'Block Census Tract 2020', fieldName: 'bct2020' },
      { label: 'Block Census Tract/Census Block 2020', fieldName: 'bctcb2020' },
    ],
  },
];

