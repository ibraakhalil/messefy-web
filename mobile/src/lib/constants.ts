/**
 * Mobile API & Storage Constants
 */

// Default backend port is 5555 (Hono server)
const DEFAULT_API_URL = 'http://localhost:5555';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || DEFAULT_API_URL;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'messefy_auth_token',
  AUTH_USER: 'messefy_auth_user',
  ACTIVE_WORKSPACE_ID: 'messefy_active_workspace_id',
  THEME_PREFERENCE: 'messefy_theme_preference',
} as const;
