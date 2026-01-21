import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SubCompany {
  id: string;
  name: string;
  code: string;
  allowedUnitTypeIds: string[];
  rates: Record<string, number>; // unitTypeId -> rate
  region: string;
  isActive: boolean;
}

export interface SubUser {
  id: string;
  email: string;
  name: string;
  subCompanyId: string;
  role: 'admin' | 'worker';
}

interface SubsAuthContextType {
  user: SubUser | null;
  subCompany: SubCompany | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const SubsAuthContext = createContext<SubsAuthContextType | undefined>(undefined);

// Mock subcontractor companies
export const mockSubCompanies: SubCompany[] = [
  {
    id: 'sub1',
    name: 'Bravo Contractors LLC',
    code: 'BRAVO',
    allowedUnitTypeIds: ['ut1', 'ut2', 'ut5'],
    rates: {
      'ut1': 8.75,
      'ut2': 5.50,
      'ut5': 325.00,
    },
    region: 'Riverside Area',
    isActive: true,
  },
  {
    id: 'sub2',
    name: 'Delta Underground',
    code: 'DELTA',
    allowedUnitTypeIds: ['ut1', 'ut3', 'ut4', 'ut6'],
    rates: {
      'ut1': 9.00,
      'ut3': 4.50,
      'ut4': 2.50,
      'ut6': 625.00,
    },
    region: 'Downtown District',
    isActive: true,
  },
];

// SECURITY WARNING: This is a demo-only authentication system.
// In production, use a proper backend authentication service.
const DEMO_MODE = true;

// Demo subcontractor users - credentials not stored for security
const DEMO_SUB_USERS: Record<string, SubUser> = {
  'john@bravocontractors.com': {
    id: 'su1',
    email: 'john@bravocontractors.com',
    name: 'John Bravo',
    subCompanyId: 'sub1',
    role: 'admin',
  },
  'mike@bravocontractors.com': {
    id: 'su2',
    email: 'mike@bravocontractors.com',
    name: 'Mike Rivera',
    subCompanyId: 'sub1',
    role: 'worker',
  },
  'sarah@deltaunderground.com': {
    id: 'su3',
    email: 'sarah@deltaunderground.com',
    name: 'Sarah Delta',
    subCompanyId: 'sub2',
    role: 'admin',
  },
};

// Demo password validation
const validateDemoCredentials = (email: string, password: string): SubUser | null => {
  if (!DEMO_MODE) return null;
  const user = DEMO_SUB_USERS[email.toLowerCase()];
  if (user && password.length >= 4) {
    return user;
  }
  return null;
};

export const SubsAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SubUser | null>(() => {
    const stored = localStorage.getItem('subs_user');
    return stored ? JSON.parse(stored) : null;
  });

  const subCompany = user
    ? mockSubCompanies.find((c) => c.id === user.subCompanyId) || null
    : null;

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = validateDemoCredentials(email, password);
    if (user) {
      setUser(user);
      localStorage.setItem('subs_user', JSON.stringify(user));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('subs_user');
  }, []);

  return (
    <SubsAuthContext.Provider
      value={{
        user,
        subCompany,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </SubsAuthContext.Provider>
  );
};

export const useSubsAuth = () => {
  const context = useContext(SubsAuthContext);
  if (context === undefined) {
    throw new Error('useSubsAuth must be used within a SubsAuthProvider');
  }
  return context;
};
