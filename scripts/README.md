# Mortgage Document Download Script

This script automates downloading mortgage documents from NYC ACRIS and uploading them to Azure Blob Storage.

## What it does

1. **Queries database** for unprocessed mortgage documents (not downloaded or failed downloads)
2. **Opens browser pages** - Creates one page per concurrency slot (reused throughout)
3. **Downloads PDFs** from ACRIS using Playwright automation
4. **Uploads to Azure Blob Storage** (container: `acris-documents-pdfs`)
5. **Tracks progress** in `gold.downloaded_acris_documents` table
6. **Cleans up** local files after successful upload
7. **Processes in batches** with configurable concurrency
8. **Closes cleanly** when all documents are processed

## Prerequisites

- Database connection configured (uses same env vars as Next.js app)
- Azure Storage connection string in environment
- Playwright browser binaries installed (`npx playwright install chromium`)

## Environment Variables Required

The script automatically loads variables from `.env.local` at the project root.

Required variables:

```bash
# Database (MSSQL)
DB_HOST=...
DB_PORT=1433
DB_NAME=...
DB_USER=...
DB_PASSWORD=...

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
```

## Usage

### Basic Usage

Run with default settings (1 document, concurrency 1):

```bash
npm run download-docs
```

### With Custom Parameters

Pass limit and concurrency as arguments:

```bash
npm run download-docs <limit> <concurrency>
```

**Examples:**

```bash
# Download 20 documents with concurrency 3
npm run download-docs 20 3

# Download 50 documents with concurrency 5
npm run download-docs 50 5

# Download 100 documents, one at a time (safest for large files)
npm run download-docs 100 1
```

Or run directly with npx:

```bash
npx tsx scripts/download-mortgage-docs.ts 20 3
```

### Parameters

1. **`<limit>`** (required): Total number of documents to download
   - Must be a positive integer
   - Default: `1` if not specified

2. **`<concurrency>`** (optional): Number of documents to process simultaneously
   - Must be a positive integer
   - Default: `1` if not specified
   - Script warns if concurrency > limit

### Validation

The script validates inputs and shows helpful error messages:

```bash
# Invalid limit
npm run download-docs abc 3
# ❌ Error: TOTAL_DOCUMENTS must be a positive number
# Usage: npm run download-docs <limit> <concurrency>

# Concurrency higher than limit
npm run download-docs 5 10
# ⚠️  Warning: CONCURRENCY (10) is greater than TOTAL_DOCUMENTS (5)
# Setting CONCURRENCY to 5
```

## Configuration

### Command-Line Parameters

- **First argument**: Total documents to download (default: `1`)
- **Second argument**: Concurrency level (default: `1`)

### Script Constants

Edit these in `download-mortgage-docs.ts` if needed:

- `DOWNLOAD_TIMEOUT`: Timeout for each download in milliseconds (default: `180000` = 3 minutes)
- `DOWNLOAD_DIR`: Temporary local directory for downloads (default: `/Users/wice/www/bbl-club/acris-pdfs`)
- `CONTAINER_NAME`: Azure blob container name (default: `'acris-documents-pdfs'`)

**Note:** The script runs with a visible browser window. The browser opens once at the start with pages for each concurrent slot, then reuses those pages throughout processing. This prevents the browser from stealing focus repeatedly. You can minimize the browser window after it opens.

## How It Works

### 1. Database Query
Queries `gold.acris_plus` for documents that:
- Have a `latest_mortgage_document_id`
- Are NOT in `downloaded_acris_documents`, OR
- Previously failed (status = 'failed')
- Orders by date DESC, then document ID ASC

### 2. Batch Processing
With `TOTAL_DOCUMENTS = 20` and `CONCURRENCY = 3`:
- Batch 1: Downloads documents 1-3 in parallel
- Batch 2: Downloads documents 4-6 in parallel
- ...continues until all 20 are processed

### 3. Per Document Flow
1. Mark status as `'downloading'` in database
2. Open ACRIS document page with Playwright
3. Click Save → OK to download PDF
4. Wait for download to complete (up to 3 minutes)
5. Upload PDF to Azure Blob Storage
6. Mark status as `'completed'` with blob URL and file size
7. Delete local PDF file (keeps disk clean)

### 4. Error Handling
- If download or upload fails: marks status as `'failed'` with error message
- Script continues processing other documents
- Failed documents can be retried (they'll be picked up in next run)

## Database Tracking

The `gold.downloaded_acris_documents` table tracks:

| Column | Description |
|--------|-------------|
| `document_id` | ACRIS document ID |
| `status` | `pending`, `downloading`, `completed`, or `failed` |
| `storage_path` | Azure blob URL (e.g., `https://...blob.core.windows.net/acris-documents-pdfs/2026020200271002&page.pdf`) |
| `file_size_bytes` | Size of uploaded PDF |
| `downloaded_date` | When successfully downloaded |
| `error_message` | Error details if failed |

## Output Files

PDFs are:
- **Downloaded** temporarily to `/Users/wice/www/bbl-club/acris-pdfs/`
- **Uploaded** to Azure Blob Storage container `acris-documents-pdfs`
- **Deleted** from local disk after successful upload

Filenames follow pattern: `{document_id}&page.pdf` (e.g., `2026020200271002&page.pdf`)

## Concurrency Example

Running `npm run download-docs 9 3` (9 documents, concurrency 3):

- **Batch 1/3**: Downloads docs 1-3 → Uploads all 3 → Deletes local files → ✅ Complete
- **Batch 2/3**: Downloads docs 4-6 → Uploads all 3 → Deletes local files → ✅ Complete
- **Batch 3/3**: Downloads docs 7-9 → Uploads all 3 → Deletes local files → ✅ Complete

This prevents overwhelming either the ACRIS server or Azure Storage while maintaining good throughput.

**Recommended Settings:**
- For stability: `npm run download-docs 100 1` (one at a time)
- For speed: `npm run download-docs 50 3` (3 concurrent downloads)
- For testing: `npm run download-docs 5 2` (small batch)

## Handling Large Files

Large PDF documents (50+ pages) may take several minutes to download. The script:
- Has a 3-minute timeout per document (`DOWNLOAD_TIMEOUT`)
- Continues processing other documents if one fails
- Reports success/failure counts at the end
- Stores error messages in database for failed downloads
- If timeouts occur frequently, increase `DOWNLOAD_TIMEOUT` or reduce `CONCURRENCY`

## Troubleshooting

### Script fails to connect to database
- Check that all `DB_*` environment variables are set
- Verify database credentials are correct
- Ensure you're connected to VPN if required

### Azure upload fails
- Check that `AZURE_STORAGE_CONNECTION_STRING` is set
- Verify the connection string is valid
- Ensure the storage account exists

### Playwright errors
- Run `npx playwright install chromium` to install browsers
- Check that ACRIS site is accessible

### Download timeouts
- Increase `DOWNLOAD_TIMEOUT` for large files
- Reduce `CONCURRENCY` to avoid rate limiting
- Check network connection

### PDF viewer not loading
- The ACRIS PDF viewer requires a full browser environment
- Browser window must be visible (cannot run in headless mode)
- Old documents (pre-2020) may have been deleted from ACRIS
- Check database `error_message` column for failed documents

### Browser window behavior
- The browser opens once at the start with `CONCURRENCY` number of pages
- These pages are reused for all documents (no new windows/tabs created)
- The browser will only steal focus once when it first opens
- After that, you can minimize the window and continue working
- The script automatically closes when all documents are processed

## Running Continuously

The browser stays open after completion. To run continuously:

1. Run the script: `npm run download-docs`
2. Wait for all downloads to complete
3. Press `Ctrl+C` to close
4. Run again to process next batch

You can also run in a loop by wrapping the script or running it periodically with a cron job.
