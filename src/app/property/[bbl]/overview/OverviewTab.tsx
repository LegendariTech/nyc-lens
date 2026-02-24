'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { BUILDING_CLASS_CODE_MAP } from '@/constants/building';
import { PlutoData } from '@/data/pluto';
import { AcrisRecord } from '@/types/acris';
import { OwnerContact } from '@/types/contacts';
import { PropertyValuation } from '@/types/valuation';
import { formatValue, formatUSPhone } from '@/utils/formatters';
import {
  getBuildingSectionData,
  getAddressSectionData,
  getOwnershipSectionData,
  getTaxSectionData,
  getContactsSectionData,
} from './utils';

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
  fullFormattedAddress?: string;
  addressSegment?: string;
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

export function OverviewTab({ plutoData, propertyData, contactsData, valuationData, error, bbl, fullFormattedAddress, addressSegment }: OverviewTabProps) {
  const getTabUrl = (tab: string) => {
    if (!bbl) return '#';
    const basePath = `/property/${bbl}/${tab}`;
    return addressSegment ? `${basePath}/${addressSegment}` : basePath;
  };

  const [showAllAddresses, setShowAllAddresses] = React.useState(false);
  const [showAllContacts, setShowAllContacts] = React.useState(false);
  const [showAllUnmaskedPhones, setShowAllUnmaskedPhones] = React.useState(false);

  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-600">Error Loading Data</h3>
        <p className="text-sm text-red-600/80">{error}</p>
      </div>
    );
  }

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

  // Prepare all section data via utils
  const latestValuation = valuationData && valuationData.length > 0 ? valuationData[0] : null;

  const address = getAddressSectionData(propertyData, plutoData, bbl, fullFormattedAddress);
  const building = getBuildingSectionData(plutoData, latestValuation);
  const ownership = getOwnershipSectionData(propertyData, contactsData);
  const tax = getTaxSectionData(valuationData);
  const allContacts = getContactsSectionData(contactsData);

  // State-dependent slicing
  const displayedAddresses = showAllAddresses
    ? address.alternativeAddresses
    : address.alternativeAddresses.slice(0, 2);

  const displayedUnmaskedPhones = showAllUnmaskedPhones
    ? (ownership.unmaskedOwner?.phones ?? [])
    : (ownership.unmaskedOwner?.phones ?? []).slice(0, 1);

  const displayedContacts = showAllContacts
    ? allContacts
    : allContacts.slice(0, 4);

  // Map data
  const latitude = plutoData?.latitude;
  const longitude = plutoData?.longitude;
  const hasCoordinates = latitude != null && longitude != null;
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

  // SEO intro
  const buildingTypeDesc = plutoData?.bldgclass && BUILDING_CLASS_CODE_MAP[plutoData.bldgclass]
    ? BUILDING_CLASS_CODE_MAP[plutoData.bldgclass].toLowerCase()
    : 'property';

  return (
    <div className="space-y-6">
      {/* SEO-optimized header and intro */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          {address.fullAddress}
        </h1>

        <div className="space-y-3 text-base text-foreground/80 leading-relaxed">
          <p>
            Access comprehensive NYC property records for {address.fullAddress}. This page provides detailed information from official New York City databases including building characteristics, ownership records, sales history, tax assessments, and contact information. All data is sourced from NYC Department of Finance, Department of City Planning (PLUTO), and ACRIS (Automated City Register Information System).
          </p>

          {plutoData?.yearbuilt && (
            <p>
              This {buildingTypeDesc} was constructed in {plutoData.yearbuilt}
              {plutoData.unitstotal && Number(plutoData.unitstotal) > 0 && ` and contains ${building.totalUnits} ${Number(plutoData.unitstotal) === 1 ? 'residential unit' : 'residential units'}`}
              {building.squareFeet !== '—' && `. The building spans ${building.squareFeet} square feet`}
              {plutoData?.lotarea && Number(plutoData.lotarea) > 0 && ` on a ${formatValue(plutoData.lotarea, undefined, 'number')} square foot lot`}.
            </p>
          )}
        </div>
      </div>

      {/* Property data sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Map Section */}
        <SectionCard title="Location">
          <div ref={mapContainerRef} className="relative w-full aspect-[4/3] bg-foreground/10 rounded-md overflow-hidden">
            {hasCoordinates && bbl ? (
              shouldLoadMap ? (
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
                    <div className="animate-pulse">
                      <svg className="mx-auto h-12 w-12 text-foreground/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-foreground/80">Map loading...</p>
                  </div>
                </div>
              )
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
            <InfoItem label="Property address" value={address.propertyAddress || '—'} />
            <InfoItem label="Borough" value={`${address.boroughCode} - ${address.boroughName}`} />
            <InfoItem label="Block" value={address.block} />
            <InfoItem label="Lot" value={address.lot} />
            <InfoItem label="Zip code" value={address.zipcode || '—'} />

            {address.alternativeAddresses.length > 0 && (
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
                {address.alternativeAddresses.length > 2 && (
                  <div>
                    <dt className="sr-only">Show more addresses</dt>
                    <dd>
                      <button
                        onClick={() => setShowAllAddresses(!showAllAddresses)}
                        className="text-xs text-foreground hover:text-foreground/80 font-semibold hover:underline"
                      >
                        {showAllAddresses
                          ? 'Show less'
                          : `Show ${address.alternativeAddresses.length - 2} more`}
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
              <InfoItem label="Building class" value={building.buildingClass} />
              <InfoItem label="Square feet" value={building.squareFeet} />
              <InfoItem label="Dimensions" value={building.buildingDimensions} />
              <InfoItem label="Buildings on lot" value={building.buildingsOnLot} />
              <InfoItem label="Stories" value={building.stories} />
              <InfoItem label="Total Units" value={building.totalUnits} />
              <InfoItem label="Year built" value={building.yearBuilt} />
              <InfoItem label="Year altered" value={building.yearLastAltered} />
            </dl>
          </div>
          <div className="flex justify-end mt-4">
            <Link
              href={getTabUrl('pluto')}
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
              {ownership.unmaskedOwner && (
                <div className="pb-3 border-b-2 border-foreground/20 bg-foreground/10 -mx-2 px-2 py-2 rounded-md">
                  <dt className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    Unmasked Owner
                  </dt>
                  <dd className="text-base font-bold text-foreground mb-2">{ownership.unmaskedOwner.name}</dd>
                  {ownership.unmaskedOwner.address && (
                    <dd className="text-sm text-foreground/90 mb-1">{ownership.unmaskedOwner.address}</dd>
                  )}
                  {ownership.unmaskedOwner.phones.length > 0 && (
                    <>
                      <dt className="sr-only">Phone Numbers</dt>
                      {displayedUnmaskedPhones.map((phone, idx) => (
                        <dd key={idx} className="text-sm text-foreground/90">
                          {formatUSPhone(phone)}
                        </dd>
                      ))}
                      {ownership.unmaskedOwner.phones.length > 1 && (
                        <dd className="mt-1">
                          <button
                            onClick={() => setShowAllUnmaskedPhones(!showAllUnmaskedPhones)}
                            className="text-xs text-foreground hover:text-foreground/80 font-semibold hover:underline"
                          >
                            {showAllUnmaskedPhones
                              ? 'Show less'
                              : `Show ${ownership.unmaskedOwner.phones.length - 1} more phone${ownership.unmaskedOwner.phones.length > 2 ? 's' : ''}`}
                          </button>
                        </dd>
                      )}
                    </>
                  )}
                </div>
              )}

              <InfoItem label="Recorded Owner" value={ownership.recordedOwnerName} />
            </dl>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              <InfoItem label="Sale Date" value={ownership.saleDate} />
              <InfoItem label="Sale Price" value={ownership.salePrice} />
            </dl>

            <div className="border-t border-border/30 pt-3 mt-3">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <InfoItem label="Mortgage Date" value={ownership.mortgageDate} />
                <InfoItem label="Mortgage Amount" value={ownership.mortgageAmount} />
              </dl>
              <dl className="mt-2">
                <InfoItem label="Lender" value={ownership.lenderName} />
              </dl>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link
              href={getTabUrl('transactions')}
              className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
            >
              Show Transactions
            </Link>
          </div>
        </div>

        {/* Tax Data Section */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 shadow-sm flex flex-col h-full">
          <div className="flex-1">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Tax Information</h2>
            <dl className="space-y-3">
              <InfoItem label="Estimated Market Value" value={tax.estimatedMarketValue} />
              <InfoItem label="Assessed Value" value={tax.assessedValue} />
              {tax.hasMarketValueExemption && (
                <InfoItem label="Market Value Exemption" value={tax.marketValueExemption} />
              )}
              <InfoItem label="Transitional Assessed Value" value={tax.transitionalAssessedValue} />
              {tax.hasTransitionalValueExemption && (
                <InfoItem label="Transitional Value Exemption" value={tax.transitionalValueExemption} />
              )}
            </dl>

            <dl className="pt-2 border-t border-border/30 mt-2">
              <div>
                <dt className="text-xs font-medium text-foreground/80 mb-1">Taxable Assessed Value ({tax.taxYear})</dt>
                <dd className="text-sm font-medium text-foreground">{tax.taxableAssessedValue}</dd>
              </div>
            </dl>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              <InfoItem label="Property Tax" value={tax.propertyTax} />
              <InfoItem
                label="Year Over Year Change"
                value={tax.yoyChange}
                valueStyle={tax.yoyColor ? { color: tax.yoyColor } : undefined}
              />
            </dl>
          </div>
          <div className="flex justify-end mt-4">
            <Link
              href={getTabUrl('tax')}
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
                {displayedContacts.map((contact, index) => (
                  <div key={index} className={index > 0 ? "pt-2 border-t border-border/30" : ""}>
                    <div className="text-sm font-medium text-foreground">{contact.owner_master_full_name}</div>
                    {contact.owner_phone.map((phone, phoneIdx) => (
                      <div key={phoneIdx} className="text-xs text-foreground/80 mt-0.5">
                        {formatUSPhone(phone)}
                      </div>
                    ))}
                  </div>
                ))}
                {allContacts.length > 4 && (
                  <button
                    onClick={() => setShowAllContacts(!showAllContacts)}
                    className="text-xs text-foreground hover:text-foreground/80 font-semibold hover:underline"
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
              href={getTabUrl('contacts')}
              aria-label="View more contact information"
              className="inline-flex items-center justify-center px-4 py-3 min-h-[48px] text-xs font-medium text-foreground/90 hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-md transition-colors"
            >
              Show More
            </Link>
          </div>
        </div>
      </div>

      {/* SEO-friendly FAQ section */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          About {address.fullAddress}
        </h2>

        <div className="space-y-4 text-sm text-foreground/80 leading-relaxed max-w-4xl">
          {building.squareFeet !== '—' && (
            <p>
              <strong className="text-foreground">How many sq. ft. does {address.fullAddress} have?</strong>
              {' '}
              {building.buildingClass !== '—' && `This ${building.buildingClass.toLowerCase()} located at `}
              {address.fullAddress} has a total of {building.squareFeet} square feet
              {plutoData?.yearbuilt && ` and was built in ${plutoData.yearbuilt}`}.
            </p>
          )}

          {(building.totalUnits !== '—' || plutoData?.zonedist1) && (
            <p>
              <strong className="text-foreground">
                {building.totalUnits !== '—'
                  ? `How many units does ${address.fullAddress} have?`
                  : `What zoning district is ${address.fullAddress} in?`
                }
              </strong>
              {' '}
              {building.totalUnits !== '—' && `This property contains ${building.totalUnits} residential units`}
              {building.totalUnits !== '—' && plutoData?.zonedist1 && ` and is located in the `}
              {plutoData?.zonedist1 && `${plutoData.zonedist1} zoning district`}
              {plutoData?.lotarea && Number(plutoData.lotarea) > 0 && ` on a ${formatValue(plutoData.lotarea, undefined, 'number')} square foot lot`}.
            </p>
          )}

          {(ownership.recordedOwnerName !== '—' || propertyData?.mortgage_document_amount) && (
            <p>
              <strong className="text-foreground">Who owns {address.fullAddress} and what are the recent mortgage transactions?</strong>
              {' '}
              {ownership.recordedOwnerName !== '—' && `According to NYC ACRIS records, ${address.fullAddress} is owned by ${ownership.recordedOwnerName}`}
              {propertyData?.sale_document_date && ownership.saleDate !== '—' && `. The property was last sold on ${ownership.saleDate}`}
              {propertyData?.sale_document_amount && ownership.salePrice !== '—' && ` for ${ownership.salePrice}`}
              {propertyData?.mortgage_document_amount && ownership.mortgageAmount !== '—' && `. The most recent mortgage recorded is ${ownership.mortgageAmount}`}
              {propertyData?.mortgage_document_date && ownership.mortgageDate !== '—' && ` from ${ownership.mortgageDate}`}
              {ownership.lenderName !== '—' && ` with lender ${ownership.lenderName}`}.
            </p>
          )}

          {(tax.estimatedMarketValue !== '—' || tax.propertyTax !== '—') && (
            <p>
              <strong className="text-foreground">What is the current market value and property tax for {address.fullAddress}?</strong>
              {' '}
              According to NYC Department of Finance records, {address.fullAddress}
              {tax.estimatedMarketValue !== '—' && ` has an estimated market value of ${tax.estimatedMarketValue}`}
              {tax.estimatedMarketValue !== '—' && tax.propertyTax !== '—' && ` and `}
              {tax.propertyTax !== '—' && `an annual property tax of ${tax.propertyTax}`}
              {tax.taxYear !== '—' && ` for the ${tax.taxYear} tax year`}.
            </p>
          )}

          {address.alternativeAddresses.length > 0 && (
            <p>
              <strong className="text-foreground">What are the alternative addresses for {address.fullAddress}?</strong>
              {' '}
              This property is also known by {address.alternativeAddresses.length === 1 ? 'the following address' : 'these addresses'}: {address.alternativeAddresses.slice(0, 5).join(', ')}
              {address.alternativeAddresses.length > 5 && ` and ${address.alternativeAddresses.length - 5} more`}. Alternative addresses are common for NYC properties with multiple entrances or corner locations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
