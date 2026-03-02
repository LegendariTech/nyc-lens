import { NextRequest, NextResponse } from 'next/server';
import {
  parseUserAgent,
  extractClientIp,
  extractGeo,
  classifyRoute,
  parseQueryParams,
  type RequestLogDocument,
} from '@/utils/requestTracker';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only track in production
  if (process.env.VERCEL_ENV !== 'production') {
    return response;
  }

  const esNode = process.env.ELASTICSEARCH_NODE;
  const esIndex = process.env.ELASTICSEARCH_REQUESTS_INDEX_NAME;
  if (!esNode || !esIndex) {
    return response;
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
