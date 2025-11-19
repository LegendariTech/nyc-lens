import type { Meta, StoryObj } from '@storybook/react';
import { DataFieldCard, type DataField } from './DataFieldCard';

const meta: Meta<typeof DataFieldCard> = {
  title: 'Components/UI/DataFieldCard',
  component: DataFieldCard,
  tags: ['autodocs'],
  argTypes: {
    hideEmptyFields: {
      control: 'boolean',
      description: 'Hide fields with empty values',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataFieldCard>;

const basicFields: DataField[] = [
  { label: 'Property Type', value: 'Residential' },
  { label: 'Year Built', value: 1925 },
  { label: 'Lot Size', value: '5000 sq ft' },
  { label: 'Zoning', value: 'R4' },
];

// Basic Examples
export const Default: Story = {
  args: {
    title: 'Property Details',
    fields: basicFields,
  },
};

export const WithEmptyFields: Story = {
  args: {
    title: 'Property Details',
    fields: [
      { label: 'Property Type', value: 'Residential' },
      { label: 'Year Built', value: null },
      { label: 'Lot Size', value: '5000 sq ft' },
      { label: 'Zoning', value: '' },
      { label: 'Owner', value: undefined },
    ],
  },
};

export const HideEmptyFields: Story = {
  args: {
    title: 'Property Details',
    hideEmptyFields: true,
    fields: [
      { label: 'Property Type', value: 'Residential' },
      { label: 'Year Built', value: null },
      { label: 'Lot Size', value: '5000 sq ft' },
      { label: 'Zoning', value: '' },
      { label: 'Owner', value: undefined },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    title: 'Property Details',
    fields: [],
  },
};

export const AllFieldsEmptyWithHide: Story = {
  args: {
    title: 'Property Details',
    hideEmptyFields: true,
    fields: [
      { label: 'Property Type', value: null },
      { label: 'Year Built', value: '' },
      { label: 'Lot Size', value: undefined },
    ],
  },
};

// With Descriptions (Tooltips)
export const WithDescriptions: Story = {
  args: {
    title: 'Property Details',
    fields: [
      {
        label: 'BBL',
        value: '1-00234-0045',
        description: 'Borough-Block-Lot identifier for NYC properties',
        fieldName: 'bbl',
      },
      {
        label: 'Tax Class',
        value: '2B',
        description: 'NYC tax classification for property assessment',
        fieldName: 'tax_class',
      },
      {
        label: 'Assessment',
        value: '$850,000',
        description: 'Assessed value used for property tax calculation',
        fieldName: 'assessment',
      },
    ],
  },
};

// With Links
export const WithLinks: Story = {
  args: {
    title: 'External Resources',
    fields: [
      {
        label: 'Property Website',
        value: 'example.com',
        link: 'https://example.com',
      },
      {
        label: 'DOB Records',
        value: 'View on NYC DOB',
        link: 'https://www.nyc.gov/dob',
      },
      {
        label: 'Tax Assessment',
        value: 'NYC Finance Portal',
        link: 'https://www1.nyc.gov/site/finance/',
      },
    ],
  },
};

// Custom Formatter
export const WithCustomFormatter: Story = {
  args: {
    title: 'Financial Details',
    fields: [
      { label: 'Purchase Price', value: 1250000 },
      { label: 'Annual Tax', value: 15000 },
      { label: 'Market Value', value: 1500000 },
      { label: 'Square Footage', value: 2500 },
    ],
    customFormatter: (field: DataField) => {
      if (field.label.includes('Price') || field.label.includes('Tax') || field.label.includes('Value')) {
        return `$${Number(field.value).toLocaleString()}`;
      }
      if (field.label.includes('Footage')) {
        return `${Number(field.value).toLocaleString()} sq ft`;
      }
      return String(field.value || 'N/A');
    },
  },
};

// Real-world Examples
export const PropertyOverview: Story = {
  args: {
    title: 'Property Overview',
    fields: [
      { label: 'Address', value: '123 Main Street' },
      { label: 'Borough', value: 'Manhattan' },
      { label: 'Neighborhood', value: 'Upper West Side' },
      { label: 'ZIP Code', value: '10024' },
      { label: 'Property Type', value: 'Residential' },
      { label: 'Building Class', value: 'R4 - Condominium' },
      { label: 'Year Built', value: 1925 },
      { label: 'Stories', value: 5 },
    ],
  },
};

export const TaxInformation: Story = {
  args: {
    title: 'Tax Assessment Information',
    fields: [
      {
        label: 'Tax Year',
        value: '2024',
        fieldName: 'tax_year',
      },
      {
        label: 'Tax Class',
        value: '2B',
        description: 'NYC tax classification',
        fieldName: 'tax_class',
      },
      {
        label: 'Assessed Value',
        value: '$850,000',
        description: 'Value used for tax calculation',
        fieldName: 'assessed_value',
      },
      {
        label: 'Exemptions',
        value: 'None',
        fieldName: 'exemptions',
      },
      {
        label: 'Annual Tax',
        value: '$12,500',
        fieldName: 'annual_tax',
      },
    ],
  },
};

export const BuildingCharacteristics: Story = {
  args: {
    title: 'Building Characteristics',
    fields: [
      { label: 'Lot Area', value: '5,000 sq ft' },
      { label: 'Building Area', value: '12,500 sq ft' },
      { label: 'Residential Units', value: 8 },
      { label: 'Commercial Units', value: 2 },
      { label: 'Stories', value: 5 },
      { label: 'Year Built', value: 1925 },
      { label: 'Year Altered', value: 2015 },
      { label: 'Construction Type', value: 'Masonry' },
    ],
  },
};

export const ViolationsSummary: Story = {
  args: {
    title: 'DOB Violations Summary',
    fields: [
      {
        label: 'Open Violations',
        value: '3',
        link: '#violations',
      },
      {
        label: 'Closed Violations',
        value: '12',
        link: '#violations',
      },
      {
        label: 'Last Inspection',
        value: 'November 15, 2024',
      },
      {
        label: 'Next Inspection',
        value: 'May 15, 2025',
      },
    ],
  },
};

export const OwnerInformation: Story = {
  args: {
    title: 'Owner Information',
    fields: [
      { label: 'Owner Name', value: 'ABC Properties LLC' },
      { label: 'Owner Type', value: 'Corporation' },
      { label: 'Mailing Address', value: '456 Business Ave, Suite 100' },
      { label: 'City, State', value: 'New York, NY' },
      { label: 'ZIP Code', value: '10001' },
    ],
  },
};

export const WithMixedContent: Story = {
  args: {
    title: 'Property Details',
    fields: [
      {
        label: 'BBL',
        value: '1-00234-0045',
        description: 'Borough-Block-Lot identifier',
        fieldName: 'bbl',
      },
      {
        label: 'Property Type',
        value: 'Residential',
      },
      {
        label: 'Year Built',
        value: 1925,
      },
      {
        label: 'Violations',
        value: 'View Details',
        link: '#violations',
      },
      {
        label: 'Last Updated',
        value: null,
      },
      {
        label: 'Notes',
        value: '',
      },
    ],
  },
};

export const CustomEmptyCheck: Story = {
  args: {
    title: 'Property Metrics',
    hideEmptyFields: true,
    fields: [
      { label: 'Violations Count', value: 0 },
      { label: 'Units Count', value: 5 },
      { label: 'Stories', value: 0 },
      { label: 'Parking Spots', value: 10 },
    ],
    customEmptyCheck: (field: DataField) => {
      // Consider 0 as empty only for Stories field
      if (field.label === 'Stories') {
        return field.value === 0;
      }
      return field.value === null || field.value === '' || field.value === undefined;
    },
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <DataFieldCard
        title="Property Overview"
        fields={[
          { label: 'Address', value: '123 Main Street' },
          { label: 'Borough', value: 'Manhattan' },
          { label: 'Type', value: 'Residential' },
        ]}
      />
      <DataFieldCard
        title="Assessment"
        fields={[
          { label: 'Tax Class', value: '2B' },
          { label: 'Assessed Value', value: '$850,000' },
          { label: 'Annual Tax', value: '$12,500' },
        ]}
      />
      <DataFieldCard
        title="Violations"
        fields={[
          { label: 'Open', value: '3' },
          { label: 'Closed', value: '12' },
          { label: 'Last Inspection', value: 'Nov 15, 2024' },
        ]}
      />
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  args: {
    title: 'Responsive Card',
    fields: [
      { label: 'Short Label', value: 'Value' },
      { label: 'Very Long Label That Might Wrap', value: 'Another Value' },
      { label: 'Medium Length Label', value: 'Some Value Here' },
      { label: 'BBL Number', value: '1-00234-0045-0001' },
    ],
  },
};
