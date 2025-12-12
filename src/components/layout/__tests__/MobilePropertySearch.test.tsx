/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock next/navigation
let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock PropertyAutocomplete to avoid complex dependencies
vi.mock('@/components/search/PropertyAutocomplete', () => ({
  PropertyAutocomplete: ({ ariaLabel, inputClassName }: { ariaLabel?: string; inputClassName?: string }) => (
    <input
      data-testid="property-autocomplete"
      aria-label={ariaLabel}
      className={inputClassName}
      placeholder="Search"
    />
  ),
}));

// Import after mocks
import ResizableSidebarLayout from '../ResizableSidebarLayout';

describe('MobilePropertySearch', () => {
  beforeEach(() => {
    mockPathname = '/';
    mockSearchParams = new URLSearchParams();
  });

  describe('Route-aware rendering', () => {
    it('renders PropertyAutocomplete on property pages', () => {
      mockPathname = '/property/1-1-1';
      mockSearchParams = new URLSearchParams('address=123+Main+St');

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      // Find the autocomplete in the mobile nav bar
      const autocomplete = screen.getByTestId('property-autocomplete');
      expect(autocomplete).toBeInTheDocument();
    });

    it('renders on nested property pages (e.g., /property/1-1-1/transactions)', () => {
      mockPathname = '/property/1-1-1/transactions';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      expect(screen.getByTestId('property-autocomplete')).toBeInTheDocument();
    });

    it('does not render on search page', () => {
      mockPathname = '/search';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      expect(screen.queryByTestId('property-autocomplete')).not.toBeInTheDocument();
    });

    it('does not render on home page', () => {
      mockPathname = '/';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      expect(screen.queryByTestId('property-autocomplete')).not.toBeInTheDocument();
    });

    it('does not render on DOB pages', () => {
      mockPathname = '/dob/violations';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      expect(screen.queryByTestId('property-autocomplete')).not.toBeInTheDocument();
    });

    it('does not render on HPD pages', () => {
      mockPathname = '/hpd/violations';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      expect(screen.queryByTestId('property-autocomplete')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('passes aria-label to PropertyAutocomplete', () => {
      mockPathname = '/property/1-1-1';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      const autocomplete = screen.getByTestId('property-autocomplete');
      expect(autocomplete).toHaveAttribute('aria-label', 'Search property by address or BBL');
    });

    it('passes custom inputClassName for mobile styling', () => {
      mockPathname = '/property/1-1-1';

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      const autocomplete = screen.getByTestId('property-autocomplete');
      // Should have mobile-specific styling classes
      expect(autocomplete).toHaveClass('border-0');
      expect(autocomplete).toHaveClass('rounded-none');
    });
  });

  describe('Address parameter', () => {
    it('reads address from URL search params', () => {
      mockPathname = '/property/1-1-1';
      mockSearchParams = new URLSearchParams('address=123+Broadway');

      render(
        <ResizableSidebarLayout sidebar={<div>Sidebar</div>}>
          <div>Content</div>
        </ResizableSidebarLayout>
      );

      // The autocomplete should be rendered (address is passed as initialValue)
      expect(screen.getByTestId('property-autocomplete')).toBeInTheDocument();
    });
  });
});
