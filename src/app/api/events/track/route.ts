import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/data/eventTracking';
import { EventType } from '@/types/events';

/**
 * Request body for event tracking
 */
interface TrackEventRequest {
  event: string;
  data: Record<string, unknown>;
}

/**
 * Whitelist of allowed event types
 * This prevents malicious or invalid events from being tracked
 */
const ALLOWED_EVENTS = new Set<string>(Object.values(EventType));

/**
 * POST /api/events/track
 *
 * Track custom events to Elasticsearch for analytics and monitoring.
 * Events are validated against a whitelist before being indexed.
 */
export async function POST(req: NextRequest) {
  // Only track events in production (not preview, dev, or test)
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  try {
    const body = await req.json() as TrackEventRequest;
    const { event, data } = body;

    // Validate request
    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'Event type is required and must be a string' },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Event data is required and must be an object' },
        { status: 400 }
      );
    }

    // Validate event type against whitelist
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json(
        { error: `Invalid event type: ${event}` },
        { status: 400 }
      );
    }

    // Track the event
    const success = await trackEvent(event, data);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in event tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
