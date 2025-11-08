import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/environment';

/**
 * Create Axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper to check if error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // API error response
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    // HTTP status text
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    // Network error
    if (error.message) {
      return error.message;
    }
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Log API request details (development only)
 */
function logRequest(config: InternalAxiosRequestConfig): void {
  if (import.meta.env.DEV) {
    console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
      headers: {
        Authorization: config.headers.Authorization ? '***' : undefined,
        'x-tenant-subdomain': config.headers['x-tenant-subdomain'],
      },
    });
  }
}

/**
 * Log API response details (development only)
 */
function logResponse(response: {url?: string; status: number; data: unknown}): void {
  if (import.meta.env.DEV) {
    console.log(`🟢 API Response: ${response.status} ${response.url}`, response.data);
  }
}

/**
 * Log API error details (always)
 */
function logError(error: AxiosError): void {
  console.error(`🔴 API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
    status: error.response?.status,
    message: error.response?.data || error.message,
  });
}

export { logRequest, logResponse, logError };

