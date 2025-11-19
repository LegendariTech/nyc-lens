import type { Meta, StoryObj } from '@storybook/react';
import { HighlightedText } from './HighlightedText';

/**
 * HighlightedText component highlights matching portions of text based on a search query.
 * Uses the textMatcher utility to find matches including synonyms and fuzzy matching.
 *
 * ## Features
 * - Smart text matching with synonym support
 * - Highlights matched text with bold styling
 * - Non-matched text appears lighter
 * - Handles no matches gracefully
 */
const meta = {
  title: 'Components/Search/HighlightedText',
  component: HighlightedText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Highlights matching text within a string based on a search query. Used in search results to show users which part of the text matched their query.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to display and highlight',
    },
    query: {
      control: 'text',
      description: 'The search query to match and highlight',
    },
  },
} satisfies Meta<typeof HighlightedText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default highlighted text example
 */
export const Default: Story = {
  args: {
    text: '123 MAIN STREET',
    query: 'main',
  },
};

/**
 * Exact match highlighting
 */
export const ExactMatch: Story = {
  args: {
    text: '456 BROADWAY',
    query: 'broadway',
  },
};

/**
 * Partial match at the beginning
 */
export const MatchAtStart: Story = {
  args: {
    text: 'PARK AVENUE SOUTH',
    query: 'park',
  },
};

/**
 * Partial match in the middle
 */
export const MatchInMiddle: Story = {
  args: {
    text: '789 WEST END AVENUE',
    query: 'end',
  },
};

/**
 * Partial match at the end
 */
export const MatchAtEnd: Story = {
  args: {
    text: '321 FIFTH AVENUE',
    query: 'avenue',
  },
};

/**
 * No match - text appears lighter
 */
export const NoMatch: Story = {
  args: {
    text: '555 LEXINGTON AVENUE',
    query: 'broadway',
  },
};

/**
 * Empty query - returns text as is
 */
export const EmptyQuery: Story = {
  args: {
    text: '999 MADISON AVENUE',
    query: '',
  },
};

/**
 * Empty text
 */
export const EmptyText: Story = {
  args: {
    text: '',
    query: 'test',
  },
};

/**
 * Number matching in address
 */
export const NumberMatch: Story = {
  args: {
    text: '1234 AMSTERDAM AVENUE',
    query: '1234',
  },
};

/**
 * Multiple words in query
 */
export const MultiWordQuery: Story = {
  args: {
    text: '100 CENTRAL PARK WEST',
    query: 'central park',
  },
};

/**
 * Case insensitive matching
 */
export const CaseInsensitive: Story = {
  args: {
    text: 'East Village',
    query: 'VILLAGE',
  },
};

/**
 * Street abbreviation matching (if supported by textMatcher)
 */
export const AbbreviationMatch: Story = {
  args: {
    text: '200 WEST 57TH STREET',
    query: 'st',
  },
};

/**
 * Multiple examples in a list
 */
export const MultipleExamples: Story = {
  render: () => (
    <div className="space-y-3 p-4 rounded-lg border border-foreground/10 bg-background">
      <div>
        <div className="text-xs text-foreground/50 mb-1">Query: "broadway"</div>
        <div className="text-lg">
          <HighlightedText text="123 BROADWAY" query="broadway" />
        </div>
      </div>
      <div>
        <div className="text-xs text-foreground/50 mb-1">Query: "5th"</div>
        <div className="text-lg">
          <HighlightedText text="789 5TH AVENUE" query="5th" />
        </div>
      </div>
      <div>
        <div className="text-xs text-foreground/50 mb-1">Query: "west"</div>
        <div className="text-lg">
          <HighlightedText text="456 WEST END AVENUE" query="west" />
        </div>
      </div>
      <div>
        <div className="text-xs text-foreground/50 mb-1">Query: "park" (no match)</div>
        <div className="text-lg">
          <HighlightedText text="321 LEXINGTON AVENUE" query="park" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Address list showing highlighted results
 */
export const AddressList: Story = {
  render: () => (
    <ul className="w-[500px] divide-y divide-foreground/10 rounded-lg border border-foreground/10 bg-background">
      <li className="px-4 py-3">
        <HighlightedText text="100 BROADWAY" query="broad" />
      </li>
      <li className="px-4 py-3">
        <HighlightedText text="200 PARK AVENUE" query="park" />
      </li>
      <li className="px-4 py-3">
        <HighlightedText text="300 MADISON AVENUE" query="madison" />
      </li>
      <li className="px-4 py-3">
        <HighlightedText text="400 LEXINGTON AVENUE" query="lex" />
      </li>
      <li className="px-4 py-3">
        <HighlightedText text="500 FIFTH AVENUE" query="fifth" />
      </li>
    </ul>
  ),
};

/**
 * Different font sizes
 */
export const FontSizes: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="text-xs">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
      <div className="text-sm">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
      <div className="text-base">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
      <div className="text-lg">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
      <div className="text-xl">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
      <div className="text-2xl">
        <HighlightedText text="123 BROADWAY" query="broadway" />
      </div>
    </div>
  ),
};

/**
 * In a card layout (realistic use case)
 */
export const InCard: Story = {
  render: () => (
    <div className="w-[400px] rounded-lg border border-foreground/10 bg-card p-4 shadow-sm">
      <div className="mb-2">
        <div className="text-lg font-medium">
          <HighlightedText text="1 CENTRE STREET" query="centre" />
        </div>
        <div className="text-sm text-foreground/60">Manhattan</div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/70">BBL:</span>
          <span className="font-medium">1-00001-0001</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Sale Date:</span>
          <span className="font-medium">2024-01-15</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Sale Amount:</span>
          <span className="font-medium">$1,250,000</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Dark mode preview
 */
export const DarkMode: Story = {
  args: {
    text: '123 BROADWAY',
    query: 'broadway',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
