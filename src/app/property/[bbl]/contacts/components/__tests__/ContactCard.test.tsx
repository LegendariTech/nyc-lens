/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactCard } from '../ContactCard';
import { ExpandableList } from '../ContactCard/ExpandableList';
import type { ContactWithCategory } from '../types';

describe('ExpandableList', () => {
  it('returns null for empty items', () => {
    const { container } = render(<ExpandableList items={[]} label="Phone" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null for items with only empty strings', () => {
    const { container } = render(<ExpandableList items={['', '  ', '']} label="Phone" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders single item without expand button', () => {
    render(<ExpandableList items={['555-1234']} label="Phone" />);

    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders multiple items with expand button', () => {
    render(<ExpandableList items={['555-1234', '555-5678', '555-9999']} label="Phone" />);

    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ 2 more/i })).toBeInTheDocument();

    // Other items should be hidden initially
    expect(screen.queryByText('555-5678')).not.toBeInTheDocument();
    expect(screen.queryByText('555-9999')).not.toBeInTheDocument();
  });

  it('expands and collapses list on button click', async () => {
    const user = userEvent.setup();
    render(<ExpandableList items={['555-1234', '555-5678', '555-9999']} label="Phone" />);

    // Click to expand
    await user.click(screen.getByRole('button', { name: /\+ 2 more/i }));

    // All items should be visible
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
    expect(screen.getByText('555-9999')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();

    // Click to collapse
    await user.click(screen.getByRole('button', { name: /show less/i }));

    // Only first item visible
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.queryByText('555-5678')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ 2 more/i })).toBeInTheDocument();
  });

  it('filters out empty items from count', () => {
    render(<ExpandableList items={['555-1234', '', '555-5678', '  ']} label="Phone" />);

    // Should show "+ 1 more" (only one valid additional item)
    expect(screen.getByRole('button', { name: /\+ 1 more/i })).toBeInTheDocument();
  });
});

describe('ContactCard', () => {
  const mockContact: ContactWithCategory = {
    borough: '1',
    block: '1',
    lot: '1',
    owner_first_name: null,
    owner_last_name: null,
    owner_business_name: 'ABC Corp\nXYZ Inc',
    owner_type: 'CORPORATION',
    owner_address: '123 Main St\n456 Oak Ave',
    owner_city: null,
    owner_state: null,
    owner_zip: null,
    date: new Date('2024-01-15'),
    agency: 'dof',
    source: 'latest_sale',
    owner_title: 'Manager',
    owner_phone: '555-1234\n555-5678',
    owner_full_name: 'John Doe',
    owner_middle_name: null,
    owner_address_2: null,
    owner_city_2: null,
    owner_state_2: null,
    owner_zip_2: null,
    owner_phone_2: null,
    category: 'sale',
  };

  it('renders contact name', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders category chip', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('S')).toBeInTheDocument(); // 'S' is the abbreviation for Sale
  });

  it('renders date', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument();
  });

  it('renders title when present', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders phones with expand/collapse', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
  });

  it('renders addresses with expand/collapse', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
  });

  it('renders business names when full name is present', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
    expect(screen.getByText('Business:')).toBeInTheDocument();
  });

  it('uses business name as contact name when no full name', () => {
    const contactWithoutFullName: ContactWithCategory = {
      ...mockContact,
      owner_full_name: null,
    };
    render(<ContactCard contact={contactWithoutFullName} />);
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
    // Business label should not appear since business name is used as contact name
    expect(screen.queryByText('Business:')).not.toBeInTheDocument();
  });

  it('shows Unknown when no name available', () => {
    const contactWithoutName: ContactWithCategory = {
      ...mockContact,
      owner_full_name: null,
      owner_business_name: null,
    };
    render(<ContactCard contact={contactWithoutName} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('does not render date when not present', () => {
    const contactWithoutDate: ContactWithCategory = {
      ...mockContact,
      date: null,
    };
    render(<ContactCard contact={contactWithoutDate} />);
    expect(screen.queryByText(/Jan/i)).not.toBeInTheDocument();
  });

  it('renders different category chips correctly', () => {
    const categories = [
      { category: 'assessment-roll' as const, abbr: 'AR' },
      { category: 'hpd-registration' as const, abbr: 'HPD' },
      { category: 'permits' as const, abbr: 'P' },
      { category: 'mortgage' as const, abbr: 'M' },
    ];

    categories.forEach(({ category, abbr }) => {
      const { unmount } = render(
        <ContactCard contact={{ ...mockContact, category }} />
      );
      expect(screen.getByText(abbr)).toBeInTheDocument();
      unmount();
    });
  });
});
