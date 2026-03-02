import 'server-only';
import { getClient } from './elasticsearch';
import type { TrackedEvent } from '@/types/events';

/**
 * Get the events index name from environment variables
 */
function getEventsIndexName(): string {
  const indexName = process.env.ELASTICSEARCH_EVENTS_INDEX_NAME;
  if (!indexName) {
    throw new Error(
      'ELASTICSEARCH_EVENTS_INDEX_NAME environment variable is not configured. ' +
      'Please set it in your environment or .env.local file.'
    );
  }
  return indexName;
}

/**
 * Track an event by indexing it to Elasticsearch.
 *
 * This function is designed to fail gracefully - errors are logged but not thrown
 * to ensure that tracking failures don't break the user experience.
 *
 * @param event - Event type identifier (e.g., "autocomplete_no_results")
 * @param data - Event-specific data (will be stored in flattened field)
 * @returns Promise that resolves to true if successful, false if failed
 */
export async function trackEvent(
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const client = getClient();
    const indexName = getEventsIndexName();

    const trackedEvent: TrackedEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    await client.index({
      index: indexName,
      body: trackedEvent,
    });

    console.log(`Event tracked: ${event}`, { data });
    return true;
  } catch (error) {
    // Log error but don't throw - tracking failures shouldn't break the app
    console.error('Failed to track event:', error);
    return false;
  }
}
