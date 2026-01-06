import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  mockProjects,
  mockUsers,
  mockMapSources,
  mockUnits,
  Project,
  MapSource,
  Unit,
} from '@/data/mockData';
import ProjectModal from '@/components/projects/ProjectModal';
import MapSourcesList from '@/components/map/MapSourcesList';
import MapUploadModal from '@/components/map/MapUploadModal';
import ProjectMapView from '@/components/map/ProjectMapView';
import UnitsListComponent from '@/components/units/UnitsList';
import UnitCreationModal from '@/components/units/UnitCreationModal';
import UnitDetailPanel from '@/components/units/UnitDetailPanel';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Pencil,
  Map,
  Boxes,
  Users,
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Archive,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusStyles: Record<Project['status'], string> = {
  planning: 'status-pending',
  in_progress: 'status-active',
  completed: 'status-complete',
};

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUnitCreationOpen, setIsUnitCreationOpen] = useState(false);
  const [creationGeometryType, setCreationGeometryType] = useState<'Line' | 'Marker'>('Line');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Project data
  const project = mockProjects.find((p) => p.id === id);

  // Map sources for this project
  const [mapSources, setMapSources] = useState<MapSource[]>(
    mockMapSources.filter((m) => m.projectId === id)
  );

  // Units for this project
  const [units, setUnits] = useState<Unit[]>(
    mockUnits.filter((u) => u.projectId === id)
  );

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/projects')} variant="outline">
          Back to Projects
        </Button>
      </div>
    );
  }

  const progress = project.totalUnits > 0
    ? Math.round((project.unitsCompleted / project.totalUnits) * 100)
    : 0;

  const feetProgress = project.totalFeet > 0
    ? Math.round((project.completedFeet / project.totalFeet) * 100)
    : 0;

  const getAssignedUser = (userId?: string) => {
    if (!userId) return null;
    return mockUsers.find((u) => u.id === userId);
  };

  const handleSaveProject = (data: Partial<Project>) => {
    toast({ title: 'Project updated', description: 'Changes have been saved.' });
  };

  // Map source handlers
  const handleUploadMapSource = (data: Partial<MapSource>) => {
    const newSource: MapSource = {
      id: String(Date.now()),
      projectId: project.id,
      name: data.name || '',
      fileName: data.fileName || '',
      fileType: data.fileType || 'IMAGE',
      fileSize: data.fileSize || 0,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      layerCategory: data.layerCategory || 'Reference',
      isPrimary: mapSources.length === 0,
      uploadedBy: '1',
    };
    setMapSources((prev) => [...prev, newSource]);
    toast({ title: 'Map uploaded', description: 'Processing your map file...' });

    // Simulate processing
    setTimeout(() => {
      setMapSources((prev) =>
        prev.map((s) => (s.id === newSource.id ? { ...s, status: 'processed' } : s))
      );
      toast({ title: 'Map processed', description: `${newSource.name} is ready to use.` });
    }, 2000);
  };

  const handleSetPrimary = (id: string) => {
    setMapSources((prev) =>
      prev.map((s) => ({ ...s, isPrimary: s.id === id }))
    );
    toast({ title: 'Primary map updated' });
  };

  const handleRemoveMapSource = (id: string) => {
    setMapSources((prev) => prev.filter((s) => s.id !== id));
    toast({ title: 'Map source removed' });
  };

  // Unit handlers
  const handleCreateUnit = (geometryType: 'Line' | 'Marker') => {
    setCreationGeometryType(geometryType);
    setIsUnitCreationOpen(true);
  };

  const handleSaveUnit = (data: Partial<Unit>) => {
    const newUnit: Unit = {
      id: String(Date.now()),
      projectId: project.id,
      unitTypeId: data.unitTypeId || '',
      code: `${project.code.split('-')[0]}-${Date.now().toString().slice(-4)}`,
      geometryType: data.geometryType || 'Line',
      length: data.length,
      coordinates: data.coordinates || [],
      price: data.price || 0,
      subRate: data.subRate || 0,
      status: 'not_started',
      notes: data.notes || '',
      photos: [],
      gpsReadings: [],
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUnits((prev) => [...prev, newUnit]);
    toast({ title: 'Unit created', description: `${newUnit.code} has been added to the project.` });
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button and header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/projects')}
            className="text-muted-foreground hover:text-foreground mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <Badge className={`${statusStyles[project.status]} text-xs font-medium`}>
                {statusLabels[project.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{project.code}</span>
              <span>•</span>
              <span>{project.customer}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="border-border text-foreground hover:bg-muted"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-border text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem className="text-foreground focus:bg-muted">
                <Archive className="w-4 h-4 mr-2" />
                Archive Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted border border-border p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Map
          </TabsTrigger>
          <TabsTrigger value="units" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Units
          </TabsTrigger>
          <TabsTrigger value="crews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Crews
          </TabsTrigger>
          <TabsTrigger value="change-orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Change Orders
          </TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Exports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Units Completed</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {project.unitsCompleted} / {project.totalUnits}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Boxes className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Feet Completed</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {project.completedFeet.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={feetProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  of {project.totalFeet.toLocaleString()} total feet
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Timeline</p>
                  <p className="text-lg font-bold text-card-foreground mt-1">
                    {format(new Date(project.startDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
              </div>
              {project.endDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  End: {format(new Date(project.endDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {project.budget
                      ? `$${(project.budget / 1000000).toFixed(2)}M`
                      : 'Not set'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick links and details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="content-panel p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-card-foreground hover:bg-muted"
                  onClick={() => setActiveTab('map')}
                >
                  <Map className="w-4 h-4 mr-3 text-primary" />
                  Open Map View
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border text-card-foreground hover:bg-muted"
                  onClick={() => setActiveTab('units')}
                >
                  <Boxes className="w-4 h-4 mr-3 text-success" />
                  Manage Units
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-card-foreground hover:bg-muted">
                  <Users className="w-4 h-4 mr-3 text-warning" />
                  Assign Crews
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-card-foreground hover:bg-muted">
                  <Download className="w-4 h-4 mr-3 text-secondary" />
                  Generate As-Built
                </Button>
                <Button variant="outline" className="w-full justify-start border-border text-card-foreground hover:bg-muted">
                  <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                  Generate CE Export
                </Button>
              </div>
            </div>

            {/* Project Details */}
            <div className="content-panel p-6 lg:col-span-2">
              <h3 className="font-semibold text-card-foreground mb-4">Project Details</h3>
              
              {project.description && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-card-foreground">{project.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Coordinator</p>
                  <p className="text-card-foreground font-medium">
                    {getAssignedUser(project.assignedPc)?.name || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Field Manager</p>
                  <p className="text-card-foreground font-medium">
                    {getAssignedUser(project.assignedFm)?.name || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Default Foreman</p>
                  <p className="text-card-foreground font-medium">
                    {getAssignedUser(project.defaultForeman)?.name || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-card-foreground font-medium">
                    {format(new Date(project.lastUpdated), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-6">
          {/* Map Sources */}
          <div className="content-panel p-6">
            <MapSourcesList
              sources={mapSources}
              onUpload={() => setIsUploadModalOpen(true)}
              onSetPrimary={handleSetPrimary}
              onReplace={(id) => toast({ title: 'Replace not implemented', description: 'This would open file picker.' })}
              onRemove={handleRemoveMapSource}
            />
          </div>

          {/* Interactive Map */}
          <ProjectMapView
            mapSources={mapSources}
            units={units}
            onCreateUnit={handleCreateUnit}
            onSelectUnit={handleSelectUnit}
          />
        </TabsContent>

        {/* Units Tab */}
        <TabsContent value="units">
          <div className="flex gap-0">
            <div className={`flex-1 transition-all ${selectedUnit ? 'mr-0' : ''}`}>
              <UnitsListComponent
                units={units}
                onSelectUnit={handleSelectUnit}
              />
            </div>
            {selectedUnit && (
              <UnitDetailPanel
                unit={selectedUnit}
                onClose={() => setSelectedUnit(null)}
                onEdit={() => toast({ title: 'Edit not implemented' })}
              />
            )}
          </div>
        </TabsContent>

        {/* Crews Tab */}
        <TabsContent value="crews">
          <div className="content-panel p-12 text-center">
            <Users className="w-16 h-16 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Crew Assignments</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Assign crews to units, manage schedules, and track crew performance.
            </p>
            <Button className="gradient-primary mt-6">
              Manage Crews
            </Button>
          </div>
        </TabsContent>

        {/* Change Orders Tab */}
        <TabsContent value="change-orders">
          <div className="content-panel p-12 text-center">
            <FileText className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Change Orders</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              View and manage project change orders, track approvals and budget impacts.
            </p>
            <Button className="gradient-primary mt-6">
              View Change Orders
            </Button>
          </div>
        </TabsContent>

        {/* Exports Tab */}
        <TabsContent value="exports">
          <div className="content-panel p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-medium text-card-foreground">As-Built Export</h4>
                    <p className="text-sm text-muted-foreground">Generate as-built documentation</p>
                  </div>
                </div>
                <Button className="w-full gradient-primary">Generate As-Built</Button>
              </div>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-8 h-8 text-success" />
                  <div>
                    <h4 className="font-medium text-card-foreground">CE Export</h4>
                    <p className="text-sm text-muted-foreground">Export for cost estimation</p>
                  </div>
                </div>
                <Button className="w-full gradient-primary">Generate CE Export</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        onSave={handleSaveProject}
      />

      <MapUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleUploadMapSource}
      />

      <UnitCreationModal
        open={isUnitCreationOpen}
        onClose={() => setIsUnitCreationOpen(false)}
        project={project}
        geometryType={creationGeometryType}
        calculatedLength={Math.floor(Math.random() * 500) + 100}
        onSave={handleSaveUnit}
      />
    </div>
  );
};

export default ProjectDetail;
