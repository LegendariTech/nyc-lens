import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Autocomplete, type BaseAutocompleteItem } from './Autocomplete';

/**
 * A flexible, reusable autocomplete component built on @algolia/autocomplete-core.
 * Can be used with any data source and custom rendering logic.
 * 
 * ## Features
 * - Type-safe generics - works with any data type
 * - Customizable rendering - full control over items, empty states, headers, footers
 * - Multiple data sources - support for multiple sources in one autocomplete
 * - Keyboard navigation - full keyboard support (arrow keys, enter, escape)
 * - Accessible - built with ARIA attributes and semantic HTML
 * - Flexible styling - custom className props for all elements
 * 
 * ## Usage
 * 
 * ```tsx
 * interface User extends BaseAutocompleteItem {
 *   name: string;
 *   email: string;
 * }
 * 
 * <Autocomplete<User>
 *   placeholder="Search users..."
 *   getSources={({ query }) => [{
 *     sourceId: 'users',
 *     getItems: () => fetchUsers(query),
 *     getItemInputValue: ({ item }) => item.name,
 *     onSelect: ({ item }) => console.log('Selected:', item)
 *   }]}
 *   renderItem={({ item, itemProps }) => (
 *     <li {...itemProps} className="px-4 py-3 hover:bg-foreground/5">
 *       <div>{item.name}</div>
 *       <div className="text-sm text-foreground/60">{item.email}</div>
 *     </li>
 *   )}
 * />
 * ```
 */
const meta = {
  title: 'Components/UI/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Generic autocomplete component that can be used with any data source. Supports custom rendering, multiple sources, keyboard navigation, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Autocomplete>;

export default meta;
// Use a permissive type for stories that use custom render functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<any>;

// ============================================================================
// Sample Data Types
// ============================================================================

interface User extends BaseAutocompleteItem {
  name: string;
  email: string;
  avatar?: string;
}

interface Product extends BaseAutocompleteItem {
  name: string;
  category: string;
  price: number;
}

interface City extends BaseAutocompleteItem {
  name: string;
  country: string;
  population: number;
}

interface Command extends BaseAutocompleteItem {
  title: string;
  description: string;
  icon: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com' },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Laptop', category: 'Electronics', price: 999 },
  { id: '2', name: 'Mouse', category: 'Electronics', price: 29 },
  { id: '3', name: 'Keyboard', category: 'Electronics', price: 79 },
  { id: '4', name: 'Monitor', category: 'Electronics', price: 299 },
  { id: '5', name: 'Desk Chair', category: 'Furniture', price: 199 },
];

const mockCities: City[] = [
  { id: '1', name: 'New York', country: 'USA', population: 8336817 },
  { id: '2', name: 'London', country: 'UK', population: 8982000 },
  { id: '3', name: 'Tokyo', country: 'Japan', population: 13960000 },
  { id: '4', name: 'Paris', country: 'France', population: 2161000 },
  { id: '5', name: 'Sydney', country: 'Australia', population: 5312000 },
];

const mockCommands: Command[] = [
  { id: '1', title: 'New Project', description: 'Create a new project', icon: '📁' },
  { id: '2', title: 'Open File', description: 'Open an existing file', icon: '📄' },
  { id: '3', title: 'Settings', description: 'Open settings', icon: '⚙️' },
  { id: '4', title: 'Search', description: 'Search in project', icon: '🔍' },
  { id: '5', title: 'Help', description: 'Open help documentation', icon: '❓' },
];

// ============================================================================
// Mock Fetch Functions
// ============================================================================

function searchItems<T extends { name?: string; title?: string }>(
  items: T[],
  query: string
): T[] {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (item.title && item.title.toLowerCase().includes(lowerQuery))
  );
}

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic user search autocomplete with name and email display
 */
export const UserSearch: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<User>
        placeholder="Search users..."
        getSources={({ query }) => [
          {
            sourceId: 'users',
            getItems: () => searchItems(mockUsers, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-foreground/10 text-lg">
              {item.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-foreground/60">{item.email}</div>
            </div>
          </li>
        )}
      />
    </div>
  ),
};

/**
 * Product search with category and price display
 */
export const ProductSearch: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<Product>
        placeholder="Search products..."
        maxResults={5}
        getSources={({ query }) => [
          {
            sourceId: 'products',
            getItems: () => searchItems(mockProducts, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Added ${item.name} to cart`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-foreground/60">{item.category}</div>
            </div>
            <div className="font-semibold">${item.price}</div>
          </li>
        )}
      />
    </div>
  ),
};

/**
 * City search with country and population
 */
export const CitySearch: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<City>
        placeholder="Search cities..."
        getSources={({ query }) => [
          {
            sourceId: 'cities',
            getItems: () => searchItems(mockCities, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}, ${item.country}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-foreground/60 ml-2">{item.country}</span>
              </div>
              <div className="text-xs text-foreground/40">
                {(item.population / 1000000).toFixed(1)}M
              </div>
            </div>
          </li>
        )}
      />
    </div>
  ),
};

/**
 * Command palette style with icons and descriptions
 */
export const CommandPalette: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<Command>
        placeholder="Type a command..."
        openOnFocus={true}
        getSources={({ query }) => [
          {
            sourceId: 'commands',
            getItems: () => searchItems(mockCommands, query),
            getItemInputValue: ({ item }) => item.title,
            onSelect: ({ item }) => {
              alert(`Executing: ${item.title}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-foreground/60">{item.description}</div>
            </div>
          </li>
        )}
        renderHeader={() => (
          <div className="border-b border-foreground/10 px-4 py-2">
            <p className="text-sm text-foreground/60">Quick Actions</p>
          </div>
        )}
      />
    </div>
  ),
};

/**
 * Compact mode - smaller width and padding
 */
export const CompactMode: Story = {
  render: () => (
    <Autocomplete<User>
      compact={true}
      placeholder="Search..."
      getSources={({ query }) => [
        {
          sourceId: 'users',
          getItems: () => searchItems(mockUsers, query),
          getItemInputValue: ({ item }) => item.name,
          onSelect: ({ item }) => {
            alert(`Selected: ${item.name}`);
          },
        },
      ]}
      renderItem={({ item, itemProps }) => (
        <li
          {...itemProps}
          className="px-3 py-2 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
        >
          <div className="text-sm font-medium">{item.name}</div>
        </li>
      )}
    />
  ),
};

/**
 * With custom empty state
 */
export const CustomEmptyState: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<User>
        placeholder="Search users..."
        initialValue="xyz123" // Non-existent user
        getSources={({ query }) => [
          {
            sourceId: 'users',
            getItems: () => searchItems(mockUsers, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li {...itemProps} className="px-4 py-3 hover:bg-foreground/5">
            {item.name}
          </li>
        )}
        renderEmpty={(query) => (
          <div className="p-8 text-center">
            <p className="text-foreground/60 mb-4">No users found for &quot;{query}&quot;</p>
            <button className="px-4 py-2 rounded-md bg-foreground text-background text-sm">
              Invite User
            </button>
          </div>
        )}
      />
    </div>
  ),
};

/**
 * With header and footer
 */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<Product>
        placeholder="Search products..."
        getSources={({ query }) => [
          {
            sourceId: 'products',
            getItems: () => searchItems(mockProducts, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="flex justify-between px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <span>{item.name}</span>
            <span className="font-semibold">${item.price}</span>
          </li>
        )}
        renderHeader={() => (
          <div className="border-b border-foreground/10 px-4 py-3">
            <p className="text-sm font-medium">Products</p>
            <p className="text-xs text-foreground/60">Select a product to add to cart</p>
          </div>
        )}
        renderFooter={({ itemCount, isOpen }) =>
          isOpen && itemCount > 0 ? (
            <div className="border-t border-foreground/10 px-4 py-2 text-xs text-foreground/60">
              {itemCount} product{itemCount !== 1 ? 's' : ''} • Press Enter to select
            </div>
          ) : null
        }
      />
    </div>
  ),
};

/**
 * Limited results (max 3 items)
 */
export const LimitedResults: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<User>
        placeholder="Search users..."
        maxResults={3}
        getSources={({ query }) => [
          {
            sourceId: 'users',
            getItems: () => searchItems(mockUsers, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
          >
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-foreground/60">{item.email}</div>
          </li>
        )}
        renderFooter={({ itemCount, isOpen }) =>
          isOpen && itemCount > 0 ? (
            <div className="border-t border-foreground/10 px-4 py-2 text-xs text-foreground/60">
              Showing top {itemCount} results
            </div>
          ) : null
        }
      />
    </div>
  ),
};

/**
 * Multi-source autocomplete (users and products)
 */
export const MultiSource: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<User | Product>
        placeholder="Search users or products..."
        getSources={({ query }) => [
          {
            sourceId: 'users',
            getItems: () => searchItems(mockUsers, query).slice(0, 3),
            getItemInputValue: ({ item }) => (item as User).name,
            onSelect: ({ item }) => {
              alert(`Selected user: ${(item as User).name}`);
            },
          },
          {
            sourceId: 'products',
            getItems: () => searchItems(mockProducts, query).slice(0, 3),
            getItemInputValue: ({ item }) => (item as Product).name,
            onSelect: ({ item }) => {
              alert(`Selected product: ${(item as Product).name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => {
          // Check if it's a User or Product
          if ('email' in item) {
            // User
            const user = item as User;
            return (
              <li
                {...itemProps}
                className="px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">👤</span>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-foreground/60">{user.email}</div>
                  </div>
                </div>
              </li>
            );
          } else {
            // Product
            const product = item as Product;
            return (
              <li
                {...itemProps}
                className="px-4 py-3 cursor-pointer hover:bg-foreground/5 border-b border-foreground/5 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">🛍️</span>
                    <div className="font-medium">{product.name}</div>
                  </div>
                  <div className="text-sm font-semibold">${product.price}</div>
                </div>
              </li>
            );
          }
        }}
      />
    </div>
  ),
};

/**
 * Custom styling example
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="w-[500px]">
      <Autocomplete<User>
        placeholder="Search users..."
        inputClassName="rounded-lg border-2 border-blue-500 focus:ring-blue-500"
        panelClassName="border-2 border-blue-500 rounded-xl"
        getSources={({ query }) => [
          {
            sourceId: 'users',
            getItems: () => searchItems(mockUsers, query),
            getItemInputValue: ({ item }) => item.name,
            onSelect: ({ item }) => {
              alert(`Selected: ${item.name}`);
            },
          },
        ]}
        renderItem={({ item, itemProps }) => (
          <li
            {...itemProps}
            className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 border-b border-blue-100 dark:border-blue-900 last:border-b-0"
          >
            <div className="font-medium text-blue-700 dark:text-blue-300">{item.name}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">{item.email}</div>
          </li>
        )}
      />
    </div>
  ),
};

