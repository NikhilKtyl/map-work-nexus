import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';
import {
  mockProjects,
  mockUnits,
  mockUnitTypes,
  mockExportRecords,
  Project,
  Unit,
  ExportRecord,
  UnitStatus,
} from '@/data/mockData';
import { toast } from 'sonner';
import CompletionSummary from '@/components/completion/CompletionSummary';
import AsBuiltModal from '@/components/completion/AsBuiltModal';
import ExportModal from '@/components/completion/ExportModal';
import ExportHistory from '@/components/completion/ExportHistory';

const statusConfig: Record<UnitStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  not_started: { label: 'Not Started', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  needs_verification: { label: 'Needs Review', variant: 'destructive' },
  verified: { label: 'Verified', variant: 'secondary' },
};

const Completion: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAsBuiltOpen, setIsAsBuiltOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportRecords, setExportRecords] = useState<ExportRecord[]>(mockExportRecords);

  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId) || null;
  
  const projectUnits = mockUnits.filter((u) => u.projectId === selectedProjectId);
  const filteredUnits = projectUnits.filter((u) => {
    if (statusFilter === 'all') return true;
    return u.status === statusFilter;
  });

  const getUnitType = (unitTypeId: string) => mockUnitTypes.find((ut) => ut.id === unitTypeId);

  const handleAsBuiltGenerate = (config: any) => {
    const newRecord: ExportRecord = {
      id: `exp${Date.now()}`,
      projectId: selectedProjectId,
      fileName: `AsBuilt_${selectedProject?.code}_${new Date().toISOString().split('T')[0]}.pdf`,
      type: 'as_built_pdf',
      generatedBy: '2',
      createdAt: new Date().toISOString(),
    };
    setExportRecords((prev) => [newRecord, ...prev]);
    toast.success('As-Built PDF generated successfully');
  };

  const handleExport = (config: any) => {
    const newRecord: ExportRecord = {
      id: `exp${Date.now()}`,
      projectId: selectedProjectId,
      fileName: `${config.exportType === 'ce_upload' ? 'CE_Export' : 'Units'}_${selectedProject?.code}_${new Date().toISOString().split('T')[0]}.csv`,
      type: config.exportType,
      generatedBy: '2',
      createdAt: new Date().toISOString(),
    };
    setExportRecords((prev) => [newRecord, ...prev]);
    toast.success('Export file generated successfully');
  };

  const handleDownload = (record: ExportRecord) => {
    toast.info(`Downloading ${record.fileName}...`);
  };

  const projectExports = exportRecords.filter((e) => e.projectId === selectedProjectId);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Completion & Export</h1>
          <p className="text-muted-foreground">
            Track completion progress and generate exports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsAsBuiltOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Generate As-Built
          </Button>
          <Button onClick={() => setIsExportOpen(true)}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Prepare CE Export
          </Button>
        </div>
      </div>

      {/* Project Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProject && (
              <div className="flex items-center gap-4 ml-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>{' '}
                  <span className="font-medium">{selectedProject.customer}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Code:</span>{' '}
                  <span className="font-medium">{selectedProject.code}</span>
                </div>
                <Badge
                  variant={selectedProject.status === 'completed' ? 'secondary' : 'default'}
                >
                  {selectedProject.status.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {selectedProject && (
        <CompletionSummary units={projectUnits} projectName={selectedProject.name} />
      )}

      <Separator />

      {/* Units List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Unit Status</h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Unit Type</TableHead>
                <TableHead>Geometry</TableHead>
                <TableHead className="text-right">Length</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No units found for selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => {
                  const unitType = getUnitType(unit.unitTypeId);
                  const status = statusConfig[unit.status];
                  return (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.code}</TableCell>
                      <TableCell>{unitType?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{unit.geometryType}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {unit.length ? `${unit.length} ft` : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {unit.completedDate
                          ? new Date(unit.completedDate).toLocaleDateString()
                          : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator />

      {/* Export History */}
      <ExportHistory exports={projectExports} onDownload={handleDownload} />

      {/* Modals */}
      <AsBuiltModal
        open={isAsBuiltOpen}
        onClose={() => setIsAsBuiltOpen(false)}
        project={selectedProject}
        onGenerate={handleAsBuiltGenerate}
      />
      <ExportModal
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={selectedProject}
        onExport={handleExport}
      />
    </div>
  );
};

export default Completion;
