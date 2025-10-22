import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * A versatile button component with multiple variants and sizes.
 * 
 * ## Features
 * - Six style variants: default, primary, secondary, ghost, danger, outline
 * - Four size options: xs, sm, md, lg
 * - Loading state with spinner
 * - Fully accessible with keyboard navigation
 * - Theme-aware using HSL color tokens
 */
const meta = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'ghost', 'danger', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size preset',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button for quick testing
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * All variants - compare different button styles
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};

/**
 * All sizes - from extra small to large
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * Loading and disabled states
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-sm text-muted-foreground">Loading</span>
        <Button isLoading>Loading...</Button>
        <Button variant="primary" isLoading>Saving...</Button>
        <Button variant="danger" isLoading>Deleting...</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-sm text-muted-foreground">Disabled</span>
        <Button disabled>Disabled</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="danger" disabled>Disabled</Button>
      </div>
    </div>
  ),
};

/**
 * Buttons with icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </Button>
      <Button variant="danger">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </Button>
      <Button variant="ghost" size="sm">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  ),
};

/**
 * Common usage patterns
 */
export const Patterns: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Button Group */}
      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Button Group</div>
        <div className="inline-flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Toolbar</div>
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Button variant="ghost" size="sm">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Form dialog example
 */
export const FormDialog: Story = {
  render: () => (
    <div className="w-96 space-y-4 rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Confirm Action</h3>
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </div>
    </div>
  ),
};

