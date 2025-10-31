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

