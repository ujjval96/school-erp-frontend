import { useTenantStore } from '@/store/tenantStore';
import { extractSubdomain } from '@/utils/tenantUtils';

/**
 * useTenant Hook
 * Provides access to tenant context and actions
 */
export function useTenant() {
  const { subdomain, tenantId, branding, setTenant, setBranding, clearTenant } = useTenantStore();

  /**
   * Initialize tenant from URL subdomain
   */
  const initializeTenant = () => {
    const detectedSubdomain = extractSubdomain();

    if (detectedSubdomain && detectedSubdomain !== subdomain) {
      // Subdomain changed, clear existing tenant data
      // Backend will provide tenantId when fetching tenant info
      setTenant(detectedSubdomain, '', undefined);
    }

    return detectedSubdomain;
  };

  /**
   * Check if tenant is initialized
   */
  const isInitialized = (): boolean => {
    return !!subdomain && !!tenantId;
  };

  /**
   * Get primary color from branding or default
   */
  const getPrimaryColor = (): string => {
    return branding?.primaryColor || '#1976d2';
  };

  /**
   * Get logo URL from branding
   */
  const getLogoUrl = (): string | undefined => {
    return branding?.logo;
  };

  return {
    // State
    subdomain,
    tenantId,
    branding,

    // Actions
    setTenant,
    setBranding,
    clearTenant,
    initializeTenant,

    // Utilities
    isInitialized,
    getPrimaryColor,
    getLogoUrl,
  };
}

