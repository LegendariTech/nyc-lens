import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { HighlightedText } from '../HighlightedText';

describe('HighlightedText', () => {
  describe('Basic Rendering', () => {
    it('should render text without query', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="" />);
      expect(container.textContent).toBe('123 Broadway');
    });

    it('should render empty text', () => {
      const { container } = render(<HighlightedText text="" query="Broadway" />);
      expect(container.textContent).toBe('');
    });

    it('should handle both empty text and query', () => {
      const { container } = render(<HighlightedText text="" query="" />);
      expect(container.textContent).toBe('');
    });
  });

  describe('No Match Styling', () => {
    it('should apply light styling when no match is found', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="Park" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveClass('font-light');
      expect(span).toHaveClass('text-foreground/60');
      expect(span?.textContent).toBe('123 Broadway');
    });

    it('should apply light styling for completely unrelated query', () => {
      const { container } = render(<HighlightedText text="Fifth Avenue" query="xyz123" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveClass('font-light');
      expect(span).toHaveClass('text-foreground/60');
    });
  });

  describe('Exact Match Highlighting', () => {
    it('should highlight exact match in the middle', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match (light)
      expect(spans[0]).toHaveClass('font-light', 'text-foreground/60');
      expect(spans[0].textContent).toBe('123 ');

      // Match (bold)
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Broadway');

      // After match (light)
      expect(spans[2]).toHaveClass('font-light', 'text-foreground/60');
      expect(spans[2].textContent).toBe('');
    });

    it('should highlight match at the beginning', () => {
      const { container } = render(<HighlightedText text="Broadway Street" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match (empty)
      expect(spans[0].textContent).toBe('');

      // Match (bold)
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Broadway');

      // After match (light)
      expect(spans[2]).toHaveClass('font-light', 'text-foreground/60');
      expect(spans[2].textContent).toBe(' Street');
    });

    it('should highlight match at the end', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match
      expect(spans[0].textContent).toBe('123 ');

      // Match (bold)
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Broadway');

      // After match (empty)
      expect(spans[2].textContent).toBe('');
    });

    it('should be case-insensitive', () => {
      const { container } = render(<HighlightedText text="123 BROADWAY" query="broadway" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('BROADWAY');
    });
  });

  describe('Partial Match Highlighting', () => {
    it('should highlight partial match at word start', () => {
      const { container } = render(<HighlightedText text="45 Broadway" query="45" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match (empty)
      expect(spans[0].textContent).toBe('');

      // Match (bold)
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('45');

      // After match
      expect(spans[2].textContent).toBe(' Broadway');
    });

    it('should highlight progressive typing: "Bro" in "Broadway"', () => {
      const { container } = render(<HighlightedText text="45 Broadway" query="45 bro" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Match should include "45 Bro"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('45 Bro');

      // After match
      expect(spans[2].textContent).toBe('adway');
    });
  });

  describe('Synonym Match Highlighting', () => {
    it('should highlight BLVD when query is Boulevard', () => {
      const { container } = render(<HighlightedText text="123 Main BLVD" query="Boulevard" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match
      expect(spans[0].textContent).toBe('123 Main ');

      // Match (bold) - should highlight "BLVD"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('BLVD');

      // After match
      expect(spans[2].textContent).toBe('');
    });

    it('should highlight Boulevard when query is BLVD', () => {
      const { container } = render(<HighlightedText text="123 Main Boulevard" query="BLVD" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Boulevard');
    });

    it('should highlight Avenue when query is AVE', () => {
      const { container } = render(<HighlightedText text="123 Park Avenue" query="AVE" />);
      const spans = container.querySelectorAll('span');

      // Should match "Ave" portion of "Avenue"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Ave');
    });

    it('should highlight AVE when query is Avenue', () => {
      const { container } = render(<HighlightedText text="123 Park AVE" query="Avenue" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('AVE');
    });

    it('should highlight Street when query is ST', () => {
      const { container } = render(<HighlightedText text="123 Main Street" query="ST" />);
      const spans = container.querySelectorAll('span');

      // Should match "St" portion of "Street"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('St');
    });

    it('should highlight ST when query is Street', () => {
      const { container } = render(<HighlightedText text="123 Main ST" query="Street" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('ST');
    });
  });

  describe('Ordinal Synonym Highlighting', () => {
    it('should highlight First when query is 1st', () => {
      const { container } = render(<HighlightedText text="First Avenue" query="1st" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('First');
    });

    it('should highlight 1ST when query is First', () => {
      const { container } = render(<HighlightedText text="1ST Avenue" query="First" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('1ST');
    });

    it('should highlight Second when query is 2nd', () => {
      const { container } = render(<HighlightedText text="Second Avenue" query="2nd" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Second');
    });

    it('should highlight Third when query is 3rd', () => {
      const { container } = render(<HighlightedText text="Third Street" query="3rd" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Third');
    });

    it('should highlight 42ND when query is 42-ND', () => {
      const { container } = render(<HighlightedText text="42ND Street" query="42-ND" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('42ND');
    });
  });

  describe('Direction Synonym Highlighting', () => {
    it('should highlight North when query is N', () => {
      const { container } = render(<HighlightedText text="North Broadway" query="N" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('N');
    });

    it('should highlight N when query is North', () => {
      const { container } = render(<HighlightedText text="N Broadway" query="North" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('N');
    });

    it('should highlight East when query is E', () => {
      const { container } = render(<HighlightedText text="East 42nd Street" query="E" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('E');
    });
  });

  describe('Multi-word Query Highlighting', () => {
    it('should highlight multi-word match with synonym', () => {
      const { container } = render(<HighlightedText text="123 Main Boulevard" query="Main BLVD" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Before match
      expect(spans[0].textContent).toBe('123 ');

      // Match should include "Main Boulevard"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Main Boulevard');

      // After match
      expect(spans[2].textContent).toBe('');
    });

    it('should highlight synonym in multi-word query', () => {
      const { container } = render(<HighlightedText text="123 Main BLVD" query="Main Boulevard" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Main BLVD');
    });

    it('should highlight "w 42" in "West 42nd Street"', () => {
      const { container } = render(<HighlightedText text="West 42nd Street" query="w 42" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('West 42');
    });
  });

  describe('Complex Address Highlighting', () => {
    it('should highlight in full address with ordinal', () => {
      const { container } = render(<HighlightedText text="123 Fifth Avenue" query="5th" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Fifth');
    });

    it('should highlight abbreviated street type', () => {
      const { container } = render(<HighlightedText text="45 Broadway ST" query="Street" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('ST');
    });

    it('should highlight full street type for abbreviation query', () => {
      const { container } = render(<HighlightedText text="45 Broadway Street" query="ST" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('St');
    });

    it('should highlight complex multi-word with synonym and partial', () => {
      const { container } = render(<HighlightedText text="31 WEST TREMONT AVENUE" query="31 w tre" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(3);

      // Should highlight "31 WEST TRE"
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toContain('31');
      expect(spans[1].textContent).toContain('WEST');
      expect(spans[1].textContent).toContain('TRE');
    });
  });

  describe('Edge Cases', () => {
    it('should handle query with extra spaces', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="  Broadway  " />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Broadway');
    });

    it('should handle text with multiple spaces', () => {
      const { container } = render(<HighlightedText text="123  Broadway" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('Broadway');
    });

    it('should preserve original case in highlighted text', () => {
      const { container } = render(<HighlightedText text="123 BROADWAY BLVD" query="boulevard" />);
      const spans = container.querySelectorAll('span');

      // Should highlight "BLVD" with original case
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('BLVD');
    });

    it('should handle single character text', () => {
      const { container } = render(<HighlightedText text="N" query="North" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('N');
    });

    it('should handle single character query', () => {
      const { container } = render(<HighlightedText text="North Broadway" query="N" />);
      const spans = container.querySelectorAll('span');

      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[1].textContent).toBe('N');
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      // All parts should be spans for proper inline rendering
      expect(spans.length).toBeGreaterThan(0);
      spans.forEach(span => {
        expect(span.tagName).toBe('SPAN');
      });
    });

    it('should maintain text content integrity', () => {
      const text = "123 Fifth Avenue";
      const { container } = render(<HighlightedText text={text} query="5th" />);

      // The full text content should match the original
      expect(container.textContent).toBe(text);
    });

    it('should maintain text content integrity with no match', () => {
      const text = "123 Broadway";
      const { container } = render(<HighlightedText text={text} query="Park" />);

      expect(container.textContent).toBe(text);
    });
  });

  describe('Visual Styling Consistency', () => {
    it('should apply consistent light styling to non-matched portions', () => {
      const { container } = render(<HighlightedText text="123 Broadway Street" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      // Before match
      expect(spans[0]).toHaveClass('font-light', 'text-foreground/60');

      // After match
      expect(spans[2]).toHaveClass('font-light', 'text-foreground/60');
    });

    it('should apply bold styling only to matched portion', () => {
      const { container } = render(<HighlightedText text="123 Broadway Street" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      // Only the middle span should be bold
      expect(spans[0]).not.toHaveClass('font-bold');
      expect(spans[1]).toHaveClass('font-bold');
      expect(spans[2]).not.toHaveClass('font-bold');
    });

    it('should not apply extra classes to bold text', () => {
      const { container } = render(<HighlightedText text="123 Broadway" query="Broadway" />);
      const spans = container.querySelectorAll('span');

      // Bold span should only have font-bold class
      expect(spans[1].className).toBe('font-bold');
    });
  });
});

