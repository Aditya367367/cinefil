import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  role: string;
  full_name: string;
  member_id?: number;
  role_title?: string;
  photo_url?: string;
  short_description?: string;
  biography?: string;
  phone?: string;
  headline?: string;
  location?: string;
  dob?: string;
  about?: string;
  membership_status?: string;
  has_pending_application?: boolean;
  is_member?: boolean;
  company?: {
    id: string;
    name: string;
  };
  address?: string;
  contact_number?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  signup: (details: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const data = await authService.getProfile();
      if (data.success && data.profile) {
        setUser(data.profile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        await refreshProfile(); // Fetch full profile
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed.' };
    } catch (e: any) {
      return { success: false, error: e.response?.data?.error || 'Server error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (details: any) => {
    setIsLoading(true);
    try {
      const data = await authService.signup(details);
      if (data.success) {
        await refreshProfile(); // Fetch full profile
        return { success: true };
      }
      return { success: false, error: data.error || 'Signup failed.' };
    } catch (e: any) {
      return { success: false, error: e.response?.data?.error || 'Server error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
