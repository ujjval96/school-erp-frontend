/**
 * API Response Types
 * Standard API response structures
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export interface ValidationError extends ApiError {
  field: string;
  constraints: Record<string, string>;
}

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ApiRequestConfig {
  method: ApiMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

