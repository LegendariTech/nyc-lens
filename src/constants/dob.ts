/**
 * DOB (Department of Buildings) Constants
 * Constants related to DOB job applications, filings, and status codes
 */

/**
 * DOB Job Status Codes and Descriptions
 * Job status codes used in DOB job application filings
 */
export const DOB_JOB_STATUS_CODE_MAP: Record<string, { status: string; description: string }> = {
  A: { status: 'PRE-FILED', description: 'PRE-FILING' },
  B: { status: 'A/P UNPAID', description: 'APPLICATION PROCESSED - PART-NO PAYMENT' },
  C: { status: 'A/P TO D.E.A.R', description: 'APPLICATION PROCESSED - PAYMENT ONLY' },
  D: { status: 'A/P ENTIRE', description: 'APPLICATION PROCESSED - COMPLETED' },
  E: { status: 'AP-NPE', description: 'APPLICATION PROCESSED - NO PLAN EXAM' },
  F: { status: 'ASSIGNED TO P/E', description: 'APPLICATION ASSIGNED TO PLAN EXAMINER' },
  G: { status: 'PAA FEE DUE', description: 'PAA FEE DUE' },
  H: { status: 'P/E IN PROCESS', description: 'PLAN EXAM - IN PROCESS' },
  I: { status: 'SIGNOFF', description: 'SIGN-OFF (ARA)' },
  J: { status: 'P/E DISAPPROVED', description: 'PLAN EXAM - DISAPPROVED' },
  K: { status: 'P/E PARTIAL APRV', description: 'PLAN EXAM - PARTIAL APPROVAL' },
  L: { status: 'P/E PAA $ PENDING', description: 'P/E PAA - PENDING FEE ESTIMATION' },
  M: { status: 'P/E PAA $ RESOLVD', description: 'P/E PAA - FEE RESOLVED' },
  P: { status: 'APPROVED', description: 'PLAN EXAM - APPROVED' },
  Q: { status: 'PERMIT-PARTIAL', description: 'PERMIT ISSUED - PARTIAL JOB' },
  R: { status: 'PERMIT - ENTIRE', description: 'PERMIT ISSUED - ENTIRE JOB/WORK' },
  U: { status: 'COMPLETED', description: 'COMPLETED' },
  X: { status: 'SIGNED-OFF', description: 'SIGNED-OFF' },
  '3': { status: 'SUSPENDED', description: 'SUSPENDED' },
};

/**
 * Get DOB job status information from status code
 * @param statusCode - Job status code (e.g., 'A', 'P', 'R')
 * @returns Object with status and description, or null if not found
 */
export function getDobJobStatusInfo(statusCode: string | null): { status: string; description: string } | null {
  if (!statusCode) return null;
  return DOB_JOB_STATUS_CODE_MAP[statusCode.toUpperCase()] || null;
}

/**
 * Get DOB job status display string from status code
 * @param statusCode - Job status code (e.g., 'A', 'P', 'R')
 * @returns Formatted status string or the code itself if not found
 */
export function getDobJobStatusDisplay(statusCode: string | null): string {
  if (!statusCode) return 'N/A';
  const statusInfo = getDobJobStatusInfo(statusCode);
  return statusInfo ? `${statusInfo.status} - ${statusInfo.description}` : statusCode;
}

/**
 * DOB Job Type Codes and Descriptions
 * Job type codes used in DOB job application filings
 */
export const DOB_JOB_TYPE_CODE_MAP: Record<string, { type: string; description: string }> = {
  A1: {
    type: 'Alteration Type I',
    description: 'A major alteration that will change the use, egress, or occupancy of the building.'
  },
  A2: {
    type: 'Alteration Type II',
    description: 'An application with multiple types of work that do not affect the use, egress, or occupancy of the building.'
  },
  A3: {
    type: 'Alteration Type III',
    description: "One type of minor work that doesn't affect the use, egress, or occupancy of the building."
  },
  NB: {
    type: 'New Building',
    description: 'An application to build a new structure. "NB" cannot be selected if any existing building elements are to remain—for example a part of an old foundation, a portion of a façade that will be incorporated into the construction, etc.'
  },
  DM: {
    type: 'Demolition',
    description: 'An application to fully or partially demolish an existing building.'
  },
  PA: {
    type: 'Place of Assembly',
    description: 'A Place of Assembly (PA) Certificate of Operation is required for premises where 75 or more members of the public gather indoors or 200 or more gather outdoors, for religious, recreational, educational, political, or social purposes, or to consume food or drink. This type of job filing is related to a NB or A1.'
  },
  SC: {
    type: 'Subdivision Condominiums',
    description: 'The division of a tax lot into several smaller tax lots allowing each condominium to have its own tax lot.'
  },
  SI: {
    type: 'Subdivision Improved',
    description: 'An improved subdivision is when one lot is being broken into several smaller lots. The Department of Finance must assign new lot numbers to subdivisions.'
  },
};

/**
 * Get DOB job type information from job type code
 * @param jobTypeCode - Job type code (e.g., 'A1', 'NB', 'DM')
 * @returns Object with type and description, or null if not found
 */
export function getDobJobTypeInfo(jobTypeCode: string | null): { type: string; description: string } | null {
  if (!jobTypeCode) return null;
  return DOB_JOB_TYPE_CODE_MAP[jobTypeCode.toUpperCase()] || null;
}

/**
 * Get DOB job type display string from job type code
 * @param jobTypeCode - Job type code (e.g., 'A1', 'NB', 'DM')
 * @returns Formatted job type string or the code itself if not found
 */
export function getDobJobTypeDisplay(jobTypeCode: string | null): string {
  if (!jobTypeCode) return 'N/A';
  const jobTypeInfo = getDobJobTypeInfo(jobTypeCode);
  return jobTypeInfo ? `${jobTypeInfo.type}` : jobTypeCode;
}
