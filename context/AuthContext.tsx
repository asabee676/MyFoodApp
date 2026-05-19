import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'rider' | 'admin' | 'merchant';
  phoneNumber?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('auth_user'),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          connectSocket(storedToken);
        }
      } catch (err) {
        console.warn('[AuthContext] Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const persist = async (authToken: string, authUser: AuthUser) => {
    await Promise.all([
      AsyncStorage.setItem('auth_token', authToken),
      AsyncStorage.setItem('auth_user', JSON.stringify(authUser)),
    ]);
    setToken(authToken);
    setUser(authUser);
    connectSocket(authToken);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: authToken, user: authUser } = response.data;
    await persist(authToken, authUser);
  };

  const signup = async (name: string, email: string, password: string, role = 'client') => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    const { token: authToken, user: authUser } = response.data;
    await persist(authToken, authUser);
  };

  const logout = async () => {
    disconnectSocket();
    await Promise.all([
      AsyncStorage.removeItem('auth_token'),
      AsyncStorage.removeItem('auth_user'),
    ]);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      login, signup, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
