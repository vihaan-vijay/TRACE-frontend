'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export type UserRole = 'ADMIN' | 'POLICE' | 'FORENSIC' | 'JUDGE' | 'ORG_ADMIN' | 'SUPERVISOR' | 'INVESTIGATOR' | 'FORENSIC_REVIEWER' | 'ATTORNEY' | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  badgeNumber: string;
  role: UserRole;
  department: string;
  securityClearance: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  badgeNumber: string;
  role: UserRole;
  department: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const savedToken = localStorage.getItem('ev-token');
    const savedUser = localStorage.getItem('ev-user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ev-token');
        localStorage.removeItem('ev-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials.');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ev-token', data.token);
      localStorage.setItem('ev-user', JSON.stringify(data.user));
    } catch (err: unknown) {
      // Fail-closed: Never manufacture fallback or simulated sessions
      const message = err instanceof Error ? err.message : 'Authentication failed. Please check credentials or server connection.';
      setError(message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('ev-token');
      localStorage.removeItem('ev-user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (regData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ev-token', data.token);
      localStorage.setItem('ev-user', JSON.stringify(data.user));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ev-token');
    localStorage.removeItem('ev-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      error: null,
      clearError: () => {},
    };
  }
  return ctx;
}
