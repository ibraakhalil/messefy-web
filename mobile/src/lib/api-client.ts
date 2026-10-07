import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './constants';
import { authStorage } from './auth-storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Active Workspace Header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const workspaceId = authStorage.getActiveWorkspaceId();
    if (workspaceId && config.headers) {
      config.headers['x-workspace-id'] = workspaceId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401) {
      // Clear local session on unauthenticated response
      authStorage.clearSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'নেটওয়ার্ক বা সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';

    return Promise.reject(new Error(customMessage));
  }
);
