/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactCard } from '../ContactCard';
import { ExpandableList } from '../ContactCard/ExpandableList';
import type { FormattedContactWithCategory } from '../types';

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
  // FormattedContactWithCategory has arrays instead of newline-separated strings
  const mockContact: FormattedContactWithCategory = {
    borough: '1',
    block: '1',
    lot: '1',
    owner_business_name: ['ABC Corp', 'XYZ Inc'],
    owner_type: 'CORPORATION',
    owner_address: ['123 Main St', '456 Oak Ave'],
    date: new Date('2024-01-15'),
    agency: 'dof',
    source: 'latest_sale',
    owner_title: 'Manager',
    owner_phone: ['555-1234', '555-5678'],
    owner_full_name: 'John Doe',
    owner_middle_name: null,
    category: 'sale',
  };

  it('renders contact name', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders category chip with full label', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
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
    // Plural label for multiple phones
    expect(screen.getByText('Phones:')).toBeInTheDocument();
  });

  it('renders addresses with expand/collapse', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    // Plural label for multiple addresses
    expect(screen.getByText('Addresses:')).toBeInTheDocument();
  });

  it('renders business names when full name is present', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
    expect(screen.getByText('Business Names:')).toBeInTheDocument();
  });

  it('uses business name as contact name when no full name', () => {
    const contactWithoutFullName: FormattedContactWithCategory = {
      ...mockContact,
      owner_full_name: null,
    };
    render(<ContactCard contact={contactWithoutFullName} />);
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
    // Business label should not appear since business name is used as contact name
    expect(screen.queryByText('Business Names:')).not.toBeInTheDocument();
  });

  it('shows Unknown when no name available', () => {
    const contactWithoutName: FormattedContactWithCategory = {
      ...mockContact,
      owner_full_name: null,
      owner_business_name: [],
    };
    render(<ContactCard contact={contactWithoutName} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('does not render date when not present', () => {
    const contactWithoutDate: FormattedContactWithCategory = {
      ...mockContact,
      date: null,
    };
    render(<ContactCard contact={contactWithoutDate} />);
    expect(screen.queryByText(/Jan/i)).not.toBeInTheDocument();
  });

  it('renders different category chips with full labels', () => {
    const categories = [
      { category: 'assessment-roll' as const, label: 'Assessment Roll' },
      { category: 'hpd-registration' as const, label: 'HPD Registration' },
      { category: 'permits' as const, label: 'Permit' },
      { category: 'mortgage' as const, label: 'Mortgage' },
    ];

    categories.forEach(({ category, label }) => {
      const { unmount } = render(
        <ContactCard contact={{ ...mockContact, category }} />
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('uses singular Phone label for single phone', () => {
    const contactWithSinglePhone: FormattedContactWithCategory = {
      ...mockContact,
      owner_phone: ['555-1234'],
    };
    render(<ContactCard contact={contactWithSinglePhone} />);
    expect(screen.getByText('Phone:')).toBeInTheDocument();
  });

  it('uses singular Address label for single address', () => {
    const contactWithSingleAddress: FormattedContactWithCategory = {
      ...mockContact,
      owner_address: ['123 Main St'],
    };
    render(<ContactCard contact={contactWithSingleAddress} />);
    expect(screen.getByText('Address:')).toBeInTheDocument();
  });
});
