/**
 * Tenant Utilities
 * Helper functions for tenant/subdomain management
 */

/**
 * Extract subdomain from current URL hostname
 * Examples:
 * - school1.localhost:5173 → "school1"
 * - school1.school.com → "school1"
 * - localhost:5173 → "default"
 * - school.com → null (main domain)
 */
export function extractSubdomain(): string | null {
  const hostname = window.location.hostname;

  // Handle localhost patterns
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    // Pattern: school1.localhost
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0];
    }
    // Pattern: localhost (no subdomain)
    return 'default';
  }

  // Handle production patterns: school1.school.com
  const parts = hostname.split('.');

  // If more than 2 parts, first part is subdomain
  if (parts.length > 2) {
    return parts[0];
  }

  // No subdomain (main domain)
  return null;
}

/**
 * Validate if subdomain is valid
 */
export function isValidSubdomain(subdomain: string | null): boolean {
  if (!subdomain) return false;

  // Check subdomain format (alphanumeric and hyphens, 3-63 characters)
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain);
}

/**
 * Get full URL for a subdomain
 */
export function getSubdomainUrl(subdomain: string): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';

  if (window.location.hostname.includes('localhost')) {
    return `${protocol}//${subdomain}.localhost${port}`;
  }

  // Extract base domain (e.g., school.com from school1.school.com)
  const parts = window.location.hostname.split('.');
  const baseDomain = parts.slice(-2).join('.');

  return `${protocol}//${subdomain}.${baseDomain}${port}`;
}

