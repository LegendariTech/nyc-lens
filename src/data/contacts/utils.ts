import type { OwnerContact } from '@/types/contacts';
import DuplicateDetector from './DuplicateDetector';

/**
 * Formatted contact with combined address and phone fields
 * - City, state, and zip fields are removed as they're combined into owner_address
 * - owner_address becomes an array of formatted addresses
 * - owner_phone becomes an array of phone numbers
 * - Secondary address and phone fields are removed
 * - owner_first_name and owner_last_name are removed (only owner_full_name is kept)
 */
export type FormattedOwnerContact = Omit<
    OwnerContact,
    | 'owner_city'
    | 'owner_state'
    | 'owner_zip'
    | 'owner_city_2'
    | 'owner_state_2'
    | 'owner_zip_2'
    | 'owner_address'
    | 'owner_address_2'
    | 'owner_phone'
    | 'owner_phone_2'
    | 'owner_first_name'
    | 'owner_last_name'
> & {
    owner_address: string[];
    owner_phone: string[];
};

/**
 * Check if a value is considered "N/A" or similar placeholder
 * Common variations: "N/A", "n/a", "NA", "na", "N.A.", "n.a."
 */
function isNAValue(value: string | null | undefined): boolean {
    if (!value) return false;

    const normalized = value.trim().toLowerCase();
    const naPatterns = [
        'n/a',
        'na',
        'n.a.',
        'n.a',
        'n a',
        'not available',
        'not applicable',
    ];

    return naPatterns.includes(normalized);
}

/**
 * Reformat name from "LASTNAME, FIRSTNAME" to "FIRSTNAME LASTNAME"
 * Examples:
 *   "KEONG, LUCIAN" -> "LUCIAN KEONG"
 *   "SMITH, JOHN" -> "JOHN SMITH"
 *   "DOE, JANE MARIE" -> "JANE MARIE DOE"
 *   '"KEONG, LUCIAN   "' -> "LUCIAN KEONG"
 * 
 * @param name - Name string that may be in "LASTNAME, FIRSTNAME" format
 * @returns Reformatted name or original if not in the expected format
 */
function reformatName(name: string | null | undefined): string | null {
    if (!name || !name.trim()) return name || null;

    // Remove surrounding quotes (single or double) and trim whitespace
    let trimmed = name.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        trimmed = trimmed.slice(1, -1).trim();
    }

    // If empty after removing quotes, return null
    if (!trimmed) return null;

    // Check if name contains a comma
    if (!trimmed.includes(',')) {
        return trimmed;
    }

    // Split by comma and trim each part (removes extra spaces)
    const parts = trimmed.split(',').map(part => part.trim()).filter(part => part.length > 0);

    // Only reformat if we have exactly 2 parts (lastname, firstname)
    if (parts.length === 2 && parts[0] && parts[1]) {
        // Return as "FIRSTNAME LASTNAME" with normalized spacing
        return `${parts[1]} ${parts[0]}`.trim();
    }

    // Return original if format doesn't match expected pattern
    return trimmed;
}

/**
 * Clean up a single contact record by replacing N/A values with null
 * and reformatting names from "LASTNAME, FIRSTNAME" to "FIRSTNAME LASTNAME"
 * 
 * Currently handles:
 * - owner_business_name: N/A values replaced with null
 * - owner_full_name: Reformatted from "LASTNAME, FIRSTNAME" to "FIRSTNAME LASTNAME"
 * - owner_first_name: Extracted from reformatted name if originally in full_name
 * - owner_last_name: Extracted from reformatted name if originally in full_name
 * 
 * @param contact - The contact record to clean
 * @returns A new contact record with cleaned data
 */
export function cleanupContact(contact: OwnerContact): OwnerContact {
    // Reformat owner_full_name if it exists
    const reformattedFullName = reformatName(contact.owner_full_name);

    // If we reformatted the full name and don't have separate first/last names,
    // try to extract them from the reformatted name
    let firstName = contact.owner_first_name;
    let lastName = contact.owner_last_name;

    if (reformattedFullName && reformattedFullName !== contact.owner_full_name) {
        // Name was reformatted, extract first and last names if they're not already set
        const nameParts = reformattedFullName.split(' ');
        if (nameParts.length >= 2) {
            // If first/last names are empty or match the original format, update them
            if (!firstName || firstName.trim() === '') {
                firstName = nameParts.slice(0, -1).join(' '); // Everything except last word
            }
            if (!lastName || lastName.trim() === '') {
                lastName = nameParts[nameParts.length - 1]; // Last word
            }
        }
    }

    return {
        ...contact,
        owner_business_name: isNAValue(contact.owner_business_name)
            ? null
            : contact.owner_business_name,
        owner_full_name: reformattedFullName,
        owner_first_name: firstName,
        owner_last_name: lastName,
    };
}

/**
 * Clean up multiple contact records
 * 
 * @param contacts - Array of contact records to clean
 * @returns Array of cleaned contact records
 */
export function cleanupContacts(contacts: OwnerContact[]): OwnerContact[] {
    return contacts.map(cleanupContact);
}

/**
 * Format an address from individual components
 * Combines street, city, state, and zip into a single formatted string
 * 
 * Format: "Street, City, State Zip"
 * Example: "123 Main St, New York, NY 10001"
 * 
 * @param street - Street address
 * @param city - City name
 * @param state - State abbreviation
 * @param zip - Zip code
 * @returns Formatted address string or null if all components are empty
 */
function formatAddress(
    street: string | null | undefined,
    city: string | null | undefined,
    state: string | null | undefined,
    zip: string | null | undefined
): string | null {
    const parts: string[] = [];

    // Add street if present
    if (street && street.trim()) {
        parts.push(street.trim());
    }

    // Build city/state/zip portion
    const cityStateParts: string[] = [];
    if (city && city.trim()) {
        cityStateParts.push(city.trim());
    }

    // Combine state and zip on same line
    const stateZipParts: string[] = [];
    if (state && state.trim()) {
        stateZipParts.push(state.trim());
    }
    if (zip && zip.trim()) {
        stateZipParts.push(zip.trim());
    }

    if (stateZipParts.length > 0) {
        cityStateParts.push(stateZipParts.join(' '));
    }

    if (cityStateParts.length > 0) {
        parts.push(cityStateParts.join(', '));
    }

    // Return null if no parts, otherwise join with comma
    return parts.length > 0 ? parts.join(', ') : null;
}

/**
 * Reformat address fields in a contact record
 * Combines individual address components into formatted address strings
 * 
 * @param contact - The contact record to reformat
 * @returns A new contact record with reformatted addresses
 */
export function reformatContactAddresses(contact: OwnerContact): OwnerContact {
    return {
        ...contact,
        owner_address: formatAddress(
            contact.owner_address,
            contact.owner_city,
            contact.owner_state,
            contact.owner_zip
        ),
        owner_address_2: formatAddress(
            contact.owner_address_2,
            contact.owner_city_2,
            contact.owner_state_2,
            contact.owner_zip_2
        ),
        // Clear the individual city/state/zip fields since they're now in the address
        owner_city: null,
        owner_state: null,
        owner_zip: null,
        owner_city_2: null,
        owner_state_2: null,
        owner_zip_2: null,
    };
}

/**
 * Reformat addresses for multiple contact records
 * 
 * @param contacts - Array of contact records to reformat
 * @returns Array of contact records with reformatted addresses
 */
export function reformatContactsAddresses(contacts: OwnerContact[]): OwnerContact[] {
    return contacts.map(reformatContactAddresses);
}

/**
 * Deduplicate an array of addresses using DuplicateDetector
 * Removes duplicate and similar addresses (e.g., case variations, minor formatting differences)
 * 
 * @param addresses - Array of address strings to deduplicate
 * @param threshold - Similarity threshold for address matching (default: 0.85)
 * @returns Array of unique addresses (keeps the canonical form from each duplicate cluster)
 */
function deduplicateAddresses(
    addresses: string[],
    threshold: number = 0.85
): string[] {
    if (addresses.length <= 1) return addresses;

    // Filter out empty addresses and trim
    const nonEmptyAddresses = addresses
        .filter(addr => addr && addr.trim())
        .map(addr => addr.trim());

    if (nonEmptyAddresses.length <= 1) return nonEmptyAddresses;

    // First, remove exact duplicates (case-sensitive exact matches)
    const seenExact = new Set<string>();
    const uniqueAddresses: string[] = [];
    for (const addr of nonEmptyAddresses) {
        if (!seenExact.has(addr)) {
            seenExact.add(addr);
            uniqueAddresses.push(addr);
        }
    }

    if (uniqueAddresses.length <= 1) return uniqueAddresses;

    // Then use DuplicateDetector to find similar duplicates (case variations, formatting differences)
    const detector = new DuplicateDetector({ threshold });
    const duplicateResult = detector.findDuplicates(uniqueAddresses);

    // If no similar duplicates found, return unique addresses
    if (duplicateResult.clusters.length === 0) {
        return uniqueAddresses;
    }

    // Build a set of addresses that are duplicates (to be removed)
    const duplicateAddresses = new Set<string>();

    for (const cluster of duplicateResult.clusters) {
        if (cluster.items.length > 1) {
            // Keep the canonical form, mark all others as duplicates
            const canonical = cluster.canonicalForm;

            for (const item of cluster.items) {
                if (item.original !== canonical) {
                    duplicateAddresses.add(item.original);
                }
            }
        }
    }

    // Return addresses that are either:
    // 1. Canonical forms from clusters, or
    // 2. Not in any cluster (unique addresses)
    return uniqueAddresses.filter(addr => !duplicateAddresses.has(addr));
}

/**
 * Apply all cleanup and formatting transformations to a contact
 * This is the main function to use for processing raw contact data
 * 
 * Transformations applied:
 * 1. Clean up N/A values in owner_business_name
 * 2. Reformat and combine address fields into an array
 * 3. Combine phone fields into an array
 * 4. Deduplicate addresses within the contact
 * 
 * @param contact - The raw contact record to process
 * @returns A formatted contact with cleaned and combined data
 */
export function formatContact(contact: OwnerContact): FormattedOwnerContact {
    // Apply cleanup transformations
    const cleaned = cleanupContact(contact);

    // Apply address reformatting
    const reformatted = reformatContactAddresses(cleaned);

    // Combine addresses into array (filter out null/empty values)
    const addresses: string[] = [];
    if (reformatted.owner_address && reformatted.owner_address.trim()) {
        addresses.push(reformatted.owner_address.trim());
    }
    if (reformatted.owner_address_2 && reformatted.owner_address_2.trim()) {
        addresses.push(reformatted.owner_address_2.trim());
    }

    // Combine phones into array (filter out null/empty values)
    const phones: string[] = [];
    if (reformatted.owner_phone && reformatted.owner_phone.trim()) {
        phones.push(reformatted.owner_phone.trim());
    }
    if (reformatted.owner_phone_2 && reformatted.owner_phone_2.trim()) {
        phones.push(reformatted.owner_phone_2.trim());
    }

    // Remove redundant fields and return with arrays
    // These variables are intentionally unused - they're destructured to exclude them from the result
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        owner_city,
        owner_state,
        owner_zip,
        owner_city_2,
        owner_state_2,
        owner_zip_2,
        owner_address,
        owner_address_2,
        owner_phone,
        owner_phone_2,
        owner_first_name,
        owner_last_name,
        ...rest
    } = reformatted;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // Deduplicate addresses within this contact
    // Use a higher threshold (0.90) for addresses to avoid deduplicating addresses with different street numbers
    const deduplicatedAddresses = deduplicateAddresses(addresses, 0.90);

    return {
        ...rest,
        owner_address: deduplicatedAddresses,
        owner_phone: phones,
    };
}

/**
 * Apply all cleanup and formatting transformations to multiple contacts
 * This is the main function to use for processing arrays of raw contact data
 * 
 * @param contacts - Array of raw contact records to process
 * @returns Array of formatted contacts with cleaned and combined data
 */
export function formatContacts(contacts: OwnerContact[]): FormattedOwnerContact[] {
    return contacts.map(formatContact);
}

/**
 * Deduplicate contacts by similar owner_full_name, matching agency and source
 * Combines phones, addresses, and business names from duplicates into master contact
 * 
 * @param contacts - Array of formatted contacts to deduplicate
 * @param threshold - Similarity threshold for name matching (default: 0.85)
 * @returns Array of deduplicated contacts
 */
export function deduplicateContacts(
    contacts: FormattedOwnerContact[],
    threshold: number = 0.85
): FormattedOwnerContact[] {
    if (contacts.length === 0) return [];

    // Create duplicate detector
    const detector = new DuplicateDetector({ threshold });

    // Group contacts by agency and source for efficient comparison
    // Exception: for 'dob' agency, only group by agency (ignore source)
    const contactsByAgencySource = new Map<string, FormattedOwnerContact[]>();

    for (const contact of contacts) {
        // For 'dob' agency, only use agency for grouping (ignore source)
        // For other agencies, use both agency and source
        const agency = contact.agency || 'null';
        let key: string;
        if (agency.toLowerCase() === 'dob') {
            key = agency;
        } else {
            key = `${agency}|${contact.source || 'null'}`;
        }

        if (!contactsByAgencySource.has(key)) {
            contactsByAgencySource.set(key, []);
        }
        contactsByAgencySource.get(key)!.push(contact);
    }

    const deduplicated: FormattedOwnerContact[] = [];
    const processedContacts = new Set<FormattedOwnerContact>();

    // Process each agency/source group separately
    for (const [, groupContacts] of contactsByAgencySource) {
        if (groupContacts.length === 0) continue;

        // Filter out contacts where both owner_full_name and owner_business_name are empty
        const validContacts = groupContacts.filter(contact => {
            const hasName = contact.owner_full_name && contact.owner_full_name.trim();
            const hasBusinessName = contact.owner_business_name && contact.owner_business_name.trim();
            return hasName || hasBusinessName;
        });

        // Separate contacts into categories
        const contactsWithNames = validContacts.filter(
            c => c.owner_full_name && c.owner_full_name.trim()
        );
        const contactsWithBusinessNamesOnly = validContacts.filter(
            c => (!c.owner_full_name || !c.owner_full_name.trim()) &&
                (c.owner_business_name && c.owner_business_name.trim())
        );

        // Process contacts with business names only (deduplicate by business name)
        if (contactsWithBusinessNamesOnly.length > 0) {
            // Create a map of business name to contacts
            const businessNameToContacts = new Map<string, FormattedOwnerContact[]>();
            for (const contact of contactsWithBusinessNamesOnly) {
                const businessName = contact.owner_business_name!.trim();
                if (!businessNameToContacts.has(businessName)) {
                    businessNameToContacts.set(businessName, []);
                }
                businessNameToContacts.get(businessName)!.push(contact);
            }

            // Handle exact business name matches
            for (const [, contactsWithSameBusinessName] of businessNameToContacts) {
                if (contactsWithSameBusinessName.length > 1) {
                    // These are exact duplicates by business name - merge them
                    let masterContact = contactsWithSameBusinessName[0];
                    let maxDataCompleteness = getDataCompleteness(masterContact);

                    for (const contact of contactsWithSameBusinessName.slice(1)) {
                        const completeness = getDataCompleteness(contact);
                        if (completeness > maxDataCompleteness) {
                            masterContact = contact;
                            maxDataCompleteness = completeness;
                        }
                    }

                    // Combine all unique data from exact duplicates
                    const allAddresses: string[] = [];
                    const combinedPhones = new Set<string>();
                    const combinedBusinessNames = new Set<string>();
                    let maxDate: Date | null = null;

                    for (const contact of contactsWithSameBusinessName) {
                        if (contact.owner_address) {
                            contact.owner_address.forEach(addr => {
                                if (addr && addr.trim()) {
                                    allAddresses.push(addr.trim());
                                }
                            });
                        }
                        if (contact.owner_phone) {
                            contact.owner_phone.forEach(phone => {
                                if (phone && phone.trim()) {
                                    combinedPhones.add(phone.trim());
                                }
                            });
                        }
                        if (contact.owner_business_name && contact.owner_business_name.trim()) {
                            combinedBusinessNames.add(contact.owner_business_name.trim());
                        }
                        if (contact.date) {
                            const contactDate = contact.date instanceof Date ? contact.date : new Date(contact.date);
                            if (!maxDate || contactDate > maxDate) {
                                maxDate = contactDate;
                            }
                        }
                    }

                    // Deduplicate addresses
                    const deduplicatedAddresses = deduplicateAddresses(allAddresses, 0.90);

                    const mergedContact: FormattedOwnerContact = {
                        ...masterContact,
                        owner_address: deduplicatedAddresses,
                        owner_phone: Array.from(combinedPhones),
                        owner_business_name: combinedBusinessNames.size > 0
                            ? Array.from(combinedBusinessNames).join(', ')
                            : masterContact.owner_business_name,
                        date: maxDate || masterContact.date,
                    };

                    deduplicated.push(mergedContact);
                    contactsWithSameBusinessName.forEach(contact => processedContacts.add(contact));
                } else {
                    // Single contact with this business name - add it directly
                    if (!processedContacts.has(contactsWithSameBusinessName[0])) {
                        deduplicated.push(contactsWithSameBusinessName[0]);
                        processedContacts.add(contactsWithSameBusinessName[0]);
                    }
                }
            }

            // Handle similar business names using similarity detection
            const remainingBusinessNameContacts = contactsWithBusinessNamesOnly.filter(c => !processedContacts.has(c));
            if (remainingBusinessNameContacts.length > 0) {
                const remainingBusinessNameToContacts = new Map<string, FormattedOwnerContact[]>();
                for (const contact of remainingBusinessNameContacts) {
                    const businessName = contact.owner_business_name!.trim();
                    if (!remainingBusinessNameToContacts.has(businessName)) {
                        remainingBusinessNameToContacts.set(businessName, []);
                    }
                    remainingBusinessNameToContacts.get(businessName)!.push(contact);
                }

                const uniqueBusinessNames = Array.from(remainingBusinessNameToContacts.keys());
                const duplicateResult = detector.findDuplicates(uniqueBusinessNames);

                for (const cluster of duplicateResult.clusters) {
                    const clusterContacts: FormattedOwnerContact[] = [];

                    for (const item of cluster.items) {
                        const contactsWithBusinessName = remainingBusinessNameToContacts.get(item.original);
                        if (contactsWithBusinessName) {
                            clusterContacts.push(...contactsWithBusinessName);
                        }
                    }

                    if (clusterContacts.length <= 1) continue;

                    let masterContact = clusterContacts[0];
                    let maxDataCompleteness = getDataCompleteness(masterContact);

                    for (const contact of clusterContacts.slice(1)) {
                        const completeness = getDataCompleteness(contact);
                        if (completeness > maxDataCompleteness) {
                            masterContact = contact;
                            maxDataCompleteness = completeness;
                        }
                    }

                    const allAddresses: string[] = [];
                    const combinedPhones = new Set<string>();
                    const combinedBusinessNames = new Set<string>();
                    let maxDate: Date | null = null;

                    for (const contact of clusterContacts) {
                        if (contact.owner_address) {
                            contact.owner_address.forEach(addr => {
                                if (addr && addr.trim()) {
                                    allAddresses.push(addr.trim());
                                }
                            });
                        }
                        if (contact.owner_phone) {
                            contact.owner_phone.forEach(phone => {
                                if (phone && phone.trim()) {
                                    combinedPhones.add(phone.trim());
                                }
                            });
                        }
                        if (contact.owner_business_name && contact.owner_business_name.trim()) {
                            combinedBusinessNames.add(contact.owner_business_name.trim());
                        }
                        if (contact.date) {
                            const contactDate = contact.date instanceof Date ? contact.date : new Date(contact.date);
                            if (!maxDate || contactDate > maxDate) {
                                maxDate = contactDate;
                            }
                        }
                    }

                    const deduplicatedAddresses = deduplicateAddresses(allAddresses, 0.90);

                    const mergedContact: FormattedOwnerContact = {
                        ...masterContact,
                        owner_address: deduplicatedAddresses,
                        owner_phone: Array.from(combinedPhones),
                        owner_business_name: combinedBusinessNames.size > 0
                            ? Array.from(combinedBusinessNames).join(', ')
                            : masterContact.owner_business_name,
                        date: maxDate || masterContact.date,
                    };

                    deduplicated.push(mergedContact);
                    clusterContacts.forEach(contact => processedContacts.add(contact));
                }

                // Add remaining business name contacts that weren't part of any cluster
                for (const contact of remainingBusinessNameContacts) {
                    if (!processedContacts.has(contact)) {
                        deduplicated.push(contact);
                        processedContacts.add(contact);
                    }
                }
            }
        }

        if (contactsWithNames.length === 0) continue;

        // Create a map of name to contacts (handle multiple contacts with same name)
        const nameToContacts = new Map<string, FormattedOwnerContact[]>();
        for (const contact of contactsWithNames) {
            const name = contact.owner_full_name!.trim();
            if (!nameToContacts.has(name)) {
                nameToContacts.set(name, []);
            }
            nameToContacts.get(name)!.push(contact);
        }

        // First, handle exact matches (same name) - these should always be deduplicated
        for (const [, contactsWithSameName] of nameToContacts) {
            if (contactsWithSameName.length > 1) {
                // These are exact duplicates by name - merge them
                let masterContact = contactsWithSameName[0];
                let maxDataCompleteness = getDataCompleteness(masterContact);

                for (const contact of contactsWithSameName.slice(1)) {
                    const completeness = getDataCompleteness(contact);
                    if (completeness > maxDataCompleteness) {
                        masterContact = contact;
                        maxDataCompleteness = completeness;
                    }
                }

                // Combine all unique data from exact duplicates
                const allAddresses: string[] = [];
                const combinedPhones = new Set<string>();
                const combinedBusinessNames = new Set<string>();
                let maxDate: Date | null = null;

                for (const contact of contactsWithSameName) {
                    if (contact.owner_address) {
                        contact.owner_address.forEach(addr => {
                            if (addr && addr.trim()) {
                                allAddresses.push(addr.trim());
                            }
                        });
                    }
                    if (contact.owner_phone) {
                        contact.owner_phone.forEach(phone => {
                            if (phone && phone.trim()) {
                                combinedPhones.add(phone.trim());
                            }
                        });
                    }
                    if (contact.owner_business_name && contact.owner_business_name.trim()) {
                        combinedBusinessNames.add(contact.owner_business_name.trim());
                    }
                    if (contact.date) {
                        const contactDate = contact.date instanceof Date ? contact.date : new Date(contact.date);
                        if (!maxDate || contactDate > maxDate) {
                            maxDate = contactDate;
                        }
                    }
                }

                // Deduplicate addresses using DuplicateDetector
                // Use a higher threshold (0.90) for addresses to avoid deduplicating addresses with different street numbers
                const deduplicatedAddresses = deduplicateAddresses(allAddresses, 0.90);

                const mergedContact: FormattedOwnerContact = {
                    ...masterContact,
                    owner_address: deduplicatedAddresses,
                    owner_phone: Array.from(combinedPhones),
                    owner_business_name: combinedBusinessNames.size > 0
                        ? Array.from(combinedBusinessNames).join(', ')
                        : masterContact.owner_business_name,
                    date: maxDate || masterContact.date,
                };

                deduplicated.push(mergedContact);
                contactsWithSameName.forEach(contact => processedContacts.add(contact));
            }
        }

        // Now handle similar but not identical names using similarity detection
        // Only process contacts that haven't been deduplicated yet
        const remainingContacts = contactsWithNames.filter(c => !processedContacts.has(c));
        if (remainingContacts.length === 0) continue;

        // Create a new map for remaining contacts
        const remainingNameToContacts = new Map<string, FormattedOwnerContact[]>();
        for (const contact of remainingContacts) {
            const name = contact.owner_full_name!.trim();
            if (!remainingNameToContacts.has(name)) {
                remainingNameToContacts.set(name, []);
            }
            remainingNameToContacts.get(name)!.push(contact);
        }

        // Extract unique names for duplicate detection
        const uniqueNames = Array.from(remainingNameToContacts.keys());

        // Find duplicates within this group
        const duplicateResult = detector.findDuplicates(uniqueNames);

        // Process each cluster
        for (const cluster of duplicateResult.clusters) {
            // Collect all contacts in this cluster
            const clusterContacts: FormattedOwnerContact[] = [];

            for (const item of cluster.items) {
                const contactsWithName = remainingNameToContacts.get(item.original);
                if (contactsWithName) {
                    clusterContacts.push(...contactsWithName);
                }
            }

            if (clusterContacts.length <= 1) continue;

            // Select master contact (one with most complete data)
            let masterContact = clusterContacts[0];
            let maxDataCompleteness = getDataCompleteness(masterContact);

            for (const contact of clusterContacts.slice(1)) {
                const completeness = getDataCompleteness(contact);
                if (completeness > maxDataCompleteness) {
                    masterContact = contact;
                    maxDataCompleteness = completeness;
                }
            }

            // Combine all unique data from duplicates
            const allAddresses: string[] = [];
            const combinedPhones = new Set<string>();
            const combinedBusinessNames = new Set<string>();
            let maxDate: Date | null = null;

            for (const contact of clusterContacts) {
                // Add addresses (already arrays in FormattedOwnerContact)
                if (contact.owner_address) {
                    contact.owner_address.forEach(addr => {
                        if (addr && addr.trim()) {
                            allAddresses.push(addr.trim());
                        }
                    });
                }

                // Add phones (already arrays in FormattedOwnerContact)
                if (contact.owner_phone) {
                    contact.owner_phone.forEach(phone => {
                        if (phone && phone.trim()) {
                            combinedPhones.add(phone.trim());
                        }
                    });
                }

                // Add business names
                if (contact.owner_business_name && contact.owner_business_name.trim()) {
                    combinedBusinessNames.add(contact.owner_business_name.trim());
                }

                // Track maximum date (most recent)
                if (contact.date) {
                    const contactDate = contact.date instanceof Date ? contact.date : new Date(contact.date);
                    if (!maxDate || contactDate > maxDate) {
                        maxDate = contactDate;
                    }
                }
            }

            // Deduplicate addresses using DuplicateDetector
            // Use a higher threshold (0.90) for addresses to avoid deduplicating addresses with different street numbers
            const deduplicatedAddresses = deduplicateAddresses(allAddresses, 0.90);

            // Create merged contact
            const mergedContact: FormattedOwnerContact = {
                ...masterContact,
                owner_address: deduplicatedAddresses,
                owner_phone: Array.from(combinedPhones),
                owner_business_name: combinedBusinessNames.size > 0
                    ? Array.from(combinedBusinessNames).join(', ')
                    : masterContact.owner_business_name,
                date: maxDate || masterContact.date, // Use max date, fallback to master's date
            };

            deduplicated.push(mergedContact);

            // Mark all contacts in this cluster as processed
            clusterContacts.forEach(contact => processedContacts.add(contact));
        }

        // Add contacts that weren't part of any duplicate cluster
        // Note: contactsWithoutNames were already added above
        for (const contact of contactsWithNames) {
            if (!processedContacts.has(contact)) {
                deduplicated.push(contact);
            }
        }
    }

    return deduplicated;
}

/**
 * Calculate data completeness score for a contact
 * Used to select the best master contact when merging duplicates
 */
function getDataCompleteness(contact: FormattedOwnerContact): number {
    let score = 0;

    if (contact.owner_full_name) score += 10;
    if (contact.owner_business_name) score += 5;
    if (contact.owner_address && contact.owner_address.length > 0) {
        score += contact.owner_address.length * 3;
    }
    if (contact.owner_phone && contact.owner_phone.length > 0) {
        score += contact.owner_phone.length * 2;
    }
    if (contact.owner_type) score += 2;
    if (contact.owner_title) score += 1;

    return score;
}
