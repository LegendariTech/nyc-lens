import React from 'react';
import { findMatchInText } from './textMatcher';

interface HighlightedTextProps {
  text: string;
  query: string;
}

/**
 * Highlights matching text in the address based on the search query
 */
export function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query || !text) {
    return <>{text}</>;
  }

  const match = findMatchInText(text, query);

  // If no match found, return text as is (light)
  if (!match) {
    return <span className="font-light text-foreground/60">{text}</span>;
  }

  const beforeMatch = text.slice(0, match.start);
  const matchedText = text.slice(match.start, match.start + match.length);
  const afterMatch = text.slice(match.start + match.length);

  return (
    <>
      <span className="font-light text-foreground/60">{beforeMatch}</span>
      <span className="font-bold">{matchedText}</span>
      <span className="font-light text-foreground/60">{afterMatch}</span>
    </>
  );
}

