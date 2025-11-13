import bodybuilder from 'bodybuilder';

// Minimal builder interface to avoid 'any' while keeping strong readability
interface BodyBuilderLite {
  from(value: number): BodyBuilderLite;
  size(value: number): BodyBuilderLite;
  sort(field: string, order: 'asc' | 'desc'): BodyBuilderLite;
  filter(type: string, field: string | Record<string, unknown>, value?: unknown): BodyBuilderLite;
  notFilter(type: string, field: string | Record<string, unknown>, value?: unknown): BodyBuilderLite;
  query(type: string, query?: Record<string, unknown> | ((qb: BodyBuilderLite) => BodyBuilderLite)): BodyBuilderLite;
  orQuery(type: string, query?: Record<string, unknown> | ((qb: BodyBuilderLite) => BodyBuilderLite)): BodyBuilderLite;
  notQuery(type: string, query?: Record<string, unknown>): BodyBuilderLite;
  build(): Record<string, unknown>;
}

type SortModelItem = {
  colId: string;
  sort: 'asc' | 'desc';
};

type FilterModelEntry = unknown;

export type ServerSideGetRowsRequest = {
  startRow?: number;
  endRow?: number;
  rowGroupCols: { id: string; displayName: string; field?: string; aggFunc?: string }[];
  valueCols: { id: string; displayName: string; field?: string; aggFunc?: string }[];
  pivotCols: { id: string; displayName: string; field?: string; aggFunc?: string }[];
  pivotMode: boolean;
  groupKeys: string[];
  filterModel: Record<string, FilterModelEntry> | unknown | null;
  sortModel: SortModelItem[];
};

const MAX_RESULTS_WINDOW = Number.MAX_SAFE_INTEGER; // Elasticsearch default index.max_result_window

function getFromAndSize(startRow?: number, endRow?: number) {
  const rawFrom = typeof startRow === 'number' ? Math.max(startRow, 0) : 0;
  const requestedSize = typeof endRow === 'number' ? Math.max(endRow - (startRow || 0), 0) : 100;
  const from = Math.min(rawFrom, MAX_RESULTS_WINDOW);
  const remaining = Math.max(MAX_RESULTS_WINDOW - from, 0);
  const size = Math.min(requestedSize, remaining);
  return { from, size };
}

function addSorting(b: BodyBuilderLite, sortModel: SortModelItem[]) {
  sortModel?.forEach((sortModelItem) => {
    if (!sortModelItem?.colId) return;
    if (sortModelItem.sort !== 'asc' && sortModelItem.sort !== 'desc') return;
    const sortableField = resolveSortableFieldForSort(sortModelItem.colId);
    if (sortableField) {
      b.sort(sortableField, sortModelItem.sort);
    }
  });
}

function addSetFilter(b: BodyBuilderLite, field: string, values: unknown[]) {
  if (!values || values.length === 0) return;
  const targetField = searchStrategies[field]?.equalsField || field;
  b.filter('terms', targetField, values);
}

function addTextFilter(b: BodyBuilderLite, field: string, type: string, filter?: string) {
  const strategy = searchStrategies[field];
  const equalsField = strategy?.equalsField || field;
  const startWithField = strategy?.startWithField || field;
  const containsField = strategy?.containsField || field;

  // Handle blank/notBlank filters (don't require filter value)
  if (type === 'blank') {
    // Filter for documents where field is missing or empty
    b.notFilter('exists', field);
    return;
  }
  if (type === 'notBlank') {
    // Filter for documents where field exists and has a value
    b.filter('exists', field);
    return;
  }

  // For other filter types, require a filter value
  if (!filter) return;

  if (field === 'address' && filter) {
    b.query('dis_max', {
      queries: [
        {
          match_phrase_prefix: {
            address: {
              query: filter,
              analyzer: 'autocomplete',
            },
          },
        },
        {
          match_phrase_prefix: {
            aka: {
              query: filter,
              analyzer: 'autocomplete',
            },
          },
        },
      ],
    });
    return;
  }
  switch (type) {
    case 'equals': {
      b.filter('term', equalsField, filter);
      break;
    }
    case 'startsWith': {
      b.query('prefix', { [startWithField]: filter });
      break;
    }
    case 'contains': {
      b.query('match_phrase_prefix', { [containsField]: filter });
      break;
    }
    default: {
      if (filter) b.query('match_phrase', { [field]: filter });
    }
  }
}

function addNumberFilter(b: BodyBuilderLite, field: string, type: string, filter?: number) {
  switch (type) {
    case 'equals':
      b.filter('term', field, filter);
      break;
    case 'lessThan':
      b.filter('range', field, { lt: filter });
      break;
    case 'lessThanOrEqual':
      b.filter('range', field, { lte: filter });
      break;
    case 'greaterThan':
      b.filter('range', field, { gt: filter });
      break;
    case 'greaterThanOrEqual':
      b.filter('range', field, { gte: filter });
      break;
    case 'inRange':
      // handled in addFilters (needs both filter and filterTo)
      break;
    default:
      break;
  }
}

function normalizeToIsoDateTime(input?: string): string | undefined {
  if (!input) return undefined;
  // MM/DD/YYYY -> YYYY-MM-DDT00:00:00Z
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
    const [m, d, y] = input.split('/').map((n) => parseInt(n, 10));
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`;
  }
  // YYYY-MM-DD HH:mm:ss -> replace space with T and add Z
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)) {
    return input.replace(' ', 'T') + 'Z';
  }
  // YYYY-MM-DDTHH:mm:ss (no zone)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(input)) {
    return input + 'Z';
  }
  // YYYY-MM-DD -> start of day UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input + 'T00:00:00Z';
  }
  // Already ISO with timezone or parseable
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return undefined;
}

function toDayRange(filter?: string) {
  if (!filter) return undefined;
  // Normalize to start of day ISO
  const isoDateTime = normalizeToIsoDateTime(filter);
  if (!isoDateTime) return undefined;
  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) return undefined;
  const start = date.toISOString();
  const end = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString();
  return { start, end };
}

function addDateLikeFilter(b: BodyBuilderLite, field: string, type: string, filter?: string) {
  const dayRange = toDayRange(filter);
  switch (type) {
    case 'equals':
      if (dayRange) b.filter('range', field, { gte: dayRange.start, lt: dayRange.end });
      break;
    case 'lessThan': {
      const normalized = normalizeToIsoDateTime(filter);
      if (normalized) b.filter('range', field, { lt: normalized });
      break;
    }
    case 'lessThanOrEqual': {
      const normalized = normalizeToIsoDateTime(filter);
      if (normalized) b.filter('range', field, { lte: normalized });
      break;
    }
    case 'greaterThan': {
      const normalized = normalizeToIsoDateTime(filter);
      if (normalized) b.filter('range', field, { gt: normalized });
      break;
    }
    case 'greaterThanOrEqual': {
      const normalized = normalizeToIsoDateTime(filter);
      if (normalized) b.filter('range', field, { gte: normalized });
      break;
    }
    default:
      break;
  }
}

function addDateInRangeFilter(
  b: BodyBuilderLite,
  field: string,
  dateFrom?: string,
  dateTo?: string
) {
  const fromIso = dateFrom ? normalizeToIsoDateTime(dateFrom) : undefined;
  const toDay = dateTo ? toDayRange(dateTo) : undefined;
  const range: Record<string, string> = {};
  if (fromIso) range.gte = fromIso;
  if (toDay) range.lt = toDay.end; // end-exclusive of the end day
  if (Object.keys(range).length > 0) {
    b.filter('range', field, range);
  }
}

function addFilters(b: BodyBuilderLite, filterModel: Record<string, FilterModelEntry> | unknown | null) {
  if (!filterModel) return;
  Object.entries(filterModel as Record<string, unknown>).forEach(([field, model]) => {
    if (!model) return;
    // Handle Set Filter model: { values: [...] } (AG Set Filter)
    if (typeof model === 'object' && model !== null && Array.isArray((model as { values?: unknown[] }).values)) {
      addSetFilter(b, field, (model as { values?: unknown[] }).values || []);
      return;
    }
    const filterType = (model as { filterType?: string }).filterType;
    const type = (model as { type?: string }).type;
    if (!filterType) return;
    if (filterType === 'text' || filterType === 'object') {
      addTextFilter(b, field, type || 'contains', (model as { filter?: string }).filter);
      return;
    }
    if (filterType === 'number') {
      const numberModel = model as { filter?: number; filterTo?: number; type?: string };
      if (type === 'inRange' && (numberModel.filter != null || numberModel.filterTo != null)) {
        const range: Record<string, number> = {};
        if (numberModel.filter != null) range.gte = numberModel.filter;
        if (numberModel.filterTo != null) range.lte = numberModel.filterTo as number;
        if (Object.keys(range).length > 0) b.filter('range', field, range);
      } else {
        addNumberFilter(b, field, type || 'equals', numberModel.filter);
      }
      return;
    }
    if (
      filterType === 'date' ||
      filterType === 'dateString' ||
      filterType === 'dateTime' ||
      filterType === 'dateTimeString'
    ) {
      const m = model as {
        filter?: string;
        dateFrom?: string;
        dateTo?: string | null;
        operator?: 'AND' | 'OR';
        conditions?: Array<{ type: string; dateFrom?: string; dateTo?: string | null }>;
      };

      // Handle inRange directly
      if (type === 'inRange') {
        addDateInRangeFilter(b, field, m.dateFrom, m.dateTo || undefined);
        return;
      }

      // Handle multiple conditions with AND (range via greater/less combos)
      if (Array.isArray(m.conditions) && (m.operator === 'AND' || !m.operator)) {
        m.conditions.forEach((cond) => {
          if (cond.type === 'inRange') {
            addDateInRangeFilter(b, field, cond.dateFrom, cond.dateTo || undefined);
          } else {
            const dateVal = cond.dateFrom;
            addDateLikeFilter(b, field, cond.type, dateVal);
          }
        });
        return;
      }

      // Fallback single condition (AG often sends dateFrom)
      const dateVal = m.dateFrom || m.filter;
      addDateLikeFilter(b, field, type || 'equals', dateVal);
      return;
    }
    if (filterType === 'boolean') {
      const val = (model as { type?: string }).type === 'true';
      addSetFilter(b, field, [val]);
      return;
    }
  });
}

export function buildEsQueryFromAgGrid(request: ServerSideGetRowsRequest) {
  const { from, size } = getFromAndSize(request.startRow, request.endRow);
  const b = (bodybuilder() as unknown as BodyBuilderLite).from(from).size(size).query('match_all');

  addSorting(b, request.sortModel || []);
  addFilters(b, request.filterModel);
  return b.build();
}

// Minimal types for reading mapping properties for sort resolution
type EsSubFieldDef = { type: string };
type EsFieldDef = {
  type: string;
  fields?: Record<string, EsSubFieldDef>;
};
type EsMapping = {
  mappings?: {
    properties?: Record<string, EsFieldDef>;
  };
};

// Resolve a sortable field path using the Elasticsearch mapping.
// If the field is of type 'text', prefer a concrete sortable subfield such as '.integer' or '.keyword'.
// Returns null if the field appears unsortable (to avoid text sort errors in Elasticsearch).
function resolveSortableFieldForSort(field: string): string | null {
  if (!field) return null;
  // Already a subfield like 'field.keyword' or 'field.integer'
  if (field.includes('.')) return field;

  // Inspect mapping
  const mappingProps = (elasticMapping as unknown as EsMapping)?.mappings?.properties;

  const def = mappingProps?.[field];
  if (!def) return field; // unknown field; allow as-is

  const type = def?.type as string | undefined;
  if (type === 'text') {
    const subFields = (def.fields || {}) as Record<string, { type: string }>;
    if (subFields.integer) return `${field}.integer`;
    if (subFields.keyword) return `${field}.keyword`;
    // Avoid sorting by analyzed text
    return null;
  }

  // keyword, numeric, date, etc. are sortable as-is
  return field;
}

type FieldSearchStrategy = {
  equalsField?: string;
  startWithField?: string;
  containsField?: string;
};
type SearchStrategiesMap = Record<string, FieldSearchStrategy>;

const searchStrategies: SearchStrategiesMap = {
  block: {
    equalsField: 'block.integer',
  },
  lot: {
    equalsField: 'lot.integer',
  },
  avroll_building_class: {
    equalsField: 'avroll_building_class.keyword',
    containsField: 'avroll_building_class',
  },
  avroll_units: {
    equalsField: 'avroll_units.integer',
  },
  avroll_building_story: {
    equalsField: 'avroll_building_story.integer',
  },
  lender_name: {
    equalsField: 'lender_name.keyword',
    startWithField: 'lender_name.keyword',
    containsField: 'lender_name',

  },
  borrower_name: {
    equalsField: 'borrower_name.keyword',
    startWithField: 'borrower_name.keyword',
    containsField: 'borrower_name',
  },
  buyer_name: {
    equalsField: 'buyer_name.keyword',
    startWithField: 'buyer_name.keyword',
    containsField: 'buyer_name',
  },
  mortgage_document_date: {},
  mortgage_recorded_date: {},
  mortgage_document_amount: {},
  sale_document_date: {},
  sale_recorded_date: {},
  sale_document_amount: {},
  prior_mortgage_document_date: {},
  prior_mortgage_document_amount: {},
  prior_lender: {
    equalsField: 'prior_lender.keyword',
    startWithField: 'prior_lender.keyword',
    containsField: 'prior_lender',
  },
  prior_lendee: {
    equalsField: 'prior_lendee.keyword',
    startWithField: 'prior_lendee.keyword',
    containsField: 'prior_lendee'
  },
  hpd_name: {
    equalsField: 'hpd_name.keyword',
    startWithField: 'hpd_name.keyword',
    containsField: 'hpd_name',
  },
  hpd_phone: {
    equalsField: 'hpd_phone.keyword',
    startWithField: 'hpd_phone.keyword',
  }
}

const elasticMapping = {
  "mappings": {
    "dynamic": "true",
    "dynamic_date_formats": [
      "strict_date_optional_time",
      "yyyy/MM/dd HH:mm:ss Z||yyyy/MM/dd Z"
    ],
    "dynamic_templates": [],
    "date_detection": true,
    "numeric_detection": false,
    "properties": {
      "address": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        },
        "similarity": "BM25",
        "eager_global_ordinals": true,
        "fielddata": true,
        "fielddata_frequency_filter": {
          "min": 0.01,
          "max": 1,
          "min_segment_size": 50
        },
        "index_prefixes": {
          "min_chars": 1,
          "max_chars": 16
        },
        "index_phrases": true
      },
      "aka": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        },
        "similarity": "BM25",
        "eager_global_ordinals": true,
        "fielddata": true,
        "fielddata_frequency_filter": {
          "min": 0.01,
          "max": 1,
          "min_segment_size": 50
        },
        "index_prefixes": {
          "min_chars": 1,
          "max_chars": 16
        },
        "index_phrases": true
      },
      "aka_address_street_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "aka_address_street_number": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "avroll_building_class": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "avroll_building_story": {
        "type": "text",
        "fields": {
          "integer": {
            "type": "integer"
          }
        }
      },
      "avroll_units": {
        "type": "text",
        "fields": {
          "integer": {
            "type": "integer"
          }
        }
      },
      "bank": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "block": {
        "type": "text",
        "fields": {
          "integer": {
            "type": "integer"
          }
        }
      },
      "borough": {
        "type": "text",
        "fields": {
          "integer": {
            "type": "integer"
          }
        }
      },
      "borrower_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "buyer_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_address": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_amount": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_created_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_csr": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_main_contact_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_main_contact_phone": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_manager_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_manager_phone": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_mortgage_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_mortgage_exp_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_numeric_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_parent_deal_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_rate": {
        "type": "float",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_sponsor_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_sponsor_phone": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_status": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "deal_status_change_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "hpd_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "hpd_phone": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "id": {
        "type": "keyword"
      },
      "lender_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "lot": {
        "type": "text",
        "fields": {
          "integer": {
            "type": "integer"
          }
        }
      },
      "mortgage_document_amount": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "mortgage_document_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "mortgage_document_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "mortgage_recorded_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "parent_deal_numeric_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_lendee": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_lender": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_bank_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_bank_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_document_amount": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_document_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_document_id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "prior_mortgage_recorded_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "purchase_refinance": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "rcaId": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "reonomyId": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "sale_document_amount": {
        "type": "long",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "sale_document_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "sale_recorded_date": {
        "type": "date",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "salesforcePropertyId": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "street_name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "street_number": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "unit": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}