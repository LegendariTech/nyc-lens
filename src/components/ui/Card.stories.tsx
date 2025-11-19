import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from './Card';
import { Button } from './Button';

const meta = {
  title: 'Components/UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default card with subtle shadow
 */
export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p className="text-foreground">
          This is a simple card with default styling. It includes a subtle shadow
          and rounded corners.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with elevated shadow for more prominence
 */
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-96">
      <CardContent>
        <p className="text-foreground">
          This card uses the elevated variant with a more prominent shadow.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with no shadow, just outline
 */
export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-96">
      <CardContent>
        <p className="text-foreground">
          This card uses the outlined variant with no shadow, just a border.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with header, content, and footer sections
 */
export const WithAllSections: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description or subtitle goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">
          This is the main content area of the card. It can contain any content
          like text, images, forms, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button size="sm">Action</Button>
          <Button size="sm" variant="secondary">
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with just header and content (common pattern)
 */
export const WithHeaderAndContent: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>Building information and specifications</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-foreground/70">Building Class:</dt>
            <dd className="text-sm font-medium text-foreground">R4 (Condo)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-foreground/70">Total Units:</dt>
            <dd className="text-sm font-medium text-foreground">42</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-foreground/70">Year Built:</dt>
            <dd className="text-sm font-medium text-foreground">2018</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  ),
};

/**
 * Simple card with just content
 */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">1,234</p>
              <p className="text-xs text-foreground/70">Properties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">$2.4M</p>
              <p className="text-xs text-foreground/70">Avg Value</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Multiple cards in a grid layout
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ACRIS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            Property sales and mortgage records
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PLUTO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            Property characteristics and zoning
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">DOB</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            Building permits and violations
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Card with custom padding and spacing
 */
export const CustomPadding: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base">Compact Header</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <p className="text-sm text-foreground">
          This card uses custom padding for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter className="px-4 py-3">
        <Button size="xs">Compact Action</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with no padding (for tables or lists)
 */
export const NoPadding: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-foreground/10">
          <li className="px-6 py-3 hover:bg-foreground/5">
            <span className="text-sm text-foreground">Transaction #1</span>
          </li>
          <li className="px-6 py-3 hover:bg-foreground/5">
            <span className="text-sm text-foreground">Transaction #2</span>
          </li>
          <li className="px-6 py-3 hover:bg-foreground/5">
            <span className="text-sm text-foreground">Transaction #3</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with full-width header and content
 */
export const FullWidth: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Full Width Card</CardTitle>
        <CardDescription>
          This card stretches to fill its container width
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">
          The card will take up the full width of its parent container. Use
          className=&quot;max-w-*&quot; to constrain the width if needed.
        </p>
      </CardContent>
    </Card>
  ),
};
