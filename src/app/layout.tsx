import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import ResizableSidebarLayout from "@/components/layout/ResizableSidebarLayout";
import { cn } from "@/utils/cn";
import SidebarNav from "@/components/layout/SidebarNav";
import { ViewportProvider } from "@/components/layout/ViewportContext";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bblclub.com'),
  title: {
    default: 'BBL Club - NYC Real Estate Data Explorer',
    template: '%s | BBL Club',
  },
  description:
    'Search and explore NYC property transactions, mortgages, deeds, violations, and building data. Access comprehensive ACRIS, PLUTO, DOB, and HPD records in real-time. Uncover true property owners behind LLCs.',
  applicationName: 'BBL Club',
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
    'mortgage records',
    'property owner lookup',
    'BBL search',
    'New York City properties',
  ],
  authors: [{ name: 'BBL Club' }],
  creator: 'BBL Club',
  publisher: 'BBL Club',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bblclub.com',
    siteName: 'BBL Club',
    title: 'BBL Club - NYC Real Estate Data Explorer',
    description:
      'Search and explore NYC property transactions, mortgages, deeds, violations, and building data. Access comprehensive ACRIS, PLUTO, DOB, and HPD records.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BBL Club - NYC Real Estate Data Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BBL Club - NYC Real Estate Data Explorer',
    description: 'Search NYC property records, transactions, and building data in real-time.',
    images: ['/og-image.png'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
      </head>
      <body className={cn("font-sans antialiased")}>
        <GoogleTagManagerNoScript />
        <ViewportProvider>
          <ResizableSidebarLayout sidebar={<Suspense fallback={null}><SidebarNav /></Suspense>}>
            {children}
          </ResizableSidebarLayout>
        </ViewportProvider>
        <Analytics />
      </body>
    </html>
  );
}
