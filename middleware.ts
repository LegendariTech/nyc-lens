import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  parseUserAgent,
  extractClientIp,
  extractGeo,
  classifyRoute,
  parseQueryParams,
  type RequestLogDocument,
} from '@/utils/requestTracker';

function trackRequest(request: NextRequest) {
  // Only track in production
  if (process.env.VERCEL_ENV !== 'production') {
    return;
  }

  const esNode = process.env.ELASTICSEARCH_NODE?.trim();
  const esIndex = process.env.ELASTICSEARCH_REQUESTS_INDEX_NAME?.trim();
  if (!esNode || !esIndex) {
    return;
  }

  const url = request.nextUrl;
  const ua = request.headers.get('user-agent');
  const parsed = parseUserAgent(ua);
  const geo = extractGeo(request.headers);
  const ip = extractClientIp(request.headers);
  const routeType = classifyRoute(url.pathname);

  const doc: RequestLogDocument = {
    '@timestamp': new Date().toISOString(),
    method: request.method,
    path: url.pathname,
    url: url.origin + url.pathname,
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
    route_type: routeType,
    request_id: crypto.randomUUID(),
    host: request.headers.get('host') || null,
    protocol: url.protocol.replace(':', ''),
    vercel_deployment_id: request.headers.get('x-vercel-deployment-id') || null,
  };

  // Fire-and-forget: write directly to ES REST API (no internal HTTP round-trip)
  try {
    const esUser = process.env.ELASTICSEARCH_USERNAME || '';
    const esPass = process.env.ELASTICSEARCH_PASSWORD || '';
    const authHeader = 'Basic ' + btoa(`${esUser}:${esPass}`);

    fetch(`${esNode}/${esIndex}/_doc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(doc),
      keepalive: true,
    }).catch(() => {
      // Silently ignore — tracking must never affect the response
    });
  } catch {
    // Silently ignore
  }
}

export default clerkMiddleware(async (_auth, request) => {
  trackRequest(request);
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api)(.*)',
  ],
};
