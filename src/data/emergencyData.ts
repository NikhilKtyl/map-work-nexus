// Emergency Jobs Data Structures

export interface EmergencyJob {
  id: string;
  code: string;
  customerId: string;
  projectId?: string;
  createdBy: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'converted';
  gpsLocation: { lat: number; lng: number };
  requestedUnits: EmergencyRequestedUnit[];
  photos: string[];
  sequentialNumbers?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  convertedProjectId?: string;
  convertedUnitIds?: string[];
  createdAt: string;
  syncState: 'synced' | 'pending';
}

export interface EmergencyRequestedUnit {
  id: string;
  unitTypeId: string;
  quantity: number;
  notes?: string;
}

// Mock Emergency Jobs
export const mockEmergencyJobs: EmergencyJob[] = [
  {
    id: 'ej1',
    code: 'EMG-2024-001',
    customerId: 'cust1',
    description: 'Fiber cut on Main St - traffic accident damaged pedestal',
    severity: 'critical',
    region: 'Downtown District',
    status: 'pending_review',
    gpsLocation: { lat: 40.7128, lng: -74.006 },
    requestedUnits: [
      { id: 'eru1', unitTypeId: 'ut4', quantity: 150, notes: 'Emergency fiber splice' },
      { id: 'eru2', unitTypeId: 'ut7', quantity: 1, notes: 'Replace damaged cabinet' },
    ],
    photos: [],
    sequentialNumbers: ['SEQ-001', 'SEQ-002'],
    createdBy: '4',
    createdAt: '2024-06-15T08:30:00Z',
    syncState: 'synced',
  },
  {
    id: 'ej2',
    code: 'EMG-2024-002',
    customerId: 'cust2',
    projectId: '2',
    description: 'Customer requesting expedited drop installation',
    severity: 'medium',
    region: 'Riverside Area',
    status: 'approved',
    gpsLocation: { lat: 40.715, lng: -74.004 },
    requestedUnits: [
      { id: 'eru3', unitTypeId: 'ut1', quantity: 75 },
      { id: 'eru4', unitTypeId: 'ut5', quantity: 1 },
    ],
    photos: [],
    createdBy: '4',
    createdAt: '2024-06-14T14:00:00Z',
    reviewedBy: '3',
    reviewedAt: '2024-06-14T16:30:00Z',
    reviewNotes: 'Approved - linked to existing FTTH project',
    convertedProjectId: '2',
    syncState: 'synced',
  },
  {
    id: 'ej3',
    code: 'EMG-2024-003',
    customerId: 'cust4',
    description: 'Storm damage - downed aerial fiber needs emergency repair',
    severity: 'high',
    region: 'Suburban Zone',
    status: 'pending_review',
    gpsLocation: { lat: 40.720, lng: -74.010 },
    requestedUnits: [
      { id: 'eru5', unitTypeId: 'ut3', quantity: 200, notes: 'Re-string aerial section' },
      { id: 'eru6', unitTypeId: 'ut6', quantity: 2, notes: 'Replace broken poles' },
    ],
    photos: [],
    sequentialNumbers: ['SEQ-010'],
    createdBy: '7',
    createdAt: '2024-06-15T06:00:00Z',
    syncState: 'synced',
  },
  {
    id: 'ej4',
    code: 'EMG-2024-004',
    customerId: 'cust3',
    description: 'Contractor hit conduit during excavation',
    severity: 'high',
    region: 'Industrial Park',
    status: 'rejected',
    gpsLocation: { lat: 40.718, lng: -74.008 },
    requestedUnits: [
      { id: 'eru7', unitTypeId: 'ut1', quantity: 50 },
    ],
    photos: [],
    createdBy: '4',
    createdAt: '2024-06-13T11:00:00Z',
    reviewedBy: '1',
    reviewedAt: '2024-06-13T15:00:00Z',
    reviewNotes: 'Rejected - Third party damage, insurance claim required first',
    syncState: 'synced',
  },
  {
    id: 'ej5',
    code: 'EMG-2024-005',
    customerId: 'cust1',
    projectId: '1',
    description: 'Add emergency service drop for hospital annex',
    severity: 'critical',
    region: 'Downtown District',
    status: 'converted',
    gpsLocation: { lat: 40.713, lng: -74.005 },
    requestedUnits: [
      { id: 'eru8', unitTypeId: 'ut1', quantity: 120 },
      { id: 'eru9', unitTypeId: 'ut5', quantity: 2 },
    ],
    photos: [],
    createdBy: '4',
    createdAt: '2024-06-10T09:00:00Z',
    reviewedBy: '1',
    reviewedAt: '2024-06-10T10:30:00Z',
    reviewNotes: 'Approved and converted - critical healthcare facility',
    convertedProjectId: '1',
    convertedUnitIds: ['u6', 'u7'],
    syncState: 'synced',
  },
];
