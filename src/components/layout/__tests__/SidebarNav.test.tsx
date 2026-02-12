/// <reference types="vitest/globals" />
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SidebarNav from "@/components/layout/SidebarNav";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { ViewportProvider } from "@/components/layout/ViewportContext";

let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

// Helper to render with SidebarProvider and ViewportProvider
function renderWithProvider(ui: React.ReactElement) {
  return render(
    <ViewportProvider>
      <SidebarProvider>{ui}</SidebarProvider>
    </ViewportProvider>
  );
}

describe("SidebarNav", () => {
  it("renders top-level links and groups", () => {
    currentPathname = "/";
    renderWithProvider(<SidebarNav />);
    expect(screen.getByRole("link", { name: /Open Block/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Search$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Bulk Search/i })).toBeInTheDocument();
  });

  it("marks active link based on pathname", () => {
    currentPathname = "/search";
    renderWithProvider(<SidebarNav />);
    const active = screen.getByRole("link", { name: /^Search$/i });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("renders all navigation links", () => {
    currentPathname = "/";
    renderWithProvider(<SidebarNav />);
    // Check that main navigation links are present
    expect(screen.getByRole("link", { name: /^Search$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Bulk Search/i })).toBeInTheDocument();
  });

  it("has collapse sidebar button", () => {
    currentPathname = "/";
    renderWithProvider(<SidebarNav />);
    expect(screen.getByRole("button", { name: /Collapse sidebar/i })).toBeInTheDocument();
  });

  describe("Collapsed State", () => {
    it("toggles collapsed state when collapse button is clicked", async () => {
      currentPathname = "/";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });

      // Initially expanded - text labels should be visible
      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("Bulk Search")).toBeInTheDocument();

      // Click to collapse
      await user.click(collapseButton);

      // After collapse, text labels should not be visible (only icons)
      expect(screen.queryByText("Search")).not.toBeInTheDocument();
      expect(screen.queryByText("Bulk Search")).not.toBeInTheDocument();

      // But links should still exist (with icons)
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("hides text labels when collapsed", async () => {
      currentPathname = "/";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });

      // Collapse the sidebar
      await user.click(collapseButton);

      // Text labels should be hidden
      expect(screen.queryByText("Search")).not.toBeInTheDocument();
      expect(screen.queryByText("Bulk Search")).not.toBeInTheDocument();
      expect(screen.queryByText("Open Block")).not.toBeInTheDocument();
    });

    it("shows only icons when collapsed", async () => {
      currentPathname = "/";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });

      // Collapse the sidebar
      await user.click(collapseButton);

      // Links should still be present (accessible by role)
      const links = screen.getAllByRole("link");
      // Should have at least the main navigation links
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it("can expand sidebar after collapsing", async () => {
      currentPathname = "/";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });

      // Collapse
      await user.click(collapseButton);
      expect(screen.queryByText("Search")).not.toBeInTheDocument();

      // Find the expand button (it might have a different label or be the same button)
      const expandButton = screen.getByRole("button");

      // Expand
      await user.click(expandButton);

      // Text should be visible again
      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("Bulk Search")).toBeInTheDocument();
    });

    it("maintains active state when collapsed", async () => {
      currentPathname = "/search";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      // Search should be active
      const searchLink = screen.getByRole("link", { name: /^Search$/i });
      expect(searchLink).toHaveAttribute("aria-current", "page");

      // Collapse the sidebar
      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });
      await user.click(collapseButton);

      // Find the search link (now without text, just icon)
      const links = screen.getAllByRole("link");
      const activeLink = links.find(link => link.getAttribute("aria-current") === "page");

      // Active state should be maintained
      expect(activeLink).toBeDefined();
      expect(activeLink).toHaveAttribute("aria-current", "page");
    });

    it("navigation links remain functional when collapsed", async () => {
      currentPathname = "/";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      // Collapse the sidebar
      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });
      await user.click(collapseButton);

      // All links should still have href attributes
      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link).toHaveAttribute("href");
      });
    });
  });

  describe("Bulk Search Navigation", () => {
    it("shows Bulk Search link in navigation", () => {
      currentPathname = "/";
      renderWithProvider(<SidebarNav />);

      // Bulk Search should be visible
      expect(screen.getByRole("link", { name: /Bulk Search/i })).toBeInTheDocument();
    });

    it("marks Bulk Search link as active when on bulk-search page", () => {
      currentPathname = "/bulk-search";
      renderWithProvider(<SidebarNav />);

      // Bulk Search link should be marked as active
      const bulkSearchLink = screen.getByRole("link", { name: /Bulk Search/i });
      expect(bulkSearchLink).toHaveAttribute("aria-current", "page");
    });

    it("Bulk Search link has correct href", () => {
      currentPathname = "/";
      renderWithProvider(<SidebarNav />);

      const bulkSearchLink = screen.getByRole("link", { name: /Bulk Search/i });
      expect(bulkSearchLink).toHaveAttribute("href", "/bulk-search");
    });
  });
});


