/**
 * Mobile API & Storage Constants
 */

// Production backend API URL (Live server via Nginx reverse proxy)
const PROD_API_URL = 'https://mess.softiklab.com/api';

// Development fallback (Local Hono server)
const DEV_API_URL = 'http://localhost:5555';

// 1. If VITE_API_URL is explicitly provided via env (.env.production / .env.development), use it.
// 2. Otherwise, if building for production/release (import.meta.env.PROD === true), use PROD_API_URL automatically.
// 3. Otherwise (local dev mode), fallback to DEV_API_URL.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.PROD ? PROD_API_URL : DEV_API_URL);

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'messefy_auth_token',
  AUTH_USER: 'messefy_auth_user',
  ACTIVE_WORKSPACE_ID: 'messefy_active_workspace_id',
  THEME_PREFERENCE: 'messefy_theme_preference',
} as const;
