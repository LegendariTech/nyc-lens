import 'server-only';
import { getClient } from './elasticsearch';
import type { TrackedEvent } from '@/types/events';

/**
 * Get the events index name from environment variables.
 * Returns null if not configured (tracking will be skipped).
 */
function getEventsIndexName(): string | null {
  return process.env.ELASTICSEARCH_EVENTS_INDEX_NAME || null;
}

/** Tracks whether we've already ensured the index exists this process */
let indexReady = false;

/**
 * Ensure the events index exists with explicit mappings.
 * Only runs once per process lifetime.
 */
async function ensureIndex(indexName: string): Promise<void> {
  if (indexReady) return;

  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });

  if (!exists) {
    await client.indices.create({
      index: indexName,
      mappings: {
        properties: {
          event: { type: 'keyword' },
          timestamp: { type: 'date' },
          data: { type: 'flattened' },
        },
      },
    });
  }

  indexReady = true;
}

/**
 * Track an event by indexing it to Elasticsearch.
 *
 * This function is designed to fail gracefully - errors are logged but not thrown
 * to ensure that tracking failures don't break the user experience.
 *
 * @param event - Event type identifier (e.g., "autocomplete_search")
 * @param data - Event-specific data (will be stored in flattened field)
 * @returns Promise that resolves to true if successful, false if failed
 */
export async function trackEvent(
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const indexName = getEventsIndexName();
  if (!indexName) {
    return false;
  }

  try {
    const client = getClient();
    await ensureIndex(indexName);

    const trackedEvent: TrackedEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    await client.index({
      index: indexName,
      document: trackedEvent,
    });

    return true;
  } catch (error) {
    // Log error but don't throw - tracking failures shouldn't break the app
    console.error('Failed to track event:', error);
    return false;
  }
}
