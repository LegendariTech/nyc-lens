import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Visual style variant',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Basic Examples
export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please review the information before continuing.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is some helpful information for you.',
  },
};

// With Titles
export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your action was completed successfully.',
  },
};

export const ErrorWithTitle: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'There was a problem processing your request. Please try again.',
  },
};

export const WarningWithTitle: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'This action cannot be undone. Please confirm before proceeding.',
  },
};

// Dismissible
export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'This alert can be dismissed by clicking the X button.',
    dismissible: true,
  },
};

export const DismissibleWithoutTitle: Story = {
  args: {
    variant: 'default',
    children: 'This is a dismissible alert without a title.',
    dismissible: true,
  },
};

// Without Icon
export const WithoutIcon: Story = {
  args: {
    variant: 'info',
    icon: null,
    children: 'This alert has no icon.',
  },
};

export const WithoutIconWithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    icon: null,
    children: 'This alert has a title but no icon.',
  },
};

// Custom Icons
export const WithCustomIcon: Story = {
  args: {
    variant: 'info',
    icon: (
      <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12c0 3.866-1.85 7.285-4.711 9.483l-7.774-8.487 7.774-7.847z" />
      </svg>
    ),
    title: 'Custom Icon',
    children: 'This alert uses a custom icon.',
  },
};

// Real-world Examples
export const FormSuccess: Story = {
  render: () => (
    <Alert variant="success" title="Form submitted!" dismissible>
      Your property listing has been successfully created and is now live.
    </Alert>
  ),
};

export const FormError: Story = {
  render: () => (
    <Alert variant="error" title="Submission failed">
      <div className="space-y-1">
        <p>Please fix the following errors:</p>
        <ul className="list-disc list-inside">
          <li>Email is required</li>
          <li>Phone number must be 10 digits</li>
        </ul>
      </div>
    </Alert>
  ),
};

export const PropertyViolation: Story = {
  render: () => (
    <Alert variant="warning" title="Open Violations">
      This property has 3 open violations. Click{' '}
      <a href="#" className="underline font-semibold">here</a>
      {' '}to view details.
    </Alert>
  ),
};

export const DataUpdate: Story = {
  render: () => (
    <Alert variant="info" icon={null}>
      Property data was last updated on November 18, 2024.
    </Alert>
  ),
};

export const SystemMaintenance: Story = {
  render: () => (
    <Alert variant="warning" title="Scheduled Maintenance">
      Our systems will be undergoing maintenance on November 20, 2024 from 2:00 AM to 4:00 AM EST. Some features may be unavailable during this time.
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="default">
        Default alert with default styling.
      </Alert>
      <Alert variant="success" title="Success">
        Operation completed successfully.
      </Alert>
      <Alert variant="warning" title="Warning">
        Please be careful with this action.
      </Alert>
      <Alert variant="error" title="Error">
        Something went wrong. Please try again.
      </Alert>
      <Alert variant="info" title="Information">
        Here&apos;s some useful information for you.
      </Alert>
    </div>
  ),
};

export const WithDismiss: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success" title="Success" dismissible>
        Your changes have been saved.
      </Alert>
      <Alert variant="warning" dismissible>
        This is a dismissible warning without a title.
      </Alert>
      <Alert variant="error" title="Error" dismissible>
        An error occurred. Please try again.
      </Alert>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <Alert variant="info" title="Property Details Updated">
      <div className="space-y-2">
        <p>The following fields have been updated:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Tax Assessment: $850,000</li>
          <li>Building Class: R4</li>
          <li>Year Built: 1925</li>
        </ul>
        <p className="mt-2">
          <a href="#" className="underline font-semibold hover:no-underline">
            View full history
          </a>
        </p>
      </div>
    </Alert>
  ),
};

export const MultipleAlerts: Story = {
  render: () => (
    <div className="space-y-3">
      <Alert variant="error" title="Critical Issue" dismissible>
        Property has failed inspection. Immediate action required.
      </Alert>
      <Alert variant="warning" title="Expiring Soon">
        Certificate of occupancy expires in 30 days.
      </Alert>
      <Alert variant="info">
        New property data available. Refresh to see updates.
      </Alert>
    </div>
  ),
};

export const MinimalAlert: Story = {
  render: () => (
    <Alert variant="default" icon={null}>
      Simple text message without icon or title.
    </Alert>
  ),
};

export const FullFeatured: Story = {
  render: () => (
    <Alert
      variant="success"
      title="Payment Successful"
      dismissible
      onDismiss={() => console.log('Alert dismissed')}
    >
      Your payment of $1,250.00 has been processed. A receipt has been sent to your email address.
    </Alert>
  ),
};
