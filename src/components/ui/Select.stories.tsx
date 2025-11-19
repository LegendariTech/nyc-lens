import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/UI/Select',
  component: Select,
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
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Basic Examples
export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">Select an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
};

export const WithValue: Story = {
  args: {
    value: '2',
    children: (
      <>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    value: 'invalid',
    children: (
      <>
        <option value="">Select an option...</option>
        <option value="valid">Valid Option</option>
        <option value="invalid">Invalid Option</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '1',
    children: (
      <>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: (
      <>
        <option value="">Extra small select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <option value="">Small select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: (
      <>
        <option value="">Medium select (default)...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <option value="">Large select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};

// With Option Groups
export const WithOptGroups: Story = {
  args: {
    children: (
      <>
        <option value="">Select a city...</option>
        <optgroup label="United States">
          <option value="nyc">New York</option>
          <option value="la">Los Angeles</option>
          <option value="chicago">Chicago</option>
        </optgroup>
        <optgroup label="Canada">
          <option value="toronto">Toronto</option>
          <option value="vancouver">Vancouver</option>
          <option value="montreal">Montreal</option>
        </optgroup>
      </>
    ),
  },
};

// Real-world Examples
export const YearSelector: Story = {
  render: () => {
    const [year, setYear] = useState('2024');
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
      <div className="space-y-2 max-w-xs">
        <label htmlFor="year" className="text-sm font-medium text-foreground">
          Select Year
        </label>
        <Select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
        <p className="text-xs text-foreground/60">
          Selected: {year}
        </p>
      </div>
    );
  },
};

export const PropertyFilter: Story = {
  render: () => {
    const [borough, setBorough] = useState('');
    const [propertyType, setPropertyType] = useState('');

    return (
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="borough" className="text-sm font-medium text-foreground">
            Borough
          </label>
          <Select
            id="borough"
            value={borough}
            onChange={(e) => setBorough(e.target.value)}
          >
            <option value="">All Boroughs</option>
            <option value="1">Manhattan</option>
            <option value="2">Bronx</option>
            <option value="3">Brooklyn</option>
            <option value="4">Queens</option>
            <option value="5">Staten Island</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="property-type" className="text-sm font-medium text-foreground">
            Property Type
          </label>
          <Select
            id="property-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">All Types</option>
            <optgroup label="Residential">
              <option value="single-family">Single Family</option>
              <option value="multi-family">Multi-Family</option>
              <option value="condo">Condo</option>
            </optgroup>
            <optgroup label="Commercial">
              <option value="retail">Retail</option>
              <option value="office">Office</option>
              <option value="industrial">Industrial</option>
            </optgroup>
          </Select>
        </div>
        {(borough || propertyType) && (
          <div className="p-3 bg-accent/10 rounded-md">
            <p className="text-sm text-foreground">
              Filters applied:
              {borough && <span className="block">Borough: {borough}</span>}
              {propertyType && <span className="block">Type: {propertyType}</span>}
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const FormValidation: Story = {
  render: () => {
    const [country, setCountry] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!country) {
        setShowError(true);
      } else {
        setShowError(false);
        alert(`Selected: ${country}`);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </label>
          <Select
            id="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setShowError(false);
            }}
            variant={showError ? 'error' : 'default'}
            required
            aria-invalid={showError}
            aria-describedby={showError ? 'country-error' : undefined}
          >
            <option value="">Select a country...</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
          </Select>
          {showError && (
            <p id="country-error" className="text-sm text-destructive">
              Please select a country
            </p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Submit
        </button>
      </form>
    );
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <Select size="xs">
        <option>Extra small</option>
      </Select>
      <Select size="sm">
        <option>Small</option>
      </Select>
      <Select size="md">
        <option>Medium (default)</option>
      </Select>
      <Select size="lg">
        <option>Large</option>
      </Select>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Default</h3>
        <Select>
          <option value="">Select an option...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Error</h3>
        <Select variant="error" value="invalid">
          <option value="">Select an option...</option>
          <option value="invalid">Invalid Option</option>
        </Select>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Disabled</h3>
        <Select disabled value="1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </div>
    </div>
  ),
};
