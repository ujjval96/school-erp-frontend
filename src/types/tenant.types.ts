/**
 * Tenant & Multi-Tenancy Types
 */

import { ID } from './common.types';

export interface Tenant {
  id: ID;
  name: string;
  subdomain: string;
  type: TenantType;
  parentId?: ID | null;
  code?: string; // Branch code if type is BRANCH
  status: TenantStatus;
  branding: TenantBranding;
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export enum TenantType {
  SCHOOL = 'SCHOOL',
  BRANCH = 'BRANCH',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface TenantBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  favicon?: string;
}

export interface TenantSettings {
  academicYearStart: string; // Month-Day format: "04-01"
  attendanceGracePeriod: number; // minutes
  lowAttendanceThreshold: number; // percentage
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface TenantContext {
  subdomain: string | null;
  tenantId: ID | null;
  branding: TenantBranding | null;
}

