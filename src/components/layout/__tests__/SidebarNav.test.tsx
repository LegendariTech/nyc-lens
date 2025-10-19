/// <reference types="vitest/globals" />
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SidebarNav from "@/components/layout/SidebarNav";

let currentPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("SidebarNav", () => {
  it("renders top-level links and groups", () => {
    currentPathname = "/";
    render(<SidebarNav />);
    expect(screen.getByRole("link", { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /DOB/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /HPD/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get Notified/i })).toBeInTheDocument();
  });

  it("marks active link based on pathname", () => {
    currentPathname = "/search";
    render(<SidebarNav />);
    const active = screen.getByRole("link", { name: /Search/i });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("expands group when its child path is active", () => {
    currentPathname = "/dob/violations";
    render(<SidebarNav />);
    // Group should be expanded and child visible
    expect(screen.getByRole("link", { name: /Violations/i })).toBeInTheDocument();
  });

  it("toggles group open/closed on click", async () => {
    currentPathname = "/";
    const user = userEvent.setup();
    render(<SidebarNav />);

    const dobButton = screen.getByRole("button", { name: /DOB/i });
    // Open group
    await user.click(dobButton);
    expect(screen.getByRole("link", { name: /Complaints/i })).toBeInTheDocument();

    // Close group
    await user.click(dobButton);
    expect(screen.queryByRole("link", { name: /Complaints/i })).not.toBeInTheDocument();
  });
});


