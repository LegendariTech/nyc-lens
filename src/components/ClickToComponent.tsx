'use client';

import { ClickToComponent as ClickToComponentLib } from 'click-to-react-component';

/**
 * Wrapper component for click-to-react-component that only renders in development.
 * Option+Click (or Alt+Click) any component to open its source in your editor.
 * Supports VS Code, VS Code Insiders, and Cursor.
 */
export function ClickToComponent() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Use 'cursor' as the default editor
  return <ClickToComponentLib editor="cursor" />;
}
