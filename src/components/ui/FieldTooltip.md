# FieldTooltip Component

A reusable tooltip component for displaying field descriptions and contextual information.

## Overview

The `FieldTooltip` component is built on top of [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip), providing a robust, accessible, and flexible tooltip solution that automatically handles:

- **Overflow clipping prevention**: Uses Radix Portal to render tooltips outside the DOM hierarchy, preventing clipping by parent containers with `overflow: hidden`
- **Smart positioning**: Automatically positions tooltips based on available viewport space
- **Collision detection**: Keeps tooltips within viewport bounds with configurable padding
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive behavior**: Optimized for both desktop (hover) and mobile (touch) interactions

## Features

- ✅ No clipping by parent overflow containers
- ✅ Auto-positioning (top/bottom/left/right)
- ✅ Collision detection with viewport edges
- ✅ HTML content support
- ✅ Two display modes: wrapper and icon
- ✅ Configurable delays
- ✅ Fully accessible (ARIA compliant)
- ✅ TypeScript support

## Usage

### Wrapper Mode (Default)

Wraps the children element with tooltip functionality:

```tsx
<FieldTooltip description="This is a description" fieldKey="owner-name">
  Owner Name
</FieldTooltip>
```

### Icon Mode

Displays an info icon that triggers the tooltip:

```tsx
<div className="flex items-center gap-1">
  Owner Name
  <FieldTooltip description="This is a description" fieldKey="owner-name" asIcon />
</div>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `description` | `string` | Yes | - | The content to show in the tooltip (supports HTML) |
| `fieldKey` | `string` | Yes | - | Unique identifier for the tooltip |
| `children` | `React.ReactNode` | No | - | Content to wrap (not used in icon mode) |
| `className` | `string` | No | - | Additional CSS classes for the trigger wrapper |
| `asIcon` | `boolean` | No | `false` | Whether to show as an inline icon |

## HTML Content

The tooltip supports HTML content in the `description` prop:

```tsx
<FieldTooltip 
  description="This has <b>bold text</b> and <a href='https://example.com'>a link</a>"
  fieldKey="example"
>
  Hover me
</FieldTooltip>
```

Newlines are automatically converted to `<br>` tags:

```tsx
<FieldTooltip 
  description="Line 1\nLine 2\nLine 3"
  fieldKey="example"
>
  Hover me
</FieldTooltip>
```

## Behavior

### Desktop (Hover)
- Tooltip appears after 300ms delay when hovering over the trigger
- Tooltip remains visible while hovering over either the trigger or tooltip content
- Tooltip disappears when mouse leaves both areas

### Mobile (Touch)
- Tooltip appears immediately on tap
- Backdrop overlay prevents interaction with page content
- Tap outside or on backdrop to close

## Styling

The tooltip uses a dark theme by default with the following characteristics:
- Black background with gray border
- White text with readable font size (text-sm)
- Blue links with hover effects
- Maximum height of 60vh with scrolling for long content
- Maximum width of 400px (or viewport width - 2rem on mobile)

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support (provided by Radix)
- Focus management
- Icon buttons include descriptive `aria-label`

## Migration from Previous Implementation

The component has been migrated from a custom implementation to Radix UI Tooltip. Key improvements:

1. **Better overflow handling**: Tooltips now use Portal rendering, preventing clipping by parent containers
2. **Improved positioning**: Radix's collision detection ensures tooltips stay within viewport
3. **Enhanced accessibility**: Built-in ARIA support and keyboard navigation
4. **Reduced complexity**: Less custom code to maintain

The API remains the same, so existing usage should continue to work without changes.

## Examples

See `FieldTooltip.stories.tsx` for interactive examples including:
- Basic wrapper and icon modes
- HTML and multiline content
- Long content with scrolling
- Tooltips in overflow containers
- Multiple tooltips on the same page
- Custom styling

## Dependencies

- `@radix-ui/react-tooltip`: Tooltip primitive component
- `@/utils/cn`: Utility for merging CSS classes

