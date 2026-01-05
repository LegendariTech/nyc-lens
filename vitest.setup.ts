import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

interface NextLinkProps {
  children: React.ReactNode;
  href: string | { pathname?: string };
  [key: string]: unknown;
}

// Mock next/link to render a normal anchor in tests
vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: NextLinkProps) => (
      React.createElement("a", { href: typeof href === "string" ? href : href?.pathname, ...props }, children)
    ),
  };
});


