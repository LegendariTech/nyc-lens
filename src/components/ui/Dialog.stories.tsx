import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';
import { Button } from './Button';
import { Input } from './Input';

const meta = {
  title: 'Components/UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple dialog with title and content
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a simple dialog with a title and description.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">
            Dialog content goes here. You can put any content you want inside the dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with header, content, and footer actions
 */
export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Confirmation dialog pattern
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your item
            and remove the data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with form content
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input id="name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input id="username" defaultValue="@peduarte" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Small dialog size
 */
export const SmallSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Small Dialog</DialogTitle>
          <DialogDescription>This dialog uses the small size variant.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">Compact dialog content.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Medium dialog size (default)
 */
export const MediumSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Medium Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Medium Dialog</DialogTitle>
          <DialogDescription>This dialog uses the medium size variant (default).</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">Standard dialog content.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Large dialog size
 */
export const LargeSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Large Dialog</DialogTitle>
          <DialogDescription>This dialog uses the large size variant.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">
            More spacious dialog content. Perfect for forms with multiple fields or
            content that needs more room.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Extra large dialog size
 */
export const ExtraLargeSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Extra Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Extra Large Dialog</DialogTitle>
          <DialogDescription>
            This dialog uses the extra-large size variant.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">
            Very spacious dialog content. Good for complex forms or detailed information.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Full width dialog
 */
export const FullWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Full Width Dialog</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Full Width Dialog</DialogTitle>
          <DialogDescription>
            This dialog uses the full width with small margins.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground">
            Maximum width dialog content for displaying large tables or detailed layouts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog without close button
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn&apos;t show the X close button. You can still close it with
            Escape or by clicking outside.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Controlled dialog with external state
 */
export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Controlled Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog is controlled by external state.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-foreground">
                The open state is managed by a React state variable.
              </p>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="text-sm text-foreground/70">
          Dialog is currently: {open ? 'Open' : 'Closed'}
        </div>
      </div>
    );
  },
};

/**
 * Alert dialog pattern
 */
export const Alert: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Warning</DialogTitle>
          <DialogDescription>
            This operation requires your attention. Please review the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
            <li>This action may affect multiple records</li>
            <li>Changes will be applied immediately</li>
            <li>This operation is logged for audit purposes</li>
          </ul>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary">I understand, continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Information dialog with detailed content
 */
export const Information: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Property Information</DialogTitle>
          <DialogDescription>Detailed information about this property</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Building Details</h4>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-foreground/70">Address:</dt>
              <dd className="text-foreground">123 Main Street, New York, NY</dd>
              <dt className="text-foreground/70">Building Class:</dt>
              <dd className="text-foreground">R4 (Condo)</dd>
              <dt className="text-foreground/70">Year Built:</dt>
              <dd className="text-foreground">2018</dd>
              <dt className="text-foreground/70">Total Units:</dt>
              <dd className="text-foreground">42</dd>
            </dl>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Valuation</h4>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-foreground/70">Market Value:</dt>
              <dd className="text-foreground">$15,000,000</dd>
              <dt className="text-foreground/70">Assessed Value:</dt>
              <dd className="text-foreground">$12,500,000</dd>
            </dl>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Multiple action buttons in footer
 */
export const MultipleActions: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
          <DialogDescription>Choose how you want to export your data.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground mb-4">
            Select the format you&apos;d like to export:
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="format" value="csv" defaultChecked />
              CSV (Comma Separated Values)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="format" value="json" />
              JSON (JavaScript Object Notation)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="format" value="excel" />
              Excel Spreadsheet
            </label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="outline">Preview</Button>
          <Button variant="primary">Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scrollable content dialog
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Terms and Conditions</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto py-4">
          <div className="space-y-4 text-sm text-foreground">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <p>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
              dolore magnam aliquam quaerat voluptatem.
            </p>
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
              laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
              reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Decline</Button>
          </DialogClose>
          <Button variant="primary">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Nested dialog trigger (not recommended but possible)
 */
export const NestedTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Parent Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parent Dialog</DialogTitle>
          <DialogDescription>This is the parent dialog.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground mb-4">
            You can open another dialog from here (not recommended for UX reasons).
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Child Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Child Dialog</DialogTitle>
                <DialogDescription>This is a nested dialog.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close Parent</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

