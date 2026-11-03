import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

/* =============================================
   Auth Context – provides auth state to entire app
   ============================================= */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);  // true while checking session
  const [error, setError]             = useState(null);

  /** Check if user is already logged in (on app mount / refresh) */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authAPI.me();
      setCurrentUser(data.user || data);
    } catch {
      // Not authenticated – that's fine
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login with email + password.
   * Throws on failure so the Login page can display errors.
   */
  const login = async (email, password) => {
    setError(null);
    const data = await authAPI.login(email, password);
    setCurrentUser(data.user || data);
    return data;
  };

  /**
   * Register a new account.
   * Throws on failure so the Register page can display errors.
   */
  const register = async (formData) => {
    setError(null);
    const data = await authAPI.register(formData);
    setCurrentUser(data.user || data);
    return data;
  };

  /** Logout – clear server session then clear local state */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setCurrentUser(null);
    }
  };

  /** Update current user profile locally after edit */
  const updateUser = (updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Custom hook – use inside any component */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
