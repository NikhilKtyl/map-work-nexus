import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Download,
  Search,
  ArrowRight,
  Check,
  MapPin,
  FileDown,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Layers,
  FolderPlus,
  Link2,
} from 'lucide-react';
import { mockVetroProjects, mockVetroFeatures, berryTechUnitTypes, VetroProject, VetroUnitMapping } from '@/data/vetroData';
import { mockProjects } from '@/data/mockData';
import { format } from 'date-fns';

type ImportStep = 'select' | 'mapping' | 'target' | 'preview' | 'importing' | 'complete';

const VetroImport: React.FC = () => {
  const [step, setStep] = useState<ImportStep>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<VetroProject | null>(null);
  const [mappings, setMappings] = useState<VetroUnitMapping[]>([]);
  const [targetMode, setTargetMode] = useState<'new' | 'existing'>('new');
  const [newProjectName, setNewProjectName] = useState('');
  const [existingProjectId, setExistingProjectId] = useState('');
  const [importProgress, setImportProgress] = useState(0);

  const filteredProjects = mockVetroProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProject = (project: VetroProject) => {
    setSelectedProject(project);
    // Generate initial mappings from features
    const featureGroups = mockVetroFeatures.reduce((acc, feature) => {
      if (!acc[feature.type]) {
        acc[feature.type] = { count: 0, totalLength: 0 };
      }
      acc[feature.type].count++;
      if (feature.length) {
        acc[feature.type].totalLength += feature.length;
      }
      return acc;
    }, {} as Record<string, { count: number; totalLength: number }>);

    const initialMappings: VetroUnitMapping[] = Object.entries(featureGroups).map(([type, data]) => ({
      vetroType: type,
      vetroTypeName: type.charAt(0).toUpperCase() + type.slice(1),
      berryTechUnitType: null,
      featureCount: data.count,
      totalLength: data.totalLength || undefined,
    }));

    setMappings(initialMappings);
    setNewProjectName(`${project.name} - Import`);
    setStep('mapping');
  };

  const handleMappingChange = (vetroType: string, berryTechType: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.vetroType === vetroType ? { ...m, berryTechUnitType: berryTechType } : m
      )
    );
  };

  const handleStartImport = async () => {
    setStep('importing');
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setImportProgress(i);
    }
    setStep('complete');
    toast.success('Import completed successfully', {
      description: `${mappings.reduce((sum, m) => sum + m.featureCount, 0)} features imported`,
    });
  };

  const mappedCount = mappings.filter((m) => m.berryTechUnitType).length;
  const totalFeatures = mappings.reduce((sum, m) => sum + m.featureCount, 0);

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {['select', 'mapping', 'target', 'preview'].map((s, idx) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              step === s
                ? 'bg-primary text-primary-foreground'
                : ['select', 'mapping', 'target', 'preview'].indexOf(step) > idx
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span>{idx + 1}</span>
            <span className="hidden sm:inline capitalize">{s === 'target' ? 'Target' : s}</span>
          </div>
          {idx < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Download className="w-6 h-6" />
          Import from VETRO
        </h1>
        <p className="text-muted-foreground mt-1">
          Import projects and features from VETRO into BerryTech
        </p>
      </div>

      {step !== 'importing' && step !== 'complete' && renderStepIndicator()}

      {/* Step 1: Select VETRO Project */}
      {step === 'select' && (
        <Card>
          <CardHeader>
            <CardTitle>Select VETRO Project</CardTitle>
            <CardDescription>Search and select a project to import from VETRO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by project name or code..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                    selectedProject?.id === project.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelectProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{project.code}</div>
                    </div>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {project.featureCount} features
                    </span>
                    <span>Modified: {format(project.lastModified, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Feature Type Mapping */}
      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Map Feature Types</CardTitle>
                <CardDescription>
                  Map VETRO feature types to BerryTech unit types ({mappedCount}/{mappings.length} mapped)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {selectedProject?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>VETRO Type</TableHead>
                  <TableHead className="text-center">Features</TableHead>
                  <TableHead className="text-center">Total Length</TableHead>
                  <TableHead></TableHead>
                  <TableHead>BerryTech Unit Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.vetroType}>
                    <TableCell>
                      <div className="font-medium">{mapping.vetroTypeName}</div>
                      <div className="text-sm text-muted-foreground font-mono">{mapping.vetroType}</div>
                    </TableCell>
                    <TableCell className="text-center">{mapping.featureCount}</TableCell>
                    <TableCell className="text-center">
                      {mapping.totalLength ? `${mapping.totalLength.toLocaleString()} ft` : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={mapping.berryTechUnitType || ''}
                        onValueChange={(value) => handleMappingChange(mapping.vetroType, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select unit type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {berryTechUnitTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={() => setStep('target')} disabled={mappedCount === 0}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Target Project */}
      {step === 'target' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Target</CardTitle>
            <CardDescription>Choose where to import the VETRO features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={targetMode} onValueChange={(v) => setTargetMode(v as 'new' | 'existing')}>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="new" id="new" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer">
                    <FolderPlus className="w-4 h-4" />
                    Create New Project
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a new BerryTech project with imported features
                  </p>
                  {targetMode === 'new' && (
                    <div className="mt-3">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="existing" id="existing" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="existing" className="flex items-center gap-2 cursor-pointer">
                    <Link2 className="w-4 h-4" />
                    Add to Existing Project
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Import features into an existing BerryTech project
                  </p>
                  {targetMode === 'existing' && (
                    <div className="mt-3">
                      <Label>Select Project</Label>
                      <Select value={existingProjectId} onValueChange={setExistingProjectId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a project..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProjects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button
                onClick={() => setStep('preview')}
                disabled={targetMode === 'new' ? !newProjectName : !existingProjectId}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preview & Confirm */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Review Import</CardTitle>
            <CardDescription>Confirm the import details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Source</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VETRO Project</span>
                    <span className="font-medium">{selectedProject?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code</span>
                    <span className="font-mono">{selectedProject?.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Features</span>
                    <span>{totalFeatures}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Target</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action</span>
                    <span className="font-medium">
                      {targetMode === 'new' ? 'Create New Project' : 'Add to Existing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Name</span>
                    <span>
                      {targetMode === 'new'
                        ? newProjectName
                        : mockProjects.find((p) => p.id === existingProjectId)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Mappings Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VETRO Type</TableHead>
                    <TableHead>BerryTech Type</TableHead>
                    <TableHead className="text-right">Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings
                    .filter((m) => m.berryTechUnitType)
                    .map((m) => (
                      <TableRow key={m.vetroType}>
                        <TableCell>{m.vetroTypeName}</TableCell>
                        <TableCell>
                          {berryTechUnitTypes.find((t) => t.id === m.berryTechUnitType)?.name}
                        </TableCell>
                        <TableCell className="text-right">{m.featureCount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('target')}>
                Back
              </Button>
              <Button onClick={handleStartImport}>
                <FileDown className="w-4 h-4 mr-2" />
                Start Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Importing Progress */}
      {step === 'importing' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-medium">Importing from VETRO</h3>
                <p className="text-muted-foreground mt-1">Please wait while we import your features...</p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{importProgress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Import Complete</h3>
                <p className="text-muted-foreground mt-1">
                  Successfully imported {totalFeatures} features from VETRO
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setStep('select')}>
                  Import Another
                </Button>
                <Button>View Project</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VetroImport;
