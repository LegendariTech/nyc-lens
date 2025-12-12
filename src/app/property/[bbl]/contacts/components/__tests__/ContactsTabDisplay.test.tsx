/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ContactsTabDisplay } from '../ContactsTabDisplay';
import type { OwnerContact } from '@/types/contacts';

// Mock child components to isolate tests
vi.mock('../Table', () => ({
  ContactsTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="contacts-table">{data.length} contacts in table</div>
  ),
}));

vi.mock('../ContactCardList', () => ({
  ContactCardList: ({ contacts }: { contacts: unknown[] }) => (
    <div data-testid="contacts-card-list">{contacts.length} contacts in cards</div>
  ),
}));

vi.mock('@/components/layout/TabControlsBar', () => ({
  TabControlsBar: ({ showNormalizedToggle }: { showNormalizedToggle: boolean }) => (
    <div data-testid="tab-controls-bar">
      {showNormalizedToggle && <span data-testid="normalized-toggle">Normalized Toggle</span>}
    </div>
  ),
}));

vi.mock('@/components/FilterLegend', () => ({
  FilterLegend: () => <div data-testid="filter-legend">Filter Legend</div>,
}));

vi.mock('@/data/contacts/utils', () => ({
  formatContacts: (contacts: OwnerContact[]) => contacts.map(c => ({
    ...c,
    owner_address: [c.owner_address].filter(Boolean),
    owner_phone: [c.owner_phone].filter(Boolean),
    owner_business_name: [c.owner_business_name].filter(Boolean),
  })),
  deduplicateContacts: (contacts: unknown[]) => contacts,
}));

const mockContactsData: OwnerContact[] = [
  {
    borough: '1',
    block: '1',
    lot: '1',
    owner_first_name: 'John',
    owner_last_name: 'Doe',
    owner_business_name: null,
    owner_type: 'INDIVIDUAL',
    owner_address: '123 Main St',
    owner_city: 'New York',
    owner_state: 'NY',
    owner_zip: '10001',
    date: new Date('2024-01-15'),
    agency: 'dof',
    source: 'latest_sale',
    owner_title: null,
    owner_phone: '555-1234',
    owner_full_name: 'John Doe',
    owner_middle_name: null,
    owner_address_2: null,
    owner_city_2: null,
    owner_state_2: null,
    owner_zip_2: null,
    owner_phone_2: null,
  },
];

describe('ContactsTabDisplay', () => {
  describe('CSS-based Responsive Visibility', () => {
    it('renders TabControlsBar with hidden md:block class for CSS visibility', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      const controlsBar = screen.getByTestId('tab-controls-bar');
      const controlsWrapper = controlsBar.parentElement;

      // Should have CSS classes for responsive visibility
      expect(controlsWrapper).toHaveClass('hidden');
      expect(controlsWrapper).toHaveClass('md:block');
    });

    it('renders ContactsTable wrapper with hidden md:block class', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      const table = screen.getByTestId('contacts-table');
      const tableWrapper = table.closest('.hidden.md\\:block');

      expect(tableWrapper).toBeInTheDocument();
    });

    it('renders ContactCardList wrapper with md:hidden class', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      const cardList = screen.getByTestId('contacts-card-list');
      const cardListWrapper = cardList.parentElement;

      expect(cardListWrapper).toHaveClass('md:hidden');
    });

    it('shows normalized toggle (desktop only)', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      expect(screen.getByTestId('normalized-toggle')).toBeInTheDocument();
    });
  });

  describe('No JavaScript Flash (CSS-only visibility)', () => {
    /**
     * These tests verify that visibility is controlled via CSS classes
     * rather than JavaScript conditions, which prevents layout flash/shift
     * on initial render.
     */

    it('controls bar visibility uses CSS class, not conditional rendering', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      // TabControlsBar should ALWAYS be in the DOM
      // (visibility controlled by CSS, not JS condition)
      expect(screen.getByTestId('tab-controls-bar')).toBeInTheDocument();
    });

    it('both table and card list are always rendered (visibility controlled by CSS)', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      // Both views should always be in the DOM
      expect(screen.getByTestId('contacts-table')).toBeInTheDocument();
      expect(screen.getByTestId('contacts-card-list')).toBeInTheDocument();
    });
  });

  describe('FilterLegend', () => {
    it('renders FilterLegend', () => {
      render(<ContactsTabDisplay contactsData={mockContactsData} bbl="1-1-1" />);

      expect(screen.getByTestId('filter-legend')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('handles empty contacts data', () => {
      render(<ContactsTabDisplay contactsData={[]} bbl="1-1-1" />);

      // Should render without errors
      expect(screen.getByTestId('filter-legend')).toBeInTheDocument();
    });
  });
});
