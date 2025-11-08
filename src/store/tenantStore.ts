import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TenantContext, TenantBranding, ID } from '@/types';

interface TenantStore extends TenantContext {
  // Actions
  setTenant: (subdomain: string, tenantId: ID, branding?: TenantBranding) => void;
  setBranding: (branding: TenantBranding) => void;
  clearTenant: () => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      // State
      subdomain: null,
      tenantId: null,
      branding: null,

      // Actions
      setTenant: (subdomain, tenantId, branding) =>
        set({
          subdomain,
          tenantId,
          branding: branding || null,
        }),

      setBranding: (branding) =>
        set((state) => ({
          ...state,
          branding,
        })),

      clearTenant: () =>
        set({
          subdomain: null,
          tenantId: null,
          branding: null,
        }),
    }),
    {
      name: 'tenant-context', // localStorage key
      partialize: (state) => ({
        subdomain: state.subdomain,
        tenantId: state.tenantId,
        branding: state.branding,
      }),
    }
  )
);

