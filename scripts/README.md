# Mortgage Document Download Script

This script automates downloading mortgage documents from NYC ACRIS and uploading them to Azure Blob Storage.

## What it does

1. **Queries database** for unprocessed mortgage documents (not downloaded or failed downloads)
2. **Downloads PDFs** from ACRIS using Playwright automation
3. **Uploads to Azure Blob Storage** (container: `acris-documents-pdfs`)
4. **Tracks progress** in `gold.downloaded_acris_documents` table
5. **Cleans up** local files after successful upload
6. **Processes in batches** with configurable concurrency

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

Run the script using npm:

```bash
npm run download-docs
```

Or run directly with npx:

```bash
npx tsx scripts/download-mortgage-docs.ts
```

## Configuration

Edit these constants in `download-mortgage-docs.ts`:

- `TOTAL_DOCUMENTS`: Total number of documents to download (default: `20`)
- `CONCURRENCY`: Number of documents to process simultaneously (default: `3`)
- `DOWNLOAD_TIMEOUT`: Timeout for each download in milliseconds (default: `180000` = 3 minutes)
- `DOWNLOAD_DIR`: Temporary local directory for downloads (default: `/Users/wice/www/nyc-lens/acris-pdfs`)
- `CONTAINER_NAME`: Azure blob container name (default: `'acris-documents-pdfs'`)
- `headless`: Set to `true` in the `chromium.launch()` call to run without opening a browser window

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
- **Downloaded** temporarily to `/Users/wice/www/nyc-lens/acris-pdfs/`
- **Uploaded** to Azure Blob Storage container `acris-documents-pdfs`
- **Deleted** from local disk after successful upload

Filenames follow pattern: `{document_id}&page.pdf` (e.g., `2026020200271002&page.pdf`)

## Concurrency Example

With `TOTAL_DOCUMENTS = 9` and `CONCURRENCY = 3`:

- **Batch 1/3**: Downloads docs 1-3 → Uploads all 3 → Deletes local files → ✅ Complete
- **Batch 2/3**: Downloads docs 4-6 → Uploads all 3 → Deletes local files → ✅ Complete
- **Batch 3/3**: Downloads docs 7-9 → Uploads all 3 → Deletes local files → ✅ Complete

This prevents overwhelming either the ACRIS server or Azure Storage while maintaining good throughput.

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

## Running Continuously

The browser stays open after completion. To run continuously:

1. Run the script: `npm run download-docs`
2. Wait for all downloads to complete
3. Press `Ctrl+C` to close
4. Run again to process next batch

You can also run in a loop by wrapping the script or running it periodically with a cron job.
