import { describe, it, expect } from 'vitest';
import {
  parseUserAgent,
  extractClientIp,
  extractGeo,
  classifyRoute,
  parseQueryParams,
} from '../requestTracker';

describe('parseUserAgent', () => {
  describe('bot detection', () => {
    const botCases: Array<[string, string]> = [
      ['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'Googlebot'],
      ['Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)', 'Bingbot'],
      ['Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)', 'Yahoo Slurp'],
      ['DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)', 'DuckDuckBot'],
      ['Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)', 'Baiduspider'],
      ['Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)', 'YandexBot'],
      ['Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)', 'SemrushBot'],
      ['Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)', 'AhrefsBot'],
      ['Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)', 'MJ12bot'],
      ['Mozilla/5.0 (compatible; DotBot/1.2; +https://opensiteexplorer.org/dotbot)', 'DotBot'],
      ['Mozilla/5.0 (compatible; PetalBot;+https://webmaster.petalsearch.com/)', 'PetalBot'],
      ['Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)', 'GPTBot'],
      ['Claude-Web/1.0 (https://claude.ai)', 'Claude-Web'],
      ['ClaudeBot/1.0', 'ClaudeBot'],
      ['Twitterbot/1.0', 'Twitterbot'],
      ['LinkedInBot/1.0 (compatible; Mozilla/5.0)', 'LinkedInBot'],
      ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0', 'Facebook'],
      ['Applebot/0.1; +http://www.apple.com/go/applebot', 'Applebot'],
      ['curl/7.68.0', 'curl'],
      ['Wget/1.21', 'wget'],
      ['python-requests/2.28.0', 'python-requests'],
      ['axios/1.4.0', 'axios'],
      ['node-fetch/1.0 (+https://github.com/node-fetch/node-fetch)', 'node-fetch'],
      ['Go-http-client/1.1', 'Go-http-client'],
      ['Mozilla/5.0 HeadlessChrome/90.0.4430.212', 'HeadlessChrome'],
      ['Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)', 'Bytespider'],
      ['Mozilla/5.0 (compatible; DataForSeoBot/1.0; +https://dataforseo.com/dataforseo-bot)', 'DataForSeoBot'],
    ];

    it.each(botCases)('detects %s as bot "%s"', (ua, expectedName) => {
      const result = parseUserAgent(ua);
      expect(result.isBot).toBe(true);
      expect(result.botName).toBe(expectedName);
    });

    describe('Facebook / Meta crawlers', () => {
      const facebookCases: Array<[string, string]> = [
        ['facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', 'facebookexternalhit'],
        ['facebookexternalhit/1.1', 'facebookexternalhit short form'],
        ['facebookcatalog/1.0', 'facebookcatalog'],
        ['meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)', 'meta-externalagent'],
        ['facebot', 'facebot'],
        ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0', 'full UA with facebot'],
      ];

      it.each(facebookCases)('detects "%s" (%s) as Facebook bot', (ua) => {
        const result = parseUserAgent(ua);
        expect(result.isBot).toBe(true);
        expect(result.botName).toBe('Facebook');
      });
    });

    it('catches unknown bots via generic pattern', () => {
      const result = parseUserAgent('Mozilla/5.0 SomeRandomBot/1.0');
      expect(result.isBot).toBe(true);
      expect(result.botName).toBe('Unknown Bot');
    });

    it('does not flag normal browsers as bots', () => {
      const chrome = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      expect(chrome.isBot).toBe(false);
      expect(chrome.botName).toBeNull();

      const safari = parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
      expect(safari.isBot).toBe(false);
      expect(safari.botName).toBeNull();
    });
  });

  describe('browser detection', () => {
    it('detects Chrome', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      expect(result.browser).toBe('Chrome 120');
    });

    it('detects Edge (not Chrome)', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91');
      expect(result.browser).toBe('Edge 120');
    });

    it('detects Opera (not Chrome)', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106');
      expect(result.browser).toBe('Opera 106');
    });

    it('detects Firefox', () => {
      const result = parseUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121');
      expect(result.browser).toBe('Firefox 121');
    });

    it('detects Safari', () => {
      const result = parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17 Safari/605.1.15');
      expect(result.browser).toBe('Safari 17');
    });

    it('returns Unknown for unrecognized browsers', () => {
      const result = parseUserAgent('SomeUnknownBrowser/1.0');
      expect(result.browser).toBe('Unknown');
    });
  });

  describe('OS detection', () => {
    it('detects Windows 10+', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(result.os).toBe('Windows 10+');
    });

    it('detects older Windows', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36');
      expect(result.os).toBe('Windows');
    });

    it('detects macOS', () => {
      const result = parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15');
      expect(result.os).toBe('macOS 10.15');
    });

    it('detects Android', () => {
      const result = parseUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36');
      expect(result.os).toBe('Android 14');
    });

    it('detects iOS', () => {
      const result = parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15');
      expect(result.os).toBe('iOS');
    });

    it('detects Linux', () => {
      const result = parseUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121');
      expect(result.os).toBe('Linux');
    });

    it('detects ChromeOS', () => {
      const result = parseUserAgent('Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36');
      expect(result.os).toBe('ChromeOS');
    });
  });

  describe('device detection', () => {
    it('detects desktop by default', () => {
      const result = parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(result.device).toBe('desktop');
    });

    it('detects mobile (iPhone)', () => {
      const result = parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      expect(result.device).toBe('mobile');
    });

    it('detects mobile (Android phone)', () => {
      const result = parseUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
      expect(result.device).toBe('mobile');
    });

    it('detects tablet (iPad)', () => {
      const result = parseUserAgent('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      expect(result.device).toBe('tablet');
    });
  });

  describe('null / empty UA', () => {
    it('returns defaults for null', () => {
      const result = parseUserAgent(null);
      expect(result).toEqual({
        browser: 'Unknown',
        os: 'Unknown',
        device: 'desktop',
        isBot: false,
        botName: null,
      });
    });

    it('returns defaults for empty string', () => {
      const result = parseUserAgent('');
      expect(result.browser).toBe('Unknown');
      expect(result.os).toBe('Unknown');
      expect(result.isBot).toBe(false);
    });
  });
});

describe('extractClientIp', () => {
  it('extracts first IP from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.50, 70.41.3.18, 150.172.238.178' });
    expect(extractClientIp(headers)).toBe('203.0.113.50');
  });

  it('extracts single IP from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.50' });
    expect(extractClientIp(headers)).toBe('203.0.113.50');
  });

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '10.0.0.1' });
    expect(extractClientIp(headers)).toBe('10.0.0.1');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.50',
      'x-real-ip': '10.0.0.1',
    });
    expect(extractClientIp(headers)).toBe('203.0.113.50');
  });

  it('returns "unknown" when no IP headers present', () => {
    const headers = new Headers();
    expect(extractClientIp(headers)).toBe('unknown');
  });
});

describe('extractGeo', () => {
  it('extracts all Vercel geo headers', () => {
    const headers = new Headers({
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-country-region': 'NY',
      'x-vercel-ip-city': 'New York',
    });
    expect(extractGeo(headers)).toEqual({
      country: 'US',
      region: 'NY',
      city: 'New York',
    });
  });

  it('returns nulls when headers are absent', () => {
    const headers = new Headers();
    expect(extractGeo(headers)).toEqual({
      country: null,
      region: null,
      city: null,
    });
  });

  it('handles partial geo headers', () => {
    const headers = new Headers({ 'x-vercel-ip-country': 'DE' });
    expect(extractGeo(headers)).toEqual({
      country: 'DE',
      region: null,
      city: null,
    });
  });
});

describe('classifyRoute', () => {
  it('classifies API routes', () => {
    expect(classifyRoute('/api/acris/properties')).toBe('api');
    expect(classifyRoute('/api/events/request')).toBe('api');
  });

  it('classifies static assets', () => {
    expect(classifyRoute('/_next/static/chunks/main.js')).toBe('static');
    expect(classifyRoute('/_next/image?url=/logo.png')).toBe('static');
    expect(classifyRoute('/logo.png')).toBe('static');
    expect(classifyRoute('/fonts/inter.woff2')).toBe('static');
    expect(classifyRoute('/favicon.ico')).toBe('static');
    expect(classifyRoute('/styles.css')).toBe('static');
  });

  it('classifies other _next routes', () => {
    expect(classifyRoute('/_next/data/abc/page.json')).toBe('other');
  });

  it('classifies page routes', () => {
    expect(classifyRoute('/')).toBe('page');
    expect(classifyRoute('/property/1-13-1/overview')).toBe('page');
    expect(classifyRoute('/search')).toBe('page');
  });
});

describe('parseQueryParams', () => {
  it('parses query params into flat object', () => {
    const url = new URL('https://example.com/search?q=test&page=1');
    expect(parseQueryParams(url)).toEqual({ q: 'test', page: '1' });
  });

  it('returns null for URLs without query params', () => {
    const url = new URL('https://example.com/property/1-1-1');
    expect(parseQueryParams(url)).toBeNull();
  });

  it('handles single param', () => {
    const url = new URL('https://example.com/?foo=bar');
    expect(parseQueryParams(url)).toEqual({ foo: 'bar' });
  });
});
