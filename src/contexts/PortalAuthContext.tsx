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

// Mock portal users - customer contacts
const MOCK_PORTAL_USERS: Record<string, { password: string; user: PortalUser }> = {
  'jsmith@metrotelecom.com': {
    password: 'portal123',
    user: {
      id: 'pu1',
      email: 'jsmith@metrotelecom.com',
      name: 'John Smith',
      customerId: 'cust1',
      customerIds: ['cust1'],
    },
  },
  'sjohnson@cityconnect.net': {
    password: 'portal123',
    user: {
      id: 'pu2',
      email: 'sjohnson@cityconnect.net',
      name: 'Sarah Johnson',
      customerId: 'cust2',
      customerIds: ['cust2'],
    },
  },
  'mchen@techzone.io': {
    password: 'portal123',
    user: {
      id: 'pu3',
      email: 'mchen@techzone.io',
      name: 'Michael Chen',
      customerId: 'cust3',
      customerIds: ['cust3', 'cust5'], // Can access multiple customers
    },
  },
  'lbrown@homenet.com': {
    password: 'portal123',
    user: {
      id: 'pu4',
      email: 'lbrown@homenet.com',
      name: 'Lisa Brown',
      customerId: 'cust4',
      customerIds: ['cust4'],
    },
  },
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

    const mockUser = MOCK_PORTAL_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      setCurrentCustomerId(mockUser.user.customerId);
      localStorage.setItem('portal_user', JSON.stringify(mockUser.user));
      localStorage.setItem('portal_current_customer', mockUser.user.customerId);
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
