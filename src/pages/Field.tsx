import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Map, List, ClipboardCheck, Clock, CheckCircle2 } from 'lucide-react';
import { mockUnits, mockProjects, Unit, UnitStatus } from '@/data/mockData';
import FieldListView from '@/components/field/FieldListView';
import FieldMapView from '@/components/field/FieldMapView';
import UnitWorkPanel from '@/components/field/UnitWorkPanel';

const Field: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [units, setUnits] = useState(mockUnits);

  // Filter units (in real app, would filter by assigned crew)
  const filteredUnits = units.filter((unit) => {
    if (projectFilter !== 'all' && unit.projectId !== projectFilter) return false;
    if (statusFilter !== 'all' && unit.status !== statusFilter) return false;
    return true;
  });

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleUpdateUnit = (unitId: string, updates: Partial<Unit>) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId ? { ...u, ...updates, lastUpdated: new Date().toISOString() } : u
      )
    );
    if (selectedUnit?.id === unitId) {
      setSelectedUnit((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Stats
  const stats = {
    total: filteredUnits.length,
    notStarted: filteredUnits.filter((u) => u.status === 'not_started').length,
    inProgress: filteredUnits.filter((u) => u.status === 'in_progress').length,
    completed: filteredUnits.filter((u) => u.status === 'completed' || u.status === 'verified')
      .length,
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Work</h1>
              <p className="text-muted-foreground">View and complete assigned units</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <ClipboardCheck className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Units</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <Clock className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.notStarted}</p>
                  <p className="text-xs text-muted-foreground">Not Started</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Project</Label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="list" className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="w-4 h-4" />
                Map View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="flex-1 p-6 pt-4 overflow-auto">
            <FieldListView
              units={filteredUnits}
              onSelectUnit={handleSelectUnit}
              selectedUnitId={selectedUnit?.id}
            />
          </TabsContent>

          <TabsContent value="map" className="flex-1 p-6 pt-4">
            <FieldMapView
              units={filteredUnits}
              onSelectUnit={handleSelectUnit}
              selectedUnitId={selectedUnit?.id}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Unit Details */}
      {selectedUnit && (
        <div className="w-96 border-l border-border">
          <UnitWorkPanel
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onUpdateUnit={handleUpdateUnit}
          />
        </div>
      )}
    </div>
  );
};

export default Field;
