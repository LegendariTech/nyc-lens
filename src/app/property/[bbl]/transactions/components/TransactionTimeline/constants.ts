/**
 * Timeline layout constants
 * These values control the positioning and sizing of timeline elements
 */
export const TIMELINE_CONFIG = {
  /** Minimum height for each timeline item to accommodate card content */
  ITEM_MIN_HEIGHT: 140,
  
  /** Left offset to position the vertical timeline axis */
  TIMELINE_AXIS_OFFSET: 60,
  
  /** Width of the date bubble container to contain formatted dates */
  DATE_BUBBLE_WIDTH: 120,
  
  /** Negative top offset for year scroll anchor positioning */
  YEAR_MARKER_TOP_OFFSET: -8,
  
  /** Width of the connector line from date bubble to card */
  CONNECTOR_LINE_WIDTH: 100,
  
  /** Height of the connector line SVG (affects vertical centering) */
  CONNECTOR_LINE_HEIGHT: 20,
  
  /** Radius of the dot at the end of the connector line */
  CONNECTOR_DOT_RADIUS: 4,
  
  /** Vertical spacing between timeline items */
  ITEM_SPACING: 8, // Tailwind space-y-8 = 2rem = 32px, but semantic value is 8
  
  /** Bottom spacer height to allow scrolling last item to top */
  BOTTOM_SPACER_HEIGHT: '60vh',
} as const;

