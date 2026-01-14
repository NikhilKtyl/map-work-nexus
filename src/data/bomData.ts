// BOM (Bill of Materials) Data Structures

export interface BOMTemplate {
  id: string;
  name: string;
  appliesToUnitTypeIds: string[];
  conditions: {
    soilType?: 'rock' | 'mixed' | 'soft';
    surfaceType?: 'pavement' | 'dirt' | 'landscaped';
    depthMin?: number;
    depthMax?: number;
    region?: string;
    customerId?: string;
  };
  lines: BOMLine[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BOMLine {
  id: string;
  itemCode: string;
  description: string;
  uom: string;
  quantityFormula: 'per_foot' | 'per_unit' | 'fixed';
  quantityMultiplier: number;
  category: 'labor' | 'material' | 'equipment';
  unitCost: number;
}

export interface ProjectBOM {
  id: string;
  projectId: string;
  version: number;
  status: 'draft' | 'approved';
  lines: ProjectBOMLine[];
  generatedAt: string;
  generatedBy: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface ProjectBOMLine {
  id: string;
  bomTemplateId: string;
  itemCode: string;
  description: string;
  uom: string;
  category: 'labor' | 'material' | 'equipment';
  suggestedQty: number;
  editedQty?: number;
  unitCost: number;
  totalCost: number;
  sourceUnitTypeIds: string[];
}

// Mock BOM Templates
export const mockBOMTemplates: BOMTemplate[] = [
  {
    id: 'bom1',
    name: 'Standard Bore BOM - Soft Soil',
    appliesToUnitTypeIds: ['ut1'],
    conditions: {
      soilType: 'soft',
    },
    lines: [
      {
        id: 'bl1',
        itemCode: 'MAT-COND-2',
        description: '2" HDPE Conduit',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.05,
        category: 'material',
        unitCost: 1.25,
      },
      {
        id: 'bl2',
        itemCode: 'MAT-PULL-TAPE',
        description: 'Pull Tape',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.1,
        category: 'material',
        unitCost: 0.15,
      },
      {
        id: 'bl3',
        itemCode: 'LAB-BORE-HR',
        description: 'Bore Crew Labor',
        uom: 'hr',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.01,
        category: 'labor',
        unitCost: 85.00,
      },
      {
        id: 'bl4',
        itemCode: 'EQ-BORE-DAY',
        description: 'Boring Rig Rental',
        uom: 'day',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.002,
        category: 'equipment',
        unitCost: 450.00,
      },
    ],
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'bom2',
    name: 'Standard Bore BOM - Rock',
    appliesToUnitTypeIds: ['ut1'],
    conditions: {
      soilType: 'rock',
    },
    lines: [
      {
        id: 'bl5',
        itemCode: 'MAT-COND-2',
        description: '2" HDPE Conduit',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.05,
        category: 'material',
        unitCost: 1.25,
      },
      {
        id: 'bl6',
        itemCode: 'MAT-PULL-TAPE',
        description: 'Pull Tape',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.1,
        category: 'material',
        unitCost: 0.15,
      },
      {
        id: 'bl7',
        itemCode: 'LAB-BORE-HR',
        description: 'Bore Crew Labor (Rock)',
        uom: 'hr',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.025,
        category: 'labor',
        unitCost: 95.00,
      },
      {
        id: 'bl8',
        itemCode: 'EQ-BORE-ROCK',
        description: 'Rock Boring Equipment',
        uom: 'day',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.004,
        category: 'equipment',
        unitCost: 750.00,
      },
    ],
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'bom3',
    name: 'Plow Installation BOM',
    appliesToUnitTypeIds: ['ut2'],
    conditions: {},
    lines: [
      {
        id: 'bl9',
        itemCode: 'MAT-COND-1.25',
        description: '1.25" HDPE Conduit',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.02,
        category: 'material',
        unitCost: 0.85,
      },
      {
        id: 'bl10',
        itemCode: 'LAB-PLOW-HR',
        description: 'Plow Crew Labor',
        uom: 'hr',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.005,
        category: 'labor',
        unitCost: 75.00,
      },
      {
        id: 'bl11',
        itemCode: 'EQ-PLOW-DAY',
        description: 'Plow Equipment Rental',
        uom: 'day',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.001,
        category: 'equipment',
        unitCost: 350.00,
      },
    ],
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'bom4',
    name: 'Aerial Fiber BOM',
    appliesToUnitTypeIds: ['ut3'],
    conditions: {},
    lines: [
      {
        id: 'bl12',
        itemCode: 'MAT-FIBER-SM',
        description: 'Single Mode Fiber Cable',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.08,
        category: 'material',
        unitCost: 0.65,
      },
      {
        id: 'bl13',
        itemCode: 'MAT-LASH-WIRE',
        description: 'Lashing Wire',
        uom: 'ft',
        quantityFormula: 'per_foot',
        quantityMultiplier: 1.05,
        category: 'material',
        unitCost: 0.12,
      },
      {
        id: 'bl14',
        itemCode: 'LAB-AERIAL-HR',
        description: 'Aerial Crew Labor',
        uom: 'hr',
        quantityFormula: 'per_foot',
        quantityMultiplier: 0.008,
        category: 'labor',
        unitCost: 80.00,
      },
    ],
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: 'bom5',
    name: 'Handhole Installation BOM',
    appliesToUnitTypeIds: ['ut5'],
    conditions: {},
    lines: [
      {
        id: 'bl15',
        itemCode: 'MAT-HH-24X36',
        description: '24x36 Polymer Handhole',
        uom: 'ea',
        quantityFormula: 'per_unit',
        quantityMultiplier: 1,
        category: 'material',
        unitCost: 185.00,
      },
      {
        id: 'bl16',
        itemCode: 'MAT-GRAVEL',
        description: 'Gravel Base (0.5 ton)',
        uom: 'ton',
        quantityFormula: 'per_unit',
        quantityMultiplier: 0.5,
        category: 'material',
        unitCost: 45.00,
      },
      {
        id: 'bl17',
        itemCode: 'LAB-HH-HR',
        description: 'Handhole Install Labor',
        uom: 'hr',
        quantityFormula: 'per_unit',
        quantityMultiplier: 3,
        category: 'labor',
        unitCost: 75.00,
      },
    ],
    isActive: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: 'bom6',
    name: 'Pole Installation BOM',
    appliesToUnitTypeIds: ['ut6'],
    conditions: {},
    lines: [
      {
        id: 'bl18',
        itemCode: 'MAT-POLE-40',
        description: '40ft Wood Pole Class 4',
        uom: 'ea',
        quantityFormula: 'per_unit',
        quantityMultiplier: 1,
        category: 'material',
        unitCost: 425.00,
      },
      {
        id: 'bl19',
        itemCode: 'MAT-ANCHOR',
        description: 'Guy Anchor Assembly',
        uom: 'ea',
        quantityFormula: 'per_unit',
        quantityMultiplier: 1,
        category: 'material',
        unitCost: 125.00,
      },
      {
        id: 'bl20',
        itemCode: 'LAB-POLE-HR',
        description: 'Pole Setting Crew',
        uom: 'hr',
        quantityFormula: 'per_unit',
        quantityMultiplier: 4,
        category: 'labor',
        unitCost: 90.00,
      },
      {
        id: 'bl21',
        itemCode: 'EQ-DIGGER',
        description: 'Pole Digger Truck',
        uom: 'day',
        quantityFormula: 'per_unit',
        quantityMultiplier: 0.25,
        category: 'equipment',
        unitCost: 550.00,
      },
    ],
    isActive: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
];

// Mock Project BOMs
export const mockProjectBOMs: ProjectBOM[] = [
  {
    id: 'pbom1',
    projectId: '1',
    version: 1,
    status: 'approved',
    lines: [
      {
        id: 'pbl1',
        bomTemplateId: 'bom1',
        itemCode: 'MAT-COND-2',
        description: '2" HDPE Conduit',
        uom: 'ft',
        category: 'material',
        suggestedQty: 945,
        editedQty: 1000,
        unitCost: 1.25,
        totalCost: 1250.00,
        sourceUnitTypeIds: ['ut1'],
      },
      {
        id: 'pbl2',
        bomTemplateId: 'bom1',
        itemCode: 'MAT-PULL-TAPE',
        description: 'Pull Tape',
        uom: 'ft',
        category: 'material',
        suggestedQty: 990,
        unitCost: 0.15,
        totalCost: 148.50,
        sourceUnitTypeIds: ['ut1'],
      },
      {
        id: 'pbl3',
        bomTemplateId: 'bom5',
        itemCode: 'MAT-HH-24X36',
        description: '24x36 Polymer Handhole',
        uom: 'ea',
        category: 'material',
        suggestedQty: 3,
        unitCost: 185.00,
        totalCost: 555.00,
        sourceUnitTypeIds: ['ut5'],
      },
    ],
    generatedAt: '2024-03-01T10:00:00Z',
    generatedBy: '2',
    approvedAt: '2024-03-02T14:00:00Z',
    approvedBy: '1',
    notes: 'Initial BOM for project kickoff',
  },
];
