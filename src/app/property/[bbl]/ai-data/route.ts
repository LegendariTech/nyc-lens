import { NextRequest, NextResponse } from 'next/server';
import { fetchPlutoData } from '@/data/pluto';
import { fetchPropertyByBBL, fetchTransactionsWithParties } from '@/data/acris';
import { fetchOwnerContacts } from '@/data/contacts';
import { fetchPropertyValuation } from '@/data/valuation';
import { formatCurrency, formatDateMMDDYYYY } from '@/utils/formatters';
import { BUILDING_CLASS_CODE_MAP } from '@/constants/building';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bbl: string }> }
) {
  const { bbl } = await context.params;

  try {
    // Fetch all property data in parallel
    const [plutoResult, acrisResult, contactsResult, valuationResult, transactionsResult] = await Promise.all([
      fetchPlutoData(bbl),
      fetchPropertyByBBL(bbl),
      fetchOwnerContacts(bbl),
      fetchPropertyValuation(bbl),
      fetchTransactionsWithParties(bbl),
    ]);

    const plutoData = plutoResult.data;
    const propertyData = acrisResult;
    const contactsData = contactsResult.data;
    const valuationData = valuationResult.data;
    const transactions = transactionsResult;

    // Build comprehensive text output
    let output = '';

    // Header
    output += '='.repeat(80) + '\n';
    output += 'PROPERTY INFORMATION REPORT\n';
    output += '='.repeat(80) + '\n\n';

    // Basic Property Information
    output += 'BASIC INFORMATION\n';
    output += '-'.repeat(80) + '\n';
    output += `BBL (Borough-Block-Lot): ${bbl}\n`;
    if (plutoData?.address) output += `Address: ${plutoData.address}\n`;
    if (plutoData?.zipcode) output += `ZIP Code: ${plutoData.zipcode}\n`;
    if (plutoData?.bldgclass) {
      const buildingClassDesc = BUILDING_CLASS_CODE_MAP[plutoData.bldgclass] || '';
      output += `Building Class: ${plutoData.bldgclass}${buildingClassDesc ? ` - ${buildingClassDesc}` : ''}\n`;
    }
    if (plutoData?.yearbuilt && Number(plutoData.yearbuilt) > 0) output += `Year Built: ${plutoData.yearbuilt}\n`;
    if (plutoData?.numfloors && Number(plutoData.numfloors) > 0) output += `Number of Floors: ${plutoData.numfloors}\n`;
    if (plutoData?.unitsres && Number(plutoData.unitsres) > 0) output += `Residential Units: ${plutoData.unitsres}\n`;
    if (plutoData?.unitstotal && Number(plutoData.unitstotal) > 0) output += `Total Units: ${plutoData.unitstotal}\n`;
    output += '\n';

    // Property Dimensions
    if (plutoData) {
      output += 'PROPERTY DIMENSIONS\n';
      output += '-'.repeat(80) + '\n';
      if (plutoData.lotarea && Number(plutoData.lotarea) > 0) output += `Lot Area: ${Number(plutoData.lotarea).toLocaleString()} sq ft\n`;
      if (plutoData.bldgarea && Number(plutoData.bldgarea) > 0) output += `Building Area: ${Number(plutoData.bldgarea).toLocaleString()} sq ft\n`;
      if (plutoData.lotfront && Number(plutoData.lotfront) > 0) output += `Lot Frontage: ${plutoData.lotfront} ft\n`;
      if (plutoData.lotdepth && Number(plutoData.lotdepth) > 0) output += `Lot Depth: ${plutoData.lotdepth} ft\n`;
      output += '\n';
    }

    // Zoning Information
    if (plutoData?.zonedist1) {
      output += 'ZONING INFORMATION\n';
      output += '-'.repeat(80) + '\n';
      output += `Primary Zoning District: ${plutoData.zonedist1}\n`;
      if (plutoData.zonedist2) output += `Secondary Zoning District: ${plutoData.zonedist2}\n`;
      if (plutoData.overlay1) output += `Overlay District 1: ${plutoData.overlay1}\n`;
      if (plutoData.overlay2) output += `Overlay District 2: ${plutoData.overlay2}\n`;
      output += '\n';
    }

    // Current Ownership (from ACRIS)
    if (propertyData) {
      output += 'CURRENT OWNERSHIP\n';
      output += '-'.repeat(80) + '\n';
      if (propertyData.buyer_name) output += `Recorded Owner: ${propertyData.buyer_name}\n`;
      if (propertyData.sale_document_date) output += `Sale Date: ${formatDateMMDDYYYY(propertyData.sale_document_date)}\n`;
      if (propertyData.sale_document_amount && propertyData.sale_document_amount > 0) {
        output += `Sale Amount: ${formatCurrency(propertyData.sale_document_amount)}\n`;
      }

      // Extract unmasked owner from contacts with source "signator"
      const unmaskedOwners = contactsData?.filter(
        (contact) => contact.source?.includes('signator')
      ) || [];

      if (unmaskedOwners.length > 0) {
        const unmaskedOwner = unmaskedOwners[0];
        if (unmaskedOwner.owner_master_full_name) {
          output += `Unmasked Owner Name: ${unmaskedOwner.owner_master_full_name}\n`;
        }
        if (unmaskedOwner.owner_full_address && unmaskedOwner.owner_full_address.length > 0) {
          output += `Unmasked Owner Address: ${unmaskedOwner.owner_full_address[0]}\n`;
        }
        if (unmaskedOwner.owner_phone && unmaskedOwner.owner_phone.length > 0) {
          const phones = unmaskedOwner.owner_phone.filter((p: string) => p && p !== 'N/A');
          if (phones.length > 0) {
            output += `Unmasked Owner Phone: ${phones.join(', ')}\n`;
          }
        }
      }
      output += '\n';
    }

    // Current Mortgage Information
    if (propertyData && (propertyData.lender_name || propertyData.mortgage_document_amount)) {
      output += 'CURRENT MORTGAGE INFORMATION\n';
      output += '-'.repeat(80) + '\n';
      if (propertyData.lender_name) output += `Lender: ${propertyData.lender_name}\n`;
      if (propertyData.borrower_name) output += `Borrower: ${propertyData.borrower_name}\n`;
      if (propertyData.mortgage_document_date) output += `Mortgage Date: ${formatDateMMDDYYYY(propertyData.mortgage_document_date)}\n`;
      if (propertyData.mortgage_document_amount && propertyData.mortgage_document_amount > 0) {
        output += `Mortgage Amount: ${formatCurrency(propertyData.mortgage_document_amount)}\n`;
      }
      output += '\n';
    }

    // Tax Assessment Information (All Years)
    if (valuationData && valuationData.length > 0) {
      output += 'TAX ASSESSMENT INFORMATION (ALL YEARS)\n';
      output += '-'.repeat(80) + '\n';
      output += `Total Assessment Records: ${valuationData.length}\n\n`;

      valuationData.forEach((valuation, index) => {
        const isLatestYear = index === 0;
        if (isLatestYear) {
          output += '>>> LATEST TAX YEAR <<<\n';
        }

        if (valuation.year) output += `Tax Year: ${valuation.year}\n`;

        // Final values (most reliable)
        if (valuation.finacttot && valuation.finacttot > 0) {
          output += `  Total Assessed Value: ${formatCurrency(valuation.finacttot)}\n`;
        }
        if (valuation.finactland && valuation.finactland > 0) {
          output += `  Assessed Land Value: ${formatCurrency(valuation.finactland)}\n`;
        }
        if (valuation.finmkttot && valuation.finmkttot > 0) {
          output += `  Market Value: ${formatCurrency(valuation.finmkttot)}\n`;
        }
        if (valuation.finactextot && valuation.finactextot > 0) {
          output += `  Tax Exemptions: ${formatCurrency(valuation.finactextot)}\n`;
        }
        if (valuation.fintaxclass) {
          output += `  Tax Class: ${valuation.fintaxclass}\n`;
        }

        // Current values (if different from final)
        if (valuation.curacttot && valuation.curacttot !== valuation.finacttot) {
          output += `  Current Assessed Total: ${formatCurrency(valuation.curacttot)}\n`;
        }
        if (valuation.curmkttot && valuation.curmkttot !== valuation.finmkttot) {
          output += `  Current Market Value: ${formatCurrency(valuation.curmkttot)}\n`;
        }

        if (isLatestYear) {
          output += '>>> END LATEST TAX YEAR <<<\n';
        }
        output += '\n';
      });
    }

    // Property Contacts (ALL CONTACTS)
    if (contactsData && contactsData.length > 0) {
      output += 'PROPERTY CONTACTS (ALL CONTACTS)\n';
      output += '-'.repeat(80) + '\n';
      output += `Total Contacts: ${contactsData.length}\n\n`;

      contactsData.forEach((contact, index: number) => {
        output += `Contact #${index + 1}:\n`;
        if (contact.owner_master_full_name) output += `  Name: ${contact.owner_master_full_name}\n`;

        // Show all full names if multiple
        if (contact.owner_full_name && contact.owner_full_name.length > 0) {
          output += `  All Names: ${contact.owner_full_name.join(', ')}\n`;
        }

        if (contact.owner_title && contact.owner_title.length > 0) {
          output += `  Title: ${contact.owner_title.join(', ')}\n`;
        }
        if (contact.owner_business_name && contact.owner_business_name.length > 0) {
          output += `  Business: ${contact.owner_business_name.join(', ')}\n`;
        }
        if (contact.owner_phone && contact.owner_phone.length > 0) {
          const phones = contact.owner_phone.filter(p => p && p !== 'N/A');
          if (phones.length > 0) {
            output += `  Phone Numbers: ${phones.join(', ')}\n`;
          }
        }
        if (contact.owner_full_address && contact.owner_full_address.length > 0) {
          output += `  Addresses:\n`;
          contact.owner_full_address.forEach(addr => {
            output += `    - ${addr}\n`;
          });
        }
        if (contact.source && contact.source.length > 0) {
          output += `  Data Sources: ${contact.source.join(', ')}\n`;
        }
        if (contact.status) {
          output += `  Status: ${contact.status}\n`;
        }
        if (contact.date) {
          output += `  Date: ${formatDateMMDDYYYY(String(contact.date))}\n`;
        }
        output += '\n';
      });
    }

    // Transaction History (ALL TRANSACTIONS)
    if (transactions && transactions.length > 0) {
      output += 'TRANSACTION HISTORY (ALL TRANSACTIONS)\n';
      output += '-'.repeat(80) + '\n';
      output += `Total Transactions: ${transactions.length}\n\n`;

      transactions.forEach((transaction, index: number) => {
        output += `Transaction #${index + 1}:\n`;
        if (transaction.documentDate) output += `  Date: ${formatDateMMDDYYYY(transaction.documentDate)}\n`;
        if (transaction.documentId) output += `  Document ID: ${transaction.documentId}\n`;
        if (transaction.documentType) output += `  Type: ${transaction.docTypeDescription || transaction.documentType}\n`;
        if (transaction.classCodeDescription) output += `  Class: ${transaction.classCodeDescription}\n`;
        if (transaction.documentAmount && transaction.documentAmount > 0) {
          output += `  Amount: ${formatCurrency(transaction.documentAmount)}\n`;
        }

        // Transaction category flags
        const categories = [];
        if (transaction.isDeed) categories.push('Deed');
        if (transaction.isMortgage) categories.push('Mortgage');
        if (transaction.isUccLien) categories.push('UCC Lien');
        if (transaction.isOtherDocument) categories.push('Other');
        if (categories.length > 0) {
          output += `  Category: ${categories.join(', ')}\n`;
        }

        // Simple party summary
        if (transaction.fromParty && transaction.fromParty.length > 0) {
          output += `  From Party (${transaction.party1Type || 'Party'}): ${transaction.fromParty.join(', ')}\n`;
        }
        if (transaction.toParty && transaction.toParty.length > 0) {
          output += `  To Party (${transaction.party2Type || 'Party'}): ${transaction.toParty.join(', ')}\n`;
        }

        // Detailed parties involved
        if (transaction.partyDetails && transaction.partyDetails.length > 0) {
          output += '  Detailed Party Information:\n';
          transaction.partyDetails.forEach((party) => {
            if (party.name) {
              output += `    - ${party.type || 'Party'}: ${party.name}\n`;
              const address = [party.address1, party.address2, party.city, party.state, party.zip]
                .filter(Boolean)
                .join(', ');
              if (address) output += `      Address: ${address}\n`;
              if (party.country && party.country !== 'US' && party.country !== 'USA') {
                output += `      Country: ${party.country}\n`;
              }
            }
          });
        }
        output += '\n';
      });
    }

    // Footer
    output += '='.repeat(80) + '\n';
    output += 'END OF REPORT\n';
    output += '='.repeat(80) + '\n';

    // Return as plain text
    return new NextResponse(output, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating AI data:', error);
    return new NextResponse(
      `Error: ${error instanceof Error ? error.message : 'Failed to generate property data'}`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  }
}
