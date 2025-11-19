import type { Meta, StoryObj } from '@storybook/react';
import { PropertyAutocomplete } from './PropertyAutocomplete';
import type { PropertyItem } from './propertyService';
import { ViewportProvider } from '@/components/layout/ViewportContext';

/**
 * PropertyAutocomplete is a specialized autocomplete component for searching NYC properties.
 * It wraps the generic Autocomplete component with property-specific logic including
 * Elasticsearch integration and navigation to property detail pages.
 *
 * ## Features
 * - Address search with autocomplete
 * - BBL (Borough-Block-Lot) search support
 * - Synonym and fuzzy text matching
 * - Navigation to property detail pages
 * - Compact mode for use in navigation bars
 * - Support for multiple address fields (address vs address_with_unit)
 *
 * ## Note
 * In these stories, the component is mocked to display mock data instead of making
 * real API calls to Elasticsearch. Navigation is also mocked.
 */
const meta = {
  title: 'Components/Search/PropertyAutocomplete',
  component: PropertyAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A property search autocomplete that fetches results from Elasticsearch and navigates to property detail pages. Supports both address and BBL searches.',
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        push: (url: string) => {
          console.log('Navigate to:', url);
          alert(`Would navigate to: ${url}`);
        },
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ViewportProvider>
        <div className="w-[600px]">
          <Story />
        </div>
      </ViewportProvider>
    ),
  ],
  argTypes: {
    compact: {
      control: 'boolean',
      description: 'Use compact styling (for nav bars)',
    },
    initialValue: {
      control: 'text',
      description: 'Initial search value',
    },
    autoFocus: {
      control: 'boolean',
      description: 'Auto-focus input on mount',
    },
    searchField: {
      control: 'select',
      options: ['address', 'address_with_unit'],
      description: 'Which field to search in Elasticsearch',
    },
  },
} satisfies Meta<typeof PropertyAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default property autocomplete with full styling
 */
export const Default: Story = {
  args: {
    compact: false,
    autoFocus: false,
  },
};

/**
 * Compact mode for use in navigation bars
 */
export const CompactMode: Story = {
  args: {
    compact: true,
    autoFocus: false,
  },
  decorators: [
    (Story) => (
      <ViewportProvider>
        <div className="w-[400px]">
          <Story />
        </div>
      </ViewportProvider>
    ),
  ],
};

/**
 * With initial search value
 */
export const WithInitialValue: Story = {
  args: {
    initialValue: 'Broadway',
    autoFocus: false,
    compact: false,
  },
};

/**
 * With auto-focus enabled
 */
export const WithAutoFocus: Story = {
  args: {
    autoFocus: true,
    compact: false,
  },
};

/**
 * Search by address (default)
 */
export const SearchByAddress: Story = {
  args: {
    searchField: 'address',
    compact: false,
    autoFocus: false,
  },
};

/**
 * Search by address with unit
 */
export const SearchByAddressWithUnit: Story = {
  args: {
    searchField: 'address_with_unit',
    compact: false,
    autoFocus: false,
  },
};

/**
 * In a header/nav bar context
 */
export const InHeader: Story = {
  render: () => (
    <ViewportProvider>
      <div className="w-full bg-background border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">NYC Lens</div>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <PropertyAutocomplete compact={true} autoFocus={false} />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm rounded-md hover:bg-foreground/5">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </ViewportProvider>
  ),
};

/**
 * Full-page search interface
 */
export const FullPageSearch: Story = {
  render: () => (
    <ViewportProvider>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-b from-background to-foreground/5 p-8">
        <div className="w-full max-w-3xl space-y-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">NYC Property Search</h1>
            <p className="text-lg text-foreground/70">
              Search millions of NYC property records
            </p>
          </div>
          <PropertyAutocomplete compact={false} autoFocus={true} />
        </div>
      </div>
    </ViewportProvider>
  ),
};

/**
 * In a sidebar
 */
export const InSidebar: Story = {
  render: () => (
    <ViewportProvider>
      <div className="flex h-[500px] border border-foreground/10 rounded-lg overflow-hidden">
        <div className="w-64 bg-card border-r border-foreground/10 p-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Search</h3>
            <PropertyAutocomplete compact={true} autoFocus={false} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground/70">Filters</div>
            <div className="space-y-1 text-sm">
              <div className="p-2 rounded hover:bg-foreground/5 cursor-pointer">
                All Properties
              </div>
              <div className="p-2 rounded hover:bg-foreground/5 cursor-pointer">
                Recent Sales
              </div>
              <div className="p-2 rounded hover:bg-foreground/5 cursor-pointer">
                Violations
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 bg-background">
          <div className="text-center text-foreground/50 mt-8">
            Search results will appear here
          </div>
        </div>
      </div>
    </ViewportProvider>
  ),
};

/**
 * In a card
 */
export const InCard: Story = {
  render: () => (
    <ViewportProvider>
      <div className="w-[500px] rounded-lg border border-foreground/10 bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Find a Property</h3>
          <p className="text-sm text-foreground/60">
            Search by address or BBL to view property details
          </p>
        </div>
        <PropertyAutocomplete compact={false} autoFocus={false} />
        <div className="mt-4 text-xs text-foreground/50">
          <p>Examples:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>1 Broadway</li>
            <li>1-2469-22 (BBL format)</li>
            <li>1 2469 22 (BBL with spaces)</li>
          </ul>
        </div>
      </div>
    </ViewportProvider>
  ),
};

/**
 * Multiple search bars (e.g., comparison tool)
 */
export const MultipleSearchBars: Story = {
  render: () => (
    <ViewportProvider>
      <div className="w-[800px] space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Compare Properties</h2>
          <p className="text-foreground/70">Select two properties to compare</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-foreground/10 bg-card p-4">
            <div className="mb-3">
              <div className="text-sm font-semibold text-foreground/70">Property 1</div>
            </div>
            <PropertyAutocomplete compact={false} autoFocus={false} />
          </div>
          <div className="rounded-lg border border-foreground/10 bg-card p-4">
            <div className="mb-3">
              <div className="text-sm font-semibold text-foreground/70">Property 2</div>
            </div>
            <PropertyAutocomplete compact={false} autoFocus={false} />
          </div>
        </div>
        <div className="text-center">
          <button className="px-6 py-2 rounded-md bg-foreground text-background font-medium hover:opacity-90">
            Compare Properties
          </button>
        </div>
      </div>
    </ViewportProvider>
  ),
};

/**
 * With custom placeholder (override default)
 */
export const CustomPlaceholder: Story = {
  render: () => (
    <ViewportProvider>
      <div className="w-[600px]">
        <PropertyAutocomplete compact={false} autoFocus={false} />
        <p className="mt-2 text-sm text-foreground/60">
          Note: The placeholder is set to 'Try "1 Broadway" or "1 13 1"' in the component
        </p>
      </div>
    </ViewportProvider>
  ),
};

/**
 * Dark mode
 */
export const DarkMode: Story = {
  args: {
    compact: false,
    autoFocus: false,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <ViewportProvider>
          <div className="w-[600px]">
            <Story />
          </div>
        </ViewportProvider>
      </div>
    ),
  ],
};

/**
 * Responsive layout demo
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <ViewportProvider>
      <div className="space-y-6">
        <div className="w-[800px] bg-background border border-foreground/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-2 text-foreground/70">Desktop (800px)</div>
          <PropertyAutocomplete compact={false} autoFocus={false} />
        </div>
        <div className="w-[600px] bg-background border border-foreground/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-2 text-foreground/70">Tablet (600px)</div>
          <PropertyAutocomplete compact={false} autoFocus={false} />
        </div>
        <div className="w-[400px] bg-background border border-foreground/10 rounded-lg p-4">
          <div className="text-sm font-medium mb-2 text-foreground/70">Mobile (400px) - Compact</div>
          <PropertyAutocomplete compact={true} autoFocus={false} />
        </div>
      </div>
    </ViewportProvider>
  ),
};
