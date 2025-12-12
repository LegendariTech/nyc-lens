'use client';

import { useState } from 'react';

interface ExpandableListProps {
  items: string[];
  label: string;
}

/**
 * Expandable list component for showing multiple items with show more/less
 */
export function ExpandableList({ items, label }: ExpandableListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter out empty items
  const validItems = items.filter(item => item && item.trim());

  if (validItems.length === 0) {
    return null;
  }

  if (validItems.length === 1) {
    return (
      <div>
        <div className="text-foreground/50 text-xs mb-0.5">{label}:</div>
        <div className="font-medium text-foreground text-sm">{validItems[0]}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-foreground/50 text-xs mb-0.5">{label}:</div>
      <div className="font-medium text-foreground text-sm">
        <div className="flex flex-wrap items-center gap-1">
          <span>{validItems[0]}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-foreground/60 hover:text-foreground transition-colors text-xs cursor-pointer"
            type="button"
          >
            {isExpanded ? '- show less' : `+ ${validItems.length - 1} more`}
          </button>
        </div>
        {isExpanded && (
          <div className="flex flex-col mt-1">
            {validItems.slice(1).map((item, index) => (
              <span key={index + 1}>{item}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
