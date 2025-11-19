import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size preset',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic Examples
export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

// With Icons
export const WithIcon: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'error',
    children: (
      <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

export const WithNumber: Story = {
  args: {
    variant: 'info',
    size: 'sm',
    children: '42',
  },
};

// Real-world Examples
export const StatusIndicators: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Inactive</Badge>
      <Badge variant="info">Draft</Badge>
      <Badge variant="default">Unknown</Badge>
    </div>
  ),
};

export const PropertyStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        No Violations
      </Badge>
      <Badge variant="warning">
        <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        3 Open Violations
      </Badge>
      <Badge variant="error">
        <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        5 Critical Issues
      </Badge>
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm" variant="info">Small</Badge>
      <Badge size="md" variant="info">Medium</Badge>
      <Badge size="lg" variant="info">Large</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Default</h3>
        <div className="flex gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Success</h3>
        <div className="flex gap-2">
          <Badge variant="success" size="sm">Small</Badge>
          <Badge variant="success" size="md">Medium</Badge>
          <Badge variant="success" size="lg">Large</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Warning</h3>
        <div className="flex gap-2">
          <Badge variant="warning" size="sm">Small</Badge>
          <Badge variant="warning" size="md">Medium</Badge>
          <Badge variant="warning" size="lg">Large</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Error</h3>
        <div className="flex gap-2">
          <Badge variant="error" size="sm">Small</Badge>
          <Badge variant="error" size="md">Medium</Badge>
          <Badge variant="error" size="lg">Large</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Info</h3>
        <div className="flex gap-2">
          <Badge variant="info" size="sm">Small</Badge>
          <Badge variant="info" size="md">Medium</Badge>
          <Badge variant="info" size="lg">Large</Badge>
        </div>
      </div>
    </div>
  ),
};

export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Property Status:</span>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Violations:</span>
        <Badge variant="warning">2 Open</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Inspection:</span>
        <Badge variant="error">Failed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Documents:</span>
        <Badge variant="info">12 Available</Badge>
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-md">
        <span className="text-sm text-foreground">123 Main Street</span>
        <Badge variant="success" size="sm">No Violations</Badge>
      </div>
      <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-md">
        <span className="text-sm text-foreground">456 Park Avenue</span>
        <Badge variant="warning" size="sm">1 Violation</Badge>
      </div>
      <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-md">
        <span className="text-sm text-foreground">789 Broadway</span>
        <Badge variant="error" size="sm">5 Violations</Badge>
      </div>
    </div>
  ),
};

export const NotificationCount: Story = {
  render: () => (
    <div className="flex gap-4">
      <button className="relative p-2 hover:bg-foreground/5 rounded-md">
        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <Badge
          variant="error"
          size="sm"
          className="absolute -top-1 -right-1"
        >
          3
        </Badge>
      </button>
      <button className="relative p-2 hover:bg-foreground/5 rounded-md">
        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <Badge
          variant="info"
          size="sm"
          className="absolute -top-1 -right-1"
        >
          12
        </Badge>
      </button>
    </div>
  ),
};
