/**
 * Event types for tracking user interactions and system events
 */
export enum EventType {
  /** Autocomplete search query */
  AUTOCOMPLETE_SEARCH = 'autocomplete_search',
  /** Condo units filter/search query */
  CONDO_UNIT_SEARCH = 'condo_unit_search',
  /** Click on a condo unit link */
  CONDO_UNIT_CLICK = 'condo_unit_click',
  /** Click on sign-in prompt (e.g., blurred ownership/contacts) */
  SIGN_IN_PROMPT_CLICK = 'sign_in_prompt_click',
}

/**
 * Base event structure stored in Elasticsearch
 */
export interface TrackedEvent {
  /** Event type identifier */
  event: EventType | string;
  /** Event-specific data (flattened in ES) */
  data: Record<string, unknown>;
  /** ISO 8601 timestamp */
  timestamp: string;
}

/**
 * Autocomplete search event data
 */
export interface AutocompleteSearchData {
  /** User's search query */
  query: string;
  /** Number of suggestions returned */
  resultCount: number;
  /** Borough from top suggestion (if any) */
  topBorough?: string;
  /** Building class from top suggestion (if any) */
  topBuildingClass?: string;
}
