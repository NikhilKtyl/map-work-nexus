// VETRO Sync Mock Data

export interface VetroConfig {
  id: string;
  apiBaseUrl: string;
  apiKey: string;
  oauthEnabled: boolean;
  defaultSyncMode: 'manual' | 'scheduled';
  scheduledInterval?: number; // hours
  projectMappingRules: VetroMappingRule[];
  lastUpdated: Date;
  updatedBy: string;
}

export interface VetroMappingRule {
  id: string;
  vetroProjectPrefix: string;
  berryTechProjectPrefix: string;
  region?: string;
  active: boolean;
}

export interface VetroProject {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'active' | 'completed' | 'archived';
  featureCount: number;
  lastModified: Date;
}

export interface VetroFeature {
  id: string;
  type: 'route' | 'span' | 'structure' | 'conduit' | 'handhole' | 'splice';
  vetroId: string;
  name: string;
  geometry: 'line' | 'point' | 'polygon';
  length?: number;
  attributes: Record<string, string | number>;
}

export interface VetroUnitMapping {
  vetroType: string;
  vetroTypeName: string;
  berryTechUnitType: string | null;
  featureCount: number;
  totalLength?: number;
}

export interface VetroImportSession {
  id: string;
  vetroProjectId: string;
  vetroProjectName: string;
  mappings: VetroUnitMapping[];
  targetProjectId?: string;
  createNewProject: boolean;
  newProjectName?: string;
  status: 'mapping' | 'preview' | 'importing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface VetroExportBatch {
  id: string;
  projects: string[];
  mode: 'full' | 'incremental';
  unitCount: number;
  conflictCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'partial' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  errorSummary?: string;
}

export interface VetroSyncLog {
  id: string;
  direction: 'import' | 'export';
  scope: string[];
  startTime: Date;
  endTime?: Date;
  result: 'success' | 'partial' | 'failed';
  itemsProcessed: number;
  itemsFailed: number;
  errorSummary?: string;
  details?: string;
  userId: string;
  userName: string;
}

// Mock VETRO Projects available for import
export const mockVetroProjects: VetroProject[] = [
  {
    id: 'vp-001',
    name: 'Downtown Fiber Expansion Phase 2',
    code: 'DFE-2024-002',
    region: 'Metro East',
    status: 'active',
    featureCount: 156,
    lastModified: new Date('2024-01-10'),
  },
  {
    id: 'vp-002',
    name: 'Industrial Park Backbone',
    code: 'IPB-2024-001',
    region: 'Industrial Zone',
    status: 'active',
    featureCount: 89,
    lastModified: new Date('2024-01-08'),
  },
  {
    id: 'vp-003',
    name: 'Residential Loop Connection',
    code: 'RLC-2023-045',
    region: 'Suburban North',
    status: 'completed',
    featureCount: 234,
    lastModified: new Date('2023-12-15'),
  },
  {
    id: 'vp-004',
    name: 'Highway 101 Corridor',
    code: 'H101-2024-003',
    region: 'Highway District',
    status: 'active',
    featureCount: 412,
    lastModified: new Date('2024-01-12'),
  },
];

// Mock features for a VETRO project
export const mockVetroFeatures: VetroFeature[] = [
  { id: 'vf-001', type: 'conduit', vetroId: 'COND-001', name: 'Main Trunk Conduit A', geometry: 'line', length: 2450, attributes: { material: 'HDPE', diameter: '4"' } },
  { id: 'vf-002', type: 'conduit', vetroId: 'COND-002', name: 'Branch Conduit B1', geometry: 'line', length: 890, attributes: { material: 'HDPE', diameter: '2"' } },
  { id: 'vf-003', type: 'conduit', vetroId: 'COND-003', name: 'Branch Conduit B2', geometry: 'line', length: 1120, attributes: { material: 'HDPE', diameter: '2"' } },
  { id: 'vf-004', type: 'handhole', vetroId: 'HH-001', name: 'Handhole 1', geometry: 'point', attributes: { size: '24x36', depth: '4ft' } },
  { id: 'vf-005', type: 'handhole', vetroId: 'HH-002', name: 'Handhole 2', geometry: 'point', attributes: { size: '24x36', depth: '4ft' } },
  { id: 'vf-006', type: 'handhole', vetroId: 'HH-003', name: 'Handhole 3', geometry: 'point', attributes: { size: '30x48', depth: '5ft' } },
  { id: 'vf-007', type: 'splice', vetroId: 'SPL-001', name: 'Splice Enclosure 1', geometry: 'point', attributes: { fiberCount: 144, type: 'dome' } },
  { id: 'vf-008', type: 'splice', vetroId: 'SPL-002', name: 'Splice Enclosure 2', geometry: 'point', attributes: { fiberCount: 96, type: 'inline' } },
  { id: 'vf-009', type: 'structure', vetroId: 'VAULT-001', name: 'Main Vault A', geometry: 'polygon', attributes: { type: 'concrete', size: '6x8' } },
  { id: 'vf-010', type: 'route', vetroId: 'RTE-001', name: 'Primary Route', geometry: 'line', length: 5200, attributes: { type: 'underground' } },
];

// Unit type options for mapping
export const berryTechUnitTypes = [
  { id: 'trench-ft', name: 'Trench ft', geometry: 'line' },
  { id: 'bore-ft', name: 'Bore ft', geometry: 'line' },
  { id: 'conduit-ft', name: 'Conduit ft', geometry: 'line' },
  { id: 'handhole', name: 'Handhole', geometry: 'point' },
  { id: 'vault', name: 'Vault', geometry: 'point' },
  { id: 'splice', name: 'Splice Enclosure', geometry: 'point' },
  { id: 'pedestal', name: 'Pedestal', geometry: 'point' },
  { id: 'pole', name: 'Pole', geometry: 'point' },
  { id: 'fiber-pull-ft', name: 'Fiber Pull ft', geometry: 'line' },
];

// Mock sync logs
export const mockSyncLogs: VetroSyncLog[] = [
  {
    id: 'log-001',
    direction: 'import',
    scope: ['DFE-2024-002'],
    startTime: new Date('2024-01-10T14:30:00'),
    endTime: new Date('2024-01-10T14:32:15'),
    result: 'success',
    itemsProcessed: 156,
    itemsFailed: 0,
    userId: 'u1',
    userName: 'Mike Johnson',
  },
  {
    id: 'log-002',
    direction: 'export',
    scope: ['PRJ-2024-001', 'PRJ-2024-002'],
    startTime: new Date('2024-01-09T16:00:00'),
    endTime: new Date('2024-01-09T16:05:42'),
    result: 'partial',
    itemsProcessed: 89,
    itemsFailed: 3,
    errorSummary: '3 units had geometry conflicts',
    details: 'Units U-045, U-067, U-089 were modified in both systems. Manual review required.',
    userId: 'u1',
    userName: 'Mike Johnson',
  },
  {
    id: 'log-003',
    direction: 'import',
    scope: ['IPB-2024-001'],
    startTime: new Date('2024-01-08T09:15:00'),
    endTime: new Date('2024-01-08T09:17:30'),
    result: 'success',
    itemsProcessed: 89,
    itemsFailed: 0,
    userId: 'u2',
    userName: 'Sarah Williams',
  },
  {
    id: 'log-004',
    direction: 'export',
    scope: ['PRJ-2023-045'],
    startTime: new Date('2024-01-07T11:00:00'),
    endTime: new Date('2024-01-07T11:00:45'),
    result: 'failed',
    itemsProcessed: 0,
    itemsFailed: 234,
    errorSummary: 'VETRO API connection timeout',
    details: 'Failed to establish connection to VETRO API. Please check network settings and API credentials.',
    userId: 'u1',
    userName: 'Mike Johnson',
  },
  {
    id: 'log-005',
    direction: 'export',
    scope: ['PRJ-2024-003'],
    startTime: new Date('2024-01-06T15:30:00'),
    endTime: new Date('2024-01-06T15:38:22'),
    result: 'success',
    itemsProcessed: 412,
    itemsFailed: 0,
    userId: 'u3',
    userName: 'Alex Chen',
  },
];

// Default configuration
export const defaultVetroConfig: VetroConfig = {
  id: 'config-001',
  apiBaseUrl: 'https://api.vetro.io/v2',
  apiKey: '••••••••••••••••',
  oauthEnabled: false,
  defaultSyncMode: 'manual',
  projectMappingRules: [
    { id: 'rule-001', vetroProjectPrefix: 'DFE-', berryTechProjectPrefix: 'PRJ-', region: 'Metro East', active: true },
    { id: 'rule-002', vetroProjectPrefix: 'IPB-', berryTechProjectPrefix: 'IND-', region: 'Industrial Zone', active: true },
    { id: 'rule-003', vetroProjectPrefix: 'RLC-', berryTechProjectPrefix: 'RES-', region: 'Suburban', active: true },
  ],
  lastUpdated: new Date('2024-01-05'),
  updatedBy: 'Mike Johnson',
};
