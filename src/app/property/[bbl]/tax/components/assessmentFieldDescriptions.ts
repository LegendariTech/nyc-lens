/**
 * Field descriptions for NYC property assessment data
 * Based on NYC Department of Finance documentation
 */

export const ASSESSMENT_FIELD_DESCRIPTIONS = {
  // Property Information
  ownerName: "The name of the property owner as registered with the NYC Department of Finance.",
  propertyAddress: "The primary address of the property as recorded in the NYC Department of Finance records.",
  bbl: "Borough-Block-Lot (BBL) is the unique identifier for each property in New York City. The first digit represents the borough code, followed by the tax block and lot numbers.",
  taxClass: "Properties in NYC are classified into four tax classes based on their use: Class 1 (residential properties with 1-3 units), Class 2 (residential properties with 4+ units and co-ops/condos), Class 3 (utility properties), and Class 4 (commercial and industrial properties).",
  buildingClass: "A detailed classification code that describes the type of building structure. These codes provide more specific information than the tax class about the property's physical characteristics and use.",

  // Land Information
  lotFrontage: "The width of the property's street frontage measured in feet.",
  lotDepth: "The distance from the street to the rear of the property measured in feet.",
  landArea: "The total land area of the property measured in square feet.",
  lotShape: "Indicates whether the lot has a regular rectangular shape or an irregular configuration.",
  corner: "Indicates whether the property is located on a corner lot, which may affect its value and use.",
  numBuildings: "The total number of buildings located on the tax lot.",

  // Building Information
  buildingFrontage: "The width of the building's front face measured in feet.",
  buildingDepth: "The distance from the front to the back of the building measured in feet.",
  stories: "The number of floors or stories in the building.",
  extension: "Indicates whether the building has been extended beyond its original footprint.",

  // Assessment Values
  estimatedMarketValue: "The Department of Finance's estimate of what the property would sell for in an open market transaction. This is the starting point for calculating assessed value.",
  marketAssessedValue: "The value used for tax purposes, calculated by applying assessment ratios to the estimated market value. Assessment ratios vary by tax class and are set by state law.",
  marketValueExemption: "The amount of market value exemption granted to the property, which reduces the assessed value for tax purposes. Common exemptions include STAR, veterans, clergy, and disability exemptions.",
  transitionalAssessedValue: "A phased-in assessed value used to limit year-over-year increases in property taxes. The transitional value caps annual increases at 6% for Class 1 properties and 8% for Class 2 properties (or 30% over 5 years for Class 2).",
  transitionalValueExemption: "The amount of transitional value exemption, which is the difference between the market assessed value and the transitional assessed value.",
  taxableAssessedValue: "The final assessed value used to calculate property taxes, after applying all exemptions and phase-ins. Your property tax is calculated by multiplying this value by the tax rate for your property's tax class.",
};


