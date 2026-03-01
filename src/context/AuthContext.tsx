import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { User, UserRole } from '../types';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
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
