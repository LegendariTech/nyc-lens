# Tax Table Component

AG Grid table component for displaying property tax and valuation history.

## Overview

The Tax Table displays historical property valuation and tax data from the NYC Department of Finance. It shows year-over-year changes in market values, assessed values, and property taxes.

## Components

### TaxTable
Client-side AG Grid table component that renders the tax data.

### Types
- `TaxRow` - Interface for tax table row data

### Utils
- `transformValuationToTaxRows()` - Transforms PropertyValuation[] to TaxRow[]

### Column Definitions
- `taxColumnDefs` - AG Grid column definitions with custom formatters

## Usage

```typescript
import { TaxTable, transformValuationToTaxRows } from '@/components/table/tax';

// In a component
const taxRows = transformValuationToTaxRows(valuationData);
<TaxTable data={taxRows} />
```

## Data Flow

```
PropertyValuation[] (from database)
  ↓
transformValuationToTaxRows()
  ↓
TaxRow[]
  ↓
TaxTable component
  ↓
AG Grid display
```

## Columns

| Column | Description | Format |
|--------|-------------|--------|
| Year | Tax year (e.g. 2024/25) | Text |
| Market Value | Final market value total | Currency |
| Assessed Value | Final assessed value total | Currency |
| Taxable | Final taxable amount | Currency |
| Tax Rate % | Calculated tax rate | Percentage |
| Base Tax | Base tax amount | Currency |
| Property Tax | Property tax amount | Currency |
| Year Over Year Change | Change from previous year | Percentage with +/- sign |

## Features

- ✅ Automatic sorting by year (most recent first)
- ✅ Currency formatting for monetary values
- ✅ Percentage formatting for rates and changes
- ✅ Color-coded YoY changes (green for positive, red for negative)
- ✅ Right-aligned numeric columns
- ✅ Responsive column widths
- ✅ Resizable columns

## Data Transformation

The `transformValuationToTaxRows()` function:
1. Formats year as "YYYY/YY" format
2. Extracts final valuation values (finmkttot, finacttot, fintxbtot)
3. Calculates tax rate percentage
4. Calculates year-over-year change
5. Returns sorted array of TaxRow objects

## Styling

Uses the shared `myTheme` from `@/components/table/theme` for consistent dark mode styling across all AG Grid tables.

