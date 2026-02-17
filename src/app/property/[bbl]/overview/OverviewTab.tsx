'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { getBuildingClassCategory, BUILDING_CLASS_CODE_MAP } from '@/constants/building';
import { BOROUGH_NAMES } from '@/constants/nyc';
import { PlutoData } from '@/data/pluto';
import { AcrisRecord } from '@/types/acris';
import { OwnerContact } from '@/types/contacts';
import { PropertyValuation } from '@/types/valuation';
import { formatValue, formatDate, formatUSPhone, formatCurrency, formatYoyChange } from '@/utils/formatters';
import { getTaxableAssessedValue, formatTaxYear, transformValuationToTaxRows } from '@/app/property/[bbl]/tax/components/utils';

// Lazy load heavy Mapbox component
const ParcelMap = dynamic(() => import('@/components/map/ParcelMap').then(mod => ({ default: mod.ParcelMap })), {
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
      <p className="text-sm text-foreground/80">Loading map...</p>
    </div>
  ),
  ssr: false,
});

interface OverviewTabProps {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
  contactsData: OwnerContact[] | null;
  valuationData: PropertyValuation[] | null;
  error?: string;
  bbl?: string;
}

function InfoItem({ label, value, className, valueStyle }: { label: string; value: string | number; className?: string; valueStyle?: React.CSSProperties }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-foreground/80 mb-1">{label}</dt>
      <dd className="text-sm font-medium text-foreground" style={valueStyle}>{value}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

export function OverviewTab({ plutoData, propertyData, contactsData, valuationData, error, bbl }: OverviewTabProps) {
  // State for showing/hiding alternative addresses and contacts - must be at top before any returns
  const [showAllAddresses, setShowAllAddresses] = React.useState(false);
  const [showAllContacts, setShowAllContacts] = React.useState(false);
  const [showAllUnmaskedPhones, setShowAllUnmaskedPhones] = React.useState(false);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

  // Use whichever data source is available
  const data = plutoData || propertyData;

  if (!data) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-foreground/90">No data available for this property.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract address data
  const propertyAddress = propertyData?.address ||
    (propertyData?.street_number && propertyData?.street_name
      ? `${propertyData.street_number} ${propertyData.street_name}`
      : null);
  const zipcode = plutoData?.zipcode;
  const alternativeAddresses = propertyData?.aka || [];

  const displayedAddresses = showAllAddresses
    ? alternativeAddresses
    : alternativeAddresses.slice(0, 2);

  // Extract and format building data from PLUTO
  const buildingClass = plutoData?.bldgclass
    ? `${getBuildingClassCategory(plutoData.bldgclass)} (${plutoData.bldgclass})`
    : '—';

  const squareFeet = plutoData?.bldgarea
    ? formatValue(plutoData.bldgarea, undefined, 'number')
    : '—';

  const formatDimension = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return null;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) || num === 0 ? null : Math.round(num);
  };

  const frontFt = formatDimension(plutoData?.bldgfront);
  const depthFt = formatDimension(plutoData?.bldgdepth);
  const buildingDimensions = (frontFt && depthFt)
    ? `${frontFt} ft x ${depthFt} ft`
    : '—';

  const buildingsOnLot = plutoData?.numbldgs != null
    ? formatValue(plutoData.numbldgs, undefined, 'number')
    : '—';

  const stories = plutoData?.numfloors
    ? formatValue(plutoData.numfloors, undefined, 'number')
    : '—';

  const totalUnits = plutoData?.unitstotal != null
    ? formatValue(plutoData.unitstotal, undefined, 'number')
    : '—';

  const yearBuilt = plutoData?.yearbuilt
    ? formatValue(plutoData.yearbuilt, undefined, 'year')
    : '—';

  const yearAltered = plutoData?.yearalter2 || plutoData?.yearalter1;
  const yearLastAltered = yearAltered
    ? formatValue(yearAltered, undefined, 'year')
    : '—';

  // Extract unmasked owner from contacts with source "signator"
  const unmaskedOwners = contactsData
    ?.filter(contact =>
      contact.status === 'current' &&
      contact.source?.includes('signator')
    )
    .sort((a, b) => {
      // Sort by date if available, most recent first
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    }) || [];

  const unmaskedOwner = unmaskedOwners.length > 0 ? unmaskedOwners[0] : null;
  const unmaskedOwnerName = unmaskedOwner?.owner_master_full_name || null;
  const unmaskedOwnerAddress = unmaskedOwner?.owner_full_address?.[0] || null;
  const unmaskedOwnerPhones = unmaskedOwner?.owner_phone?.filter(phone => phone && phone !== 'N/A') || [];

  const displayedUnmaskedPhones = showAllUnmaskedPhones
    ? unmaskedOwnerPhones
    : unmaskedOwnerPhones.slice(0, 1);

  // Extract and format ownership data from ACRIS
  const recordedOwnerName = propertyData?.buyer_name || '—';

  const saleDate = propertyData?.sale_document_date
    ? formatDate(propertyData.sale_document_date)
    : '—';

  const salePrice = propertyData?.sale_document_amount != null
    ? formatValue(propertyData.sale_document_amount, undefined, 'currency')
    : '—';

  const mortgageDate = propertyData?.mortgage_document_date
    ? formatDate(propertyData.mortgage_document_date)
    : '—';

  const mortgageAmount = propertyData?.mortgage_document_amount != null
    ? formatValue(propertyData.mortgage_document_amount, undefined, 'currency')
    : '—';

  const lenderName = propertyData?.lender_name || '—';

  // Extract and format contacts data - prioritize contacts with phone numbers, then show all others
  const allContacts = contactsData
    ?.filter(contact => {
      // Filter out contacts that are not current
      if (contact.status !== 'current') {
        return false;
      }
      // Filter out contacts with master name N/A
      if (!contact.owner_master_full_name || contact.owner_master_full_name === 'N/A') {
        return false;
      }
      return true;
    })
    .map(contact => ({
      ...contact,
      // Filter out N/A from phone array
      owner_phone: contact.owner_phone?.filter(phone => phone && phone !== 'N/A') || []
    }))
    .sort((a, b) => {
      // Prioritize contacts with phone numbers first
      const aHasPhone = a.owner_phone && a.owner_phone.length > 0;
      const bHasPhone = b.owner_phone && b.owner_phone.length > 0;
      if (aHasPhone && !bHasPhone) return -1;
      if (!aHasPhone && bHasPhone) return 1;
      return 0;
    }) || [];

  const displayedContacts = showAllContacts
    ? allContacts
    : allContacts.slice(0, 4);

  // Extract and format tax/assessment data from valuation
  const latestValuation = valuationData && valuationData.length > 0 ? valuationData[0] : null;
  const taxRows = valuationData ? transformValuationToTaxRows(valuationData) : [];
  const latestTaxRow = taxRows.length > 0 ? taxRows[0] : null;

  const estimatedMarketValue = latestValuation?.finmkttot != null
    ? formatCurrency(latestValuation.finmkttot)
    : '—';

  const assessedValue = latestValuation?.finacttot != null
    ? formatCurrency(latestValuation.finacttot)
    : '—';

  const hasMarketValueExemption = latestValuation?.finactextot != null &&
    latestValuation.finactextot !== 0
  const marketValueExemption = hasMarketValueExemption
    ? formatCurrency(latestValuation.finactextot)
    : '—';

  const transitionalAssessedValue = latestValuation?.fintrntot != null
    ? formatCurrency(latestValuation.fintrntot)
    : '—';

  const hasTransitionalValueExemption = latestValuation?.fintrnextot != null &&
    latestValuation.fintrnextot !== 0
  const transitionalValueExemption = hasTransitionalValueExemption
    ? formatCurrency(latestValuation.fintrnextot)
    : '—';

  const taxableAssessedValue = latestValuation
    ? getTaxableAssessedValue(latestValuation.fintxbtot, latestValuation.fintxbextot)
    : null;

  const taxableAssessedValueDisplay = taxableAssessedValue != null
    ? formatCurrency(taxableAssessedValue)
    : '—';

  const taxYear = latestValuation?.year
    ? formatTaxYear(latestValuation.year)
    : '—';

  const propertyTax = latestTaxRow?.propertyTax != null
    ? formatCurrency(latestTaxRow.propertyTax)
    : '—';

  const yoyChangeValue = latestTaxRow?.yoyChange;
  const yoyChange = formatYoyChange(yoyChangeValue);
  const yoyColor = yoyChangeValue != null
    ? (yoyChangeValue >= 0 ? '#4ade80' : '#f87171') // green for positive, red for negative
    : undefined;

  // Extract coordinates for map
  const latitude = plutoData?.latitude;
  const longitude = plutoData?.longitude;
  const hasCoordinates = latitude != null && longitude != null;

  // Mapbox configuration from environment variables
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  // Get borough name for intro text
  const boroughCode = bbl?.split('-')[0];
  const boroughName = boroughCode ? BOROUGH_NAMES[boroughCode] || 'NYC' : 'NYC';

  // Build full address with zipcode for SEO
  const fullAddress = propertyAddress
    ? `${propertyAddress}, ${boroughName}, NY${zipcode ? ` ${zipcode}` : ''}`
    : `BBL ${bbl}, ${boroughName}`;

  // Build descriptive intro text
  const buildingTypeDesc = plutoData?.bldgclass && BUILDING_CLASS_CODE_MAP[plutoData.bldgclass]
    ? BUILDING_CLASS_CODE_MAP[plutoData.bldgclass].toLowerCase()
    : 'property';

  return (
    <div className="space-y-6">
      {/* SEO-optimized header and intro */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Property Information for {fullAddress}
        </h1>

        <div className="space-y-3 text-base text-foreground/80 leading-relaxed">
          <p>
            Access comprehensive NYC property records for {fullAddress}. This page provides detailed information from official New York City databases including building characteristics, ownership records, sales history, tax assessments, and contact information. All data is sourced from NYC Department of Finance, Department of City Planning (PLUTO), and ACRIS (Automated City Register Information System).
          </p>

          {plutoData?.yearbuilt && (
            <p>
              This {buildingTypeDesc} was constructed in {plutoData.yearbuilt}
              {plutoData.unitstotal && Number(plutoData.unitstotal) > 0 && ` and contains ${totalUnits} ${Number(plutoData.unitstotal) === 1 ? 'residential unit' : 'residential units'}`}
              {squareFeet !== '—' && `. The building spans ${squareFeet} square feet`}
              {plutoData?.lotarea && Number(plutoData.lotarea) > 0 && ` on a ${formatValue(plutoData.lotarea, undefined, 'number')} square foot lot`}.
            </p>
          )}
        </div>
      </div>

      {/* Property data sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Map Section */}
      <SectionCard title="Location">
        <div className="relative w-full aspect-[4/3] bg-foreground/10 rounded-md overflow-hidden">
          {/* Mapbox Parcel Map */}
          {hasCoordinates && bbl ? (
            <ParcelMap
              bbl={bbl}
              latitude={latitude}
              longitude={longitude}
              accessToken={MAPBOX_ACCESS_TOKEN}
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-foreground/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm text-foreground/80">Location map unavailable</p>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Address Section */}
      <SectionCard title="Address">
        <dl className="space-y-3">
          <InfoItem label="Property address" value={propertyAddress || '—'} />
          <InfoItem label="Zip code" value={zipcode || '—'} />
          <InfoItem label="BBL" value={bbl || '—'} />

          {alternativeAddresses.length > 0 && (
            <>
              <div>
                <dt className="text-xs font-medium text-foreground/80 mb-1.5">Alternative addresses</dt>
                <dd>
                  <div className="space-y-1">
                    {displayedAddresses.map((addr, idx) => (
                      <div key={idx} className="text-sm text-foreground/80">{addr}</div>
                    ))}
                  </div>
                </dd>
              </div>
              {alternativeAddresses.length > 2 && (
                <div>
                  <dt className="sr-only">Show more addresses</dt>
                  <dd>
                    <button
                      onClick={() => setShowAllAddresses(!showAllAddresses)}
                      className="text-xs text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      {showAllAddresses
                        ? 'Show less'
                        : `Show ${alternativeAddresses.length - 2} more`}
                    </button>
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>
      </SectionCard>

      {/* Building Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Building</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <InfoItem label="Building class" value={buildingClass} />
            <InfoItem label="Square feet" value={squareFeet} />
            <InfoItem label="Dimensions" value={buildingDimensions} />
            <InfoItem label="Buildings on lot" value={buildingsOnLot} />
            <InfoItem label="Stories" value={stories} />
            <InfoItem label="Total Units" value={totalUnits} />
            <InfoItem label="Year built" value={yearBuilt} />
            <InfoItem label="Year altered" value={yearLastAltered} />
          </dl>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/pluto`}
            aria-label="View more building information"
            className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>

      {/* Ownership Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Ownership</h2>
          <dl className="space-y-3">
            {/* Unmasked Owner - Most Prominent */}
            {unmaskedOwnerName && (
              <div className="pb-3 border-b-2 border-teal-500/30 bg-teal-500/5 -mx-2 px-2 py-2 rounded-md">
                <dt className="text-xs font-medium text-teal-700 dark:text-teal-400 mb-1.5 uppercase tracking-wide">
                  Unmasked Owner
                </dt>
                <dd className="text-base font-bold text-foreground mb-2">{unmaskedOwnerName}</dd>
                {unmaskedOwnerAddress && (
                  <dd className="text-sm text-foreground/90 mb-1">{unmaskedOwnerAddress}</dd>
                )}
                {unmaskedOwnerPhones.length > 0 && (
                  <>
                    <dt className="sr-only">Phone Numbers</dt>
                    {displayedUnmaskedPhones.map((phone, idx) => (
                      <dd key={idx} className="text-sm text-foreground/90">
                        {formatUSPhone(phone)}
                      </dd>
                    ))}
                    {unmaskedOwnerPhones.length > 1 && (
                      <dd className="mt-1">
                        <button
                          onClick={() => setShowAllUnmaskedPhones(!showAllUnmaskedPhones)}
                          className="text-xs text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium hover:underline"
                        >
                          {showAllUnmaskedPhones
                            ? 'Show less'
                            : `Show ${unmaskedOwnerPhones.length - 1} more phone${unmaskedOwnerPhones.length > 2 ? 's' : ''}`}
                        </button>
                      </dd>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Recorded Owner - Secondary */}
            <InfoItem label="Recorded Owner" value={recordedOwnerName} />
          </dl>

          {/* Sale Information */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            <InfoItem label="Sale Date" value={saleDate} />
            <InfoItem label="Sale Price" value={salePrice} />
          </dl>

          {/* Mortgage Information */}
          <div className="border-t border-border/30 pt-3 mt-3">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <InfoItem label="Mortgage Date" value={mortgageDate} />
              <InfoItem label="Mortgage Amount" value={mortgageAmount} />
            </dl>
            <dl className="mt-2">
              <InfoItem label="Lender" value={lenderName} />
            </dl>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/transactions`}
            className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show Transactions
          </Link>
        </div>
      </div>

      {/* Tax Data Section - Tax Information */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tax Information</h2>
          <dl className="space-y-3">
            <InfoItem label="Estimated Market Value" value={estimatedMarketValue} />
            <InfoItem label="Assessed Value" value={assessedValue} />
            {hasMarketValueExemption && (
              <InfoItem label="Market Value Exemption" value={marketValueExemption} />
            )}
            <InfoItem label="Transitional Assessed Value" value={transitionalAssessedValue} />
            {hasTransitionalValueExemption && (
              <InfoItem label="Transitional Value Exemption" value={transitionalValueExemption} />
            )}
          </dl>

          <dl className="pt-2 border-t border-border/30 mt-2">
            <div>
              <dt className="text-xs font-medium text-foreground/80 mb-1">Taxable Assessed Value ({taxYear})</dt>
              <dd className="text-sm font-medium text-foreground">{taxableAssessedValueDisplay}</dd>
            </div>
          </dl>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <InfoItem label="Property Tax" value={propertyTax} />
            <InfoItem
              label="Year Over Year Change"
              value={yoyChange}
              valueStyle={yoyColor ? { color: yoyColor } : undefined}
            />
          </dl>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/tax`}
            aria-label="View more tax information"
            className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Contacts</h2>
          {displayedContacts.length > 0 ? (
            <div className="space-y-3">
              {displayedContacts.map((contact, index) => {
                const contactName = contact.owner_master_full_name || 'Unknown';
                const phoneNumbers = contact.owner_phone || [];

                return (
                  <div key={index} className={index > 0 ? "pt-2 border-t border-border/30" : ""}>
                    <div className="text-sm font-medium text-foreground">{contactName}</div>
                    {phoneNumbers.map((phone, phoneIdx) => (
                      <div key={phoneIdx} className="text-xs text-foreground/80 mt-0.5">
                        {formatUSPhone(phone)}
                      </div>
                    ))}
                  </div>
                );
              })}
              {allContacts.length > 4 && (
                <button
                  onClick={() => setShowAllContacts(!showAllContacts)}
                  className="text-xs text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                >
                  {showAllContacts
                    ? 'Show less'
                    : `Show ${allContacts.length - 4} more`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-foreground/80">No contact information available</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/contacts`}
            aria-label="View more contact information"
            className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>
      </div>

      {/* SEO-friendly FAQ section - Full width plain text below cards */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          About {fullAddress}
        </h2>

        <div className="space-y-4 text-sm text-foreground/80 leading-relaxed max-w-4xl">
          {/* FAQ 1: Building Size */}
          {squareFeet !== '—' && (
            <p>
              <strong className="text-foreground">How many sq. ft. does {fullAddress} have?</strong>
              {' '}
              {buildingClass !== '—' && `This ${buildingClass.toLowerCase()} located at `}
              {fullAddress} has a total of {squareFeet} square feet
              {plutoData?.yearbuilt && ` and was built in ${plutoData.yearbuilt}`}.
            </p>
          )}

          {/* FAQ 2: Units and Zoning */}
          {(totalUnits !== '—' || plutoData?.zonedist1) && (
            <p>
              <strong className="text-foreground">
                {totalUnits !== '—'
                  ? `How many units does ${fullAddress} have?`
                  : `What zoning district is ${fullAddress} in?`
                }
              </strong>
              {' '}
              {totalUnits !== '—' && `This property contains ${totalUnits} residential units`}
              {totalUnits !== '—' && plutoData?.zonedist1 && ` and is located in the `}
              {plutoData?.zonedist1 && `${plutoData.zonedist1} zoning district`}
              {plutoData?.lotarea && Number(plutoData.lotarea) > 0 && ` on a ${formatValue(plutoData.lotarea, undefined, 'number')} square foot lot`}.
            </p>
          )}

          {/* FAQ 3: Property Ownership & Mortgages */}
          {(recordedOwnerName !== '—' || propertyData?.mortgage_document_amount) && (
            <p>
              <strong className="text-foreground">Who owns {fullAddress} and what are the recent mortgage transactions?</strong>
              {' '}
              {recordedOwnerName !== '—' && `According to NYC ACRIS records, ${fullAddress} is owned by ${recordedOwnerName}`}
              {propertyData?.sale_document_date && saleDate !== '—' && `. The property was last sold on ${saleDate}`}
              {propertyData?.sale_document_amount && salePrice !== '—' && ` for ${salePrice}`}
              {propertyData?.mortgage_document_amount && mortgageAmount !== '—' && `. The most recent mortgage recorded is ${mortgageAmount}`}
              {propertyData?.mortgage_document_date && mortgageDate !== '—' && ` from ${mortgageDate}`}
              {lenderName !== '—' && ` with lender ${lenderName}`}.
            </p>
          )}

          {/* FAQ 4: Tax Assessment & Market Value */}
          {(estimatedMarketValue !== '—' || propertyTax !== '—') && (
            <p>
              <strong className="text-foreground">What is the current market value and property tax for {fullAddress}?</strong>
              {' '}
              According to NYC Department of Finance records, {fullAddress}
              {estimatedMarketValue !== '—' && ` has an estimated market value of ${estimatedMarketValue}`}
              {estimatedMarketValue !== '—' && propertyTax !== '—' && ` and `}
              {propertyTax !== '—' && `an annual property tax of ${propertyTax}`}
              {taxYear !== '—' && ` for the ${taxYear} tax year`}.
            </p>
          )}

          {/* FAQ 5: Alternative Addresses */}
          {alternativeAddresses.length > 0 && (
            <p>
              <strong className="text-foreground">What are the alternative addresses for {fullAddress}?</strong>
              {' '}
              This property is also known by {alternativeAddresses.length === 1 ? 'the following address' : 'these addresses'}: {alternativeAddresses.slice(0, 5).join(', ')}
              {alternativeAddresses.length > 5 && ` and ${alternativeAddresses.length - 5} more`}. Alternative addresses are common for NYC properties with multiple entrances or corner locations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
