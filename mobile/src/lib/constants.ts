/**
 * Mobile API & Storage Constants
 */

// Production backend API URL (Live server via Nginx reverse proxy)
export const PROD_API_URL = 'https://mess.softiklab.com/api';

// Development fallback (Local Hono server)
export const DEV_API_URL = 'http://localhost:5555';

// 1. In release/production build (import.meta.env.PROD === true), conditionally resolve to production API.
// 2. In local development (import.meta.env.DEV === true), conditionally resolve to localhost API.
export const API_BASE_URL: string = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || PROD_API_URL)
  : (import.meta.env.VITE_API_URL || DEV_API_URL);

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'messefy_auth_token',
  AUTH_USER: 'messefy_auth_user',
  ACTIVE_WORKSPACE_ID: 'messefy_active_workspace_id',
  THEME_PREFERENCE: 'messefy_theme_preference',
} as const;
