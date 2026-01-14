import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Upload,
  Check,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  FileUp,
  Layers,
  GitCompare,
} from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { format } from 'date-fns';

interface ExportProject {
  id: string;
  name: string;
  code: string;
  verifiedUnits: number;
  totalUnits: number;
  hasVetroOrigin: boolean;
  lastExport?: Date;
  conflicts: number;
}

type ExportStep = 'select' | 'options' | 'preview' | 'exporting' | 'complete';

const VetroExport: React.FC = () => {
  const [step, setStep] = useState<ExportStep>('select');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [exportMode, setExportMode] = useState<'full' | 'incremental'>('incremental');
  const [exportProgress, setExportProgress] = useState(0);

  // Mock export-eligible projects
  const exportProjects: ExportProject[] = mockProjects.slice(0, 5).map((p, idx) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    verifiedUnits: Math.floor(Math.random() * 50) + 20,
    totalUnits: Math.floor(Math.random() * 80) + 40,
    hasVetroOrigin: idx < 3, // First 3 have VETRO origin
    lastExport: idx < 2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
    conflicts: idx === 1 ? 2 : 0,
  }));

  const eligibleProjects = exportProjects.filter((p) => p.hasVetroOrigin);
  const selectedProjectsData = eligibleProjects.filter((p) => selectedProjects.includes(p.id));
  const totalUnitsToExport = selectedProjectsData.reduce((sum, p) => sum + p.verifiedUnits, 0);
  const totalConflicts = selectedProjectsData.reduce((sum, p) => sum + p.conflicts, 0);

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === eligibleProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(eligibleProjects.map((p) => p.id));
    }
  };

  const handleStartExport = async () => {
    setStep('exporting');
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExportProgress(i);
    }
    setStep('complete');
    toast.success('Export completed', {
      description: `${totalUnitsToExport} units exported to VETRO`,
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {['select', 'options', 'preview'].map((s, idx) => (
        <React.Fragment key={s}>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              step === s
                ? 'bg-primary text-primary-foreground'
                : ['select', 'options', 'preview'].indexOf(step) > idx
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span>{idx + 1}</span>
            <span className="hidden sm:inline capitalize">{s}</span>
          </div>
          {idx < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Export As-Built to VETRO
        </h1>
        <p className="text-muted-foreground mt-1">
          Push verified as-built data back to VETRO for synchronized records
        </p>
      </div>

      {step !== 'exporting' && step !== 'complete' && renderStepIndicator()}

      {/* Step 1: Select Projects */}
      {step === 'select' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Select Projects to Export</CardTitle>
                <CardDescription>
                  Choose projects with verified units to export to VETRO
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedProjects.length === eligibleProjects.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {eligibleProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No projects with VETRO origin found</p>
                <p className="text-sm">Import projects from VETRO first to enable export</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-center">Verified Units</TableHead>
                    <TableHead className="text-center">Conflicts</TableHead>
                    <TableHead>Last Export</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligibleProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => handleToggleProject(project.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{project.code}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {project.verifiedUnits} / {project.totalUnits}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {project.conflicts > 0 ? (
                          <Badge variant="destructive">{project.conflicts}</Badge>
                        ) : (
                          <Badge variant="secondary">0</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.lastExport ? format(project.lastExport, 'MMM d, yyyy') : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep('options')} disabled={selectedProjects.length === 0}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Export Options */}
      {step === 'options' && (
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Configure how the data should be exported to VETRO</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Export Mode</Label>
              <RadioGroup value={exportMode} onValueChange={(v) => setExportMode(v as 'full' | 'incremental')}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="incremental" id="incremental" className="mt-1" />
                  <div>
                    <Label htmlFor="incremental" className="flex items-center gap-2 cursor-pointer">
                      <GitCompare className="w-4 h-4" />
                      Incremental Sync
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only export changes since the last sync. Faster and recommended for regular updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="full" id="full" className="mt-1" />
                  <div>
                    <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer">
                      <FileUp className="w-4 h-4" />
                      Full Sync
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Export all verified units regardless of previous exports. Use when data may be out of sync.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={() => setStep('preview')}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview & Confirm */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
            <CardDescription>Review the export details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {totalConflicts > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Conflicts Detected</AlertTitle>
                <AlertDescription>
                  {totalConflicts} unit(s) have been modified in both BerryTech and VETRO.
                  These will be flagged for manual review.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{selectedProjects.length}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{totalUnitsToExport}</div>
                <div className="text-sm text-muted-foreground">Units to Export</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className={`text-3xl font-bold ${totalConflicts > 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {totalConflicts}
                </div>
                <div className="text-sm text-muted-foreground">Conflicts</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Projects to Export</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-center">Verified Units</TableHead>
                    <TableHead className="text-center">Conflicts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProjectsData.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{p.code}</div>
                      </TableCell>
                      <TableCell className="text-center">{p.verifiedUnits}</TableCell>
                      <TableCell className="text-center">
                        {p.conflicts > 0 ? (
                          <Badge variant="destructive">{p.conflicts}</Badge>
                        ) : (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Export Mode</span>
                <span className="font-medium capitalize">{exportMode}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('options')}>
                Back
              </Button>
              <Button onClick={handleStartExport}>
                <Upload className="w-4 h-4 mr-2" />
                Start Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exporting Progress */}
      {step === 'exporting' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin" />
              <div>
                <h3 className="text-lg font-medium">Exporting to VETRO</h3>
                <p className="text-muted-foreground mt-1">Please wait while we sync your data...</p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={exportProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{exportProgress}% complete</p>
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
                <h3 className="text-lg font-medium">Export Complete</h3>
                <p className="text-muted-foreground mt-1">
                  Successfully exported {totalUnitsToExport} units to VETRO
                </p>
              </div>
              {totalConflicts > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Manual Review Required</AlertTitle>
                  <AlertDescription>
                    {totalConflicts} unit(s) require manual review in VETRO due to conflicts.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setStep('select')}>
                  Export More
                </Button>
                <Button onClick={() => window.location.href = '/vetro/logs'}>
                  View Sync Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VetroExport;
