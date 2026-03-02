import { NextRequest, NextResponse } from 'next/server';
import {
  parseUserAgent,
  extractClientIp,
  extractGeo,
  classifyRoute,
  parseQueryParams,
  sanitizeBody,
  type RequestLogDocument,
} from '@/utils/requestTracker';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only track in production
  if (process.env.VERCEL_ENV !== 'production') {
    return response;
  }

  // Skip tracking for the tracking endpoint itself to avoid infinite loops
  if (request.nextUrl.pathname === '/api/events/request') {
    return response;
  }

  const url = request.nextUrl;
  const ua = request.headers.get('user-agent');
  const parsed = parseUserAgent(ua);
  const geo = extractGeo(request.headers);
  const ip = extractClientIp(request.headers);
  const routeType = classifyRoute(url.pathname);

  // Read request body for API POST/PUT routes (truncated to 4KB, sensitive keys stripped)
  let requestBody: unknown = null;
  if (routeType === 'api' && (request.method === 'POST' || request.method === 'PUT')) {
    try {
      const cloned = request.clone();
      const text = await cloned.text();
      if (text) {
        const truncated = text.length > 4096 ? text.slice(0, 4096) : text;
        try {
          requestBody = sanitizeBody(JSON.parse(truncated));
        } catch {
          requestBody = { _raw: truncated };
        }
      }
    } catch {
      // Body reading can fail — ignore
    }
  }

  const doc: RequestLogDocument = {
    '@timestamp': new Date().toISOString(),
    method: request.method,
    path: url.pathname,
    url: url.href,
    query_params: parseQueryParams(url),
    ip,
    user_agent: ua,
    ua_browser: parsed.browser,
    ua_os: parsed.os,
    ua_device: parsed.device,
    is_bot: parsed.isBot,
    bot_name: parsed.botName,
    referer: request.headers.get('referer') || null,
    accept_language: request.headers.get('accept-language') || null,
    content_type: request.headers.get('content-type') || null,
    geo_country: geo.country,
    geo_region: geo.region,
    geo_city: geo.city,
    request_body: requestBody,
    route_type: routeType,
    request_id: crypto.randomUUID(),
    host: request.headers.get('host') || null,
    protocol: url.protocol.replace(':', ''),
    vercel_deployment_id: request.headers.get('x-vercel-deployment-url') || null,
  };

  // Fire-and-forget: non-blocking tracking
  try {
    const trackingUrl = new URL('/api/events/request', request.url);
    fetch(trackingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
      keepalive: true,
    }).catch(() => {
      // Silently ignore — tracking must never affect the response
    });
  } catch {
    // Silently ignore
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Common static asset extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap.*\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot)).*)',
  ],
};
