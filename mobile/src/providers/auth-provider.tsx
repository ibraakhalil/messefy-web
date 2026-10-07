import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/auth-context';
import { authStorage } from '@/lib/auth-storage';
import { authService, type LoginInput, type RegisterInput } from '@/services/auth-service';
import type { UserProfile } from '@/types/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authStorage.getUser());
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    authStorage.clearSession();
    setUser(null);
    setToken(null);
  }, []);

  // Validate session on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authStorage.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const freshUser = await authService.getCurrentUser();
        setUser(freshUser);
        authStorage.setUser(freshUser);
      } catch (err) {
        console.warn('Failed to refresh user profile from server:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for 401 unauthorized event from api-client
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials: LoginInput) => {
    const session = await authService.login(credentials);
    authStorage.setToken(session.token);
    authStorage.setUser(session.user);
    setToken(session.token);
    setUser(session.user);
  };

  const register = async (userData: RegisterInput) => {
    const session = await authService.register(userData);
    authStorage.setToken(session.token);
    authStorage.setUser(session.user);
    setToken(session.token);
    setUser(session.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
