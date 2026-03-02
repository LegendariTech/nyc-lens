import { EventType } from '@/types/events';

/**
 * Check if event tracking is enabled.
 * Only tracks in Vercel production deployments (not preview, dev, or test).
 */
function isTrackingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}

/**
 * Track an event by sending it to the tracking API.
 *
 * This is a client-side utility that sends events asynchronously without blocking
 * the user interface. Only fires in production environments (not preview, dev, or test).
 * Errors are silently ignored to avoid disrupting the user experience.
 *
 * @param event - Event type identifier
 * @param data - Event-specific data
 */
export function trackEvent(
  event: EventType | string,
  data: Record<string, unknown>
): void {
  if (!isTrackingEnabled()) return;

  fetch('/api/events/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event, data }),
    keepalive: true,
  }).catch(() => {
    // Silently ignore tracking failures
  });
}

type DebouncedFunction<T extends (...args: never[]) => void> = T & {
  cancel: () => void;
};

/**
 * Debounce utility for limiting how often a function can be called.
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before calling the function
 * @returns Debounced function with a `.cancel()` method
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
