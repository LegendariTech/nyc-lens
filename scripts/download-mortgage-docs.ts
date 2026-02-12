import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import sql from 'mssql';
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Parse CLI arguments
const args = process.argv.slice(2);
const TOTAL_DOCUMENTS = args[0] ? parseInt(args[0], 10) : 1; // First arg: total documents (default: 1)
const CONCURRENCY = args[1] ? parseInt(args[1], 10) : 1; // Second arg: concurrency (default: 1)

// Validate arguments
if (isNaN(TOTAL_DOCUMENTS) || TOTAL_DOCUMENTS < 1) {
  console.error('❌ Error: TOTAL_DOCUMENTS must be a positive number');
  console.log('Usage: npm run download-docs <limit> <concurrency>');
  console.log('Example: npm run download-docs 20 3');
  process.exit(1);
}

if (isNaN(CONCURRENCY) || CONCURRENCY < 1) {
  console.error('❌ Error: CONCURRENCY must be a positive number');
  console.log('Usage: npm run download-docs <limit> <concurrency>');
  console.log('Example: npm run download-docs 20 3');
  process.exit(1);
}

if (CONCURRENCY > TOTAL_DOCUMENTS) {
  console.warn(`⚠️  Warning: CONCURRENCY (${CONCURRENCY}) is greater than TOTAL_DOCUMENTS (${TOTAL_DOCUMENTS})`);
  console.warn(`   Setting CONCURRENCY to ${TOTAL_DOCUMENTS}`);
}

// Configuration
const DOWNLOAD_TIMEOUT = 180000; // Timeout for downloads in ms (3 minutes for large PDFs)
const DOWNLOAD_DIR = '/Users/wice/www/nyc-lens/acris-pdfs';
const CONTAINER_NAME = 'acris-documents-pdfs';

// Database configuration
const dbConfig: sql.config = {
  server: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Types
interface DocumentToDownload {
  document_id: string;
}

// Database connection pool
let pool: sql.ConnectionPool | null = null;

async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('✅ Database connection established');
  }
  return pool;
}

async function getDocumentsToDownload(limit: number): Promise<DocumentToDownload[]> {
  const db = await getPool();
  const result = await db.request().query<DocumentToDownload>(`
    SELECT TOP ${limit} document_id
    FROM (
      SELECT DISTINCT
        ap.latest_mortgage_document_id as document_id,
        MAX(ap.latest_mortgage_document_date) as latest_date
      FROM gold.acris_plus ap
      LEFT JOIN gold.downloaded_acris_documents dad
        ON ap.latest_mortgage_document_id = dad.document_id
      WHERE ap.latest_mortgage_document_id IS NOT NULL
        AND ap.latest_mortgage_document_id != ''
        AND (dad.document_id IS NULL OR dad.status = 'failed')
      GROUP BY ap.latest_mortgage_document_id
    ) as docs
    ORDER BY latest_date DESC, document_id ASC
  `);

  return result.recordset;
}

async function updateDocumentStatus(
  documentId: string,
  status: 'pending' | 'downloading' | 'completed' | 'failed',
  data?: {
    storagePath?: string;
    fileSizeBytes?: number;
    errorMessage?: string;
  }
): Promise<void> {
  const db = await getPool();
  const request = db.request();

  request.input('documentId', sql.VarChar(255), documentId);
  request.input('status', sql.VarChar(50), status);

  // Check if record exists
  const existing = await request.query(`
    SELECT id FROM gold.downloaded_acris_documents
    WHERE document_id = @documentId
  `);

  if (existing.recordset.length === 0) {
    // Insert new record
    const insertRequest = db.request();
    insertRequest.input('documentId', sql.VarChar(255), documentId);
    insertRequest.input('status', sql.VarChar(50), status);
    insertRequest.input('storagePath', sql.VarChar(512), data?.storagePath || null);
    insertRequest.input('fileSizeBytes', sql.BigInt, data?.fileSizeBytes || null);
    insertRequest.input('errorMessage', sql.NVarChar(sql.MAX), data?.errorMessage || null);

    await insertRequest.query(`
      INSERT INTO gold.downloaded_acris_documents
        (document_id, status, storage_path, file_size_bytes, error_message, downloaded_date, created_at, updated_at)
      VALUES
        (@documentId, @status, @storagePath, @fileSizeBytes, @errorMessage,
         ${status === 'completed' ? 'GETDATE()' : 'NULL'}, GETDATE(), GETDATE())
    `);
  } else {
    // Update existing record
    const updateRequest = db.request();
    updateRequest.input('documentId', sql.VarChar(255), documentId);
    updateRequest.input('status', sql.VarChar(50), status);
    updateRequest.input('storagePath', sql.VarChar(512), data?.storagePath || null);
    updateRequest.input('fileSizeBytes', sql.BigInt, data?.fileSizeBytes || null);
    updateRequest.input('errorMessage', sql.NVarChar(sql.MAX), data?.errorMessage || null);

    await updateRequest.query(`
      UPDATE gold.downloaded_acris_documents
      SET status = @status,
          storage_path = ${data?.storagePath ? '@storagePath' : 'storage_path'},
          file_size_bytes = ${data?.fileSizeBytes ? '@fileSizeBytes' : 'file_size_bytes'},
          error_message = ${data?.errorMessage ? '@errorMessage' : 'error_message'},
          downloaded_date = ${status === 'completed' ? 'GETDATE()' : 'downloaded_date'},
          updated_at = GETDATE()
      WHERE document_id = @documentId
    `);
  }
}

async function uploadToAzure(filePath: string, documentId: string): Promise<string> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: 'blob', // Public read access for blobs
  });

  // Upload the file
  const fileName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadFile(filePath, {
    blobHTTPHeaders: {
      blobContentType: 'application/pdf',
    },
  });

  return blockBlobClient.url;
}

async function downloadMortgageDocs() {
  console.log('🚀 Starting mortgage document download automation...');
  console.log(`📊 Configuration: ${TOTAL_DOCUMENTS} documents, concurrency ${CONCURRENCY}`);

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-features=TranslateUI',
      '--disable-popup-blocking',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 720 },
  });

  try {
    // Get documents to download from database
    console.log(`\n🔍 Querying database for documents to download...`);
    const documents = await getDocumentsToDownload(TOTAL_DOCUMENTS);

    if (documents.length === 0) {
      console.log('✨ No documents to download! All caught up.');
      await browser.close();
      return;
    }

    console.log(`✅ Found ${documents.length} document(s) to download`);

    // Track results
    let successCount = 0;
    let failureCount = 0;

    // Create reusable pages for each concurrent slot to avoid focus stealing
    console.log('🌐 Creating browser pages...');
    const reusablePages = await Promise.all(
      Array.from({ length: CONCURRENCY }, () => context.newPage())
    );
    console.log(`✅ Created ${reusablePages.length} browser page(s)`);

    // Process documents in batches based on concurrency
    for (let batchStart = 0; batchStart < documents.length; batchStart += CONCURRENCY) {
      const batchEnd = Math.min(batchStart + CONCURRENCY, documents.length);
      const batch = documents.slice(batchStart, batchEnd);
      const batchNum = Math.floor(batchStart / CONCURRENCY) + 1;
      const totalBatches = Math.ceil(documents.length / CONCURRENCY);

      console.log(`\n🔄 Batch ${batchNum}/${totalBatches}: Processing ${batch.length} document(s) in parallel...`);

      // Process all documents in this batch concurrently
      const batchPromises = batch.map(async (doc, batchIndex) => {
        // Reuse page for this slot instead of creating new ones
        const docPage = reusablePages[batchIndex];
        const globalIndex = batchStart + batchIndex;
        const documentId = doc.document_id;
        const docUrl = `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${documentId}`;
        const expectedFilename = `${documentId}&page.pdf`;
        let downloadedFilePath: string | null = null;

        try {
          console.log(`\n📄 [${globalIndex + 1}/${documents.length}] Processing document`);
          console.log(`   Document ID: ${documentId}`);
          console.log(`   Expected filename: ${expectedFilename}`);
          console.log(`   URL: ${docUrl}`);

          // Mark as downloading in database right before processing
          console.log(`   [${globalIndex + 1}] 💾 Marking as downloading in DB...`);
          await updateDocumentStatus(documentId, 'downloading');

          // Navigate to document (reusing existing page)
          await docPage.goto(docUrl, { waitUntil: 'load', timeout: 30000 });

          // Wait for the iframe to load
          console.log(`   [${globalIndex + 1}] ⏳ Waiting for PDF viewer to load...`);
          await docPage.waitForSelector('iframe[name="mainframe"]', { timeout: 20000 });
          await docPage.waitForTimeout(2000); // Wait for PDF to render

          // Get the iframe
          const iframe = docPage.frameLocator('iframe[name="mainframe"]');

          // Click the Save button
          console.log(`   [${globalIndex + 1}] 💾 Clicking Save button...`);
          await iframe.getByRole('cell', { name: 'Save' }).click();

          // Wait for save dialog
          await docPage.waitForTimeout(500);

          // Listen for download event with longer timeout for large files
          const downloadPromise = docPage.waitForEvent('download', { timeout: DOWNLOAD_TIMEOUT });

          // Click OK to confirm save (All pages option is already selected by default)
          console.log(`   [${globalIndex + 1}] ✅ Clicking OK to confirm save...`);
          await iframe.getByText('OK').click();

          // Wait for download to start and get the proper filename
          console.log(`   [${globalIndex + 1}] ⏳ Waiting for download (timeout: ${DOWNLOAD_TIMEOUT / 1000}s)...`);
          const download = await downloadPromise;
          const suggestedFilename = download.suggestedFilename();

          console.log(`   [${globalIndex + 1}] 📦 Download started: ${suggestedFilename}`);

          // Save with proper filename
          downloadedFilePath = path.join(DOWNLOAD_DIR, suggestedFilename);
          await download.saveAs(downloadedFilePath);

          console.log(`   [${globalIndex + 1}] 💾 File saved locally: ${downloadedFilePath}`);

          // Get file size
          const stats = fs.statSync(downloadedFilePath);
          const fileSizeBytes = stats.size;
          const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(2);
          console.log(`   [${globalIndex + 1}] 📏 File size: ${fileSizeMB} MB`);

          // Upload to Azure
          console.log(`   [${globalIndex + 1}] ☁️  Uploading to Azure Blob Storage...`);
          const blobUrl = await uploadToAzure(downloadedFilePath, documentId);
          console.log(`   [${globalIndex + 1}] ✅ Uploaded to: ${blobUrl}`);

          // Mark as completed in database
          console.log(`   [${globalIndex + 1}] 💾 Marking as completed in DB...`);
          await updateDocumentStatus(documentId, 'completed', {
            storagePath: blobUrl,
            fileSizeBytes: fileSizeBytes,
          });

          console.log(`   [${globalIndex + 1}] ✅ Complete!`);

          successCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`\n❌ [${globalIndex + 1}] Failed:`, errorMessage);

          // Mark as failed in database
          try {
            await updateDocumentStatus(documentId, 'failed', {
              errorMessage: errorMessage,
            });
            console.log(`   [${globalIndex + 1}] 💾 Marked as failed in DB`);
          } catch (dbError) {
            console.error(`   [${globalIndex + 1}] ⚠️  Failed to update DB:`, dbError);
          }

          failureCount++;
        } finally {
          // Clean up local file if it exists
          if (downloadedFilePath && fs.existsSync(downloadedFilePath)) {
            try {
              fs.unlinkSync(downloadedFilePath);
              console.log(`   [${globalIndex + 1}] 🗑️  Deleted local file: ${path.basename(downloadedFilePath)}`);
            } catch (e) {
              console.warn(`   [${globalIndex + 1}] ⚠️  Failed to delete local file:`, e);
            }
          }
        }
      });

      // Wait for all documents in this batch to complete
      await Promise.all(batchPromises);
      console.log(`✅ Batch ${batchNum}/${totalBatches} complete!`);

      // Small delay between batches
      if (batchEnd < documents.length) {
        console.log('   ⏸️  Pausing before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n✨ Download process complete!');
    console.log(`📊 Results: ${successCount} succeeded, ${failureCount} failed (out of ${documents.length} total)`);
    if (failureCount > 0) {
      console.log(`⚠️  Some downloads failed (check database for error messages)`);
    }

    // Close reusable pages
    console.log('\n🧹 Cleaning up browser pages...');
    for (const page of reusablePages) {
      try {
        await page.close();
      } catch (e) {
        // Ignore errors when closing
      }
    }

    console.log('✅ All done! Closing browser...');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close database connection
    if (pool) {
      await pool.close();
      console.log('🔌 Database connection closed');
    }
    await browser.close();
    console.log('🏁 Browser closed');
  }
}

// Run the script
downloadMortgageDocs().catch(console.error);
