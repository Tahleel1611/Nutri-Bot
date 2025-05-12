
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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Call the login API
      const data = await authApi.login(email, password);
      
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('nutribot-user', JSON.stringify(userData));
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
      const data = await authApi.signup(name, email, password);
      
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      };
      
      localStorage.setItem('nutribot-user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nutribot-user');
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
