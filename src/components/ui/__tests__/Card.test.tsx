import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-background', 'shadow-sm');
  });

  it('applies elevated variant correctly', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
    expect(card).not.toHaveClass('shadow-sm');
  });

  it('applies outlined variant correctly', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-none');
    expect(card).not.toHaveClass('shadow-sm');
  });

  it('forwards custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards other HTML attributes', () => {
    render(<Card data-testid="test-card">Content</Card>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('px-6', 'py-4', 'border-b');
  });

  it('forwards custom className', () => {
    const { container } = render(<CardHeader className="custom">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Content area</CardContent>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('p-6');
  });

  it('forwards custom className', () => {
    const { container } = render(<CardContent className="custom">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('px-6', 'py-4', 'border-t');
  });

  it('forwards custom className', () => {
    const { container } = render(<CardFooter className="custom">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('custom');
  });
});

describe('CardTitle', () => {
  it('renders as h3 by default', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('H3');
  });

  it('applies correct classes', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-foreground');
  });

  it('forwards custom className', () => {
    const { container } = render(<CardTitle className="custom">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('custom');
  });
});

describe('CardDescription', () => {
  it('renders as paragraph', () => {
    render(<CardDescription>Description</CardDescription>);
    const desc = screen.getByText('Description');
    expect(desc.tagName).toBe('P');
  });

  it('applies correct classes', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc).toHaveClass('text-sm', 'text-foreground/70');
  });

  it('forwards custom className', () => {
    const { container } = render(<CardDescription className="custom">Description</CardDescription>);
    const desc = container.firstChild as HTMLElement;
    expect(desc).toHaveClass('custom');
  });
});

describe('Card composition', () => {
  it('composes all card components together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
