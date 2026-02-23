import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL } from '@/data/acris';
import { getBoroughDisplayName } from '@/constants/nyc';
import { formatFullAddress } from '@/utils/formatters';

/**
 * Fetch and format property address for metadata generation
 *
 * @param bbl - Property BBL in format "1-13-1"
 * @returns Formatted address string (e.g., "220 Riverside Blvd 20A, New York, NY 10069")
 */
export async function getFormattedAddressForMetadata(bbl: string): Promise<string> {
  // Parse BBL to get borough code
  const bblParts = bbl.split('-');
  const boroughCode = parseInt(bblParts[0]);
  const borough = getBoroughDisplayName(boroughCode) || 'NYC';

  // Default fallback
  let fullFormattedAddress = `BBL ${bbl}`;

  try {
    const [plutoResult, propertyResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
    ]);

    // Get address components and build formatted address
    const streetAddress = propertyResult?.address || plutoResult.data?.address;
    const unit = propertyResult?.unit || undefined;
    const zipcode = propertyResult?.zip_code || plutoResult.data?.zipcode;

    // Build formatted address using formatFullAddress
    if (streetAddress && zipcode) {
      fullFormattedAddress = formatFullAddress(streetAddress, unit, boroughCode, zipcode);
    } else if (streetAddress) {
      // Fallback if no zipcode
      fullFormattedAddress = `${streetAddress}, ${borough}, NY`;
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return fullFormattedAddress;
}
