"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { MobileHeaderProvider, useMobileHeader } from "./MobileHeaderContext";
import { MenuIcon } from "@/components/icons";

interface ResizableSidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  /** Initial sidebar width in pixels */
  initialWidth?: number;
  /** Minimum sidebar width in pixels */
  minWidth?: number;
  /** Maximum sidebar width in pixels */
  maxWidth?: number;
  /** Optional className for the root container */
  className?: string;
}

function ResizableSidebarLayoutInner({
  sidebar,
  children,
  initialWidth = 280,
  minWidth = 200,
  maxWidth = 560,
  className,
}: ResizableSidebarLayoutProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  const [sidebarWidth, setSidebarWidth] = useState<number>(initialWidth);
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { headerContent } = useMobileHeader();

  // Collapsed width (just enough for icons and padding)
  const collapsedWidth = 64;
  const effectiveWidth = isCollapsed ? collapsedWidth : sidebarWidth;

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const newWidth = Math.min(Math.max(startWidthRef.current + dx, minWidth), maxWidth);
    setSidebarWidth(newWidth);
  }, [minWidth, maxWidth]);

  const stopDragging = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    setIsDragging(true);
  }, [sidebarWidth]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("mouseleave", stopDragging);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("mouseleave", stopDragging);
    };
  }, [onMouseMove, stopDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // Layout
        "flex w-full h-dvh",
        // Prevent horizontal scroll globally at this container
        "overflow-x-hidden",
        // Ensure text colors follow tokens
        "bg-background text-foreground",
        // Dragging cursor and disable selection while resizing
        isDragging && "cursor-col-resize select-none",
        className
      )}
    >
      {/* Mobile top bar with burger menu */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 z-[60]",
          "h-12 flex items-center gap-2 px-3",
          "bg-background border-b border-foreground/20"
        )}
      >
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "h-9 w-9 rounded-md",
            "hover:bg-foreground/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        {/* Injected header content (e.g., search from property pages) */}
        {headerContent && (
          <div className="flex-1 min-w-0">
            {headerContent}
          </div>
        )}
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className={cn(
            "md:hidden fixed inset-0 z-[65]",
            "bg-foreground/20 backdrop-blur-[2px]"
          )}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ width: `${effectiveWidth}px` }}
        className={cn(
          // Box
          "h-full shrink-0",
          // Visual
          "border-r border-foreground/20 bg-sidebar-background",
          // Scrolling behavior: allow internal scroll; not required by user but practical
          "overflow-auto",
          // Typography
          "font-sans",
          // Smooth transition when collapsing/expanding (but not when dragging)
          !isDragging && "transition-[width] duration-300 ease-in-out",
          // Mobile: off-canvas drawer
          "fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 ease-in-out md:static md:transform-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebar}
      </aside>

      {!isCollapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          onMouseDown={onMouseDown}
          className={cn(
            // Size & hit area
            "relative w-1",
            "cursor-col-resize select-none",
            // Visual handle hover affordance
            "bg-foreground/10 hover:bg-foreground/20",
            // Accessibility: allow keyboard focus styles if needed
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            // Hide resizer on small screens
            "hidden md:block"
          )}
        />
      )}

      <main
        className={cn(
          // Fill remaining
          "flex-1 h-full",
          // Prevent vertical scroll in main content block per requirement
          "overflow-hidden",
          // Container spacing is up to page content; keep neutral here
          "font-sans",
          // Ensure main content not hidden behind mobile top bar
          "pt-12 md:pt-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function ResizableSidebarLayout(props: ResizableSidebarLayoutProps) {
  return (
    <SidebarProvider>
      <MobileHeaderProvider>
        <ResizableSidebarLayoutInner {...props} />
      </MobileHeaderProvider>
    </SidebarProvider>
  );
}
