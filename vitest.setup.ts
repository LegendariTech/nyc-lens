import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/link to render a normal anchor in tests
vi.mock("next/link", () => {
  return {
    default: ({ children, href, ...props }: any) => (
      React.createElement("a", { href: typeof href === "string" ? href : href?.pathname, ...props }, children)
    ),
  };
});


