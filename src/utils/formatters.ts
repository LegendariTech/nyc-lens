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
 * Format date string to MM/DD/YYYY format
 */
export function formatDateMMDDYYYY(value?: string | null): string {
  const date = new Date(value || '');
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Format number as USD currency
 */
export function formatCurrency(value?: number | null): string {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

