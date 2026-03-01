import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { User, UserRole } from '../types';
import { getMockUsers, mockLogin, mockRegisterMerchant } from '../services/mockAuthService';

interface AuthContextValue {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserRole>;
  registerMerchant: (name: string, email: string, password: string) => Promise<UserRole>;
import { mockLogin, mockRegister } from '../services/mockAuthService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const dashboardRouteByRole = (role: UserRole) => `/${role}/dashboard`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(getMockUsers());
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const profile = await mockLogin(email, password);
      setUser(profile);
      setUsers(getMockUsers());
      return profile.role;
    } finally {
      setIsLoading(false);
    }
  };

  const registerMerchant = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const profile = await mockRegisterMerchant(name, email, password);
      setUser(profile);
      setUsers(getMockUsers());
      return profile.role;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, users, isAuthenticated: Boolean(user), isLoading, login, registerMerchant, logout }),
    [user, users, isLoading],
    const profile = await mockLogin(email, password);
    setUser({ ...profile, role: 'student' });
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const profile = await mockRegister(name, email, password);
    setUser({ ...profile, role: 'student' });
    setIsLoading(false);
  };

  const setRole = (role: UserRole) => setUser((prev) => (prev ? { ...prev, role } : prev));
  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, login, register, setRole, logout }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
