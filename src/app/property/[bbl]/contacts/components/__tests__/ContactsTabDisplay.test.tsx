import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactsTabDisplay } from '../ContactsTabDisplay';
import type { OwnerContact } from '@/types/contacts';

describe('ContactsTabDisplay', () => {
  const mockContacts: OwnerContact[] = [
    {
      bbl: '1000010001',
      borough: '1',
      block: '1',
      lot: '1',
      bucket_name: 'ALL',
      status: 'current',
      merged_count: 5,
      owner_business_name: ['ABC Corp'],
      owner_full_address: ['123 Main St, New York, NY 10001'],
      date: new Date('2024-01-15'),
      owner_title: 'Manager',
      owner_phone: ['555-1234'],
      owner_full_name: ['John Doe'],
      owner_master_full_name: 'John Doe',
      source: ['latest_sale'],
      agency: ['DOF'],
    },
    {
      bbl: '1000010001',
      borough: '1',
      block: '1',
      lot: '1',
      bucket_name: 'ALL',
      status: 'current',
      merged_count: 3,
      owner_business_name: ['XYZ Inc'],
      owner_full_address: ['456 Oak Ave, Brooklyn, NY 11201'],
      date: new Date('2024-02-10'),
      owner_title: null,
      owner_phone: ['555-5678'],
      owner_full_name: ['Jane Smith'],
      owner_master_full_name: 'Jane Smith',
      source: ['latest_sale'],
      agency: ['DOF'],
    },
  ];

  it('renders contact data with status filters', () => {
    render(<ContactsTabDisplay contactsData={mockContacts} bbl="1-1-1" />);

    // Check for status filter legend (should appear)
    expect(screen.getAllByText(/Current/i)[0]).toBeInTheDocument();
  });

  it('handles empty contact data', () => {
    render(<ContactsTabDisplay contactsData={[]} bbl="1-1-1" />);

    // Should show message about no matching contacts
    expect(screen.getAllByText(/No contacts match the selected filters/i)[0]).toBeInTheDocument();
  });
});
