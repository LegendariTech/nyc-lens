/**
 * Utility functions to resolve NYC property tax codes to human-readable descriptions
 */

/**
 * Resolve taxable flag code to human-readable description
 * @param flag - 'T' = Taxable, 'A' = Actual, or blank
 * @returns Human-readable description
 */
export function resolveTaxableFlag(flag: string | null | undefined): string {
  if (!flag || flag.trim() === '') return 'Not Specified';
  
  const normalized = flag.trim().toUpperCase();
  
  switch (normalized) {
    case 'T':
      return 'Taxable';
    case 'A':
      return 'Actual';
    default:
      return flag;
  }
}

/**
 * Resolve condo suffix code to human-readable description
 * @param suffix - 'C' = Commercial, 'R' = Residential, or blank
 * @returns Human-readable description
 */
export function resolveCondoSuffix(suffix: string | null | undefined): string {
  if (!suffix || suffix.trim() === '') {
    return 'Entire condo (all residential or all commercial)';
  }
  
  const normalized = suffix.trim().toUpperCase();
  
  switch (normalized) {
    case 'C':
      return 'Commercial unit';
    case 'R':
      return 'Residential unit';
    default:
      return suffix;
  }
}

/**
 * Resolve building extension code to human-readable description
 * @param extension - 'E' = Extension, 'G' = Garage, 'EG' = Extension and Garage, or blank
 * @returns Human-readable description
 */
export function resolveBuildingExtension(extension: string | null | undefined): string {
  if (!extension || extension.trim() === '') return 'None';
  
  const normalized = extension.trim().toUpperCase();
  
  switch (normalized) {
    case 'E':
      return 'Extension';
    case 'G':
      return 'Garage';
    case 'EG':
      return 'Extension and Garage';
    default:
      return extension;
  }
}

/**
 * Resolve easement code to human-readable description
 * @param easement - Various codes (A, B, E, F-M, N, P, R, S, U) or blank
 * @returns Human-readable description
 */
export function resolveEasement(easement: string | null | undefined): string {
  if (!easement || easement.trim() === '') return 'No Easement';
  
  const normalized = easement.trim().toUpperCase();
  
  switch (normalized) {
    case 'A':
      return 'Air Rights';
    case 'B':
      return 'Non-Air Rights';
    case 'E':
      return 'Land Easement';
    case 'F':
    case 'G':
    case 'H':
    case 'I':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
      return 'Multiple Easements';
    case 'N':
      return 'Non-Transit';
    case 'P':
      return 'Piers';
    case 'R':
      return 'Railroads';
    case 'S':
      return 'Street';
    case 'U':
      return 'U.S. Government';
    default:
      return easement;
  }
}

/**
 * Get short description for taxable flag (for compact displays)
 */
export function getTaxableFlagShort(flag: string | null | undefined): string {
  if (!flag || flag.trim() === '') return '-';
  
  const normalized = flag.trim().toUpperCase();
  
  switch (normalized) {
    case 'T':
      return 'T';
    case 'A':
      return 'A';
    default:
      return flag;
  }
}

