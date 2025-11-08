/**
 * Auth Feature Types
 * Authentication-specific types and interfaces
 */

import { User as OidcUser } from 'oidc-client-ts';

/**
 * Login credentials (if using username/password)
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: OidcUser | null;
  error: string | null;
}

/**
 * OIDC token response
 */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
}

/**
 * Session info
 */
export interface SessionInfo {
  expiresAt: number;
  issuedAt: number;
  subject: string;
}

/**
 * Auth error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  TOKEN_EXPIRED = 'token_expired',
  NETWORK_ERROR = 'network_error',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Auth error
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: unknown;
}

