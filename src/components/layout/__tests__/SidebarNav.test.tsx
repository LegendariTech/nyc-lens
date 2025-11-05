/// <reference types="vitest/globals" />
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SidebarNav from "@/components/layout/SidebarNav";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { ViewportProvider } from "@/components/layout/ViewportContext";

let currentPathname = "/";
let currentSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
  useSearchParams: () => currentSearchParams,
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
    expect(screen.getByRole("link", { name: /NYC Lens/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alerts/i })).toBeInTheDocument();
  });

  it("marks active link based on pathname", () => {
    currentPathname = "/search";
    renderWithProvider(<SidebarNav />);
    const active = screen.getByRole("link", { name: /Search/i });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("renders all navigation links", () => {
    currentPathname = "/";
    renderWithProvider(<SidebarNav />);
    // Check that main navigation links are present
    expect(screen.getByRole("link", { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alerts/i })).toBeInTheDocument();
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
      expect(screen.getByText("Alerts")).toBeInTheDocument();

      // Click to collapse
      await user.click(collapseButton);

      // After collapse, text labels should not be visible (only icons)
      expect(screen.queryByText("Search")).not.toBeInTheDocument();
      expect(screen.queryByText("Alerts")).not.toBeInTheDocument();

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
      expect(screen.queryByText("Alerts")).not.toBeInTheDocument();
      expect(screen.queryByText("NYC Lens")).not.toBeInTheDocument();
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
      expect(screen.getByText("Alerts")).toBeInTheDocument();
    });

    it("maintains active state when collapsed", async () => {
      currentPathname = "/search";
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      // Search should be active
      const searchLink = screen.getByRole("link", { name: /Search/i });
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

  describe("Bulk Search Mode", () => {
    beforeEach(() => {
      // Reset to default state before each test
      currentPathname = "/";
      currentSearchParams = new URLSearchParams();
    });

    it("hides DOB and HPD groups when bulk mode is disabled", () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams(); // No bulk param
      renderWithProvider(<SidebarNav />);

      // DOB and HPD should not be visible
      expect(screen.queryByRole("button", { name: /DOB/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /HPD/i })).not.toBeInTheDocument();

      // Regular links should still be visible
      expect(screen.getByRole("link", { name: /Search/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Alerts/i })).toBeInTheDocument();
    });

    it("shows DOB and HPD groups when bulk=true in URL", () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams("bulk=true");
      renderWithProvider(<SidebarNav />);

      // DOB and HPD should be visible as buttons (collapsible groups)
      expect(screen.getByRole("button", { name: /DOB/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /HPD/i })).toBeInTheDocument();
    });

    it("shows DOB group when on DOB pages even without bulk param", () => {
      currentPathname = "/dob/violations-dob-now";
      currentSearchParams = new URLSearchParams(); // No bulk param
      renderWithProvider(<SidebarNav />);

      // DOB should be visible because we're on a DOB page
      expect(screen.getByRole("button", { name: /DOB/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /HPD/i })).toBeInTheDocument();
    });

    it("shows HPD group when on HPD pages even without bulk param", () => {
      currentPathname = "/hpd/violations";
      currentSearchParams = new URLSearchParams(); // No bulk param
      renderWithProvider(<SidebarNav />);

      // Both should be visible because we're on an HPD page
      expect(screen.getByRole("button", { name: /DOB/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /HPD/i })).toBeInTheDocument();
    });

    it("can expand DOB group in bulk mode", async () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams("bulk=true");
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const dobButton = screen.getByRole("button", { name: /DOB/i });

      // Initially, DOB children should not be visible
      expect(screen.queryByRole("link", { name: /Violations: DOB Now/i })).not.toBeInTheDocument();

      // Click to expand
      await user.click(dobButton);

      // Now DOB children should be visible
      expect(screen.getByRole("link", { name: /Violations: DOB Now/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Violations: BIS/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Complaints/i })).toBeInTheDocument();
    });

    it("can expand HPD group in bulk mode", async () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams("bulk=true");
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const hpdButton = screen.getByRole("button", { name: /HPD/i });

      // Initially, HPD children should not be visible
      expect(screen.queryByRole("link", { name: /Violations/i })).not.toBeInTheDocument();

      // Click to expand
      await user.click(hpdButton);

      // Now HPD children should be visible
      expect(screen.getByRole("link", { name: /Violations/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Registration Contacts/i })).toBeInTheDocument();
    });

    it("auto-expands DOB group when on DOB page", () => {
      currentPathname = "/dob/violations-dob-now";
      currentSearchParams = new URLSearchParams();
      renderWithProvider(<SidebarNav />);

      // DOB group should be auto-expanded
      expect(screen.getByRole("link", { name: /Violations: DOB Now/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Violations: BIS/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Complaints/i })).toBeInTheDocument();
    });

    it("auto-expands HPD group when on HPD page", () => {
      currentPathname = "/hpd/violations";
      currentSearchParams = new URLSearchParams();
      renderWithProvider(<SidebarNav />);

      // HPD group should be auto-expanded
      expect(screen.getByRole("link", { name: /Violations/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Registration Contacts/i })).toBeInTheDocument();
    });

    it("can collapse DOB group after expanding", async () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams("bulk=true");
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      const dobButton = screen.getByRole("button", { name: /DOB/i });

      // Expand
      await user.click(dobButton);
      expect(screen.getByRole("link", { name: /Violations: DOB Now/i })).toBeInTheDocument();

      // Collapse
      await user.click(dobButton);
      expect(screen.queryByRole("link", { name: /Violations: DOB Now/i })).not.toBeInTheDocument();
    });

    it("marks active DOB child link correctly", () => {
      currentPathname = "/dob/violations-dob-now";
      currentSearchParams = new URLSearchParams();
      renderWithProvider(<SidebarNav />);

      // Violations: DOB Now link should be marked as active
      const violationsLink = screen.getByRole("link", { name: /Violations: DOB Now/i });
      expect(violationsLink).toHaveAttribute("aria-current", "page");
    });

    it("marks active HPD child link correctly", () => {
      currentPathname = "/hpd/permits";
      currentSearchParams = new URLSearchParams();
      renderWithProvider(<SidebarNav />);

      // Permits link should be marked as active
      const permitsLink = screen.getByRole("link", { name: /Permits/i });
      expect(permitsLink).toHaveAttribute("aria-current", "page");
    });

    it("hides DOB and HPD groups when collapsed even in bulk mode", async () => {
      currentPathname = "/search";
      currentSearchParams = new URLSearchParams("bulk=true");
      const user = userEvent.setup();
      renderWithProvider(<SidebarNav />);

      // Initially, DOB and HPD should be visible
      expect(screen.getByRole("button", { name: /DOB/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /HPD/i })).toBeInTheDocument();

      // Collapse the sidebar
      const collapseButton = screen.getByRole("button", { name: /Collapse sidebar/i });
      await user.click(collapseButton);

      // DOB and HPD should now be hidden (groups are hidden when collapsed)
      expect(screen.queryByRole("button", { name: /DOB/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /HPD/i })).not.toBeInTheDocument();
    });
  });
});


