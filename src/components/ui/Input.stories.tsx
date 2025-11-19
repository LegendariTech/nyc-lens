import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size preset',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Basic Examples
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter text...',
  },
};

export const Error: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <label htmlFor="error-input" className="text-sm font-medium text-foreground">
        Email Address
      </label>
      <Input
        id="error-input"
        type="email"
        variant="error"
        value="invalid@email"
        onChange={() => {}}
        aria-invalid
        aria-describedby="error-message"
      />
      <p id="error-message" className="text-sm text-destructive">
        Please enter a valid email address
      </p>
    </div>
  ),
};

/**
 * Error state compared to default state
 */
export const ErrorComparison: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Default State</label>
        <Input
          type="email"
          value="user@example.com"
          onChange={() => {}}
        />
        <p className="text-xs text-foreground/60">Valid input with default border</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Error State</label>
        <Input
          type="email"
          variant="error"
          value="invalid@email"
          onChange={() => {}}
          aria-invalid
        />
        <p className="text-xs text-destructive">Invalid input with red error border</p>
      </div>
    </div>
  ),
};

/**
 * Error state with icon
 */
export const ErrorWithIcon: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <label htmlFor="error-icon-input" className="text-sm font-medium text-foreground">
        Password
      </label>
      <Input
        id="error-icon-input"
        type="password"
        variant="error"
        value="123"
        onChange={() => {}}
        aria-invalid
        aria-describedby="password-error"
        endIcon={
          <svg className="size-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <p id="password-error" className="text-sm text-destructive">
        Password must be at least 8 characters
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input',
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    placeholder: 'Extra small input',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input (default)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// With Icons
export const WithStartIcon: Story = {
  args: {
    placeholder: 'Search...',
    startIcon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
};

export const WithEndIcon: Story = {
  args: {
    placeholder: 'Enter email...',
    type: 'email',
    endIcon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search properties...',
    startIcon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    endIcon: (
      <button className="text-foreground/50 hover:text-foreground">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ),
  },
};

// Input Types
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number...',
  },
};

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    startIcon: (
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
};

// Real-world Examples
export const PropertySearch: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="space-y-2">
        <label htmlFor="property-search" className="text-sm font-medium text-foreground">
          Search Properties
        </label>
        <Input
          id="property-search"
          placeholder="Enter BBL or address..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          startIcon={
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          endIcon={
            value && (
              <button
                onClick={() => setValue('')}
                className="text-foreground/50 hover:text-foreground"
                aria-label="Clear search"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )
          }
        />
      </div>
    );
  },
};

export const LoginForm: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);

    return (
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(!e.target.value.includes('@'));
            }}
            variant={emailError && email ? 'error' : 'default'}
            aria-invalid={emailError && email}
            aria-describedby={emailError && email ? 'email-error' : undefined}
          />
          {emailError && email && (
            <p id="email-error" className="text-sm text-destructive">
              Please enter a valid email address
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
    );
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="xs" placeholder="Extra small" />
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Default</h3>
        <Input placeholder="Default input" />
        <p className="text-xs text-foreground/60">Regular border with hover and focus states</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Error</h3>
        <Input variant="error" placeholder="Error input" value="Invalid value" onChange={() => {}} aria-invalid />
        <p className="text-xs text-destructive">Red border indicates validation error</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Disabled</h3>
        <Input disabled placeholder="Disabled input" value="Cannot edit" onChange={() => {}} />
        <p className="text-xs text-foreground/60">Reduced opacity and no interaction</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">With Icons</h3>
        <Input
          placeholder="Search..."
          startIcon={
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <p className="text-xs text-foreground/60">Icons can be added at start or end</p>
      </div>
    </div>
  ),
};
