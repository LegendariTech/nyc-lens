import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta = {
  title: 'Components/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A set of layered sections of content—known as tab panels—that are displayed one at a time. Built with Radix UI.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-foreground/70">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Password Settings</h3>
          <p className="text-sm text-foreground/70">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const MultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Overview</h3>
          <p className="text-sm text-foreground/70">
            View a summary of your account activity and performance metrics.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-foreground/70">
            Detailed analytics and insights about your usage patterns.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Reports</h3>
          <p className="text-sm text-foreground/70">
            Generate and download custom reports for your data.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-lg border border-foreground/10 bg-background p-6">
          <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-foreground/70">
            Manage your notification preferences and settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const PropertyTabs: Story = {
  render: () => (
    <Tabs defaultValue="pluto" className="w-full">
      <TabsList>
        <TabsTrigger value="pluto">PLUTO</TabsTrigger>
        <TabsTrigger value="dob">DOB</TabsTrigger>
        <TabsTrigger value="hpd">HPD</TabsTrigger>
      </TabsList>
      <TabsContent value="pluto">
        <div className="space-y-4">
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              PLUTO Data
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-foreground/70">Land Use</dt>
                <dd className="mt-1 text-base text-foreground">Commercial</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground/70">Building Class</dt>
                <dd className="mt-1 text-base text-foreground">O6</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-foreground/70">Year Built</dt>
                <dd className="mt-1 text-base text-foreground">1887</dd>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="dob">
        <div className="space-y-4">
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              DOB Permits
            </h3>
            <p className="text-sm text-foreground/70">
              Department of Buildings permits will be displayed here.
            </p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="hpd">
        <div className="space-y-4">
          <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              HPD Violations
            </h3>
            <p className="text-sm text-foreground/70">
              Housing Preservation and Development violations will be displayed here.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

