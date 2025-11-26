import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Badge } from '../Badge';
import { Skeleton } from '../Skeleton';
import { Alert } from '../Alert';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../Card';
import { ButtonGroup } from '../ButtonGroup';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../Collapsible';
import { DataFieldCard } from '../DataFieldCard';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../Dialog';

describe('Accessibility Tests', () => {
  describe('Button', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with loading state', async () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations for all variants', async () => {
      const variants = ['default', 'primary', 'secondary', 'ghost', 'danger', 'outline'] as const;
      for (const variant of variants) {
        const { container } = render(<Button variant={variant}>Button</Button>);
        const results = await axe(container);
        expect(results.violations).toEqual([]);
      }
    });
  });

  describe('Input', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Input placeholder="Enter text" />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Name</label>
          <Input id="test-input" placeholder="Enter name" />
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with aria-label', async () => {
      const { container } = render(<Input aria-label="Search" placeholder="Search..." />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations in error state with aria-invalid', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email-input">Email</label>
          <Input
            id="email-input"
            variant="error"
            aria-invalid
            aria-describedby="email-error"
          />
          <span id="email-error">Invalid email address</span>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Select', () => {
    it('should not have violations with label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-select">Choose option</label>
          <Select id="test-select">
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </Select>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with aria-label', async () => {
      const { container } = render(
        <Select aria-label="Select option">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Badge', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Badge>Badge</Badge>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations for all variants', async () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'] as const;
      for (const variant of variants) {
        const { container } = render(<Badge variant={variant}>Badge</Badge>);
        const results = await axe(container);
        expect(results.violations).toEqual([]);
      }
    });

    it('should not have violations with aria-label', async () => {
      const { container } = render(<Badge aria-label="Status: Active">Active</Badge>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Skeleton', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Skeleton className="h-12 w-full" />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should have proper ARIA attributes', async () => {
      const { container } = render(<Skeleton className="h-12 w-full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Alert', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Alert>Alert message</Alert>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should have proper role attribute', async () => {
      const { container } = render(<Alert>Alert message</Alert>);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations for all variants', async () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'] as const;
      for (const variant of variants) {
        const { container } = render(<Alert variant={variant}>Alert</Alert>);
        const results = await axe(container);
        expect(results.violations).toEqual([]);
      }
    });

    it('should not have violations with dismissible', async () => {
      const { container } = render(<Alert dismissible>Dismissible alert</Alert>);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Card', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with minimal content', async () => {
      const { container } = render(
        <Card>
          <CardContent>Simple content</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('ButtonGroup', () => {
    const mockItems = [
      { label: 'Edit', onClick: () => {} },
      { label: 'Delete', onClick: () => {} },
    ];

    it('should not have accessibility violations', async () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations when disabled', async () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} disabled />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations when loading', async () => {
      const { container } = render(<ButtonGroup label="Actions" items={mockItems} isLoading />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Collapsible', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations when open', async () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should have proper ARIA attributes', async () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = container.querySelector('button');
      expect(trigger).toHaveAttribute('aria-expanded');
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('DataFieldCard', () => {
    const mockFields = [
      { label: 'Name', value: 'John Doe' },
      { label: 'Age', value: 30 },
    ];

    it('should not have accessibility violations', async () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should use proper semantic HTML', async () => {
      const { container } = render(<DataFieldCard title="Details" fields={mockFields} />);
      const dl = container.querySelector('dl');
      const dt = container.querySelector('dt');
      const dd = container.querySelector('dd');
      expect(dl).toBeInTheDocument();
      expect(dt).toBeInTheDocument();
      expect(dd).toBeInTheDocument();
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with links', async () => {
      const fieldsWithLinks = [
        { label: 'Website', value: 'example.com', link: 'https://example.com' },
      ];
      const { container } = render(<DataFieldCard title="Details" fields={fieldsWithLinks} />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with empty state', async () => {
      const { container } = render(<DataFieldCard title="Details" fields={[]} />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Dialog', () => {
    it('should not have accessibility violations', async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessible Dialog</DialogTitle>
              <DialogDescription>This is an accessible dialog</DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <button>Close</button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );

      await user.click(getByText('Open Dialog'));

      await waitFor(() => {
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeTruthy();
      });

      // Test the dialog element directly since it renders in a portal
      const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
      const results = await axe(dialog);
      expect(results.violations).toEqual([]);
    });

    it('should have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ARIA Dialog</DialogTitle>
              <DialogDescription>Dialog with ARIA attributes</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(getByText('Open Dialog'));

      await waitFor(() => {
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeTruthy();
        expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy();
        expect(dialog?.getAttribute('aria-describedby')).toBeTruthy();
      });
    });

    it('should not have violations with all size variants', async () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
      for (const size of sizes) {
        const user = userEvent.setup();
        const { getByText, unmount } = render(
          <Dialog>
            <DialogTrigger asChild>
              <button>Open Dialog {size}</button>
            </DialogTrigger>
            <DialogContent size={size}>
              <DialogHeader>
                <DialogTitle>Dialog</DialogTitle>
                <DialogDescription>Size variant {size}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );

        await user.click(getByText(`Open Dialog ${size}`));

        await waitFor(() => {
          const dialog = document.querySelector('[role="dialog"]');
          expect(dialog).toBeTruthy();
        });

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        const results = await axe(dialog);
        expect(results.violations).toEqual([]);

        unmount();
      }
    });

    it('should not have violations without close button', async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent showClose={false}>
            <DialogHeader>
              <DialogTitle>Dialog</DialogTitle>
              <DialogDescription>Dialog without close button</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      await user.click(getByText('Open Dialog'));

      await waitFor(() => {
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeTruthy();
      });

      const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
      const results = await axe(dialog);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Form Components Integration', () => {
    it('should not have violations in complete form', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <Select id="country">
              <option value="">Select country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
            </Select>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with error states', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              variant="error"
              aria-invalid
              aria-describedby="email-error"
            />
            <span id="email-error">Please enter a valid email</span>
          </div>
          <Alert variant="error">Please fix the errors above</Alert>
        </form>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe('Complex Layouts', () => {
    it('should not have violations in card grid', async () => {
      const { container } = render(
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>Content 1</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>Content 2</CardContent>
          </Card>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });

    it('should not have violations with mixed components', async () => {
      const { container } = render(
        <div>
          <Alert variant="info">Information message</Alert>
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DataFieldCard
                title="Information"
                fields={[
                  { label: 'Type', value: 'Residential' },
                  { label: 'Year', value: 2020 },
                ]}
              />
            </CardContent>
            <CardFooter>
              <Button>View More</Button>
              <Badge variant="success">Active</Badge>
            </CardFooter>
          </Card>
        </div>
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });
});
