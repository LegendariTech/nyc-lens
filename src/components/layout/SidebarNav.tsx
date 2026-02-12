"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { useSidebar } from "./SidebarContext";
import {
  HomeIcon,
  ChevronRightIcon,
  SearchIcon,
  BellIcon,
  PanelLeftIcon,
  PanelRightIcon,
  SettingsIcon,
  TableIcon
} from "@/components/icons";
import { Button } from "@/components/ui";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Search", href: "/search" },
  { label: "Bulk Search", href: "/bulk-search" },
  // { label: "Alerts", href: "/get-notified" },
  // {
  //   label: "DOB",
  //   children: [
  //     { label: "Complaints", href: "/dob/complaints" },
  //     { label: "Certificate of Occupancy", href: "/dob/certificate-of-occupancy" },
  //     { label: "Permits", href: "/dob/permits" },
  //     { label: "Violations: DOB Now", href: "/dob/violations-dob-now" },
  //     { label: "Violations: BIS", href: "/dob/violations-bis" },
  //   ],
  // },
  // {
  //   label: "HPD",
  //   children: [
  //     { label: "Violations", href: "/hpd/violations" },
  //     { label: "Permits", href: "/hpd/permits" },
  //     { label: "Registration Contacts", href: "/hpd/registration-contacts" },
  //   ],
  // },
  // { label: "Settings", href: "/settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar();

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
      "p-2 gap-2",
      // Typography & colors
      "text-sm text-nav-item"
    )}>
      {/* Logo and Collapse Button */}
      <div className={cn(
        // Fixed header height to prevent vertical shift
        "mb-2 flex h-12 shrink-0 items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {isCollapsed ? (
          // When collapsed: show logo button that reveals expand icon on hover
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className={cn(
              "group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-md",
              "hover:bg-foreground/10 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
            title="Expand sidebar"
          >
            <HomeIcon className="text-foreground h-5 w-5 shrink-0 transition-opacity group-hover:opacity-0" />
            <PanelRightIcon className="absolute inset-0 m-auto h-5 w-5 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ) : (
          // When expanded: show logo link and separate collapse button
          <>
            <Link
              href="/"
              className={cn(
                // Keep header height stable and icon position consistent
                "flex h-12 flex-1 items-center rounded-md",
                "hover:bg-foreground/10 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              onClick={() => setIsMobileOpen(false)}
              title="Open Block - Home"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <HomeIcon className="text-foreground shrink-0 h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 whitespace-nowrap text-lg font-semibold text-nav-item">
                Open Block
              </span>
            </Link>

            {/* Collapse Button - position stable on the right */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
              className="h-12 w-12 shrink-0"
            >
              <PanelLeftIcon className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      <ul className={cn("flex flex-col gap-1")}>
        {NAV_ITEMS.map((item) => {
          if (item.href) {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    // Layout & spacing - consistent icon position
                    "flex h-12 shrink-0 items-center rounded-md",
                    isCollapsed ? "w-12 justify-center" : "w-full",
                    // Active / inactive
                    isActive
                      ? "bg-foreground/10 text-nav-item"
                      : "text-nav-item hover:bg-foreground/10",
                    // Focus
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center")}>
                    {item.label === "Search" && <SearchIcon className="shrink-0 h-5 w-5" />}
                    {item.label === "Bulk Search" && <TableIcon className="shrink-0 h-5 w-5" />}
                    {item.label === "Alerts" && <BellIcon className="shrink-0 h-5 w-5" />}
                    {item.label === "Settings" && <SettingsIcon className="shrink-0 h-5 w-5" />}
                  </span>
                  {!isCollapsed && (
                    <span className="truncate text-sm">
                      {item.label}
                    </span>
                  )}
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
                            "flex h-12 w-full items-center",
                            "px-3 rounded-md",
                            active
                              ? "bg-foreground/10 text-nav-item"
                              : "text-nav-item hover:bg-foreground/10",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          )}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <span className="truncate text-sm">{child.label}</span>
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


