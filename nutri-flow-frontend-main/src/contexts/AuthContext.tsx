
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing token on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('nutribot-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Ensure token is also stored separately for API calls
      if (userData.token) {
        localStorage.setItem('nutribot-token', userData.token);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Call the login API
      const data = await authApi.login(email, password);
      
      const userData = {
        id: data.id,
        name: data.username || data.email.split('@')[0],
        email: data.email,
        token: data.accessToken,
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('nutribot-user', JSON.stringify(userData));
      // Also store token separately for API calls
      localStorage.setItem('nutribot-token', data.accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Call the signup API
      await authApi.signup(name, email, password);
      
      // After successful signup, login automatically
      await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nutribot-user');
    localStorage.removeItem('nutribot-token');
    setUser(null);
  };

  const refreshToken = async (token: string) => {
    setLoading(true);
    try {
      // Call the refresh token API
      const data = await authApi.refreshToken(token);
      
      // Update user data with new token
      if (user) {
        const updatedUser = {
          ...user,
          token: data.token
        };
        localStorage.setItem('nutribot-user', JSON.stringify(updatedUser));
        // Also store token separately for API calls
        localStorage.setItem('nutribot-token', data.token);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
