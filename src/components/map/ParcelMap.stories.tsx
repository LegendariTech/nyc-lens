import type { Meta, StoryObj } from '@storybook/react';
import { ParcelMap } from './ParcelMap';

const meta = {
  title: 'Components/Map/ParcelMap',
  component: ParcelMap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive map component displaying NYC parcel boundaries on Mapbox streets view. Features include parcel highlighting, hover effects, click navigation, and fullscreen mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bbl: {
      control: 'text',
      description: 'BBL in URL format (e.g., "4-476-1")',
    },
    latitude: {
      control: 'number',
      description: 'Latitude coordinate for map center',
    },
    longitude: {
      control: 'number',
      description: 'Longitude coordinate for map center',
    },
    accessToken: {
      control: 'text',
      description: 'Mapbox access token',
    },
    showFullscreenButton: {
      control: 'boolean',
      description: 'Whether to show the fullscreen button',
    },
  },
} satisfies Meta<typeof ParcelMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default parcel map showing a property in Queens
 */
export const Default: Story = {
  args: {
    bbl: '4-476-1',
    latitude: 40.7489,
    longitude: -73.9387,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: true,
  },
};

/**
 * Parcel map in Manhattan
 */
export const Manhattan: Story = {
  args: {
    bbl: '1-1-1',
    latitude: 40.7128,
    longitude: -74.006,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: true,
  },
};

/**
 * Parcel map in Brooklyn
 */
export const Brooklyn: Story = {
  args: {
    bbl: '3-100-500',
    latitude: 40.6782,
    longitude: -73.9442,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: true,
  },
};

/**
 * Parcel map without fullscreen button
 */
export const WithoutFullscreenButton: Story = {
  args: {
    bbl: '4-476-1',
    latitude: 40.7489,
    longitude: -73.9387,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: false,
  },
};

/**
 * Parcel map with custom styling
 */
export const WithCustomClassName: Story = {
  args: {
    bbl: '4-476-1',
    latitude: 40.7489,
    longitude: -73.9387,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: true,
    className: 'rounded-xl shadow-2xl',
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-background">
        <div className="aspect-video">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Demonstrates fullscreen functionality
 * Click the expand icon in the top-right to view fullscreen mode with:
 * - Dark overlay (80% opacity with backdrop blur)
 * - Prominent exit button
 * - Full screen coverage
 * - Mobile optimized
 */
export const FullscreenDemo: Story = {
  args: {
    bbl: '1-1-1',
    latitude: 40.7128,
    longitude: -74.006,
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test',
    showFullscreenButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the enhanced fullscreen mode. Click the expand icon to enter fullscreen and see the prominent exit button.',
      },
    },
  },
};
