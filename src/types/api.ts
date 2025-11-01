import type { ServerSideGetRowsRequest } from '@/utils/agGrid';
import type { AcrisDoc, AcrisParty, AcrisRecord } from './acris';
import type { PropertyValuation } from './valuation';

/**
 * API Request/Response types for /api/acris/* endpoints
 */

// Base response type for all ACRIS endpoints
export interface AcrisApiResponse<T> {
  rows: T[];
  total: number;
}

// Error response
export interface ApiErrorResponse {
  error: string;
}

// ===== /api/acris/documents =====

export interface AcrisDocumentsRequest {
  borough: string;
  block: string;
  lot: string;
  request?: Partial<ServerSideGetRowsRequest>;
}

export type AcrisDocumentsResponse = AcrisApiResponse<AcrisDoc>;

// ===== /api/acris/parties =====

export interface AcrisPartiesRequest {
  documentId: string;
  request?: Partial<ServerSideGetRowsRequest>;
}

export type AcrisPartiesResponse = AcrisApiResponse<AcrisParty>;

// ===== /api/acris/properties =====

export interface AcrisPropertiesRequest {
  request?: Partial<ServerSideGetRowsRequest>;
}

export type AcrisPropertiesResponse = AcrisApiResponse<AcrisRecord>;

