import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockCustomers, Customer } from '@/data/mockData';

export interface PortalUser {
  id: string;
  email: string;
  name: string;
  customerId: string;
  customerIds: string[]; // Can access multiple customers
}

interface PortalAuthContextType {
  user: PortalUser | null;
  currentCustomer: Customer | null;
  availableCustomers: Customer[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchCustomer: (customerId: string) => void;
}

const PortalAuthContext = createContext<PortalAuthContextType | undefined>(undefined);

// SECURITY WARNING: This is a demo-only authentication system.
// In production, use a proper backend authentication service.
const DEMO_MODE = true;

// Demo portal users - credentials not stored for security
const DEMO_PORTAL_USERS: Record<string, PortalUser> = {
  'jsmith@metrotelecom.com': {
    id: 'pu1',
    email: 'jsmith@metrotelecom.com',
    name: 'John Smith',
    customerId: 'cust1',
    customerIds: ['cust1'],
  },
  'sjohnson@cityconnect.net': {
    id: 'pu2',
    email: 'sjohnson@cityconnect.net',
    name: 'Sarah Johnson',
    customerId: 'cust2',
    customerIds: ['cust2'],
  },
  'mchen@techzone.io': {
    id: 'pu3',
    email: 'mchen@techzone.io',
    name: 'Michael Chen',
    customerId: 'cust3',
    customerIds: ['cust3', 'cust5'],
  },
  'lbrown@homenet.com': {
    id: 'pu4',
    email: 'lbrown@homenet.com',
    name: 'Lisa Brown',
    customerId: 'cust4',
    customerIds: ['cust4'],
  },
};

// Demo password validation
const validateDemoCredentials = (email: string, password: string): PortalUser | null => {
  if (!DEMO_MODE) return null;
  const user = DEMO_PORTAL_USERS[email.toLowerCase()];
  if (user && password.length >= 4) {
    return user;
  }
  return null;
};

export const PortalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PortalUser | null>(() => {
    const stored = localStorage.getItem('portal_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [currentCustomerId, setCurrentCustomerId] = useState<string>(() => {
    const stored = localStorage.getItem('portal_current_customer');
    return stored || '';
  });

  const availableCustomers = user
    ? mockCustomers.filter((c) => user.customerIds.includes(c.id))
    : [];

  const currentCustomer = mockCustomers.find(
    (c) => c.id === (currentCustomerId || user?.customerId)
  ) || null;

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = validateDemoCredentials(email, password);
    if (user) {
      setUser(user);
      setCurrentCustomerId(user.customerId);
      localStorage.setItem('portal_user', JSON.stringify(user));
      localStorage.setItem('portal_current_customer', user.customerId);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentCustomerId('');
    localStorage.removeItem('portal_user');
    localStorage.removeItem('portal_current_customer');
  }, []);

  const switchCustomer = useCallback((customerId: string) => {
    if (user?.customerIds.includes(customerId)) {
      setCurrentCustomerId(customerId);
      localStorage.setItem('portal_current_customer', customerId);
    }
  }, [user]);

  return (
    <PortalAuthContext.Provider
      value={{
        user,
        currentCustomer,
        availableCustomers,
        isAuthenticated: !!user,
        login,
        logout,
        switchCustomer,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
};

export const usePortalAuth = () => {
  const context = useContext(PortalAuthContext);
  if (context === undefined) {
    throw new Error('usePortalAuth must be used within a PortalAuthProvider');
  }
  return context;
};
