/**
 * Authentication utility functions for token management
 */

// Token storage key
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Store authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
