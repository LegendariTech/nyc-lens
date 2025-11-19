import type { Meta, StoryObj } from '@storybook/nextjs';
import { FieldTooltip } from './FieldTooltip';

const meta = {
  title: 'Components/UI/FieldTooltip',
  component: FieldTooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FieldTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WrapperMode: Story = {
  args: {
    description: 'This is a helpful tooltip description that provides additional context.',
    fieldKey: 'wrapper-example',
    children: 'Hover over me',
  },
};

export const IconMode: Story = {
  args: {
    description: 'This tooltip appears next to an info icon.',
    fieldKey: 'icon-example',
    asIcon: true,
  },
};

export const WithHTMLContent: Story = {
  args: {
    description: 'This tooltip has <b>bold text</b> and <a href="https://example.com">a link</a>.',
    fieldKey: 'html-example',
    children: 'Hover for rich content',
  },
};

export const WithMultilineContent: Story = {
  args: {
    description: 'Line 1: First line of text\nLine 2: Second line of text\nLine 3: Third line of text',
    fieldKey: 'multiline-example',
    children: 'Hover for multiline',
  },
};

export const LongContent: Story = {
  args: {
    description: 'This is a very long tooltip description that demonstrates how the tooltip handles overflow. It should scroll if the content exceeds the maximum height. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    fieldKey: 'long-example',
    children: 'Hover for long content',
  },
};

export const InOverflowContainer: Story = {
  render: () => (
    <div style={{ overflow: 'hidden', border: '2px solid red', padding: '20px', width: '300px' }}>
      <p style={{ marginBottom: '10px' }}>
        Container with overflow:hidden (red border)
      </p>
      <FieldTooltip
        description="This tooltip should not be clipped by the parent container&apos;s overflow:hidden. It uses Radix UI Portal to render outside the DOM hierarchy."
        fieldKey="overflow-test"
      >
        Hover me (tooltip won&apos;t be clipped)
      </FieldTooltip>
      <p style={{ marginTop: '10px' }}>
        <FieldTooltip
          description="Icon tooltips also work correctly in overflow containers."
          fieldKey="overflow-icon-test"
          asIcon
        />
      </p>
    </div>
  ),
};

export const MultipleTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      <div>
        <FieldTooltip
          description="First tooltip description"
          fieldKey="tooltip-1"
        >
          First tooltip
        </FieldTooltip>
      </div>
      <div>
        <FieldTooltip
          description="Second tooltip description"
          fieldKey="tooltip-2"
        >
          Second tooltip
        </FieldTooltip>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>Label with icon</span>
        <FieldTooltip
          description="Icon tooltip description"
          fieldKey="tooltip-3"
          asIcon
        />
      </div>
    </div>
  ),
};

export const EmptyDescription: Story = {
  args: {
    description: '',
    fieldKey: 'empty-example',
    children: 'No tooltip (empty description)',
  },
};

export const CustomClassName: Story = {
  args: {
    description: 'Tooltip with custom styling on the trigger',
    fieldKey: 'custom-class-example',
    children: 'Custom styled trigger',
    className: 'text-blue-500 font-bold',
  },
};

