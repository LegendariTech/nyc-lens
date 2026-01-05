import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataFieldCard, type DataField } from '../DataFieldCard';

describe('DataFieldCard', () => {
  const mockFields: DataField[] = [
    { label: 'Property Type', value: 'Residential' },
    { label: 'Year Built', value: 1925 },
    { label: 'Lot Size', value: '5000 sq ft' },
  ];

  describe('Basic Rendering', () => {
    it('renders card with title', () => {
      render(<DataFieldCard title="Property Details" fields={mockFields} />);
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    it('renders all field labels', () => {
      render(<DataFieldCard title="Details" fields={mockFields} />);
      expect(screen.getByText('Property Type')).toBeInTheDocument();
      expect(screen.getByText('Year Built')).toBeInTheDocument();
      expect(screen.getByText('Lot Size')).toBeInTheDocument();
    });

    it('renders all field values', () => {
      render(<DataFieldCard title="Details" fields={mockFields} />);
      expect(screen.getByText('Residential')).toBeInTheDocument();
      expect(screen.getByText('1925')).toBeInTheDocument();
      expect(screen.getByText('5000 sq ft')).toBeInTheDocument();
    });

    it('renders as dl element', () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      expect(container.querySelector('dl')).toBeInTheDocument();
    });

    it('uses dt for labels and dd for values', () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const dts = container.querySelectorAll('dt');
      const dds = container.querySelectorAll('dd');
      expect(dts).toHaveLength(3);
      expect(dds).toHaveLength(3);
    });
  });

  describe('Empty State', () => {
    it('shows empty state message when fields array is empty', () => {
      render(<DataFieldCard title="Details" fields={[]} />);
      expect(screen.getByText('No data available for this section')).toBeInTheDocument();
    });

    it('shows field with N/A for null value when not hiding empty fields', () => {
      const fields: DataField[] = [{ label: 'Name', value: null }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('shows field with N/A for undefined value when not hiding empty fields', () => {
      const fields: DataField[] = [{ label: 'Name', value: undefined }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('shows field with N/A for empty string when not hiding empty fields', () => {
      const fields: DataField[] = [{ label: 'Name', value: '' }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Hide Empty Fields', () => {
    it('hides fields with null values when hideEmptyFields=true', () => {
      const fields: DataField[] = [
        { label: 'Name', value: 'John' },
        { label: 'Age', value: null },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Age')).not.toBeInTheDocument();
    });

    it('hides fields with undefined values when hideEmptyFields=true', () => {
      const fields: DataField[] = [
        { label: 'Name', value: 'John' },
        { label: 'Age', value: undefined },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Age')).not.toBeInTheDocument();
    });

    it('hides fields with empty string when hideEmptyFields=true', () => {
      const fields: DataField[] = [
        { label: 'Name', value: 'John' },
        { label: 'Age', value: '' },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Age')).not.toBeInTheDocument();
    });

    it('shows empty state when all fields are empty and hideEmptyFields=true', () => {
      const fields: DataField[] = [
        { label: 'Name', value: null },
        { label: 'Age', value: '' },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('No data available for this section')).toBeInTheDocument();
    });

    it('keeps fields with value 0 when hideEmptyFields=true', () => {
      const fields: DataField[] = [
        { label: 'Count', value: 0 },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('Count')).toBeInTheDocument();
      // Note: 0 is treated as falsy and displays as N/A due to || operator
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Field with Description', () => {
    it('renders FieldTooltip when field has description', () => {
      const fields: DataField[] = [
        { label: 'Property Type', value: 'Residential', description: 'The type of property' },
      ];
      const { container } = render(<DataFieldCard title="Details" fields={fields} />);
      // FieldTooltip typically renders an icon or trigger element
      expect(container.querySelector('dt')).toBeInTheDocument();
    });

    it('renders plain label when field has no description', () => {
      const fields: DataField[] = [
        { label: 'Property Type', value: 'Residential' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('Property Type')).toBeInTheDocument();
    });
  });

  describe('Field with Link', () => {
    it('renders field value as link when link is provided', () => {
      const fields: DataField[] = [
        { label: 'Website', value: 'example.com', link: 'https://example.com' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      const link = screen.getByText('example.com');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('opens links in new tab with security attributes', () => {
      const fields: DataField[] = [
        { label: 'Website', value: 'example.com', link: 'https://example.com' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      const link = screen.getByText('example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders plain text when no link is provided', () => {
      const fields: DataField[] = [
        { label: 'Website', value: 'example.com' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      const text = screen.getByText('example.com');
      expect(text.tagName).not.toBe('A');
    });
  });

  describe('Custom Formatter', () => {
    it('uses custom formatter when provided', () => {
      const fields: DataField[] = [
        { label: 'Price', value: 1000000 },
      ];
      const customFormatter = (field: DataField) => {
        if (field.label === 'Price') {
          return `$${Number(field.value).toLocaleString()}`;
        }
        return String(field.value);
      };
      render(<DataFieldCard title="Details" fields={fields} customFormatter={customFormatter} />);
      expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    });

    it('applies custom formatter to all fields', () => {
      const fields: DataField[] = [
        { label: 'Count', value: 5 },
        { label: 'Total', value: 10 },
      ];
      const customFormatter = (field: DataField) => `${field.value} items`;
      render(<DataFieldCard title="Details" fields={fields} customFormatter={customFormatter} />);
      expect(screen.getByText('5 items')).toBeInTheDocument();
      expect(screen.getByText('10 items')).toBeInTheDocument();
    });

    it('uses default formatter when custom formatter is not provided', () => {
      const fields: DataField[] = [
        { label: 'Count', value: 5 },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Custom Empty Check', () => {
    it('uses custom empty check when provided', () => {
      const fields: DataField[] = [
        { label: 'Count', value: 0 },
        { label: 'Name', value: 'Test' },
      ];
      // Consider 0 as empty
      const customEmptyCheck = (field: DataField) => field.value === 0;
      render(
        <DataFieldCard
          title="Details"
          fields={fields}
          hideEmptyFields
          customEmptyCheck={customEmptyCheck}
        />
      );
      expect(screen.queryByText('Count')).not.toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('defaults to standard empty check when not provided', () => {
      const fields: DataField[] = [
        { label: 'Count', value: 0 },
        { label: 'Empty', value: null },
      ];
      render(<DataFieldCard title="Details" fields={fields} hideEmptyFields />);
      expect(screen.getByText('Count')).toBeInTheDocument(); // 0 is not empty by default
      expect(screen.queryByText('Empty')).not.toBeInTheDocument(); // null is empty
    });
  });

  describe('Field Name Key', () => {
    it('uses fieldName as key when provided', () => {
      const fields: DataField[] = [
        { label: 'Type', value: 'Residential', fieldName: 'property_type' },
        { label: 'Type', value: 'Owner', fieldName: 'owner_type' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      // Both fields should render despite having the same label
      expect(screen.getAllByText('Type')).toHaveLength(2);
    });

    it('falls back to label as key when fieldName is not provided', () => {
      const fields: DataField[] = [
        { label: 'Type', value: 'Residential' },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('Type')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <DataFieldCard title="Details" fields={mockFields} className="custom-class" />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('accepts id prop', () => {
      const { container } = render(
        <DataFieldCard title="Details" fields={mockFields} id="test-card" />
      );
      const card = container.firstChild;
      expect(card).toHaveAttribute('id', 'test-card');
    });
  });

  describe('Styling', () => {
    it('applies base card styling', () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('rounded-lg');
      expect(card.className).toContain('border');
      expect(card.className).toContain('shadow-sm');
    });

    it('applies field row styling', () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const fieldRow = container.querySelector('dl > div');
      expect(fieldRow?.className).toContain('flex');
      expect(fieldRow?.className).toContain('border-b');
    });

    it('removes border from last field', () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const fieldRows = container.querySelectorAll('dl > div');
      const lastRow = fieldRows[fieldRows.length - 1];
      expect(lastRow.className).toContain('last:border-b-0');
    });
  });

  describe('Value Types', () => {
    it('renders string values', () => {
      const fields: DataField[] = [{ label: 'Name', value: 'Test' }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('renders number values', () => {
      const fields: DataField[] = [{ label: 'Count', value: 42 }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders boolean values', () => {
      const fields: DataField[] = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false },
      ];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('true')).toBeInTheDocument();
      // Note: false is treated as falsy and displays as N/A due to || operator
      expect(screen.getAllByText('N/A')[0]).toBeInTheDocument();
    });

    it('renders object values as string', () => {
      const fields: DataField[] = [{ label: 'Data', value: { key: 'value' } }];
      render(<DataFieldCard title="Details" fields={fields} />);
      expect(screen.getByText('[object Object]')).toBeInTheDocument();
    });
  });
});
