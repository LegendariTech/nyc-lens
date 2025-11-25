'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { AcrisRecord } from '@/types/acris';
import { PlutoData } from '@/data/pluto';

interface AddressCardProps {
  plutoData: PlutoData | null;
  propertyData: AcrisRecord | null;
}

export function AddressCard({ plutoData, propertyData }: AddressCardProps) {
  // Get primary address from PLUTO or ACRIS
  const primaryAddress = plutoData?.address || propertyData?.address || 'Address not available';

  // Get address components from PLUTO
  const plutoAddress = plutoData?.address;

  // Get address components from ACRIS
  const acrisStreetNumber = propertyData?.street_number;
  const acrisStreetName = propertyData?.street_name;
  const acrisUnit = propertyData?.unit;
  const acrisAddressWithUnit = propertyData?.address_with_unit;

  // Get AKA addresses from ACRIS
  const akaAddresses = propertyData?.aka || [];

  // Check if we have detailed address components
  const hasAddressComponents = acrisStreetNumber || acrisStreetName || plutoAddress;
  const hasAkaAddresses = akaAddresses.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Address */}
        <div>
          <h4 className="text-sm font-medium text-foreground/70 mb-2">Primary Address</h4>
          <p className="text-lg font-semibold text-foreground">{primaryAddress}</p>
        </div>

        {/* Address Components */}
        {hasAddressComponents && (
          <div>
            <h4 className="text-sm font-medium text-foreground/70 mb-3">Address Components</h4>
            <dl className="space-y-2">
              {acrisStreetNumber && (
                <div className="flex justify-between text-sm">
                  <dt className="text-foreground/70">Street Number:</dt>
                  <dd className="font-medium text-foreground">{acrisStreetNumber}</dd>
                </div>
              )}
              {acrisStreetName && (
                <div className="flex justify-between text-sm">
                  <dt className="text-foreground/70">Street Name:</dt>
                  <dd className="font-medium text-foreground">{acrisStreetName}</dd>
                </div>
              )}
              {acrisUnit && (
                <div className="flex justify-between text-sm">
                  <dt className="text-foreground/70">Unit:</dt>
                  <dd className="font-medium text-foreground">{acrisUnit}</dd>
                </div>
              )}
              {acrisAddressWithUnit && acrisAddressWithUnit !== propertyData?.address && (
                <div className="flex justify-between text-sm">
                  <dt className="text-foreground/70">Full Address with Unit:</dt>
                  <dd className="font-medium text-foreground">{acrisAddressWithUnit}</dd>
                </div>
              )}
              {plutoAddress && plutoAddress !== primaryAddress && (
                <div className="flex justify-between text-sm">
                  <dt className="text-foreground/70">PLUTO Address:</dt>
                  <dd className="font-medium text-foreground">{plutoAddress}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* AKA Addresses */}
        {hasAkaAddresses && (
          <div>
            <h4 className="text-sm font-medium text-foreground/70 mb-3">
              Also Known As (AKA) Addresses
            </h4>
            <ul className="space-y-2">
              {akaAddresses.map((aka, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground bg-foreground/5 rounded-md px-3 py-2"
                >
                  {aka}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Data Available */}
        {!hasAddressComponents && !hasAkaAddresses && (
          <p className="text-sm text-foreground/70">
            Detailed address information not available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
