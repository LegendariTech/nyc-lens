export const DEFAULT_TEXT_FILTER_PARAMS = {
  buttons: [],
  filterOptions: [
    'startsWith',
    'equals',
  ],
  defaultOption: 'startsWith',
  maxNumConditions: 1,
};

export const DEFAULT_MATCH_TEXT_FILTER_PARAMS = {
  buttons: [],
  filterOptions: [
    'contains',
    'startsWith',
    'equals',
  ],
  defaultOption: 'contains',
  maxNumConditions: 1,
};

export const DEFAULT_DATE_FILTER_PARAMS = {
  browserDatePicker: true,
  includeTime: false,
  maxNumConditions: 1,
  filterOptions: ['equals', 'greaterThan', 'lessThan', 'inRange'],
  inRangeFloatingFilterDateFormat: 'MM/DD/YYYY',
};

export const DEFAULT_NUMBER_FILTER_PARAMS = {
  maxNumConditions: 1,
  filterOptions: ['equals', 'greaterThanOrEqual', 'lessThanOrEqual', 'inRange'],
  defaultOption: 'greaterThanOrEqual',
};


