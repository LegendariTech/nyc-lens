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
 * Extract user info from Clerk's __session JWT without verification.
 * This is safe for analytics — we just want to associate events with users,
 * not make auth decisions. Avoids any network calls to Clerk.
 */
function getUserFromSessionCookie(req: NextRequest): { userId: string; email?: string; name?: string } | null {
  const token = req.cookies.get('__session')?.value;
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      userId: payload.sub || null,
      // These require custom session claims configured in Clerk Dashboard
      email: payload.email || payload.primary_email || undefined,
      name: payload.name || payload.full_name || undefined,
    };
  } catch {
    return null;
  }
}

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

    // Enrich event data with user info from session cookie (no network calls)
    const user = getUserFromSessionCookie(req);
    const enrichedData = user
      ? { ...data, user_id: user.userId, user_email: user.email, user_name: user.name }
      : data;

    // Track the event (returns false if not configured or write failed)
    const success = await trackEvent(event, enrichedData);

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    console.error('Error in event tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
