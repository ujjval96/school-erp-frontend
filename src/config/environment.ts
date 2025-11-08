/**
 * Environment Configuration
 * Validates and exports environment variables from import.meta.env
 */

function getEnvVar(key: keyof ImportMetaEnv, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
}

// API Configuration
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL');

// OIDC Configuration
export const OIDC_AUTHORITY = getEnvVar('VITE_OIDC_AUTHORITY');
export const OIDC_CLIENT_ID = getEnvVar('VITE_OIDC_CLIENT_ID');
export const OIDC_CLIENT_SECRET = getEnvVar('VITE_OIDC_CLIENT_SECRET', '');
export const OIDC_REDIRECT_URI = getEnvVar('VITE_OIDC_REDIRECT_URI');
export const OIDC_POST_LOGOUT_REDIRECT_URI = getEnvVar('VITE_OIDC_POST_LOGOUT_REDIRECT_URI');
export const OIDC_SCOPES = getEnvVar('VITE_OIDC_SCOPES');

// App Configuration
export const APP_NAME = getEnvVar('VITE_APP_NAME', 'School ERP');
export const APP_VERSION = getEnvVar('VITE_APP_VERSION', '1.0.0');
export const LOG_LEVEL = getEnvVar('VITE_LOG_LEVEL', 'info');

// Feature Flags
export const FEATURE_ONLINE_PAYMENT = getEnvVar('VITE_FEATURE_ONLINE_PAYMENT', 'false') === 'true';
export const FEATURE_SMS_NOTIFICATIONS = getEnvVar('VITE_FEATURE_SMS_NOTIFICATIONS', 'false') === 'true';

// Environment Type
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// Validation
if (IS_PROD) {
  if (!API_BASE_URL.startsWith('https://')) {
    console.warn('⚠️ Production API should use HTTPS');
  }
  if (!OIDC_AUTHORITY.startsWith('https://')) {
    console.warn('⚠️ Production OIDC should use HTTPS');
  }
}

// Log configuration in development
if (IS_DEV) {
  console.log('🔧 Environment Configuration:', {
    API_BASE_URL,
    OIDC_AUTHORITY,
    OIDC_CLIENT_ID,
    APP_NAME,
    APP_VERSION,
    FEATURE_ONLINE_PAYMENT,
    FEATURE_SMS_NOTIFICATIONS,
  });
}

