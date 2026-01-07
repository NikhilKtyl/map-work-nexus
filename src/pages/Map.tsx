import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Layers,
  MousePointer2,
  Minus,
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Satellite,
  Filter,
  FileText,
  FileImage,
  File,
  Save,
  X,
  PanelLeftClose,
  PanelLeft,
  Mountain,
} from 'lucide-react';
import { mockProjects, mockMapSources, MapSource } from '@/data/mockData';

type DrawingTool = 'select' | 'line' | 'marker' | null;

const Map: React.FC = () => {
  const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const [baseMapType, setBaseMapType] = useState<'satellite' | 'terrain'>('satellite');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedMapFile, setSelectedMapFile] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [layers, setLayers] = useState({
    projects: true,
    units: true,
    crews: false,
  });

  // Get map files for selected project
  const projectMapFiles = useMemo(() => {
    if (!selectedProject) return [];
    return mockMapSources.filter(ms => ms.projectId === selectedProject);
  }, [selectedProject]);

  // Reset map file selection when project changes
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    const projectFiles = mockMapSources.filter(ms => ms.projectId === projectId);
    setSelectedMapFile(projectFiles[0]?.id || '');
  };

  const handleSaveChanges = () => {
    // Save logic would go here
    setHasUnsavedChanges(false);
  };

  const handleCancelChanges = () => {
    // Cancel/revert logic would go here
    setHasUnsavedChanges(false);
  };

  const getFileIcon = (fileType: MapSource['fileType']) => {
    switch (fileType) {
      case 'PDF':
        return FileText;
      case 'IMAGE':
        return FileImage;
      default:
        return File;
    }
  };

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select' },
    { id: 'line' as const, icon: Minus, label: 'Draw Line' },
    { id: 'marker' as const, icon: MapPin, label: 'Draw Marker' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Layers & Filters */}
      <div 
        className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${
          panelCollapsed ? 'w-0 overflow-hidden' : 'w-72'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters & Layers
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setPanelCollapsed(true)}
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Project Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project</Label>
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Map File Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Map File</Label>
            {projectMapFiles.length > 0 ? (
              <Select value={selectedMapFile} onValueChange={setSelectedMapFile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Map File" />
                </SelectTrigger>
                <SelectContent>
                  {projectMapFiles.map((mapFile) => {
                    const FileIcon = getFileIcon(mapFile.fileType);
                    return (
                      <SelectItem key={mapFile.id} value={mapFile.id}>
                        <span className="flex items-center gap-2">
                          <FileIcon className="w-3 h-3" />
                          {mapFile.name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No map files uploaded for this project</p>
            )}
          </div>

          {/* Tool Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tool</Label>
            <Select value={activeTool || 'select'} onValueChange={(val) => setActiveTool(val as DrawingTool)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tool" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    <span className="flex items-center gap-2">
                      <tool.icon className="w-3 h-3" />
                      {tool.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Base Map Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Base Map</Label>
            <div className="flex gap-2">
              <Button
                variant={baseMapType === 'satellite' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setBaseMapType('satellite')}
              >
                <Satellite className="w-4 h-4 mr-1" />
                Satellite
              </Button>
              <Button
                variant={baseMapType === 'terrain' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setBaseMapType('terrain')}
              >
                <Mountain className="w-4 h-4 mr-1" />
                Terrain
              </Button>
            </div>
          </div>

          {/* Layer Toggles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Layers</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Projects</span>
                </div>
                <Switch
                  checked={layers.projects}
                  onCheckedChange={() => toggleLayer('projects')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm">Units</span>
                </div>
                <Switch
                  checked={layers.units}
                  onCheckedChange={() => toggleLayer('units')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm">Crews</span>
                </div>
                <Switch
                  checked={layers.crews}
                  onCheckedChange={() => toggleLayer('crews')}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Expand Panel Button */}
        {panelCollapsed && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 left-4 z-20 h-8 w-8 shadow-md"
            onClick={() => setPanelCollapsed(false)}
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        )}
        {/* Map Placeholder */}
        <div
          className={`absolute inset-0 ${
            baseMapType === 'satellite'
              ? 'bg-gradient-to-br from-green-900 via-green-800 to-blue-900'
              : 'bg-gradient-to-br from-amber-100 via-green-200 to-emerald-300'
          }`}
        >
          {/* Terrain texture for terrain view */}
          {baseMapType === 'terrain' && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 60%, rgba(34, 139, 34, 0.3) 0%, transparent 40%),
                  radial-gradient(circle at 50% 80%, rgba(139, 69, 19, 0.2) 0%, transparent 60%)
                `,
              }}
            />
          )}

          {/* Mock project markers */}
          {layers.projects && (
            <>
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  1
                </div>
              </div>
              <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  2
                </div>
              </div>
              <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  3
                </div>
              </div>
            </>
          )}

          {/* Center message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Layers className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">Global Map View</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect Mapbox for interactive maps
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  View all projects and units across locations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Zoom Controls & Save/Cancel */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Save/Cancel Actions */}
          <Card className="shadow-lg">
            <CardContent className="p-2">
              <div className="flex gap-1">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSaveChanges}
                  className="gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelChanges}
                  className="gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zoom Controls */}
          <div className="flex flex-col gap-1">
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="shadow-lg">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">{mockProjects.length}</strong> Projects
                </span>
                <span>
                  <strong className="text-foreground">24</strong> Units
                </span>
                <span>
                  <strong className="text-foreground">5</strong> Active Crews
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Tool: <Badge variant="outline" className="ml-1">{activeTool || 'None'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
