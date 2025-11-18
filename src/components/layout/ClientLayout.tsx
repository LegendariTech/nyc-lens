'use client';

import ResizableSidebarLayout from "@/components/layout/ResizableSidebarLayout";
import SidebarNav from "@/components/layout/SidebarNav";
import { ViewportProvider } from "@/components/layout/ViewportContext";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ViewportProvider>
        <ResizableSidebarLayout sidebar={<SidebarNav />}>
          {children}
        </ResizableSidebarLayout>
      </ViewportProvider>
    </ThemeProvider>
  );
}

