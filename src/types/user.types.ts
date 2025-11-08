/**
 * User & Authentication Types
 */

import { ID } from './common.types';

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: UserRole[];
  tenantId: ID;
  profilePhoto?: string;
  phone?: string;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// OIDC User (from oidc-client-ts)
export interface OIDCUser {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  profile: {
    sub: string;
    email: string;
    name: string;
    roles?: string[];
    tenant_id?: string;
  };
  expires_at: number;
  expired: boolean;
}

export interface AuthState {
  user: User | null;
  oidcUser: OIDCUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

