import { STORAGE_KEYS } from './constants';
import type { UserProfile } from '@/types/api';

export const authStorage = {
  // Token
  getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.error('Failed to save token to storage', e);
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Failed to remove token from storage', e);
    }
  },

  // User Profile
  getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? (JSON.parse(data) as UserProfile) : null;
    } catch {
      return null;
    }
  },

  setUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to storage', e);
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (e) {
      console.error('Failed to remove user from storage', e);
    }
  },

  // Active Workspace / Mess ID
  getActiveWorkspaceId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
    } catch {
      return null;
    }
  },

  setActiveWorkspaceId(workspaceId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID, workspaceId);
    } catch (e) {
      console.error('Failed to save workspace ID to storage', e);
    }
  },

  removeActiveWorkspaceId(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKSPACE_ID);
    } catch (e) {
      console.error('Failed to remove workspace ID from storage', e);
    }
  },

  // Clear all session data
  clearSession(): void {
    this.removeToken();
    this.removeUser();
    this.removeActiveWorkspaceId();
  },
};
