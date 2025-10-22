import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

/**
 * A toggle switch component built with Radix UI.
 * 
 * ## Features
 * - Three size variants: small, medium, large
 * - Fully accessible with keyboard navigation
 * - Smooth animations
 * - Theme-aware using HSL color tokens
 */
const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the switch',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled)',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state (requires onCheckedChange)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default interactive switch - click to toggle
 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * All size variants in one view
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-muted-foreground">Small</span>
        <Switch size="sm" defaultChecked={false} />
        <Switch size="sm" defaultChecked={true} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-muted-foreground">Medium</span>
        <Switch size="md" defaultChecked={false} />
        <Switch size="md" defaultChecked={true} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-muted-foreground">Large</span>
        <Switch size="lg" defaultChecked={false} />
        <Switch size="lg" defaultChecked={true} />
      </div>
    </div>
  ),
};

/**
 * Disabled states - both checked and unchecked
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm text-muted-foreground">Disabled</span>
        <Switch disabled checked={false} />
        <Switch disabled checked={true} />
      </div>
    </div>
  ),
};

/**
 * With labels - common usage pattern
 */
export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-sm text-foreground/70">Enable notifications</span>
        <Switch defaultChecked />
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-sm text-foreground/70">Dark mode</span>
        <Switch defaultChecked={false} />
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-sm text-foreground/70">Auto-save</span>
        <Switch defaultChecked size="sm" />
      </label>
    </div>
  ),
};

/**
 * Form settings example
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <div className="text-sm font-medium">Push notifications</div>
          <p className="text-xs text-muted-foreground">
            Receive notifications about updates
          </p>
        </div>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <div className="text-sm font-medium">Marketing emails</div>
          <p className="text-xs text-muted-foreground">
            Receive emails about new features
          </p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <div className="text-sm font-medium">Security alerts</div>
          <p className="text-xs text-muted-foreground">
            Get notified about security issues
          </p>
        </div>
        <Switch defaultChecked />
      </div>
    </div>
  ),
};
