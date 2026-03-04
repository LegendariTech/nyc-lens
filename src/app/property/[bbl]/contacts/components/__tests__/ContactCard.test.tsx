import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactCard } from '../ContactCard/ContactCard';
import type { OwnerContact } from '@/types/contacts';

const mockOpenSignUp = vi.fn();

// Mock Clerk hooks used by ContactCard
vi.mock('@clerk/nextjs', () => ({
  useClerk: () => ({ openSignUp: mockOpenSignUp }),
}));

describe('ContactCard', () => {
  const mockContact: OwnerContact = {
    bbl: '1000010001',
    borough: '1',
    block: '1',
    lot: '1',
    bucket_name: 'ALL',
    status: 'current',
    merged_count: 5,
    owner_business_name: ['ABC Corp', 'XYZ Inc'],
    owner_full_address: ['123 Main St, New York, NY 10001'],
    date: new Date('2024-01-15'),
    owner_title: ['Manager'],
    owner_phone: ['555-1234', '555-5678'],
    owner_full_name: ['John Doe'],
    owner_master_full_name: 'John Doe',
    source: ['latest_sale'],
    agency: ['DOF'],
  };

  it('renders contact name', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders source category chip with label', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    // The 'latest_sale' source maps to 'recorded_owner' category with label 'Recorded Owner'
    expect(screen.getByText('Recorded Owner')).toBeInTheDocument();
  });

  it('renders date', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument();
  });

  it('renders title when present', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('does not render title when absent', () => {
    const contactWithoutTitle: OwnerContact = {
      ...mockContact,
      owner_title: [],
    };
    render(<ContactCard contact={contactWithoutTitle} isSignedIn />);
    expect(screen.queryByText('Manager')).not.toBeInTheDocument();
  });

  it('renders expandable phone list', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    // First phone should be visible
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('renders expandable business name list', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    // First business name should be visible
    expect(screen.getByText('ABC Corp')).toBeInTheDocument();
  });

  it('renders expandable address list', () => {
    render(<ContactCard contact={mockContact} isSignedIn />);
    // Address should be visible
    expect(screen.getByText('123 Main St, New York, NY 10001')).toBeInTheDocument();
  });

  it('uses first business name as contact name when master name is not present', () => {
    const businessOnlyContact: OwnerContact = {
      ...mockContact,
      owner_master_full_name: null,
    };
    render(<ContactCard contact={businessOnlyContact} isSignedIn />);
    expect(screen.getAllByText('ABC Corp')[0]).toBeInTheDocument();
  });

  it('displays "Unknown" when neither master name nor business name is present', () => {
    const unknownContact: OwnerContact = {
      ...mockContact,
      owner_master_full_name: null,
      owner_business_name: [],
    };
    render(<ContactCard contact={unknownContact} isSignedIn />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('does not render empty fields', () => {
    const minimalContact: OwnerContact = {
      ...mockContact,
      owner_phone: [],
      owner_business_name: [],
      owner_full_address: [],
      owner_title: [],
    };
    render(<ContactCard contact={minimalContact} isSignedIn />);

    // These labels should not appear when fields are empty
    expect(screen.queryByText('Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('Business Names')).not.toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('blurs details and shows eye icon when not signed in', () => {
    render(<ContactCard contact={mockContact} isSignedIn={false} />);
    // Name should still be visible
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Eye icon should be present
    expect(screen.getByTitle('Sign up to view')).toBeInTheDocument();
  });

  it('triggers sign-up when blurred card is activated via keyboard', async () => {
    mockOpenSignUp.mockClear();
    const user = userEvent.setup();
    render(<ContactCard contact={mockContact} isSignedIn={false} />);

    const button = screen.getByRole('button');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(mockOpenSignUp).toHaveBeenCalledTimes(1);
  });
});
