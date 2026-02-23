import { getBoroughDisplayName } from '@/constants/nyc';

/**
 * Column metadata interface for formatValue function
 */
export interface DatasourceColumnMetadata {
  id: number;
  name: string;
  dataTypeName: string;
  description: string;
  fieldName: string;
  position: number;
  renderTypeName: string;
  tableColumnId: number;
  format?: Record<string, string | undefined>;
}

/**
 * Format a value based on its metadata and field format
 * Used for displaying property data with proper formatting
 */
export function formatValue(
  value: string | number | boolean | null | undefined,
  column?: DatasourceColumnMetadata,
  fieldFormat?: 'currency' | 'number' | 'percentage' | 'year'
): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle numeric values with formatting
  if (typeof value === 'number') {
    // Check for year formatting - always display without commas
    if (fieldFormat === 'year') {
      return value.toString();
    }

    // Check for currency formatting first
    if (fieldFormat === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // Check for number formatting
    if (fieldFormat === 'number') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Check if the column has a format specification
    if (column?.format?.noCommas === 'true') {
      return value.toString();
    }
    return value.toLocaleString();
  }

  // Handle string values that should be formatted as years
  if (typeof value === 'string' && fieldFormat === 'year') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return numericValue.toString();
    }
  }

  // Handle string values that should be formatted as currency
  if (typeof value === 'string' && fieldFormat === 'currency') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    }
  }

  // Handle string values that should be formatted as numbers
  if (typeof value === 'string' && fieldFormat === 'number') {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numericValue);
    }
  }

  return String(value);
}

/**
 * Format Unix timestamp to readable date
 */
export function formatTimestamp(timestamp: number | string | undefined): string {
  if (!timestamp) return 'Unknown';

  const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  const date = new Date(numericTimestamp * 1000);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date string to human-readable format (e.g., "Jan 15, 2024")
 * Handles ISO dates, Date objects, and YYYYMMDD format (e.g., "20240222")
 * Alias: formatDateMMDDYYYY (for backwards compatibility)
 */
export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    let date: Date;

    // If it's already a Date object, use it directly
    if (dateString instanceof Date) {
      date = dateString;
    }
    // Check if it's in YYYYMMDD format (8 digits)
    else if (typeof dateString === 'string' && /^\d{8}$/.test(dateString)) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      date = new Date(`${year}-${month}-${day}`);
    }
    // Otherwise parse as regular date string
    else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return 'N/A';
  }
}

/**
 * Alias for formatDate (for backwards compatibility)
 */
export const formatDateMMDDYYYY = formatDate;

/**
 * Format number as USD currency
 * Returns 'N/A' for null or undefined values, '$0' for zero
 */
export function formatCurrency(value?: number | null): string {
  if (value == null) return 'N/A';
  // Handle -0 edge case (Object.is(-0, 0) is false, but -0 === 0 is true)
  if (value === 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format phone number as US format: (123) 456-7890
 */
export function formatUSPhone(phone: string): string {
  if (!phone || phone === '') return phone;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format as US phone number if it has 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // If it has 11 digits and starts with 1, format as US number with country code
  if (digits.length === 11 && digits.startsWith('1')) {
    const number = digits.slice(1);
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  }

  // Return original if it doesn't match expected formats
  return phone;
}

/**
 * Format year over year change with sign
 */
export function formatYoyChange(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  const percentage = value * 100;
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Format a full address from components
 *
 * @param addressLine - Street address (e.g., "220 Riverside Blvd")
 * @param unit - Unit/apartment number (optional, e.g., "20A")
 * @param borough - Borough code (1-5)
 * @param zipcode - ZIP code (e.g., "10069")
 * @param state - State abbreviation (defaults to "NY")
 * @returns Formatted address string (e.g., "220 Riverside Blvd 20A, New York, NY 10069")
 *
 * @example
 * formatFullAddress("220 Riverside Blvd", "20A", 1, "10069")
 * // => "220 Riverside Blvd 20A, New York, NY 10069"
 *
 * @example
 * formatFullAddress("123 Main St", undefined, 3, "11201")
 * // => "123 Main St, Brooklyn, NY 11201"
 */
export function formatFullAddress(
  addressLine: string,
  unit: string | undefined,
  borough: number,
  zipcode: string,
  state: string = 'NY'
): string {
  // Build street address with unit if provided
  const streetWithUnit = unit ? `${addressLine} ${unit}` : addressLine;

  // Get borough name (Manhattan becomes "New York")
  const boroughName = getBoroughDisplayName(borough);

  // Combine: "220 Riverside Blvd 20A, New York, NY 10069"
  return `${streetWithUnit}, ${boroughName}, ${state} ${zipcode}`;
}

