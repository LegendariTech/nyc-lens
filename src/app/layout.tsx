import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import ResizableSidebarLayout from "@/components/layout/ResizableSidebarLayout";
import { cn } from "@/utils/cn";
import SidebarNav from "@/components/layout/SidebarNav";
import { ViewportProvider } from "@/components/layout/ViewportContext";
import { AgGridRegistry } from "@/components/AgGridRegistry";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/GoogleTagManager";

export const metadata: Metadata = {
  title: "Open Block - NYC Real Estate Data",
  description: "Search the latest NYC property transactions, mortgages, and deeds in real-time. Uncover the true owners behind LLCs and access comprehensive tax and building information.",
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
        <AgGridRegistry />
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
