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
  {
    id: '8',
    name: 'David Martinez',
    email: 'david.m@berrytech.com',
    role: 'crew',
    status: 'active',
    createdAt: '2024-03-20',
    projectAccess: ['1', '2'],
  },
  {
    id: '9',
    name: 'Kevin Lee',
    email: 'kevin.l@berrytech.com',
    role: 'crew',
    status: 'active',
    createdAt: '2024-04-01',
    projectAccess: ['1', '2', '3'],
  },
  {
    id: '10',
    name: 'Ryan Thompson',
    email: 'ryan.t@berrytech.com',
    role: 'crew',
    status: 'active',
    createdAt: '2024-04-10',
    projectAccess: ['2'],
  },
  {
    id: '11',
    name: 'Marcus Johnson',
    email: 'marcus.j@berrytech.com',
    role: 'crew',
    status: 'active',
    createdAt: '2024-04-15',
    projectAccess: ['1', '4'],
  },
  {
    id: '12',
    name: 'Jake Williams',
    email: 'jake.w@berrytech.com',
    role: 'crew',
    status: 'inactive',
    createdAt: '2024-02-01',
    projectAccess: ['1'],
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

// Map Sources
export interface MapSource {
  id: string;
  projectId: string;
  name: string;
  fileName: string;
  fileType: 'SHP' | 'KMZ' | 'CAD' | 'PDF' | 'IMAGE';
  fileSize: number;
  uploadDate: string;
  status: 'processing' | 'processed' | 'error';
  layerCategory: 'Base' | 'Design' | 'Reference';
  isPrimary: boolean;
  uploadedBy: string;
}

export const mockMapSources: MapSource[] = [
  {
    id: 'ms1',
    projectId: '1',
    name: 'Downtown Base Layout',
    fileName: 'downtown_base_v2.shp',
    fileType: 'SHP',
    fileSize: 2450000,
    uploadDate: '2024-03-05T10:00:00Z',
    status: 'processed',
    layerCategory: 'Base',
    isPrimary: true,
    uploadedBy: '2',
  },
  {
    id: 'ms2',
    projectId: '1',
    name: 'Fiber Design Plan',
    fileName: 'fiber_design_draft.kmz',
    fileType: 'KMZ',
    fileSize: 1200000,
    uploadDate: '2024-03-10T14:30:00Z',
    status: 'processed',
    layerCategory: 'Design',
    isPrimary: false,
    uploadedBy: '2',
  },
  {
    id: 'ms3',
    projectId: '1',
    name: 'Utility Reference',
    fileName: 'utility_ref.pdf',
    fileType: 'PDF',
    fileSize: 5600000,
    uploadDate: '2024-03-12T09:15:00Z',
    status: 'processed',
    layerCategory: 'Reference',
    isPrimary: false,
    uploadedBy: '1',
  },
];

// Unit Types (Catalog)
export interface UnitType {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'Line' | 'Marker';
  customerId?: string; // If customer-specific
  defaultPrice: number;
  defaultSubRate: number;
  requiresGps: boolean;
  requiresSequential: boolean;
  requiresPhotos: boolean;
  minPhotoCount: number;
  isActive: boolean;
}

export const mockUnitTypes: UnitType[] = [
  {
    id: 'ut1',
    code: 'BORE-FT',
    name: 'Bore - per foot',
    description: 'Horizontal directional boring for underground conduit installation',
    category: 'Line',
    defaultPrice: 12.50,
    defaultSubRate: 8.75,
    requiresGps: true,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 2,
    isActive: true,
  },
  {
    id: 'ut2',
    code: 'PLOW-FT',
    name: 'Plow - per foot',
    description: 'Direct burial plow installation for fiber conduit',
    category: 'Line',
    defaultPrice: 8.25,
    defaultSubRate: 5.50,
    requiresGps: true,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 2,
    isActive: true,
  },
  {
    id: 'ut3',
    code: 'AERIAL-FT',
    name: 'Aerial Fiber - per foot',
    description: 'Aerial strand and fiber installation on existing poles',
    category: 'Line',
    defaultPrice: 6.75,
    defaultSubRate: 4.25,
    requiresGps: false,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 1,
    isActive: true,
  },
  {
    id: 'ut4',
    code: 'FIBER-FT',
    name: 'Fiber Pull - per foot',
    description: 'Fiber cable pull through existing conduit',
    category: 'Line',
    defaultPrice: 3.50,
    defaultSubRate: 2.25,
    requiresGps: false,
    requiresSequential: false,
    requiresPhotos: false,
    minPhotoCount: 0,
    isActive: true,
  },
  {
    id: 'ut5',
    code: 'HH-EA',
    name: 'Handhole - each',
    description: 'Handhole installation for underground access points',
    category: 'Marker',
    defaultPrice: 450.00,
    defaultSubRate: 325.00,
    requiresGps: true,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 3,
    isActive: true,
  },
  {
    id: 'ut6',
    code: 'POLE-EA',
    name: 'Pole - each',
    description: 'New pole installation for aerial runs',
    category: 'Marker',
    defaultPrice: 850.00,
    defaultSubRate: 600.00,
    requiresGps: true,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 2,
    isActive: true,
  },
  {
    id: 'ut7',
    code: 'CAB-EA',
    name: 'Cabinet - each',
    description: 'Fiber distribution cabinet installation',
    category: 'Marker',
    defaultPrice: 1200.00,
    defaultSubRate: 850.00,
    requiresGps: true,
    requiresSequential: true,
    requiresPhotos: true,
    minPhotoCount: 4,
    isActive: true,
  },
  {
    id: 'ut8',
    code: 'ANCHOR-EA',
    name: 'Anchor - each',
    description: 'Guy wire anchor installation',
    category: 'Marker',
    defaultPrice: 175.00,
    defaultSubRate: 125.00,
    requiresGps: true,
    requiresSequential: false,
    requiresPhotos: true,
    minPhotoCount: 1,
    isActive: true,
  },
];

// Units (Actual placed units on map)
export type UnitStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_verification' | 'verified';

export interface Unit {
  id: string;
  projectId: string;
  unitTypeId: string;
  code: string;
  geometryType: 'Line' | 'Marker';
  length?: number; // For line units, in feet
  coordinates: { lat: number; lng: number }[];
  price: number;
  subRate: number;
  status: UnitStatus;
  assignedCrewId?: string;
  assignedDate?: string;
  completedDate?: string;
  verifiedDate?: string;
  notes: string;
  photos: string[];
  sequentialNumber?: number;
  gpsReadings: { lat: number; lng: number; timestamp: string }[];
  lastUpdated: string;
  createdAt: string;
}

export const mockUnits: Unit[] = [
  {
    id: 'u1',
    projectId: '1',
    unitTypeId: 'ut1',
    code: 'DFE-BORE-001',
    geometryType: 'Line',
    length: 450,
    coordinates: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7135, lng: -74.0055 },
    ],
    price: 12.50,
    subRate: 8.75,
    status: 'completed',
    assignedCrewId: '5',
    assignedDate: '2024-03-15',
    completedDate: '2024-03-18',
    notes: 'Completed ahead of schedule',
    photos: [],
    sequentialNumber: 1,
    gpsReadings: [],
    lastUpdated: '2024-03-18T16:00:00Z',
    createdAt: '2024-03-10',
  },
  {
    id: 'u2',
    projectId: '1',
    unitTypeId: 'ut1',
    code: 'DFE-BORE-002',
    geometryType: 'Line',
    length: 380,
    coordinates: [
      { lat: 40.7135, lng: -74.0055 },
      { lat: 40.714, lng: -74.005 },
    ],
    price: 12.50,
    subRate: 8.75,
    status: 'verified',
    assignedCrewId: '5',
    assignedDate: '2024-03-19',
    completedDate: '2024-03-22',
    verifiedDate: '2024-03-23',
    notes: '',
    photos: [],
    sequentialNumber: 2,
    gpsReadings: [],
    lastUpdated: '2024-03-23T10:00:00Z',
    createdAt: '2024-03-15',
  },
  {
    id: 'u3',
    projectId: '1',
    unitTypeId: 'ut5',
    code: 'DFE-HH-001',
    geometryType: 'Marker',
    coordinates: [{ lat: 40.7128, lng: -74.006 }],
    price: 450.00,
    subRate: 325.00,
    status: 'in_progress',
    assignedCrewId: '5',
    assignedDate: '2024-06-10',
    notes: 'Standard 24x36 handhole',
    photos: [],
    sequentialNumber: 1,
    gpsReadings: [],
    lastUpdated: '2024-06-12T14:00:00Z',
    createdAt: '2024-06-05',
  },
  {
    id: 'u4',
    projectId: '1',
    unitTypeId: 'ut3',
    code: 'DFE-AER-001',
    geometryType: 'Line',
    length: 820,
    coordinates: [
      { lat: 40.715, lng: -74.004 },
      { lat: 40.716, lng: -74.003 },
    ],
    price: 6.75,
    subRate: 4.25,
    status: 'not_started',
    notes: 'Waiting for pole permits',
    photos: [],
    sequentialNumber: 1,
    gpsReadings: [],
    lastUpdated: '2024-06-01T09:00:00Z',
    createdAt: '2024-06-01',
  },
  {
    id: 'u5',
    projectId: '1',
    unitTypeId: 'ut6',
    code: 'DFE-POLE-001',
    geometryType: 'Marker',
    coordinates: [{ lat: 40.715, lng: -74.004 }],
    price: 850.00,
    subRate: 600.00,
    status: 'needs_verification',
    assignedCrewId: '5',
    assignedDate: '2024-05-20',
    completedDate: '2024-05-25',
    notes: '40ft wood pole',
    photos: [],
    sequentialNumber: 1,
    gpsReadings: [],
    lastUpdated: '2024-05-25T17:00:00Z',
    createdAt: '2024-05-15',
  },
];

// Crews
export interface Crew {
  id: string;
  name: string;
  type: 'internal' | 'subcontractor';
  foremanId: string;
  memberIds: string[];
  equipment: string[];
  defaultWorkRegion: string;
  assignedUnitsCount: number;
  projectIds: string[];
  isActive: boolean;
  createdAt: string;
}

export const mockCrews: Crew[] = [
  {
    id: 'crew1',
    name: 'Alpha Team',
    type: 'internal',
    foremanId: '4',
    memberIds: ['5'],
    equipment: ['Boring Rig #1', 'Utility Truck #3', 'Trailer #2'],
    defaultWorkRegion: 'Downtown District',
    assignedUnitsCount: 12,
    projectIds: ['1', '4'],
    isActive: true,
    createdAt: '2024-02-01',
  },
  {
    id: 'crew2',
    name: 'Bravo Contractors',
    type: 'subcontractor',
    foremanId: '7',
    memberIds: [],
    equipment: ['Plow Unit #1', 'Dump Truck'],
    defaultWorkRegion: 'Riverside Area',
    assignedUnitsCount: 8,
    projectIds: ['2'],
    isActive: true,
    createdAt: '2024-03-15',
  },
  {
    id: 'crew3',
    name: 'Charlie Squad',
    type: 'internal',
    foremanId: '4',
    memberIds: ['5'],
    equipment: ['Aerial Lift #2', 'Service Van #5'],
    defaultWorkRegion: 'Suburban Zone',
    assignedUnitsCount: 5,
    projectIds: ['1', '2', '4'],
    isActive: true,
    createdAt: '2024-04-01',
  },
];

// Time Tracking for Units
export interface UnitTimeEntry {
  id: string;
  unitId: string;
  crewId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  totalMinutes?: number;
  notes?: string;
}

export const mockTimeEntries: UnitTimeEntry[] = [
  {
    id: 'te1',
    unitId: 'u1',
    crewId: 'crew1',
    userId: '5',
    startTime: '2024-03-15T08:00:00Z',
    endTime: '2024-03-15T12:30:00Z',
    totalMinutes: 270,
    notes: 'Morning shift',
  },
  {
    id: 'te2',
    unitId: 'u1',
    crewId: 'crew1',
    userId: '5',
    startTime: '2024-03-15T13:00:00Z',
    endTime: '2024-03-15T17:00:00Z',
    totalMinutes: 240,
  },
];

// Change Orders
export interface ChangeOrder {
  id: string;
  code: string;
  projectId: string;
  type: 'simple' | 'major';
  changeCategory?: string;
  description: string;
  reason?: string;
  status: 'open' | 'approved' | 'rejected' | 'applied';
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  appliedAt?: string;
  impactedUnitIds: string[];
  attachments: string[];
  createdAt: string;
}

export const mockChangeOrders: ChangeOrder[] = [
  {
    id: 'co1',
    code: 'CO-2024-001',
    projectId: '1',
    type: 'simple',
    changeCategory: 'location_change',
    description: 'Move handhole HH-001 approximately 15 feet north to avoid existing utility conflict',
    reason: 'Discovered unmarked gas line during excavation',
    status: 'approved',
    requestedBy: '4',
    approvedBy: '3',
    approvedAt: '2024-06-10T14:00:00Z',
    impactedUnitIds: ['u3'],
    attachments: [],
    createdAt: '2024-06-09T10:00:00Z',
  },
  {
    id: 'co2',
    code: 'CO-2024-002',
    projectId: '1',
    type: 'major',
    changeCategory: 'add_units',
    description: 'Add 5 additional handholes to support new customer connection points in Block C',
    reason: 'Customer requested additional service drops',
    status: 'open',
    requestedBy: '2',
    impactedUnitIds: [],
    attachments: [],
    createdAt: '2024-06-12T09:00:00Z',
  },
  {
    id: 'co3',
    code: 'CO-2024-003',
    projectId: '2',
    type: 'simple',
    changeCategory: 'quantity_adjust',
    description: 'Reduce bore length by 50 feet due to rock formation',
    status: 'applied',
    requestedBy: '4',
    approvedBy: '3',
    approvedAt: '2024-06-05T11:00:00Z',
    appliedAt: '2024-06-06T08:00:00Z',
    impactedUnitIds: ['u1'],
    attachments: [],
    createdAt: '2024-06-04T16:00:00Z',
  },
  {
    id: 'co4',
    code: 'CO-2024-004',
    projectId: '1',
    type: 'major',
    changeCategory: 'remove_units',
    description: 'Remove 3 pole installations - customer decided to use existing utility poles',
    reason: 'Cost reduction initiative by customer',
    status: 'rejected',
    requestedBy: '2',
    approvedBy: '1',
    approvedAt: '2024-06-08T10:00:00Z',
    impactedUnitIds: ['u5'],
    attachments: [],
    createdAt: '2024-06-07T14:00:00Z',
  },
];

// Export Records
export interface ExportRecord {
  id: string;
  projectId: string;
  fileName: string;
  type: 'as_built_pdf' | 'ce_upload' | 'unit_csv';
  generatedBy: string;
  createdAt: string;
}

export const mockExportRecords: ExportRecord[] = [
  {
    id: 'exp1',
    projectId: '1',
    fileName: 'AsBuilt_DFE-2024-001_2024-06-01.pdf',
    type: 'as_built_pdf',
    generatedBy: '2',
    createdAt: '2024-06-01T14:30:00Z',
  },
  {
    id: 'exp2',
    projectId: '1',
    fileName: 'CE_Export_DFE-2024-001_2024-06-05.csv',
    type: 'ce_upload',
    generatedBy: '2',
    createdAt: '2024-06-05T10:00:00Z',
  },
  {
    id: 'exp3',
    projectId: '5',
    fileName: 'Units_BDU-2024-005_2024-05-30.csv',
    type: 'unit_csv',
    generatedBy: '6',
    createdAt: '2024-05-30T16:45:00Z',
  },
];
