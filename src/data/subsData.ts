// Subcontractor-specific data structures

export interface SubAssignment {
  id: string;
  subCompanyId: string;
  projectId: string;
  unitIds: string[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface SubDailyLog {
  id: string;
  subCompanyId: string;
  projectId: string;
  date: string;
  entries: SubDailyEntry[];
  submittedAt?: string;
  submittedBy?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface SubDailyEntry {
  id: string;
  unitId: string;
  completedQty: number;
  startTime?: string;
  endTime?: string;
  photos: string[];
  notes?: string;
}

export interface SubDocument {
  id: string;
  subCompanyId: string;
  projectId: string;
  type: 'work_report' | 'locate_ticket' | 'safety_form' | 'other';
  fileName: string;
  fileSize: number;
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Mock subcontractor assignments
export const mockSubAssignments: SubAssignment[] = [
  {
    id: 'sa1',
    subCompanyId: 'sub1',
    projectId: '2',
    unitIds: ['u1', 'u2'],
    startDate: '2024-04-15',
    status: 'active',
  },
  {
    id: 'sa2',
    subCompanyId: 'sub2',
    projectId: '1',
    unitIds: ['u3', 'u4', 'u5'],
    startDate: '2024-03-01',
    status: 'active',
  },
];

// Mock daily logs
export const mockSubDailyLogs: SubDailyLog[] = [
  {
    id: 'sdl1',
    subCompanyId: 'sub1',
    projectId: '2',
    date: '2024-06-14',
    entries: [
      {
        id: 'sde1',
        unitId: 'u1',
        completedQty: 150,
        startTime: '08:00',
        endTime: '12:00',
        photos: [],
        notes: 'Good progress, no issues',
      },
    ],
    submittedAt: '2024-06-14T17:00:00Z',
    submittedBy: 'su1',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: '2024-06-15T09:00:00Z',
  },
  {
    id: 'sdl2',
    subCompanyId: 'sub1',
    projectId: '2',
    date: '2024-06-15',
    entries: [
      {
        id: 'sde2',
        unitId: 'u1',
        completedQty: 200,
        startTime: '08:00',
        endTime: '16:00',
        photos: [],
        notes: 'Completed full shift',
      },
    ],
    submittedAt: '2024-06-15T17:30:00Z',
    submittedBy: 'su1',
    status: 'submitted',
  },
];

// Mock sub documents
export const mockSubDocuments: SubDocument[] = [
  {
    id: 'sd1',
    subCompanyId: 'sub1',
    projectId: '2',
    type: 'locate_ticket',
    fileName: 'locate_ticket_061424.pdf',
    fileSize: 245000,
    notes: 'Utility locate for Main St section',
    uploadedBy: 'su1',
    uploadedAt: '2024-06-14T08:00:00Z',
  },
  {
    id: 'sd2',
    subCompanyId: 'sub1',
    projectId: '2',
    type: 'safety_form',
    fileName: 'daily_safety_061424.pdf',
    fileSize: 125000,
    uploadedBy: 'su1',
    uploadedAt: '2024-06-14T07:30:00Z',
  },
];
