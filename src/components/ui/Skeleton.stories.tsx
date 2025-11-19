import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'text', 'circular', 'rectangular'],
      description: 'Visual variant',
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
      description: 'Animation style',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Basic Examples
export const Default: Story = {
  args: {
    className: 'h-12 w-full',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    className: 'h-12 w-12',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    className: 'h-32 w-full',
  },
};

// Animations
export const PulseAnimation: Story = {
  args: {
    animation: 'pulse',
    className: 'h-12 w-full',
  },
};

export const WaveAnimation: Story = {
  args: {
    animation: 'wave',
    className: 'h-12 w-full',
  },
};

export const NoAnimation: Story = {
  args: {
    animation: 'none',
    className: 'h-12 w-full',
  },
};

// Common Patterns
export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-4 border border-foreground/10 rounded-lg">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
    </div>
  ),
};

export const ListItems: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-md">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="w-full space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      ))}
    </div>
  ),
};

export const FormSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-28" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  ),
};

export const PropertyCardSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4 p-6 border border-foreground/10 rounded-lg">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-48 h-6" />
        <Skeleton variant="text" className="w-32" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
    </div>
  ),
};

export const TextParagraph: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
  ),
};

export const ImageWithCaption: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Default (Rounded)</h3>
        <Skeleton variant="default" className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Text</h3>
        <Skeleton variant="text" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Circular</h3>
        <Skeleton variant="circular" className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Rectangular</h3>
        <Skeleton variant="rectangular" className="h-12 w-full" />
      </div>
    </div>
  ),
};

export const AnimationComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Pulse (Default)</h3>
        <Skeleton animation="pulse" className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Wave</h3>
        <Skeleton animation="wave" className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">None</h3>
        <Skeleton animation="none" className="h-12 w-full" />
      </div>
    </div>
  ),
};

export const DashboardSkeleton: Story = {
  render: () => (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton variant="text" className="w-64" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-foreground/10 rounded-lg space-y-3">
            <Skeleton variant="text" className="w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton variant="text" className="w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <Skeleton className="h-64 w-full" />

      {/* Table */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  ),
};
