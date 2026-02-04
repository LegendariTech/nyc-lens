import chokidar, { type FSWatcher } from 'chokidar';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import OpenAI from 'openai';
import { query } from '@/data/db';

let watcher: FSWatcher | null = null;
let isActive = false;
let currentWatchFolder = '';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractDocumentId(fileName: string): string | null {
  // Extract document ID from filename patterns like:
  // "2026012900979003&page.pdf" -> "2026012900979003"
  // "2026012900979003-page.pdf" -> "2026012900979003"
  // "2026012900979003&page (33-36) 18.59.06 19.00.46.pdf" -> "2026012900979003"
  const match = fileName.match(/^(\d{16})[-&]page/);
  return match ? match[1] : null;
}

async function insertPdfUploadedRecord(documentId: string, filename: string): Promise<void> {
  try {
    await query(
      `INSERT INTO gold.acris_pdf_uploaded (document_id, filename, date_downloaded)
       VALUES (@documentId, @filename, GETDATE())`,
      {
        documentId,
        filename,
      }
    );
    console.log('💾 DB: Saved to acris_pdf_uploaded');
  } catch (error: any) {
    // If it's a duplicate key error, log but don't throw
    if (error.number === 2627 || error.code === 'EREQUEST') {
      console.log('💾 DB: Already in acris_pdf_uploaded');
    } else {
      console.error(`💾 DB: ✗ Failed to insert - ${error.message}`);
      throw error;
    }
  }
}

async function insertSignatorRecords(documentId: string, borrowers: any): Promise<void> {
  try {
    // Parse borrowers if it's a string
    let borrowersData = borrowers;
    if (typeof borrowers === 'string') {
      try {
        borrowersData = JSON.parse(borrowers);
      } catch (e) {
        console.error('💾 DB: ✗ Failed to parse borrowers');
        return;
      }
    }

    // Extract borrowers array
    const borrowersArray = borrowersData?.borrowers || [];

    if (!Array.isArray(borrowersArray) || borrowersArray.length === 0) {
      console.log('💾 DB: No signators to save');
      return;
    }

    // Insert each borrower as a signator record
    let insertedCount = 0;
    let duplicateCount = 0;

    for (const borrower of borrowersArray) {
      const signatorName = borrower.person_name || null;
      const signatorTitle = borrower.title || null;
      const signatorBusinessName = borrower.business_name || null;

      try {
        await query(
          `INSERT INTO gold.acris_signator
           (document_id, signator_name, signator_title, signator_business_name, due_date, error_message)
           VALUES (@documentId, @signatorName, @signatorTitle, @signatorBusinessName, NULL, NULL)`,
          {
            documentId,
            signatorName,
            signatorTitle,
            signatorBusinessName,
          }
        );
        insertedCount++;
      } catch (error: any) {
        // Check if it's a duplicate key violation (SQL Server error codes: 2627 for unique constraint, 2601 for unique index)
        if (error.number === 2627 || error.number === 2601) {
          duplicateCount++;
        } else {
          // Log other errors
          console.error(`💾 DB: ✗ Insert failed - ${error.message}`);
        }
      }
    }

    // Summary log
    if (insertedCount > 0 || duplicateCount > 0) {
      console.log(`💾 DB: Saved ${insertedCount} signator(s) to acris_signator${duplicateCount > 0 ? ` (${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} skipped)` : ''}`);
    }
  } catch (error: any) {
    console.error(`💾 DB: ✗ Failed - ${error.message}`);
  }
}

async function processWithOpenAI(ocrData: string, documentId: string | null): Promise<any> {
  try {
    console.log(`🤖 OpenAI: Starting extraction${documentId ? ` (doc: ${documentId})` : ''}...`);

    const response = await openai.responses.create({
      prompt: {
        id: "pmpt_6980de34d35c81939e55233252d0233b0c10dbc86a885ac6",
        version: "15"
      },
      input: ocrData,
    });

    // Log the full OpenAI response for debugging
    console.log('🤖 OpenAI: Full Response:', JSON.stringify(response, null, 2));

    // Extract and parse the structured output
    let extractedData = null;
    if (response.output_text) {
      try {
        extractedData = JSON.parse(response.output_text);
        const borrowerCount = extractedData?.borrowers?.length || 0;
        const borrowerNames = extractedData?.borrowers?.map((b: any) =>
          b.business_name || b.person_name || 'Unknown'
        ).join(', ') || 'None';

        console.log(`🤖 OpenAI: ✓ Extracted ${borrowerCount} borrower(s): ${borrowerNames}`);
      } catch (e) {
        console.log('🤖 OpenAI: ✓ Complete (raw text)');
      }
    }

    // Compact token usage logging
    if (response.usage) {
      const cachedTokens = response.usage.input_tokens_details?.cached_tokens || 0;
      const uncachedInputTokens = response.usage.input_tokens - cachedTokens;
      const inputCost = (uncachedInputTokens / 1000000) * 0.05;
      const cachedCost = (cachedTokens / 1000000) * 0.005;
      const outputCost = (response.usage.output_tokens / 1000000) * 0.40;
      const totalCost = inputCost + cachedCost + outputCost;

      console.log(`   Tokens: ${response.usage.total_tokens} total (${response.usage.input_tokens} in, ${response.usage.output_tokens} out) | Cost: $${totalCost.toFixed(4)}`);
    }

    // Return the parsed borrowers data instead of the full response
    return extractedData || response.output_text || response;
  } catch (error: any) {
    console.error(`🤖 OpenAI: ✗ Failed - ${error.message}`);
    throw error;
  }
}

async function processFileWithOCR(filePath: string, documentId: string | null): Promise<any> {
  try {
    const fileName = path.basename(filePath);
    console.log(`📄 OCR: Starting (file: ${fileName})...`);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(
      'https://mintel-dev.legendari.tech/ocr/from_pdf_file',
      formData,
      {
        headers: {
          'accept': 'application/json',
          ...formData.getHeaders(),
        },
      }
    );

    // Get summary info about OCR result
    const numPages = response.data?.num_pages || response.data?.ocr_data?.length || '?';
    const ocrTime = response.data?.time ? `${response.data.time.toFixed(2)}s` : '';
    console.log(`📄 OCR: ✓ Complete (${numPages} page(s)${ocrTime ? ', ' + ocrTime : ''})`);

    // Extract only the text content from OCR result to reduce token usage
    const ocrText = typeof response.data === 'string'
      ? response.data
      : response.data.text || JSON.stringify(response.data);

    // Process OCR result with OpenAI
    const openaiResult = await processWithOpenAI(ocrText, documentId);

    // Debug logging for signator insertion
    console.log(`💾 DB: Checking signator insertion - documentId: ${documentId ? 'exists' : 'missing'}, openaiResult: ${openaiResult ? 'exists' : 'missing'}`);

    // Insert signator records into database if document ID exists
    if (documentId && openaiResult) {
      console.log(`💾 DB: Calling insertSignatorRecords for document ${documentId}...`);
      await insertSignatorRecords(documentId, openaiResult);
    } else {
      console.log(`💾 DB: Skipping insertSignatorRecords - ${!documentId ? 'no document ID' : 'no OpenAI result'}`);
    }

    return {
      document_id: documentId,
      ocr: response.data,
      borrowers: openaiResult,
    };
  } catch (error: any) {
    if (error.response) {
      console.error(`📄 OCR: ✗ Failed (${error.response.status}) - ${error.message}`);
    } else {
      console.error(`📄 OCR: ✗ Failed - ${error.message}`);
    }
    throw error;
  }
}

export function getWatcherStatus() {
  return {
    isActive,
    watchFolder: currentWatchFolder,
  };
}

// Auto-start the file watcher when the module is loaded (server startup)
const DEFAULT_WATCH_FOLDER = '/Users/wice/www/nyc-lens/acris-pdfs';

// Initialize watcher on server startup
if (typeof window === 'undefined') {
  // Only run on server side
  setTimeout(() => {
    if (!isActive) {
      try {
        console.log('🚀 Auto-starting file watcher on server startup...');
        startWatcher(DEFAULT_WATCH_FOLDER);
      } catch (error) {
        console.error('Failed to auto-start file watcher:', error);
      }
    }
  }, 1000); // Small delay to ensure server is ready
}

export function startWatcher(watchFolder: string) {
  if (watcher) {
    console.log('File watcher is already running. Stopping existing watcher...');
    stopWatcher();
  }

  // Ensure the watch folder exists
  if (!fs.existsSync(watchFolder)) {
    try {
      fs.mkdirSync(watchFolder, { recursive: true });
      console.log(`Created watch folder: ${watchFolder}`);
    } catch (error) {
      console.error(`Failed to create watch folder: ${watchFolder}`, error);
      throw new Error(`Failed to create watch folder: ${watchFolder}`);
    }
  }

  console.log(`Starting file watcher on folder: ${watchFolder}`);

  watcher = chokidar.watch(watchFolder, {
    persistent: true,
    ignoreInitial: true, // Don't trigger events for files that already exist
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  });

  watcher
    .on('add', async (filePath) => {
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath).toLowerCase();
      const fileSize = fs.statSync(filePath).size;

      // Extract document ID immediately
      const documentId = extractDocumentId(fileName);

      // Compact file detection log
      const sizeKb = (fileSize / 1024).toFixed(1);
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      console.log('');
      console.log(`[${timestamp}] 📁 File dropped: ${fileName} (${sizeKb} KB)`);
      if (documentId) {
        console.log(`   Document ID: ${documentId}`);
      }

      // Only process PDF files
      if (fileExt !== '.pdf') {
        console.log(`   ⚠️  Skipped: Not a PDF file`);
        return;
      }

      // Insert database record if document ID was extracted
      if (documentId) {
        try {
          await insertPdfUploadedRecord(documentId, fileName);
        } catch (error) {
          console.error('Failed to insert database record, but continuing with processing...');
        }
      }

      // Process the PDF file with OCR service
      try {
        await processFileWithOCR(filePath, documentId);
      } catch (error) {
        // Error already logged in processFileWithOCR
      }
    })
    .on('error', (error) => {
      console.error('File watcher error:', error);
    })
    .on('ready', () => {
      console.log(`File watcher is ready and monitoring: ${watchFolder}`);
      isActive = true;
      currentWatchFolder = watchFolder;
    });

  return {
    isActive: true,
    watchFolder,
  };
}

export function stopWatcher() {
  if (watcher) {
    console.log('Stopping file watcher...');
    watcher.close();
    watcher = null;
    isActive = false;
    currentWatchFolder = '';
    console.log('File watcher stopped');
  }

  return {
    isActive: false,
    watchFolder: '',
  };
}
