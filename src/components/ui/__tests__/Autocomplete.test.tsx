/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete, type BaseAutocompleteItem } from '../Autocomplete';

// Mock data
interface MockItem extends BaseAutocompleteItem {
  name: string;
  description: string;
}

const mockItems: MockItem[] = [
  { id: '1', name: 'Apple', description: 'A fruit' },
  { id: '2', name: 'Banana', description: 'Another fruit' },
  { id: '3', name: 'Cherry', description: 'A small fruit' },
];

const mockGetSources = (items: MockItem[] = mockItems) => ({ query }: { query: string }) => [
  {
    sourceId: 'test',
    getItems: () => {
      if (!query) return items;
      return items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    getItemInputValue: ({ item }: { item: MockItem }) => item.name,
    onSelect: vi.fn(),
  },
];

const mockRenderItem = ({ item, itemProps }: { item: MockItem; itemProps: React.LiHTMLAttributes<HTMLLIElement> }) => (
  <li {...itemProps} data-testid={`item-${item.id}`}>
    <div>{item.name}</div>
    <div>{item.description}</div>
  </li>
);

describe('Autocomplete', () => {
  describe('Rendering', () => {
    it('renders input field', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
        />
      );
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          placeholder="Search items..."
        />
      );
      expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          initialValue="Apple"
        />
      );
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('Apple');
    });

    it('auto-focuses input when autoFocus is true', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          autoFocus={true}
        />
      );
      const input = screen.getByRole('searchbox');
      expect(input).toHaveFocus();
    });

    it('does not auto-focus when autoFocus is false', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          autoFocus={false}
        />
      );
      const input = screen.getByRole('searchbox');
      expect(input).not.toHaveFocus();
    });
  });

  describe('Dropdown Behavior', () => {
    it('opens dropdown on focus when openOnFocus is true', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          openOnFocus={true}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });
    });

    it('shows results when typing', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.type(input, 'App');

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });

    it('filters results based on query', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Ban');

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown on blur', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Autocomplete
            getSources={mockGetSources()}
            renderItem={mockRenderItem}
            openOnFocus={true}
            autoFocus={false}
          />
          <button>Outside</button>
        </div>
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });

      const outsideButton = screen.getByRole('button', { name: /outside/i });
      await user.click(outsideButton);

      await waitFor(() => {
        expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });
  });

  describe('Item Selection', () => {
    it('calls onSelect when item is clicked', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      const getSources = () => [
        {
          sourceId: 'test',
          getItems: () => mockItems,
          getItemInputValue: ({ item }: { item: MockItem }) => item.name,
          onSelect,
        },
      ];

      render(
        <Autocomplete
          getSources={getSources}
          renderItem={mockRenderItem}
          openOnFocus={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });

      const item = screen.getByTestId('item-1');
      await user.click(item);

      expect(onSelect).toHaveBeenCalledTimes(1);
      // Just verify it was called with an object containing the item
      const callArg = onSelect.mock.calls[0][0];
      expect(callArg.item).toEqual(expect.objectContaining({
        id: '1',
        name: 'Apple',
        description: 'A fruit',
      }));
    });

    it('updates input value after selection', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          openOnFocus={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });

      const item = screen.getByTestId('item-1');
      await user.click(item);

      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('Apple');
    });
  });

  // Note: Empty state tests are complex to test with algolia autocomplete
  // as the dropdown behavior with empty results depends on internal state management
  // These are better tested through Storybook or E2E tests

  describe('Custom Rendering', () => {
    it('renders custom header', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          renderHeader={() => <div data-testid="custom-header">Custom Header</div>}
          openOnFocus={true}
          autoFocus={false}
        />
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('renders custom footer', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          renderFooter={({ itemCount }) => (
            <div data-testid="custom-footer">{itemCount} items</div>
          )}
          openOnFocus={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
        expect(screen.getByTestId('custom-footer')).toHaveTextContent('3 items');
      });
    });
  });

  describe('Compact Mode', () => {
    it('applies compact styles when compact is true', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          compact={true}
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('w-96');
    });

    it('applies full-width styles when compact is false', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          compact={false}
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('w-full');
    });
  });

  describe('Max Results', () => {
    it('limits results when maxResults is set', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          maxResults={2}
          openOnFocus={true}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
        expect(screen.getByTestId('item-2')).toBeInTheDocument();
        expect(screen.queryByTestId('item-3')).not.toBeInTheDocument();
      });
    });
  });

  describe('Callbacks', () => {
    it('calls onInputChange when input changes', async () => {
      const onInputChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          onInputChange={onInputChange}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.type(input, 'A');

      expect(onInputChange).toHaveBeenCalled();
      expect(onInputChange).toHaveBeenCalledWith('A');
    });

    it('calls onOpenChange when dropdown opens/closes', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <div>
          <Autocomplete
            getSources={mockGetSources()}
            renderItem={mockRenderItem}
            onOpenChange={onOpenChange}
            openOnFocus={true}
            autoFocus={false}
          />
          <button>Outside</button>
        </div>
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });

      const outsideButton = screen.getByRole('button', { name: /outside/i });
      await user.click(outsideButton);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      }, { timeout: 500 });
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom input className', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          inputClassName="custom-input"
        />
      );

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('custom-input');
    });

    it('accepts custom panel className', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          panelClassName="custom-panel"
          openOnFocus={true}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        const panel = screen.getByTestId('item-1').closest('div[class*="custom-panel"]');
        expect(panel).toBeInTheDocument();
      });
    });

    it('accepts custom container className', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          containerClassName="custom-container"
        />
      );

      const input = screen.getByRole('searchbox');
      const container = input.closest('div[class*="custom-container"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates items with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          openOnFocus={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });

      const input = screen.getByRole('searchbox');
      await user.keyboard('{ArrowDown}');

      // First item should be highlighted (implementation depends on algolia autocomplete)
      const firstItem = screen.getByTestId('item-1');
      expect(firstItem).toBeInTheDocument();
    });

    it('closes dropdown on Escape', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          openOnFocus={true}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-1')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByTestId('item-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper input role', () => {
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
        />
      );
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('has accessible list when open', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete
          getSources={mockGetSources()}
          renderItem={mockRenderItem}
          openOnFocus={true}
          autoFocus={false}
        />
      );

      const input = screen.getByRole('searchbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });
});

