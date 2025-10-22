"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import {
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  BellIcon
} from "@/components/icons";
import { Button } from "@/components/ui";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Search", href: "/search" },
  { label: "Alerts", href: "/get-notified" },
  {
    label: "DOB",
    children: [
      { label: "Complaints", href: "/dob/complaints" },
      { label: "Certificate of Occupancy", href: "/dob/certificate-of-occupancy" },
      { label: "Permits", href: "/dob/permits" },
      { label: "Violations", href: "/dob/violations" },
    ],
  },
  {
    label: "HPD",
    children: [
      { label: "Violations", href: "/hpd/violations" },
      { label: "Permits", href: "/hpd/permits" },
      { label: "Registration Contacts", href: "/hpd/registration-contacts" },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  // Check if bulk mode is active via URL param
  const isBulkMode = searchParams.get('bulk') === 'true';

  // Show DOB and HPD only when bulk mode is ON or when on their own pages
  const showBulkItems = isBulkMode || pathname.startsWith("/dob") || pathname.startsWith("/hpd");

  // Filter nav items based on bulk mode
  const visibleNavItems = useMemo(() => {
    if (showBulkItems) {
      return NAV_ITEMS;
    }
    // Hide DOB and HPD when bulk mode is off
    return NAV_ITEMS.filter(item => item.label !== "DOB" && item.label !== "HPD");
  }, [showBulkItems]);

  const initiallyOpen = useMemo(() => ({
    DOB: pathname.startsWith("/dob"),
    HPD: pathname.startsWith("/hpd"),
  }), [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    DOB: initiallyOpen.DOB,
    HPD: initiallyOpen.HPD,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <nav className={cn(
      // Layout
      "flex flex-col h-full",
      // Spacing
      "p-4 gap-2",
      // Typography & colors
      "text-sm text-nav-item"
    )}>
      {/* Logo and Collapse Button */}
      <div className={cn("mb-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {isCollapsed ? (
          // When collapsed: show logo that becomes chevron on hover
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="group relative"
            title="Expand sidebar"
          >
            <HomeIcon className="text-foreground shrink-0 group-hover:opacity-0 transition-opacity" />
            <ChevronRightIcon className="absolute inset-0 m-auto text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        ) : (
          // When expanded: show logo and separate chevron button
          <>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                "hover:bg-foreground/10 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
            >
              <HomeIcon className="text-foreground shrink-0" />
              <span className="text-lg font-semibold text-nav-item whitespace-nowrap">NYC Lens</span>
            </Link>

            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
            >
              <ChevronLeftIcon />
            </Button>
          </>
        )}
      </div>

      <ul className={cn("flex flex-col gap-1")}>
        {visibleNavItems.map((item) => {
          if (item.href) {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    // Layout & spacing
                    "block w-full",
                    "px-3 py-2 rounded-md",
                    // Active / inactive
                    isActive
                      ? "bg-foreground/10 text-nav-item"
                      : "text-nav-item hover:bg-foreground/10",
                    // Focus
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
                    {item.label === "Search" && <SearchIcon className="shrink-0" />}
                    {item.label === "Alerts" && <BellIcon className="shrink-0" />}
                    {!isCollapsed && item.label}
                  </span>
                </Link>
              </li>
            );
          }

          // Hide DOB and HPD groups when collapsed
          if (isCollapsed) {
            return null;
          }

          const group = item.label;
          const isOpen = !!openGroups[group];

          return (
            <li key={group}>
              <button
                type="button"
                className={cn(
                  // Layout & spacing
                  "w-full text-left",
                  "px-3 py-2 rounded-md",
                  // Visual
                  "text-nav-group",
                  "hover:bg-foreground/10",
                  // Focus
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                )}
                aria-expanded={isOpen}
                onClick={() => toggleGroup(group)}
              >
                <span className={cn("inline-flex items-center gap-1.5")}>
                  <span className={cn("font-medium text-nav-group")}>{group}</span>
                  <ChevronRightIcon
                    className={cn(
                      "h-3 w-3 text-nav-group/80 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                </span>
              </button>

              {isOpen && item.children && (
                <ul className={cn("mt-1 pl-3 flex flex-col gap-1")}>
                  {item.children.map((child) => {
                    const active = pathname === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block w-full",
                            "px-3 py-2 rounded-md",
                            active
                              ? "bg-foreground/10 text-nav-item"
                              : "text-nav-item hover:bg-foreground/10",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


