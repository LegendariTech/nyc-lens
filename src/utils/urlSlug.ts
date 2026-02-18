/**
 * URL Slug Utilities
 *
 * Converts addresses and other strings to SEO-friendly URL slugs.
 *
 * Examples:
 * - "1 BROADWAY", "Manhattan", "NY", "10004" → "1-Broadway-Manhattan-NY-10004"
 * - "1141 BURNETT PLACE", "Bronx", "NY", "10472" → "1141-Burnett-Place-Bronx-NY-10472"
 */

/**
 * Convert full address (street + borough + state + zip) to SEO-friendly URL slug
 *
 * Rules:
 * - Title case (capitalize first letter of each word)
 * - Replace spaces with hyphens
 * - Remove special characters except hyphens and numbers
 * - Remove multiple consecutive hyphens
 * - Trim leading/trailing hyphens
 *
 * @param streetAddress - Street address (e.g., "1 BROADWAY")
 * @param borough - Borough name (e.g., "Manhattan")
 * @param state - State code (e.g., "NY")
 * @param zipcode - ZIP code (e.g., "10004")
 */
export function addressToSlug(
  streetAddress: string,
  borough?: string,
  state?: string,
  zipcode?: string
): string {
  if (!streetAddress) return '';

  // Build full address string
  const parts = [streetAddress];
  if (borough) parts.push(borough);
  if (state) parts.push(state);
  if (zipcode) parts.push(zipcode);

  const fullAddress = parts.join(' ');

  return fullAddress
    // Convert to title case
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    // Replace spaces and special chars with hyphens
    .replace(/[^a-zA-Z0-9]+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert slug back to display address
 *
 * Rules:
 * - Replace hyphens with spaces
 * - Convert to uppercase (NYC addresses are typically uppercase)
 */
export function slugToAddress(slug: string): string {
  if (!slug) return '';

  return slug
    // Replace hyphens with spaces
    .replace(/-/g, ' ')
    // Convert to uppercase to match NYC format
    .toUpperCase();
}

/**
 * Build property URL with optional address slug
 *
 * Examples:
 * - buildPropertyUrl('1-13-1', 'overview') → '/property/1-13-1/overview'
 * - buildPropertyUrl('1-13-1', 'overview', { street: '1 BROADWAY', borough: 'Manhattan', state: 'NY', zip: '10004' })
 *   → '/property/1-13-1/overview/1-Broadway-Manhattan-NY-10004'
 */
export function buildPropertyUrl(
  bbl: string,
  tab: string,
  addressParts?: {
    street?: string;
    borough?: string;
    state?: string;
    zip?: string;
  }
): string {
  const basePath = `/property/${bbl}/${tab}`;

  if (!addressParts?.street) {
    return basePath;
  }

  const slug = addressToSlug(
    addressParts.street,
    addressParts.borough,
    addressParts.state,
    addressParts.zip
  );

  return slug ? `${basePath}/${slug}` : basePath;
}

/**
 * Parse address from URL path segments
 *
 * Examples:
 * - ['1-Broadway'] → '1 BROADWAY'
 * - ['1141-Burnett-Place'] → '1141 BURNETT PLACE'
 * - undefined → undefined
 */
export function parseAddressFromUrl(segments?: string[]): string | undefined {
  if (!segments || segments.length === 0) {
    return undefined;
  }

  // Join all segments with hyphens (in case address was split)
  const slug = segments.join('-');
  return slugToAddress(slug);
}
