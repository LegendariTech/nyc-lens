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
  fieldFormat?: 'currency' | 'number' | 'percentage'
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
 * Returns 'N/A' for zero, null, or undefined values
 */
export function formatCurrency(value?: number | null): string {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

