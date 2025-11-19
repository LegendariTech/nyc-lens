import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { useState } from 'react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/UI/ButtonGroup',
  component: ButtonGroup,
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
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

const defaultItems = [
  {
    label: 'Edit',
    onClick: () => console.log('Edit clicked'),
  },
  {
    label: 'Duplicate',
    onClick: () => console.log('Duplicate clicked'),
  },
  {
    label: 'Archive',
    onClick: () => console.log('Archive clicked'),
  },
];

// Basic Examples
export const Default: Story = {
  args: {
    label: 'Actions',
    items: defaultItems,
  },
};

export const Primary: Story = {
  args: {
    label: 'Actions',
    variant: 'primary',
    items: defaultItems,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Actions',
    variant: 'secondary',
    items: defaultItems,
  },
};

export const Ghost: Story = {
  args: {
    label: 'Actions',
    variant: 'ghost',
    items: defaultItems,
  },
};

export const Danger: Story = {
  args: {
    label: 'Delete',
    variant: 'danger',
    items: [
      {
        label: 'Delete Permanently',
        onClick: () => console.log('Delete permanently'),
      },
      {
        label: 'Move to Trash',
        onClick: () => console.log('Move to trash'),
      },
    ],
  },
};

export const Outline: Story = {
  args: {
    label: 'Actions',
    variant: 'outline',
    items: defaultItems,
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    label: 'Actions',
    size: 'xs',
    items: defaultItems,
  },
};

export const Small: Story = {
  args: {
    label: 'Actions',
    size: 'sm',
    items: defaultItems,
  },
};

export const Medium: Story = {
  args: {
    label: 'Actions',
    size: 'md',
    items: defaultItems,
  },
};

export const Large: Story = {
  args: {
    label: 'Actions',
    size: 'lg',
    items: defaultItems,
  },
};

// States
export const Loading: Story = {
  args: {
    label: 'Actions',
    isLoading: true,
    items: defaultItems,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Actions',
    disabled: true,
    items: defaultItems,
  },
};

// With Icons
export const WithMainIcon: Story = {
  args: {
    label: 'Actions',
    icon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    items: defaultItems,
  },
};

export const WithItemIcons: Story = {
  args: {
    label: 'Actions',
    items: [
      {
        label: 'Edit',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        onClick: () => console.log('Edit'),
      },
      {
        label: 'Duplicate',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
        onClick: () => console.log('Duplicate'),
      },
      {
        label: 'Delete',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
        onClick: () => console.log('Delete'),
      },
    ],
  },
};

// With Subtitles
export const WithSubtitles: Story = {
  args: {
    label: 'Export',
    items: [
      {
        label: 'Export as PDF',
        subtitle: 'Download in PDF format',
        onClick: () => console.log('Export PDF'),
      },
      {
        label: 'Export as CSV',
        subtitle: 'Download in CSV format',
        onClick: () => console.log('Export CSV'),
      },
      {
        label: 'Export as Excel',
        subtitle: 'Download in Excel format',
        onClick: () => console.log('Export Excel'),
      },
    ],
  },
};

// With End Icons
export const WithEndIcons: Story = {
  args: {
    label: 'Actions',
    items: [
      {
        label: 'Basic Action',
        onClick: () => console.log('Basic'),
      },
      {
        label: 'Premium Action',
        endIcon: (
          <span className="text-xs bg-accent/20 text-accent px-1 rounded">PRO</span>
        ),
        onClick: () => console.log('Premium'),
      },
      {
        label: 'New Feature',
        endIcon: (
          <span className="text-xs bg-accent/20 text-accent px-1 rounded">NEW</span>
        ),
        onClick: () => console.log('New'),
      },
    ],
  },
};

// Real-world Examples
export const PropertyActions: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string>('');
    return (
      <div className="space-y-4">
        <ButtonGroup
          label="Property Actions"
          variant="primary"
          items={[
            {
              label: 'View Details',
              icon: (
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              onClick: () => setLastAction('Viewed details'),
            },
            {
              label: 'Edit Property',
              icon: (
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
              onClick: () => setLastAction('Edited property'),
            },
            {
              label: 'Share',
              icon: (
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              ),
              onClick: () => setLastAction('Shared property'),
            },
          ]}
        />
        {lastAction && (
          <p className="text-sm text-foreground/70">
            Last action: {lastAction}
          </p>
        )}
      </div>
    );
  },
};

export const DataExport: Story = {
  args: {
    label: 'Export Data',
    variant: 'secondary',
    icon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    items: [
      {
        label: 'PDF Document',
        subtitle: 'Best for sharing',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        onClick: () => console.log('Export PDF'),
      },
      {
        label: 'Excel Spreadsheet',
        subtitle: 'Best for analysis',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        onClick: () => console.log('Export Excel'),
      },
      {
        label: 'CSV File',
        subtitle: 'Best for importing',
        icon: (
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        ),
        onClick: () => console.log('Export CSV'),
      },
    ],
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup label="Extra Small" size="xs" items={defaultItems} />
      <ButtonGroup label="Small" size="sm" items={defaultItems} />
      <ButtonGroup label="Medium" size="md" items={defaultItems} />
      <ButtonGroup label="Large" size="lg" items={defaultItems} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup label="Default" variant="default" items={defaultItems} />
      <ButtonGroup label="Primary" variant="primary" items={defaultItems} />
      <ButtonGroup label="Secondary" variant="secondary" items={defaultItems} />
      <ButtonGroup label="Ghost" variant="ghost" items={defaultItems} />
      <ButtonGroup label="Danger" variant="danger" items={defaultItems} />
      <ButtonGroup label="Outline" variant="outline" items={defaultItems} />
    </div>
  ),
};
