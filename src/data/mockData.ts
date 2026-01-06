import { UserRole } from '@/contexts/AuthContext';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  projectAccess: 'all' | string[];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  customer: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed';
  startDate: string;
  endDate?: string;
  parentProjectId?: string;
  assignedPc?: string;
  assignedFm?: string;
  defaultForeman?: string;
  budget?: number;
  unitsCompleted: number;
  totalUnits: number;
  totalFeet: number;
  completedFeet: number;
  lastUpdated: string;
  createdAt: string;
}

export const mockUsers: ManagedUser[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'admin@berrytech.com',
    role: 'admin',
    phone: '555-0101',
    status: 'active',
    createdAt: '2024-01-15',
    projectAccess: 'all',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'pc@berrytech.com',
    role: 'pc',
    phone: '555-0102',
    status: 'active',
    createdAt: '2024-02-10',
    projectAccess: 'all',
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'fm@berrytech.com',
    role: 'fm',
    phone: '555-0103',
    status: 'active',
    createdAt: '2024-02-15',
    projectAccess: ['1', '2', '3'],
  },
  {
    id: '4',
    name: 'Tom Wilson',
    email: 'foreman@berrytech.com',
    role: 'foreman',
    status: 'active',
    createdAt: '2024-03-01',
    projectAccess: ['1', '2'],
  },
  {
    id: '5',
    name: 'Chris Brown',
    email: 'crew@berrytech.com',
    role: 'crew',
    status: 'active',
    createdAt: '2024-03-15',
    projectAccess: ['1'],
  },
  {
    id: '6',
    name: 'Emily Chen',
    email: 'accounting@berrytech.com',
    role: 'accounting',
    phone: '555-0106',
    status: 'active',
    createdAt: '2024-01-20',
    projectAccess: 'all',
  },
  {
    id: '7',
    name: 'James Rodriguez',
    email: 'james.r@berrytech.com',
    role: 'foreman',
    status: 'inactive',
    createdAt: '2024-01-05',
    projectAccess: ['2'],
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Downtown Fiber Expansion',
    code: 'DFE-2024-001',
    customer: 'Metro Telecom',
    description: 'Major fiber expansion project covering downtown business district with underground conduit installation.',
    status: 'in_progress',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    assignedPc: '2',
    assignedFm: '3',
    defaultForeman: '4',
    budget: 2500000,
    unitsCompleted: 340,
    totalUnits: 500,
    totalFeet: 45000,
    completedFeet: 30600,
    lastUpdated: '2024-06-15T10:30:00Z',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    name: 'Riverside FTTH Phase 2',
    code: 'RFT-2024-002',
    customer: 'CityConnect ISP',
    description: 'Fiber-to-the-home deployment for residential areas along the riverside development zone.',
    status: 'in_progress',
    startDate: '2024-04-15',
    endDate: '2024-12-15',
    assignedPc: '2',
    assignedFm: '3',
    budget: 1800000,
    unitsCompleted: 225,
    totalUnits: 500,
    totalFeet: 62000,
    completedFeet: 27900,
    lastUpdated: '2024-06-14T15:45:00Z',
    createdAt: '2024-03-20',
  },
  {
    id: '3',
    name: 'Industrial Park Network',
    code: 'IPN-2024-003',
    customer: 'TechZone Solutions',
    description: 'High-capacity fiber network for industrial park with redundant connections.',
    status: 'planning',
    startDate: '2024-07-01',
    assignedPc: '2',
    budget: 950000,
    unitsCompleted: 0,
    totalUnits: 200,
    totalFeet: 18000,
    completedFeet: 0,
    lastUpdated: '2024-06-10T09:00:00Z',
    createdAt: '2024-05-01',
  },
  {
    id: '4',
    name: 'Suburban Fiber Ring',
    code: 'SFR-2024-004',
    customer: 'HomeNet Services',
    description: 'Ring topology fiber deployment connecting suburban communities with central hub.',
    status: 'in_progress',
    startDate: '2024-02-01',
    endDate: '2024-07-31',
    assignedPc: '2',
    assignedFm: '3',
    defaultForeman: '4',
    budget: 3200000,
    unitsCompleted: 445,
    totalUnits: 500,
    totalFeet: 78000,
    completedFeet: 69420,
    lastUpdated: '2024-06-15T08:15:00Z',
    createdAt: '2024-01-10',
  },
  {
    id: '5',
    name: 'Business District Upgrade',
    code: 'BDU-2024-005',
    customer: 'EnterpriseCom',
    description: 'Upgrade existing fiber infrastructure in business district to support 10G connections.',
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-05-30',
    assignedPc: '2',
    assignedFm: '3',
    budget: 750000,
    unitsCompleted: 150,
    totalUnits: 150,
    totalFeet: 12000,
    completedFeet: 12000,
    lastUpdated: '2024-05-30T16:00:00Z',
    createdAt: '2023-12-01',
  },
];

export const customers = [
  'Metro Telecom',
  'CityConnect ISP',
  'TechZone Solutions',
  'HomeNet Services',
  'EnterpriseCom',
  'FiberFirst Networks',
  'ConnectAll Inc.',
];
