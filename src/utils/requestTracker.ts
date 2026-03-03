/**
 * Request tracking utilities for middleware.
 * Edge-runtime compatible — no Node.js-specific imports.
 */

/** Known bot patterns (covers ~95% of bot traffic) */
const BOT_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /GoogleOther/i, name: 'GoogleOther' },
  { pattern: /Googlebot/i, name: 'Googlebot' },
  { pattern: /Bingbot/i, name: 'Bingbot' },
  { pattern: /Slurp/i, name: 'Yahoo Slurp' },
  { pattern: /DuckDuckBot/i, name: 'DuckDuckBot' },
  { pattern: /Baiduspider/i, name: 'Baiduspider' },
  { pattern: /YandexBot/i, name: 'YandexBot' },
  { pattern: /facebot|facebookexternalhit|facebookcatalog|meta-externalagent/i, name: 'Facebook' },
  { pattern: /Twitterbot/i, name: 'Twitterbot' },
  { pattern: /LinkedInBot/i, name: 'LinkedInBot' },
  { pattern: /Applebot/i, name: 'Applebot' },
  { pattern: /SemrushBot/i, name: 'SemrushBot' },
  { pattern: /AhrefsBot/i, name: 'AhrefsBot' },
  { pattern: /MJ12bot/i, name: 'MJ12bot' },
  { pattern: /DotBot/i, name: 'DotBot' },
  { pattern: /PetalBot/i, name: 'PetalBot' },
  { pattern: /GPTBot/i, name: 'GPTBot' },
  { pattern: /Claude-Web/i, name: 'Claude-Web' },
  { pattern: /ClaudeBot/i, name: 'ClaudeBot' },
  { pattern: /\bcurl\b/i, name: 'curl' },
  { pattern: /\bwget\b/i, name: 'wget' },
  { pattern: /python-requests/i, name: 'python-requests' },
  { pattern: /\baxios\b/i, name: 'axios' },
  { pattern: /node-fetch/i, name: 'node-fetch' },
  { pattern: /Go-http-client/i, name: 'Go-http-client' },
  { pattern: /HeadlessChrome/i, name: 'HeadlessChrome' },
  { pattern: /Bytespider/i, name: 'Bytespider' },
  { pattern: /DataForSeoBot/i, name: 'DataForSeoBot' },
];

export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: 'desktop' | 'mobile' | 'tablet';
  isBot: boolean;
  botName: string | null;
}

export interface GeoInfo {
  country: string | null;
  region: string | null;
  city: string | null;
}

export type RouteType = 'page' | 'api' | 'static' | 'other';

/**
 * Parse user-agent string into structured data.
 */
export function parseUserAgent(ua: string | null): ParsedUserAgent {
  if (!ua) {
    return { browser: 'Unknown', os: 'Unknown', device: 'desktop', isBot: false, botName: null };
  }

  // Bot detection
  let isBot = false;
  let botName: string | null = null;
  for (const { pattern, name } of BOT_PATTERNS) {
    if (pattern.test(ua)) {
      isBot = true;
      botName = name;
      break;
    }
  }
  // Generic bot catch-all
  if (!isBot && /bot|crawler|spider|scraper|headless/i.test(ua)) {
    isBot = true;
    botName = 'Unknown Bot';
  }

  // Browser detection
  let browser = 'Unknown';
  const edgMatch = ua.match(/Edg\/(\d+)/i);
  const oprMatch = ua.match(/OPR\/(\d+)/i);
  const chromeMatch = ua.match(/Chrome\/(\d+)/i);
  const ffMatch = ua.match(/Firefox\/(\d+)/i);
  const safariMatch = ua.match(/Version\/(\d+).*Safari/i);
  const ieMatch = ua.match(/MSIE (\d+)/i);
  if (edgMatch) {
    browser = `Edge ${edgMatch[1]}`;
  } else if (oprMatch) {
    browser = `Opera ${oprMatch[1]}`;
  } else if (chromeMatch) {
    browser = `Chrome ${chromeMatch[1]}`;
  } else if (ffMatch) {
    browser = `Firefox ${ffMatch[1]}`;
  } else if (safariMatch) {
    browser = `Safari ${safariMatch[1]}`;
  } else if (ieMatch || /Trident/i.test(ua)) {
    browser = `IE ${ieMatch ? ieMatch[1] : '11'}`;
  }

  // OS detection
  let os = 'Unknown';
  const macMatch = ua.match(/Mac OS X (\d+[._]\d+)/i);
  const androidMatch = ua.match(/Android (\d+)/i);
  if (/Windows NT 10/i.test(ua)) {
    os = 'Windows 10+';
  } else if (/Windows NT/i.test(ua)) {
    os = 'Windows';
  } else if (macMatch) {
    os = `macOS ${macMatch[1].replace('_', '.')}`;
  } else if (androidMatch) {
    os = `Android ${androidMatch[1]}`;
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
  } else if (/CrOS/i.test(ua)) {
    os = 'ChromeOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  // Device detection
  let device: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) {
    device = 'tablet';
  } else if (/Mobile|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) {
    device = 'mobile';
  }

  return { browser, os, device, isBot, botName };
}

/**
 * Extract client IP from request headers.
 * Prefers x-real-ip (set reliably by Vercel). Falls back to the last
 * entry in x-forwarded-for (appended by the platform, not spoofable).
 */
export function extractClientIp(headers: Headers): string | null {
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(s => s.trim());
    return ips[ips.length - 1];
  }
  return null;
}

/**
 * Safely decode a percent-encoded header value.
 */
function safeDecode(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Extract geo information from Vercel headers.
 * City names are percent-encoded per RFC3986 by Vercel.
 */
export function extractGeo(headers: Headers): GeoInfo {
  return {
    country: headers.get('x-vercel-ip-country') || null,
    region: headers.get('x-vercel-ip-country-region') || null,
    city: safeDecode(headers.get('x-vercel-ip-city')),
  };
}

/**
 * Classify a request path into a route type.
 */
export function classifyRoute(path: string): RouteType {
  if (path.startsWith('/api/')) return 'api';
  if (path.startsWith('/_next/static') || path.startsWith('/_next/image') || path.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?|ttf|eot)$/)) {
    return 'static';
  }
  if (path.startsWith('/_next/')) return 'other';
  return 'page';
}

/**
 * Parse query string into a flat object.
 */
export function parseQueryParams(url: URL): Record<string, string> | null {
  const params: Record<string, string> = {};
  let hasParams = false;
  url.searchParams.forEach((value, key) => {
    params[key] = value;
    hasParams = true;
  });
  return hasParams ? params : null;
}

export interface RequestLogDocument {
  '@timestamp': string;
  method: string;
  path: string;
  url: string;
  query_params: Record<string, string> | null;
  ip: string | null;
  user_agent: string | null;
  ua_browser: string;
  ua_os: string;
  ua_device: string;
  is_bot: boolean;
  bot_name: string | null;
  referer: string | null;
  accept_language: string | null;
  content_type: string | null;
  geo_country: string | null;
  geo_region: string | null;
  geo_city: string | null;
  route_type: RouteType;
  request_id: string;
  host: string | null;
  protocol: string;
  vercel_deployment_id: string | null;
  blocked: boolean;
}
