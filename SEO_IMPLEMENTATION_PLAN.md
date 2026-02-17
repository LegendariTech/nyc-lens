# Comprehensive SEO & Google Setup Plan for BBL Club

**Project**: NYC Real Estate Data Explorer
**Timeline**: 1-2 weeks
**Goal**: Transform BBL Club into a fully SEO-optimized, Google-indexed web application

---

## 📊 Current State Assessment

### ✅ What's Already Good
- Modern Next.js 16 App Router architecture
- Vercel Analytics integrated
- Clean URL structure with semantic routing
- Server-side rendering for SEO-friendly content
- Comprehensive data sources (ACRIS, PLUTO, DOB, HPD)

### ❌ Critical Gaps
- No sitemap.xml - Search engines can't efficiently discover pages
- No robots.txt - No crawl guidance
- No Open Graph/Twitter Cards - Poor social media sharing
- No structured data - Missing rich search results
- No Google Analytics - No search traffic insights
- No generateMetadata on dynamic routes - Generic titles on property pages
- No Search Console verification

---

## 🎯 Configuration Decisions

- **Domain**: Custom domain (already owned)
- **Google Account**: Existing account ready
- **Approach**: Comprehensive setup
- **Analytics Stack**: Google Tag Manager + GA4 + Search Console + Vercel Analytics

---

## 📋 PHASE 1: Account Setup & Registration
**Estimated Time**: 1-2 hours
**Difficulty**: Easy ⭐

### 1.1 Verify Vercel Account
- Ensure Vercel account is active with admin access
- Install Vercel CLI globally: `npm i -g vercel`
- Verify login: `vercel whoami`

### 1.2 Create/Access Google Services
Using your existing Google account:

1. **Google Analytics 4** (https://analytics.google.com)
   - Click "Start measuring"
   - Create new account: "BBL Club"
   - Create property: "BBL Club Website"
   - Select web platform
   - Note your **Measurement ID** (format: G-XXXXXXXXXX)

2. **Google Search Console** (https://search.google.com/search-console)
   - Click "Start now"
   - Add property → Domain property (recommended)
   - Keep verification instructions open (needed in Phase 2)

3. **Google Tag Manager** (https://tagmanager.google.com)
   - Create new account: "BBL Club"
   - Set up container: "BBL Club Website" (Web)
   - Note your **Container ID** (format: GTM-XXXXXX)

### 1.3 Document Service IDs
Create a secure note with these IDs:
```
GA4 Measurement ID: G-__________
GTM Container ID: GTM-______
Search Console Property: https://yourdomain.com
```

**✅ Completion Criteria**: All three Google services accessible, IDs recorded

---

## 🚀 PHASE 2: Deploy & Domain Configuration
**Estimated Time**: 2-4 hours
**Difficulty**: Medium ⭐⭐

### 2.1 Initial Vercel Deployment
```bash
cd /Users/wice/www/nyc-lens
vercel
```
- Choose: Link to existing project or create new
- Project name: "bbl-club"
- Framework: Next.js (auto-detected)
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Development command: `npm run dev` (default)
- Production deployment: Yes

**Note the deployment URL** (e.g., bbl-club.vercel.app)

### 2.2 Configure Custom Domain

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your custom domain (e.g., bblclub.com)
   - Add both apex domain and www subdomain

2. **At Your Domain Registrar** (e.g., Namecheap, GoDaddy, Cloudflare):
   - Add DNS records as instructed by Vercel:
     - **A Record**: @ → 76.76.21.21
     - **CNAME**: www → cname.vercel-dns.com
   - Save changes

3. **Wait for DNS Propagation**: 15 minutes to 24 hours
   - Check status: `dig yourdomain.com` or use https://dnschecker.org

### 2.3 Configure Environment Variables

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all variables from your local `.env.local`:

**Existing Variables**:
```
ELASTICSEARCH_NODE=https://...
ELASTICSEARCH_USERNAME=...
ELASTICSEARCH_PASSWORD=...
ELASTICSEARCH_ACRIS_INDEX_NAME=...
DB_SERVER=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_DATABASE=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

**New Variables to Add**:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

3. For each variable:
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

4. Redeploy after adding variables: `vercel --prod`

### 2.4 Enable HTTPS & Security
- Verify SSL certificate is active (automatic in Vercel)
- Check: Visit https://yourdomain.com (should show lock icon)
- Test redirect: Visit http://yourdomain.com (should redirect to https)

**✅ Completion Criteria**: Site accessible at custom domain with HTTPS, environment variables configured

---

## 🏗️ PHASE 3: Essential SEO Foundation
**Estimated Time**: 1-2 days
**Difficulty**: Medium ⭐⭐

### 3.1 Create Dynamic Sitemap

**Create file**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com' // Replace with your actual domain

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bulk-search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add other static routes...
  ]

  // TODO: Add dynamic property routes from database
  // Query top 1000 most viewed properties or recent transactions
  // const properties = await getTopProperties()
  // const propertyRoutes = properties.map(p => ({
  //   url: `${baseUrl}/property/${p.bbl}/overview`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return [...staticRoutes]
}
```

**Test locally**: Visit http://localhost:3000/sitemap.xml

### 3.2 Create Robots.txt

**Create file**: `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Block API routes from indexing
    },
    sitemap: 'https://yourdomain.com/sitemap.xml', // Replace with actual domain
  }
}
```

**Test locally**: Visit http://localhost:3000/robots.txt

### 3.3 Enhance Root Metadata

**Modify file**: `src/app/layout.tsx`

Add at the top of the file (after imports):

```typescript
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'), // Replace with actual domain
  title: {
    default: 'BBL Club - NYC Real Estate Data Explorer',
    template: '%s | BBL Club',
  },
  description:
    'Search and explore NYC property transactions, mortgages, deeds, violations, and building data. Access comprehensive ACRIS, PLUTO, DOB, and HPD records in real-time.',
  keywords: [
    'NYC real estate',
    'property records',
    'ACRIS',
    'PLUTO',
    'DOB violations',
    'HPD data',
    'property search',
    'NYC buildings',
    'property transactions',
    'deed records',
  ],
  authors: [{ name: 'BBL Club' }],
  creator: 'BBL Club',
  publisher: 'BBL Club',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'BBL Club',
    title: 'BBL Club - NYC Real Estate Data Explorer',
    description:
      'Search and explore NYC property transactions, mortgages, deeds, violations, and building data.',
    images: [
      {
        url: '/og-image.png', // We'll create this later
        width: 1200,
        height: 630,
        alt: 'BBL Club - NYC Real Estate Data',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBL Club - NYC Real Estate Data Explorer',
    description: 'Search and explore NYC property records, transactions, and building data.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // From Search Console
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### 3.4 Create Metadata Icons

**Create these image files**:

1. **Icon (Favicon)**:
   - Create `src/app/icon.png` (192x192px)
   - Simple logo/letter "B" with BBL Club branding
   - PNG format with transparency

2. **Apple Touch Icon**:
   - Create `src/app/apple-icon.png` (180x180px)
   - Same design as icon
   - PNG format

3. **Keep existing**: `src/app/favicon.ico` (already exists)

**Create file**: `src/app/manifest.ts`

```typescript
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BBL Club - NYC Real Estate Data',
    short_name: 'BBL Club',
    description: 'Search and explore NYC property records and building data',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

### 3.5 Add Canonical URLs

**Create file**: `src/utils/metadata.ts`

```typescript
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  return `${baseUrl}${path}`
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}) {
  const canonicalUrl = getCanonicalUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [image] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}
```

**✅ Completion Criteria**: Sitemap accessible, robots.txt working, enhanced metadata in place, icons created

---

## 📊 PHASE 4: Analytics & Tracking Setup
**Estimated Time**: 4-6 hours
**Difficulty**: Medium ⭐⭐

### 4.1 Install GTM Component

**Create file**: `src/components/analytics/GoogleTagManager.tsx`

```typescript
'use client'

import Script from 'next/script'

export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!gtmId) {
    console.warn('GTM ID not found')
    return null
  }

  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  )
}

export function GoogleTagManagerNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!gtmId) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
```

**Modify file**: `src/app/layout.tsx`

Add imports:
```typescript
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'
```

Add in the `<head>` section (before closing `</head>`):
```typescript
<GoogleTagManager />
```

Add immediately after `<body>` tag:
```typescript
<GoogleTagManagerNoScript />
```

### 4.2 Configure GA4 in GTM

1. **Open GTM Dashboard** (https://tagmanager.google.com)
2. Navigate to your container
3. Click **Tags** → **New**
4. Name: "GA4 Configuration"
5. Tag Configuration → **Google Analytics: GA4 Configuration**
6. Measurement ID: Enter your G-XXXXXXXXXX
7. Triggering → **All Pages**
8. Click **Save**
9. Click **Submit** → **Publish** (Version 1 - Initial Setup)

### 4.3 Set Up Enhanced Measurement in GA4

1. **Open GA4** (https://analytics.google.com)
2. Go to Admin → Data Streams → Select your stream
3. Click **Enhanced measurement**
4. Ensure these are enabled:
   - ✅ Page views (auto-tracked)
   - ✅ Scrolls (tracks 90% scroll depth)
   - ✅ Outbound clicks (external links)
   - ✅ Site search (configure query parameter: `q`)
   - ✅ Video engagement (if applicable)
   - ✅ File downloads (PDFs, etc.)

### 4.4 Create Custom Events in GTM

**Event 1: Property View**

1. In GTM, click **Tags** → **New**
2. Name: "GA4 Event - Property View"
3. Tag Type: **Google Analytics: GA4 Event**
4. Configuration Tag: Select your GA4 Configuration tag
5. Event Name: `property_view`
6. Event Parameters:
   - `property_bbl` = `{{Page Path}}` (captures BBL from URL)
7. Triggering → **New Trigger**:
   - Trigger Type: **Page View**
   - Trigger fires on: Some Page Views
   - Page Path contains `/property/`
8. Save and publish

**Event 2: Property Search**

1. Create New Tag: "GA4 Event - Property Search"
2. Event Name: `property_search`
3. Triggering: Page View on `/search`
4. Save

**Event 3: Export Click** (if you add export features)

1. Create New Tag: "GA4 Event - Export Click"
2. Event Name: `export_click`
3. Triggering: Click on elements with class `.export-button`
4. Save

**Publish all changes**: Click **Submit** → **Publish**

### 4.5 Verify Google Search Console

**Option A: HTML Meta Tag (Recommended)**

1. In Search Console, select HTML tag method
2. Copy the verification code (e.g., `abc123xyz...`)
3. Add to `src/app/layout.tsx` in metadata:
```typescript
verification: {
  google: 'abc123xyz...', // Your actual code
},
```
4. Deploy to production
5. Click "Verify" in Search Console

**Option B: HTML File Upload**

1. Download verification file from Search Console
2. Place in `public/` directory
3. Deploy to production
4. Click "Verify"

**Submit Sitemap**:
1. In Search Console → Sitemaps
2. Enter: `https://yourdomain.com/sitemap.xml`
3. Click "Submit"

### 4.6 Set Up Web Vitals Monitoring

**Create file**: `src/app/web-vitals.tsx`

```typescript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Also send to GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'web_vitals',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
      })
    }
  })

  return null
}
```

Add type declarations for window (create or update `src/types/globals.d.ts`):

```typescript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export {}
```

**Modify**: `src/app/layout.tsx` - Add inside body:
```typescript
<WebVitals />
```

**✅ Completion Criteria**: GTM firing on all pages, GA4 showing real-time data, Search Console verified, Web Vitals tracking

---

## 🎯 PHASE 5: Metadata Optimization
**Estimated Time**: 2-3 days
**Difficulty**: Medium-Hard ⭐⭐⭐

### 5.1 Create Property Metadata Generator

**Update file**: `src/utils/metadata.ts` (add these functions)

```typescript
import { Metadata } from 'next'
import type { AcrisProperty } from '@/types/acris'

export function generatePropertyMetadata(property: AcrisProperty, bbl: string): Metadata {
  const address = property.property_address || `BBL ${bbl}`
  const borough = getBoroughName(property.borough)

  const title = `${address} - Property Details & Transactions`
  const description = `View comprehensive property data for ${address} in ${borough}. Access ACRIS transaction history, DOB violations, HPD complaints, PLUTO data, and tax assessments.`

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/property/${bbl}`),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: getCanonicalUrl(`/property/${bbl}`),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

function getBoroughName(code: string): string {
  const boroughs: Record<string, string> = {
    '1': 'Manhattan',
    '2': 'The Bronx',
    '3': 'Brooklyn',
    '4': 'Queens',
    '5': 'Staten Island',
  }
  return boroughs[code] || 'NYC'
}
```

### 5.2 Implement generateMetadata for Property Pages

**Create file**: `src/app/property/[bbl]/layout.tsx`

```typescript
import { Metadata } from 'next'
import { getPropertyByBbl } from '@/data/acris' // Assuming this function exists
import { generatePropertyMetadata } from '@/utils/metadata'

interface PropertyLayoutProps {
  children: React.ReactNode
  params: { bbl: string }
}

export async function generateMetadata({
  params,
}: {
  params: { bbl: string }
}): Promise<Metadata> {
  try {
    // Convert URL BBL format (1-476-1) to standard format (1004760001)
    const standardBbl = params.bbl.replace(/-/g, '').padStart(10, '0')

    // Fetch property data
    const property = await getPropertyByBbl(standardBbl)

    if (!property) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
        robots: { index: false },
      }
    }

    return generatePropertyMetadata(property, params.bbl)
  } catch (error) {
    console.error('Error generating property metadata:', error)
    return {
      title: 'Property Details',
      description: 'View NYC property data and transaction history.',
    }
  }
}

export default function PropertyLayout({ children, params }: PropertyLayoutProps) {
  return <>{children}</>
}
```

### 5.3 Add Metadata to Property Sub-Routes

**Update**: `src/app/property/[bbl]/transactions/page.tsx`

```typescript
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { bbl: string }
}): Promise<Metadata> {
  return {
    title: 'Property Transactions',
    description: `View all ACRIS property transactions, sales, mortgages, and deeds for BBL ${params.bbl}.`,
  }
}
```

**Similarly update**:
- `src/app/property/[bbl]/pluto/page.tsx` - "PLUTO Property Data & Zoning"
- `src/app/property/[bbl]/tax/page.tsx` - "Tax Assessment & Valuation History"
- `src/app/property/[bbl]/dob/violations/page.tsx` - "DOB Violations"
- etc.

### 5.4 Add Metadata to Dataset Pages

**Example for DOB pages**:

```typescript
// src/app/dob/violations/page.tsx
export const metadata: Metadata = {
  title: 'NYC DOB Violations Database',
  description: 'Search and explore Department of Buildings violations across all NYC properties. View violation types, statuses, and ECB violations.',
  keywords: ['DOB violations', 'NYC building violations', 'ECB violations'],
}
```

Repeat for all dataset exploration pages.

### 5.5 Create Open Graph Images

**Create file**: `src/app/opengraph-image.tsx`

```typescript
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BBL Club - NYC Real Estate Data'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 'bold' }}>BBL Club</div>
        <div style={{ fontSize: 48, marginTop: 20 }}>NYC Real Estate Data Explorer</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
```

**Create file**: `src/app/property/[bbl]/opengraph-image.tsx`

```typescript
import { ImageResponse } from 'next/og'
import { getPropertyByBbl } from '@/data/acris'

export const runtime = 'edge'
export const alt = 'Property Details'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { bbl: string } }) {
  const standardBbl = params.bbl.replace(/-/g, '').padStart(10, '0')
  const property = await getPropertyByBbl(standardBbl)

  const address = property?.property_address || `BBL ${params.bbl}`
  const borough = property?.borough ? getBoroughName(property.borough) : 'NYC'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          color: '#000',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 32, color: '#666', marginBottom: 20 }}>BBL Club</div>
        <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 10 }}>{address}</div>
        <div style={{ fontSize: 40, color: '#444' }}>{borough}</div>
        <div style={{ fontSize: 32, color: '#888', marginTop: 'auto' }}>
          Property Data & Transactions
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

function getBoroughName(code: string): string {
  const boroughs: Record<string, string> = {
    '1': 'Manhattan',
    '2': 'The Bronx',
    '3': 'Brooklyn',
    '4': 'Queens',
    '5': 'Staten Island',
  }
  return boroughs[code] || 'NYC'
}
```

### 5.6 Optimize Search Page Metadata

**Update**: `src/app/search/page.tsx`

```typescript
import { Metadata } from 'next'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string }
}): Promise<Metadata> {
  const query = searchParams.q

  if (query) {
    // Don't index search result pages
    return {
      title: `Search Results for "${query}"`,
      robots: { index: false, follow: false },
    }
  }

  return {
    title: 'Property Search',
    description: 'Search NYC properties by address, BBL, owner name, or location. Access comprehensive ACRIS, PLUTO, and building data.',
  }
}
```

**✅ Completion Criteria**: All major pages have unique, descriptive metadata; OG images generate correctly

---

## 🌟 PHASE 6: Structured Data & Rich Results
**Estimated Time**: 2-3 days
**Difficulty**: Hard ⭐⭐⭐⭐

### 6.1 Create Schema.org Utilities

**Create file**: `src/utils/structuredData.ts`

```typescript
import type { Organization, WebSite, BreadcrumbList, WithContext } from 'schema-dts'

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BBL Club',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/icon.png',
    description: 'NYC Real Estate Data Explorer - Search property transactions, violations, and building data',
    sameAs: [
      // Add social media profiles if you have them
      // 'https://twitter.com/bblclub',
      // 'https://github.com/yourusername',
    ],
  }
}

export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BBL Club',
    url: 'https://yourdomain.com',
    description: 'Search and explore NYC property records, transactions, and building data',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://yourdomain.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generatePropertySchema(property: {
  address: string
  bbl: string
  borough: string
  assessedValue?: number
  ownerName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: property.address,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressRegion: property.borough,
      addressCountry: 'US',
    },
    identifier: property.bbl,
    ...(property.assessedValue && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Assessed Value',
        value: property.assessedValue,
      },
    }),
  }
}

// Helper to safely serialize JSON-LD
export function jsonLdScript(data: any) {
  return {
    __html: JSON.stringify(data),
  }
}
```

### 6.2 Add Organization & WebSite Schema to Root Layout

**Update**: `src/app/layout.tsx`

```typescript
import { generateOrganizationSchema, generateWebSiteSchema, jsonLdScript } from '@/utils/structuredData'

// Inside the <body> tag, add after <GoogleTagManagerNoScript />:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={jsonLdScript(generateOrganizationSchema())}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={jsonLdScript(generateWebSiteSchema())}
/>
```

### 6.3 Add BreadcrumbList Schema to Property Pages

**Update**: `src/app/property/[bbl]/layout.tsx`

```typescript
import { generateBreadcrumbSchema, jsonLdScript } from '@/utils/structuredData'

export default function PropertyLayout({ children, params }: PropertyLayoutProps) {
  const breadcrumbs = [
    { name: 'Home', url: 'https://yourdomain.com' },
    { name: 'Properties', url: 'https://yourdomain.com/search' },
    { name: `BBL ${params.bbl}`, url: `https://yourdomain.com/property/${params.bbl}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(generateBreadcrumbSchema(breadcrumbs))}
      />
      {children}
    </>
  )
}
```

### 6.4 Add PropertyListing Schema (Optional)

Only add if property data is public and appropriate:

**In property detail pages**, add:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={jsonLdScript(
    generatePropertySchema({
      address: property.property_address,
      bbl: params.bbl,
      borough: getBoroughName(property.borough),
      assessedValue: property.assessed_value,
      ownerName: property.owner_name,
    })
  )}
/>
```

### 6.5 Add Dataset Schema to Dataset Pages

**Example for ACRIS dataset page**:

```typescript
export default function AcrisPage() {
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'NYC ACRIS Property Records',
    description: 'Automated City Register Information System - Property transactions, deeds, and mortgages',
    url: 'https://yourdomain.com/datasets/acris',
    spatialCoverage: 'New York City, NY',
    temporalCoverage: '2003/..',
    distribution: {
      '@type': 'DataDownload',
      contentUrl: 'https://yourdomain.com/api/acris',
      encodingFormat: 'application/json',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      {/* Rest of page content */}
    </>
  )
}
```

### 6.6 Add FAQ Schema (Optional)

If you create an FAQ page:

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a BBL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BBL stands for Borough-Block-Lot, a unique identifier for every property in NYC...',
      },
    },
    // Add more Q&A pairs
  ],
}
```

**✅ Completion Criteria**: All structured data validates in Google Rich Results Test

---

## ⚡ PHASE 7: Performance & Technical SEO
**Estimated Time**: 1-2 days
**Difficulty**: Medium ⭐⭐⭐

### 7.1 Configure Next.js Image Optimization

**Update**: `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Existing config...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
        pathname: '/styles/**',
      },
      // Add other image domains as needed
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig
```

**Note**: Your app primarily uses SVGs and Mapbox tiles, so image optimization is minimal. If you add photos/screenshots later, always use `<Image>` from `next/image`.

### 7.2 Add Security Headers

**Update**: `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // Existing config...

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
```

**Note**: Don't add Content-Security-Policy yet if it might break GTM/GA4. Add later once analytics is confirmed working.

### 7.3 Configure Redirects

**Update**: `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // Existing config...

  async redirects() {
    return [
      // Redirect /property/:bbl to /property/:bbl/overview (if needed)
      // Add other legacy URL redirects
    ]
  },
}
```

### 7.4 Implement Route-Level Optimizations

**For static pages**, add at top of page file:

```typescript
export const dynamic = 'force-static'
export const revalidate = false
```

**For property pages** (semi-static), add:

```typescript
export const revalidate = 3600 // Revalidate every hour
```

**For search pages** (dynamic), add:

```typescript
export const dynamic = 'force-dynamic'
```

### 7.5 Create Custom Error Pages

**Create file**: `src/app/not-found.tsx`

```typescript
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-8 text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
```

**Create file**: `src/app/error.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { Metadata } from 'next'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <button
        onClick={reset}
        className="mt-8 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}
```

### 7.6 Add Loading States

**Create file**: `src/app/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  )
}
```

### 7.7 Bundle Analysis

**Install**:
```bash
npm install --save-dev @next/bundle-analyzer
```

**Update**: `next.config.ts`

```typescript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Your config...
}

export default withBundleAnalyzer(nextConfig)
```

**Add script** to `package.json`:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

**Run analysis**:
```bash
npm run analyze
```

Review bundle size and optimize:
- Lazy load heavy components (ag-Grid, Mapbox)
- Use dynamic imports: `const AgGrid = dynamic(() => import('./AgGrid'))`
- Split large utility files

**✅ Completion Criteria**: Lighthouse Performance 90+, security headers active, error pages functional

---

## 🔍 PHASE 8: Content & On-Page SEO
**Estimated Time**: 1-2 days
**Difficulty**: Easy-Medium ⭐⭐

### 8.1 Enhance Homepage Content

**Update**: `src/app/page.tsx`

Add comprehensive, keyword-rich content:

```typescript
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>NYC Real Estate Data Explorer</h1>
        <p>
          Search comprehensive property records, transactions, violations, and building data
          across all five boroughs. Access ACRIS deeds, PLUTO zoning info, DOB violations,
          and HPD complaints in one platform.
        </p>
        {/* CTA for property search */}
      </section>

      <section className="features">
        <h2>What You Can Find</h2>
        <div className="grid">
          <div>
            <h3>Property Transactions</h3>
            <p>Search ACRIS records for sales, mortgages, and deed transfers</p>
          </div>
          <div>
            <h3>Building Violations</h3>
            <p>View DOB violations, ECB notices, and compliance history</p>
          </div>
          <div>
            <h3>Tax Assessments</h3>
            <p>Access property valuations and assessment history</p>
          </div>
          <div>
            <h3>Zoning & Use</h3>
            <p>Explore PLUTO data including lot size, zoning, and building class</p>
          </div>
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div>
          <h3>What is a BBL?</h3>
          <p>BBL stands for Borough-Block-Lot, NYC's unique property identifier...</p>
        </div>
        {/* Add more FAQs */}
      </section>
    </main>
  )
}
```

### 8.2 Create About Page

**Create file**: `src/app/about/page.tsx`

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About BBL Club',
  description: 'Learn about BBL Club, our data sources, and how we help you explore NYC real estate records.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold">About BBL Club</h1>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="mt-4">
          BBL Club provides free, comprehensive access to NYC real estate data...
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Data Sources</h2>
        <ul className="mt-4 list-disc pl-6">
          <li>
            <strong>ACRIS</strong> - Automated City Register Information System
            <p>Property transactions, deeds, mortgages from 2003-present</p>
          </li>
          <li>
            <strong>PLUTO</strong> - Primary Land Use Tax Lot Output
            <p>Property characteristics, zoning, lot dimensions</p>
          </li>
          <li>
            <strong>DOB</strong> - Department of Buildings
            <p>Violations, permits, job applications, complaints</p>
          </li>
          <li>
            <strong>HPD</strong> - Housing Preservation & Development
            <p>Violations, registrations, complaints</p>
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Use Cases</h2>
        <p className="mt-4">BBL Club is used by:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>Real estate investors for due diligence</li>
          <li>Journalists investigating property ownership</li>
          <li>Researchers studying urban development</li>
          <li>Homeowners checking their property history</li>
          <li>Attorneys preparing for real estate cases</li>
        </ul>
      </section>
    </div>
  )
}
```

### 8.3 Add Alt Text to Images

**Audit all `<img>` tags** in your codebase and add descriptive alt text:

```typescript
// Good
<img src="/icon.svg" alt="BBL Club logo" />

// Bad
<img src="/icon.svg" alt="" />
<img src="/icon.svg" />
```

For decorative images (purely visual):
```typescript
<img src="/decoration.svg" alt="" role="presentation" />
```

### 8.4 Optimize Internal Linking

**Add contextual links** throughout your site:

- From homepage → Link to "/search", "/about", dataset pages
- From dataset pages → Link to example properties
- From property pages → Link to related properties (same block, same owner)
- Create "Related Properties" section on property detail pages

### 8.5 Implement Breadcrumb Navigation Component

**Create file**: `src/components/layout/Breadcrumbs.tsx`

```typescript
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {index === items.length - 1 ? (
              <span className="font-semibold text-gray-900">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

Use in property pages:
```typescript
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { label: `BBL ${bbl}`, href: `/property/${bbl}` },
    { label: 'Transactions', href: `/property/${bbl}/transactions` },
  ]}
/>
```

**✅ Completion Criteria**: Homepage has rich content, about page created, internal linking established, breadcrumbs on all pages

---

## 📈 PHASE 9: Testing & Validation
**Estimated Time**: 1 day
**Difficulty**: Easy ⭐

### 9.1 Test Google Integrations

**GTM Preview Mode**:
1. Open GTM dashboard
2. Click **Preview**
3. Enter your site URL
4. Click Connect
5. Navigate through your site in the new tab
6. Verify in GTM debugger:
   - ✅ Tags firing on all pages
   - ✅ GA4 Configuration tag fires
   - ✅ Custom events fire on triggers

**GA4 Real-Time Report**:
1. Open GA4 → Reports → Realtime
2. Navigate your site in another tab
3. Verify you see:
   - ✅ Active users (you)
   - ✅ Page views updating
   - ✅ Events firing (property_view, etc.)

**Search Console**:
1. Open Search Console
2. Verify ownership badge shows "Verified"
3. Check Sitemaps → Status should be "Success"

### 9.2 Validate Structured Data

**Google Rich Results Test**:
1. Go to https://search.google.com/test/rich-results
2. Test these URLs:
   - Homepage: `https://yourdomain.com`
   - Property page: `https://yourdomain.com/property/1-476-1`
   - Dataset page: `https://yourdomain.com/dob/violations`

3. Check for:
   - ✅ No errors
   - ✅ All schema types detected (Organization, WebSite, Breadcrumb, etc.)
   - ✅ Green "Valid" status

**Schema.org Validator**:
1. Go to https://validator.schema.org
2. Paste your page HTML or URL
3. Fix any warnings or errors

### 9.3 Check Sitemap

**Manual Check**:
1. Visit `https://yourdomain.com/sitemap.xml` in browser
2. Verify:
   - ✅ XML is well-formed
   - ✅ All important pages included
   - ✅ Priority values correct (homepage = 1.0, etc.)
   - ✅ changeFrequency appropriate

**Search Console Sitemap Status**:
1. Go to Search Console → Sitemaps
2. Check status: Should say "Success"
3. View "Discovered URLs" count
4. Check for errors (should be 0)

### 9.4 Audit with Lighthouse

**Run Lighthouse**:
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Device: Desktop & Mobile
5. Click "Analyze page load"

**Target Scores**:
- SEO: 90-100
- Performance: 90+ (desktop), 80+ (mobile)
- Accessibility: 90+
- Best Practices: 90+

**Fix any issues flagged** before proceeding.

**Test key pages**:
- Homepage
- Search page
- Property detail page
- Dataset page

### 9.5 Test Meta Tags with Social Debuggers

**Facebook Sharing Debugger**:
1. Go to https://developers.facebook.com/tools/debug
2. Enter your URL
3. Click "Debug"
4. Verify:
   - ✅ Title correct
   - ✅ Description correct
   - ✅ OG image loads (1200x630)
   - ✅ No warnings

**Twitter Card Validator**:
1. Go to https://cards-dev.twitter.com/validator
2. Enter your URL
3. Click "Preview card"
4. Verify card renders correctly

**LinkedIn Post Inspector**:
1. Go to https://www.linkedin.com/post-inspector
2. Enter URL and inspect
3. Verify preview looks good

### 9.6 Mobile Responsiveness Check

**Chrome DevTools**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - iPhone 12 Pro
   - iPad Air
   - Samsung Galaxy S20

**Google Mobile-Friendly Test**:
1. Go to https://search.google.com/test/mobile-friendly
2. Enter your URL
3. Verify "Page is mobile-friendly"

**Search Console Mobile Usability**:
1. Open Search Console → Mobile Usability
2. Check for issues (should be 0)

### 9.7 Cross-Browser Testing

**Test in**:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest, macOS/iOS)
- ✅ Edge (latest)

**Check**:
- Layout renders correctly
- GTM/GA4 tracking works
- No console errors
- Functionality works (search, tables, navigation)

**Use BrowserStack** (free trial) for comprehensive testing: https://www.browserstack.com

**✅ Completion Criteria**: All tests pass, Lighthouse SEO 90+, structured data valid, social cards working

---

## 🚀 PHASE 10: Launch & Monitoring
**Estimated Time**: Ongoing
**Difficulty**: Easy ⭐

### 10.1 Request Indexing in Search Console

**For Critical Pages**:
1. Open Search Console
2. Use URL Inspection tool (top search bar)
3. Enter URL: `https://yourdomain.com`
4. Click "Request indexing"
5. Wait 1-2 minutes for confirmation

**Request indexing for** (do these manually, one by one):
- Homepage: `https://yourdomain.com`
- Search: `https://yourdomain.com/search`
- About: `https://yourdomain.com/about`
- Top 5-10 most important property pages
- Main dataset pages (DOB violations, PLUTO, etc.)

**Note**: Google will discover other pages from sitemap automatically. Manual requests speed up critical pages.

### 10.2 Set Up Google Alerts

**Create Alerts**:
1. Go to https://www.google.com/alerts
2. Create alerts for:
   - "BBL Club"
   - "yourdomain.com"
   - "NYC property records" (to track competitors)
3. Frequency: As-it-happens
4. Deliver to: Your email

### 10.3 Configure GA4 Custom Reports

**Create Custom Exploration**:
1. In GA4, go to Explore
2. Create new exploration: "Property Views"
3. Dimensions: Page path, Event name
4. Metrics: Event count, Users
5. Filter: Page path contains "/property/"
6. Save

**Create Funnel Analysis**:
1. Step 1: Homepage visit
2. Step 2: Search page visit
3. Step 3: Property detail page view
4. Goal: Track user journey

**Set up Conversion Events** (if applicable):
1. GA4 → Configure → Events
2. Mark events as conversions:
   - property_view
   - export_click (if you add export)

### 10.4 Establish Monitoring Routine

**Daily** (5 minutes):
- Check GA4 real-time report for anomalies
- Monitor error rates in GA4
- Quick scan of Search Console Overview

**Weekly** (30 minutes):
- Review Search Console:
  - Coverage issues (Excluded pages, Errors)
  - Performance (Clicks, Impressions, CTR)
  - Mobile Usability issues
- Review GA4:
  - Traffic sources
  - Top pages
  - User behavior flow
- Check Core Web Vitals report in Search Console

**Monthly** (2-3 hours):
- Full SEO audit:
  - Rankings for target keywords (use Google or Ahrefs/SEMrush)
  - Backlink profile (Search Console → Links)
  - Competitor analysis
  - Content gaps
- Review and optimize:
  - Underperforming pages (low CTR)
  - High-impression, low-click queries
  - Pages with indexing issues
- Update content:
  - Refresh old pages
  - Add new FAQ items
  - Create new dataset guides

### 10.5 Set Up Alerts

**Search Console Alerts**:
1. Search Console → Settings → Users and permissions
2. Email preferences: Enable all
   - ✅ Coverage issues
   - ✅ Manual actions
   - ✅ Security issues
   - ✅ New message alerts

**GA4 Custom Alerts**:
1. GA4 → Configure → Custom insights
2. Create insights for:
   - Traffic drops >50% day-over-day
   - Error rate increase
   - Conversion rate drop

**Uptime Monitoring**:
Consider setting up:
- **Vercel**: Already has built-in monitoring
- **UptimeRobot** (free): https://uptimerobot.com
  - Monitor homepage every 5 minutes
  - Get email/SMS if site is down

**✅ Completion Criteria**: Monitoring routine established, alerts configured, custom reports saved

---

## 📊 Success Metrics (After 30 Days)

Track these KPIs monthly:

### Indexing & Coverage
- ✅ Pages indexed in Google: Check Search Console → Coverage
- Target: 80%+ of submitted URLs indexed
- Monitor "Excluded" pages and fix issues

### Organic Traffic
- ✅ Organic sessions in GA4: Acquisition → Traffic acquisition
- Benchmark after Month 1, track growth
- Target: 10-20% month-over-month growth after initial indexing

### Search Visibility
- ✅ Total impressions in Search Console: Performance report
- Target: Increasing trend
- ✅ Average position: Track for top keywords
- Target: Top 10 positions for brand terms, Top 30 for category terms

### Engagement
- ✅ Average engagement time in GA4
- Target: 1-3 minutes (varies by user intent)
- ✅ Bounce rate (inverse of engagement rate)
- Target: <60%

### Technical SEO
- ✅ Core Web Vitals: Search Console → Core Web Vitals
- Target: "Good" status for all metrics (LCP, FID, CLS)
- ✅ Mobile Usability: 0 errors
- ✅ Security Issues: 0 issues

### Rankings (Manual Check)
Search Google for:
- "BBL Club" → Position 1 (your site)
- "[YourDomain]" → Position 1
- "NYC property records" → Top 20-30 (competitive)
- "ACRIS property search" → Top 10-20
- "[Specific BBL] violations" → Top 10 (for indexed properties)

**Use Rank Tracking Tools** (optional):
- Free: Google Search Console (limited)
- Paid: Ahrefs, SEMrush, Moz (comprehensive)

---

## 📁 Deliverables Summary

By the end of implementation, you will have:

### New Files Created (23+)
- ✅ `src/app/sitemap.ts`
- ✅ `src/app/robots.ts`
- ✅ `src/app/manifest.ts`
- ✅ `src/app/icon.png`
- ✅ `src/app/apple-icon.png`
- ✅ `src/app/opengraph-image.tsx`
- ✅ `src/app/property/[bbl]/opengraph-image.tsx`
- ✅ `src/app/not-found.tsx`
- ✅ `src/app/error.tsx`
- ✅ `src/app/loading.tsx`
- ✅ `src/app/web-vitals.tsx`
- ✅ `src/components/analytics/GoogleTagManager.tsx`
- ✅ `src/utils/metadata.ts`
- ✅ `src/utils/structuredData.ts`
- ✅ `src/app/about/page.tsx`
- ✅ `src/app/property/[bbl]/layout.tsx`
- ✅ `src/components/layout/Breadcrumbs.tsx`
- ✅ `src/types/globals.d.ts`

### Modified Files (8+)
- ✅ `src/app/layout.tsx`
- ✅ `next.config.ts`
- ✅ `package.json`
- ✅ `src/app/property/[bbl]/transactions/page.tsx`
- ✅ `src/app/property/[bbl]/pluto/page.tsx`
- ✅ `src/app/search/page.tsx`
- ✅ `.env.local`

### External Configurations
- ✅ Vercel project deployed and configured
- ✅ Custom domain connected
- ✅ Environment variables set
- ✅ Google Analytics 4 property created
- ✅ Google Tag Manager container created and published
- ✅ Google Search Console property verified
- ✅ Sitemap submitted to Search Console

---

## 🛠️ Troubleshooting Guide

### Issue: GTM Not Firing
**Symptoms**: No tags showing in GTM Preview mode
**Solutions**:
- Verify GTM_ID environment variable is set in Vercel
- Check browser console for script errors
- Ensure ad blockers are disabled during testing
- Verify GTM component is imported in layout.tsx

### Issue: GA4 Not Receiving Data
**Symptoms**: No real-time users in GA4
**Solutions**:
- Verify GA4 Configuration tag is published in GTM
- Check Measurement ID is correct (G-XXXXXXXXXX format)
- Wait 24-48 hours for data to appear in main reports (Realtime should work immediately)
- Test with GA4 DebugView: Add `?debug_mode=true` to URL

### Issue: Search Console Verification Failed
**Symptoms**: "Verification failed" error
**Solutions**:
- Ensure verification meta tag is in <head> (check View Source)
- Wait 5-10 minutes after deployment, then retry
- Try alternative verification method (HTML file upload)
- Check that domain is correctly configured in Vercel

### Issue: Sitemap Not Indexing
**Symptoms**: "Couldn't fetch" error in Search Console
**Solutions**:
- Verify sitemap is accessible: Visit https://yourdomain.com/sitemap.xml in browser
- Check for XML syntax errors
- Ensure sitemap returns correct Content-Type: `application/xml`
- Resubmit sitemap after fixing issues

### Issue: Pages Not Indexed
**Symptoms**: Pages in "Excluded" status in Coverage report
**Solutions**:
- Check if pages are blocked by robots.txt
- Verify pages are linked from sitemap
- Ensure pages return 200 status code
- Check for noindex tags (should only be on search results pages)
- Request indexing manually via URL Inspection tool

### Issue: Poor Lighthouse SEO Score
**Symptoms**: SEO score below 90
**Common Issues**:
- Missing meta description (check all pages have generateMetadata)
- Missing alt text on images
- Links without descriptive text
- Blocked resources in robots.txt
- Mobile viewport not set (check viewport export)

### Issue: Structured Data Errors
**Symptoms**: Rich Results Test shows errors
**Solutions**:
- Validate JSON-LD syntax (use jsonlint.com)
- Ensure required fields are present (name, url, etc.)
- Check for typos in @type values (case-sensitive)
- Verify URLs are absolute, not relative

---

## 📚 Resources & Documentation

### Official Documentation
- **Next.js Metadata**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Next.js SEO**: https://nextjs.org/learn/seo/introduction-to-seo
- **Google Search Central**: https://developers.google.com/search
- **Schema.org**: https://schema.org
- **Google Analytics 4**: https://support.google.com/analytics/answer/9304153

### Tools
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **PageSpeed Insights**: https://pagespeed.web.dev
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Structured Data Testing Tool**: https://validator.schema.org
- **Facebook Debugger**: https://developers.facebook.com/tools/debug
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

### SEO Learning Resources
- **Google SEO Starter Guide**: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **Ahrefs Blog**: https://ahrefs.com/blog (comprehensive SEO guides)
- **Moz Beginner's Guide**: https://moz.com/beginners-guide-to-seo

---

## ✅ Final Checklist

Before considering the project complete:

**Phase 1: Accounts**
- [ ] Vercel account active
- [ ] Google Analytics 4 property created
- [ ] Google Tag Manager container created
- [ ] Google Search Console property added
- [ ] All service IDs documented

**Phase 2: Deployment**
- [ ] Site deployed to Vercel
- [ ] Custom domain connected and SSL active
- [ ] Environment variables configured
- [ ] Production build successful

**Phase 3: SEO Foundation**
- [ ] sitemap.xml accessible and submitted
- [ ] robots.txt configured
- [ ] Root metadata enhanced
- [ ] Icons created (favicon, apple-icon)
- [ ] Canonical URLs implemented

**Phase 4: Analytics**
- [ ] GTM installed and firing
- [ ] GA4 receiving data (check Realtime)
- [ ] Search Console verified
- [ ] Custom events configured
- [ ] Web Vitals tracking active

**Phase 5: Metadata**
- [ ] generateMetadata on all dynamic routes
- [ ] Open Graph images generated
- [ ] Twitter Cards configured
- [ ] Search page metadata optimized
- [ ] All pages have unique titles/descriptions

**Phase 6: Structured Data**
- [ ] Organization schema on homepage
- [ ] WebSite schema with SearchAction
- [ ] BreadcrumbList on navigation
- [ ] Property schema on detail pages
- [ ] All schemas validate without errors

**Phase 7: Performance**
- [ ] Security headers configured
- [ ] Redirects set up
- [ ] Custom 404 page created
- [ ] Loading states added
- [ ] Lighthouse Performance 90+

**Phase 8: Content**
- [ ] Homepage content enhanced
- [ ] About page created
- [ ] Alt text on all images
- [ ] Internal linking established
- [ ] Breadcrumbs on all pages

**Phase 9: Testing**
- [ ] GTM tags firing correctly
- [ ] GA4 tracking verified
- [ ] Structured data validated
- [ ] Lighthouse SEO 90+
- [ ] Social cards rendering correctly
- [ ] Mobile-friendly test passed

**Phase 10: Launch**
- [ ] Critical pages requested for indexing
- [ ] Google Alerts set up
- [ ] GA4 custom reports configured
- [ ] Monitoring routine established
- [ ] Alerts configured

---

## 🎯 Next Steps After Launch

**Week 1-2**: Monitor indexing
- Check Search Console daily for coverage issues
- Verify pages are being indexed
- Fix any crawl errors immediately

**Week 3-4**: Analyze initial data
- Review GA4 traffic sources
- Identify top-performing pages
- Check which keywords are driving impressions

**Month 2**: Optimization
- Optimize pages with high impressions but low CTR (improve titles/descriptions)
- Create content for high-value keywords
- Build internal links to important pages

**Month 3+**: Growth
- Monitor rankings and adjust strategy
- Create new content based on search intent
- Consider technical SEO enhancements (advanced schema, etc.)
- Explore link-building opportunities

---

**Ready to start? Begin with Phase 1 and work through systematically. Good luck! 🚀**
