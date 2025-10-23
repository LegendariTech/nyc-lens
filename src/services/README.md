# Property Data Services

This directory contains services for fetching and processing property data from various NYC data sources.

## Overview

The property data service provides a unified interface for accessing property information from different sources (PLUTO, DOB, HPD, etc.) with consistent error handling and data formatting.

## Usage

### Basic Usage

```typescript
import { usePropertyData } from '@/services/propertyData';

// In a React Server Component
async function MyComponent({ bbl }: { bbl: string }) {
  const { data, metadata, error } = await usePropertyData(bbl, 'pluto');
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return <div>{/* Render data */}</div>;
}
```

### With React's `use` hook (Client Components)

```typescript
'use client';

import { use } from 'react';
import { usePropertyData } from '@/services/propertyData';

function MyClientComponent({ bbl }: { bbl: string }) {
  const propertyDataPromise = usePropertyData(bbl, 'pluto');
  const { data, metadata, error } = use(propertyDataPromise);
  
  // Component logic...
}
```

## API Reference

### `usePropertyData(bbl: string, source: 'pluto' | 'dob' | 'hpd')`

Fetches property data from the specified source.

**Parameters:**
- `bbl` - Borough-Block-Lot identifier (e.g., "1-13-1")
- `source` - Data source to fetch from

**Returns:** `Promise<PropertyDataResult>`
```typescript
interface PropertyDataResult {
  data: PlutoData | null;
  metadata: PlutoMetadata | null;
  error?: string;
}
```

### Helper Functions

#### `groupPlutoData(data, metadata)`

Groups PLUTO data into logical sections for display.

**Returns:** `PlutoSection[]`

```typescript
interface PlutoSection {
  title: string;
  fields: Array<{
    label: string;
    fieldName: string;
    value: string | number | boolean | null;
    description?: string;
  }>;
}
```

#### `formatValue(value, column?)`

Formats a value based on its metadata and type.

**Examples:**
```typescript
formatValue(null)           // "N/A"
formatValue(true)           // "Yes"
formatValue(1000)           // "1,000"
formatValue(1000, { format: { noCommas: 'true' } }) // "1000"
```

#### `getLandUseDescription(landUseCode)`

Converts a numeric land use code to a human-readable description.

**Example:**
```typescript
getLandUseDescription(5) // "Commercial & Office Buildings"
```

#### `getBoroughName(boroughCode)`

Converts a borough code to its full name.

**Example:**
```typescript
getBoroughName('MN') // "Manhattan"
```

#### `getBuildingClassCategory(buildingClass)`

Gets the category description for a building class code.

**Example:**
```typescript
getBuildingClassCategory('O6') // "Office Buildings"
```

## Data Sources

### PLUTO (Primary Land Use Tax Lot Output)

PLUTO data is provided by the NYC Department of City Planning and contains extensive land use and geographic data at the tax lot level.

**Current Implementation:**
- Data is loaded from static sample JSON files located at `/app/property/[bbl]/data/pluto/`
- This is a fixed path containing test data for development purposes
- Files included:
  - `data.json` - Sample property data (1 Broadway, Manhattan)
  - `metadata.json` - Column definitions and descriptions from Socrata
- The `bbl` parameter is currently ignored; all requests return the same sample data

**Future Enhancement:**
- Replace static file loading with API calls to Elasticsearch or Socrata
- Use the `bbl` parameter to fetch actual property-specific data
- Implement caching for improved performance

### DOB (Department of Buildings)

*Coming soon*

### HPD (Housing Preservation and Development)

*Coming soon*

## Data Sections

PLUTO data is organized into the following sections:

1. **Basic Information** - Address, BBL, borough, block, lot, ZIP code
2. **Building Information** - Building class, year built, floors, units, area
3. **Land Use & Zoning** - Land use type, zoning districts, overlays
4. **Area Breakdown** - Detailed square footage by use type
5. **Ownership & Assessment** - Owner information, assessed values
6. **Floor Area Ratio (FAR)** - Built, residential, commercial, facility FAR
7. **Geographic & Administrative** - Community district, council district, census tract
8. **Coordinates** - Latitude, longitude, X/Y coordinates
9. **Historic & Landmark** - Historic district, landmark status

## Type Definitions

See `/src/types/pluto.ts` for complete type definitions including:
- `PlutoRecord` - Full PLUTO data structure
- `LAND_USE_CODES` - Land use code mappings
- `BOROUGH_CODES` - Borough code mappings
- `BUILDING_CLASS_CATEGORIES` - Building class category mappings

## Testing

Tests are located in `__tests__/propertyData.test.ts` and cover:
- Value formatting
- Metadata retrieval
- Data grouping
- Error handling

Run tests with:
```bash
npm test -- src/services/__tests__/propertyData.test.ts
```

## Examples

### Complete Component Example

```typescript
import { use } from 'react';
import { usePropertyData, groupPlutoData } from '@/services/propertyData';

export function PropertyDetails({ bbl }: { bbl: string }) {
  const propertyDataPromise = usePropertyData(bbl, 'pluto');
  const { data, metadata, error } = use(propertyDataPromise);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!data || !metadata) {
    return <EmptyState />;
  }

  const sections = groupPlutoData(data, metadata);

  return (
    <div>
      {sections.map((section) => (
        <Section key={section.title} title={section.title}>
          {section.fields.map((field) => (
            <Field
              key={field.fieldName}
              label={field.label}
              value={field.value}
              description={field.description}
            />
          ))}
        </Section>
      ))}
    </div>
  );
}
```

## Contributing

When adding new data sources:

1. Add the source type to the `usePropertyData` function signature
2. Implement a fetch function (e.g., `fetchDobData`)
3. Define appropriate TypeScript types
4. Add helper functions for decoding any coded values
5. Create grouping functions for logical data organization
6. Add comprehensive tests
7. Update this README with usage examples

