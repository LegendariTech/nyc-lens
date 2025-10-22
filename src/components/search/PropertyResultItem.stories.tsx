import type { Meta, StoryObj } from '@storybook/react';
import { PropertyResultItem } from './PropertyResultItem';
import type { PropertyItem } from './propertyService';

/**
 * PropertyResultItem displays a single property search result with address,
 * BBL, sale information, and owner details. It supports text highlighting
 * based on the search query.
 */
const meta = {
  title: 'Components/Search/PropertyResultItem',
  component: PropertyResultItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual property result item used in autocomplete dropdown. Highlights matching text and displays property details including address, BBL, sale information, and owner.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ul className="w-[600px] rounded-md border border-foreground/20 bg-background">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof PropertyResultItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample property data
const sampleProperty: PropertyItem = {
  id: '1-2469-22',
  address: '123 MAIN STREET',
  borough: '1',
  block: '2469',
  lot: '22',
  aka: [],
  sale_document_date: '2024-01-15',
  sale_document_amount: 1250000,
  buyer_name: 'JOHN DOE',
};

const propertyWithoutSale: PropertyItem = {
  id: '2-1234-56',
  address: '456 BROADWAY',
  borough: '2',
  block: '1234',
  lot: '56',
  aka: [],
};

const propertyWithLongAddress: PropertyItem = {
  id: '3-5678-90',
  address: '789 WEST END AVENUE APARTMENT 12B',
  borough: '3',
  block: '5678',
  lot: '90',
  aka: [],
  sale_document_date: '2023-12-01',
  sale_document_amount: 2500000,
  buyer_name: 'ACME REAL ESTATE HOLDINGS LLC',
};

const propertyLowValue: PropertyItem = {
  id: '4-9876-54',
  address: '321 PARK PLACE',
  borough: '4',
  block: '9876',
  lot: '54',
  aka: [],
  sale_document_date: '2024-03-20',
  sale_document_amount: 100000,
  buyer_name: 'JANE SMITH',
};

/**
 * Default property result item with all information displayed
 */
export const Default: Story = {
  args: {
    item: sampleProperty,
    query: 'main',
    compact: false,
    itemProps: {},
  },
};

/**
 * Property result without sale information
 */
export const NoSaleInfo: Story = {
  args: {
    item: propertyWithoutSale,
    query: 'broadway',
    compact: false,
    itemProps: {},
  },
};

/**
 * Compact variant with reduced padding
 */
export const Compact: Story = {
  args: {
    item: sampleProperty,
    query: 'main',
    compact: true,
    itemProps: {},
  },
};

/**
 * Property with long address and owner name
 */
export const LongContent: Story = {
  args: {
    item: propertyWithLongAddress,
    query: 'west',
    compact: false,
    itemProps: {},
  },
};

/**
 * Property with low sale value
 */
export const LowValue: Story = {
  args: {
    item: propertyLowValue,
    query: 'park',
    compact: false,
    itemProps: {},
  },
};

/**
 * Highlighted by BBL search
 */
export const BBLSearch: Story = {
  args: {
    item: sampleProperty,
    query: '2469',
    compact: false,
    itemProps: {},
  },
};

/**
 * No query (no highlighting)
 */
export const NoQuery: Story = {
  args: {
    item: sampleProperty,
    query: '',
    compact: false,
    itemProps: {},
  },
};

/**
 * Hover state (simulated with aria-selected)
 */
export const Hovered: Story = {
  args: {
    item: sampleProperty,
    query: 'main',
    compact: false,
    itemProps: {
      'aria-selected': true,
    },
  },
};

/**
 * Multiple items in a list to show border behavior
 */
export const MultipleItems: Story = {
  render: () => (
    <ul className="w-[600px] rounded-md border border-foreground/20 bg-background">
      <PropertyResultItem
        item={sampleProperty}
        query="main"
        compact={false}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyWithoutSale}
        query="broadway"
        compact={false}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyLowValue}
        query="park"
        compact={false}
        itemProps={{}}
      />
    </ul>
  ),
};

/**
 * Multiple items with one selected
 */
export const MultipleItemsWithSelection: Story = {
  render: () => (
    <ul className="w-[600px] rounded-md border border-foreground/20 bg-background">
      <PropertyResultItem
        item={sampleProperty}
        query="main"
        compact={false}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyWithoutSale}
        query="broadway"
        compact={false}
        itemProps={{
          'aria-selected': true,
        }}
      />
      <PropertyResultItem
        item={propertyLowValue}
        query="park"
        compact={false}
        itemProps={{}}
      />
    </ul>
  ),
};

/**
 * Compact list with multiple items
 */
export const CompactList: Story = {
  render: () => (
    <ul className="w-[600px] rounded-md border border-foreground/20 bg-background">
      <PropertyResultItem
        item={sampleProperty}
        query="main"
        compact={true}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyWithoutSale}
        query="broadway"
        compact={true}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyLowValue}
        query="park"
        compact={true}
        itemProps={{}}
      />
      <PropertyResultItem
        item={propertyWithLongAddress}
        query="west"
        compact={true}
        itemProps={{}}
      />
    </ul>
  ),
};

/**
 * Recent high-value sale
 */
export const HighValueSale: Story = {
  args: {
    item: {
      id: '1-1111-11',
      address: '1 CENTRAL PARK WEST',
      borough: '1',
      block: '1111',
      lot: '11',
      aka: [],
      sale_document_date: '2024-10-01',
      sale_document_amount: 15000000,
      buyer_name: 'LUXURY PROPERTIES LLC',
    },
    query: 'central',
    compact: false,
    itemProps: {},
  },
};

/**
 * Property with only owner, no sale date/amount
 */
export const OwnerOnly: Story = {
  args: {
    item: {
      id: '2-2222-22',
      address: '100 FIFTH AVENUE',
      borough: '2',
      block: '2222',
      lot: '22',
      aka: [],
      buyer_name: 'CITY HOUSING AUTHORITY',
    },
    query: 'fifth',
    compact: false,
    itemProps: {},
  },
};

/**
 * Dark mode preview
 */
export const DarkMode: Story = {
  args: {
    item: sampleProperty,
    query: 'main',
    compact: false,
    itemProps: {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <ul className="w-[600px] rounded-md border border-foreground/20 bg-background">
          <Story />
        </ul>
      </div>
    ),
  ],
};

