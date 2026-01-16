'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { getBuildingClassCategory } from '@/constants/building';
import { PlutoData } from '@/data/pluto';
import { AcrisRecord } from '@/types/acris';
import { OwnerContact } from '@/types/contacts';
import { PropertyValuation } from '@/types/valuation';
import { formatValue, formatDate, formatUSPhone, formatCurrency, formatYoyChange } from '@/utils/formatters';
import { getTaxableAssessedValue, formatTaxYear, transformValuationToTaxRows } from '@/app/property/[bbl]/tax/components/utils';

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
      <dt className="text-xs font-medium text-foreground/50 mb-1">{label}</dt>
      <dd className="text-sm font-medium text-foreground" style={valueStyle}>{value}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function OverviewTab({ plutoData, propertyData, contactsData, valuationData, error, bbl }: OverviewTabProps) {
  // State for showing/hiding alternative addresses and contacts - must be at top before any returns
  const [showAllAddresses, setShowAllAddresses] = React.useState(false);
  const [showAllContacts, setShowAllContacts] = React.useState(false);

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
          <p className="text-sm text-foreground/70">No data available for this property.</p>
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

  // Extract and format ownership data from ACRIS
  const ownerName = propertyData?.buyer_name || '—';
  const ownerAddress = 'fix owner address'; // TODO: No owner address field in AcrisRecord

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Map Section */}
      <SectionCard title="Location">
        <div className="relative w-full aspect-[4/3] bg-foreground/10 rounded-md overflow-hidden">
          {/* Google Maps Embed - Satellite View */}
          {propertyAddress && zipcode ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(`${propertyAddress}, New York, NY ${zipcode}`)}&maptype=satellite&zoom=19`}
              title="Property Location Map"
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-foreground/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm text-foreground/50">Location map unavailable</p>
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
            <div>
              <dt className="text-xs font-medium text-foreground/50 mb-1.5">Alternative addresses</dt>
              <dd className="space-y-1">
                {displayedAddresses.map((addr, idx) => (
                  <div key={idx} className="text-sm text-foreground/80">{addr}</div>
                ))}
                {alternativeAddresses.length > 2 && (
                  <button
                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-1 hover:underline"
                  >
                    {showAllAddresses
                      ? 'Show less'
                      : `Show ${alternativeAddresses.length - 2} more`}
                  </button>
                )}
              </dd>
            </div>
          )}
        </dl>
      </SectionCard>

      {/* Building Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Building</h3>
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
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>

      {/* Ownership Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Ownership</h3>
          <dl className="space-y-3">
            <InfoItem label="Recorded Owner Name" value={ownerName} />
            <InfoItem label="Owner address" value={ownerAddress} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <InfoItem label="Sale Date" value={saleDate} />
              <InfoItem label="Sell Price" value={salePrice} />
            </div>
            <div className="border-t border-border/30 pt-3 mt-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <InfoItem label="Mortgage Date" value={mortgageDate} />
                <InfoItem label="Mortgage Amount" value={mortgageAmount} />
              </div>
              <div className="mt-2">
                <InfoItem label="Lender" value={lenderName} />
              </div>
            </div>
          </dl>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/transactions`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show Transactions
          </Link>
        </div>
      </div>

      {/* Tax Data Section - Tax Information */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Tax Information</h3>
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
            <div className="pt-2 border-t border-border/30 mt-2">
              <dt className="text-xs font-medium text-foreground/50 mb-1">Taxable Assessed Value ({taxYear})</dt>
              <dd className="text-sm font-medium text-foreground">{taxableAssessedValueDisplay}</dd>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              <InfoItem label="Property Tax" value={propertyTax} />
              <InfoItem
                label="Year Over Year Change"
                value={yoyChange}
                valueStyle={yoyColor ? { color: yoyColor } : undefined}
              />
            </div>
          </dl>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/tax`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Contacts</h3>
          {displayedContacts.length > 0 ? (
            <div className="space-y-3">
              {displayedContacts.map((contact, index) => {
                const contactName = contact.owner_master_full_name || 'Unknown';
                const phoneNumbers = contact.owner_phone || [];

                return (
                  <div key={index} className={index > 0 ? "pt-2 border-t border-border/30" : ""}>
                    <div className="text-sm font-medium text-foreground">{contactName}</div>
                    {phoneNumbers.map((phone, phoneIdx) => (
                      <div key={phoneIdx} className="text-xs text-foreground/60 mt-0.5">
                        {formatUSPhone(phone)}
                      </div>
                    ))}
                  </div>
                );
              })}
              {allContacts.length > 4 && (
                <button
                  onClick={() => setShowAllContacts(!showAllContacts)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                >
                  {showAllContacts
                    ? 'Show less'
                    : `Show ${allContacts.length - 4} more`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-foreground/50">No contact information available</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/property/${bbl}/contacts`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
          >
            Show More
          </Link>
        </div>
      </div>
    </div>
  );
}
