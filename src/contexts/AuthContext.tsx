import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'pc' | 'fm' | 'foreman' | 'crew' | 'accounting';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@berrytech.com': {
    password: 'admin123',
    user: { id: '1', email: 'admin@berrytech.com', name: 'Alex Johnson', role: 'admin' },
  },
  'pc@berrytech.com': {
    password: 'pc123',
    user: { id: '2', email: 'pc@berrytech.com', name: 'Sarah Miller', role: 'pc' },
  },
  'fm@berrytech.com': {
    password: 'fm123',
    user: { id: '3', email: 'fm@berrytech.com', name: 'Mike Davis', role: 'fm' },
  },
  'foreman@berrytech.com': {
    password: 'foreman123',
    user: { id: '4', email: 'foreman@berrytech.com', name: 'Tom Wilson', role: 'foreman' },
  },
  'crew@berrytech.com': {
    password: 'crew123',
    user: { id: '5', email: 'crew@berrytech.com', name: 'Chris Brown', role: 'crew' },
  },
  'accounting@berrytech.com': {
    password: 'acc123',
    user: { id: '6', email: 'accounting@berrytech.com', name: 'Emily Chen', role: 'accounting' },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('berrytech_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('berrytech_user', JSON.stringify(mockUser.user));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('berrytech_user');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (MOCK_USERS[email.toLowerCase()]) {
      return { success: true };
    }
    return { success: false, error: 'Email not found' };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Admin / DM',
    pc: 'Project Coordinator',
    fm: 'Field Manager',
    foreman: 'Foreman',
    crew: 'Crew Member',
    accounting: 'Accounting',
  };
  return labels[role];
};
