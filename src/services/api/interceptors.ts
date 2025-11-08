import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient, logRequest, logResponse, logError } from './apiClient';
import { getAccessToken, refreshToken } from '../oidc/oidcClient';
import { useTenantStore } from '@/store/tenantStore';

/**
 * Request Interceptor
 * Automatically adds authentication and tenant headers to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add authentication token
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant subdomain header
    const { subdomain } = useTenantStore.getState();
    if (subdomain) {
      config.headers['x-tenant-subdomain'] = subdomain;
    }

    // Log request (development only)
    logRequest(config);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios (success, errors, token refresh)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response (development only)
    logResponse({
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  async (error: AxiosError) => {
    logError(error);

    const originalRequest = error.config;

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = await refreshToken();

        if (user && user.access_token) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${user.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed, redirecting to login');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied - insufficient permissions');
      // Could redirect to forbidden page or show toast
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - check your connection');
    }

    return Promise.reject(error);
  }
);

// Add types for retry flag
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

