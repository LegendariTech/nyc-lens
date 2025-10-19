"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/" },
  { label: "Search", href: "/search" },
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
  { label: "Get Notified", href: "/get-notified" },
];

export default function SidebarNav() {
  const pathname = usePathname();

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
      "flex flex-col",
      // Spacing
      "p-4 gap-2",
      // Typography & colors
      "text-sm text-nav-item"
    )}>
      <ul className={cn("flex flex-col gap-1")}>
        {NAV_ITEMS.map((item) => {
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
                  {item.label}
                </Link>
              </li>
            );
          }

          const group = item.label;
          const isOpen = !!openGroups[group];
          const anyChildActive = (item.children || []).some((c) => pathname === c.href);

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
                <span className={cn("inline-flex items-center justify-between w-full")}>
                  <span className={cn("font-medium text-nav-group")}>{group}</span>
                  <span className={cn("text-nav-group/80 text-xs")}>{isOpen ? "▲" : "▼"}</span>
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


