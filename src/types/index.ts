/**
 * Type Exports
 * Centralized export of all types
 */

// Common Types
export * from './common.types';
export * from './api.types';
export * from './user.types';
export * from './tenant.types';

// Re-export for convenience
export type { ID, Address, EmergencyContact, PaginationParams, PaginatedResponse, DateRange } from './common.types';
export type { ApiResponse, ApiError, ApiErrorResponse, ValidationError } from './api.types';
export type { User, OIDCUser, AuthState } from './user.types';
export { UserRole, UserStatus } from './user.types';
export type { Tenant, TenantBranding, TenantSettings, TenantContext } from './tenant.types';
export { TenantType, TenantStatus } from './tenant.types';

