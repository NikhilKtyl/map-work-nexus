import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Unit, UnitType, UnitStatus, mockUnitTypes, mockUsers, mockCrews } from '@/data/mockData';
import { format } from 'date-fns';
import { Search, Minus, MapPin, Users, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnitsListProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  onAddUnit?: () => void;
  projectId?: string;
}

const statusConfig: Record<UnitStatus, { label: string; className: string }> = {
  not_started: { label: 'Not Started', className: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', className: 'status-pending' },
  completed: { label: 'Completed', className: 'status-active' },
  needs_verification: { label: 'Needs Verification', className: 'bg-secondary/10 text-secondary border-secondary/20' },
  verified: { label: 'Verified', className: 'status-complete' },
};

const UnitsListComponent: React.FC<UnitsListProps> = ({ units, onSelectUnit, onAddUnit, projectId }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [crewFilter, setCrewFilter] = useState<string>('all');

  const crews = mockUsers.filter((u) => u.role === 'crew' || u.role === 'foreman');
  const projectCrews = mockCrews.filter((c) => c.isActive && (!projectId || c.projectIds.includes(projectId)));

  const getUnitType = (unitTypeId: string): UnitType | undefined => {
    return mockUnitTypes.find((ut) => ut.id === unitTypeId);
  };

  const getCrewName = (crewId?: string): string => {
    if (!crewId) return 'Unassigned';
    const crew = mockCrews.find((c) => c.id === crewId);
    if (crew) return crew.name;
    const user = mockUsers.find((u) => u.id === crewId);
    return user?.name || 'Unknown';
  };

  const handleAssignCrew = (unitId: string, crewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const crew = mockCrews.find((c) => c.id === crewId);
    const unit = units.find((u) => u.id === unitId);
    if (crew && unit) {
      toast({
        title: 'Crew Assigned',
        description: `${unit.code} assigned to ${crew.name}`,
      });
    }
  };

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    const matchesType = typeFilter === 'all' || unit.unitTypeId === typeFilter;
    const matchesCrew =
      crewFilter === 'all' ||
      (crewFilter === 'unassigned' && !unit.assignedCrewId) ||
      unit.assignedCrewId === crewFilter;
    return matchesSearch && matchesStatus && matchesType && matchesCrew;
  });

  // Summary stats
  const totalUnits = units.length;
  const completedUnits = units.filter((u) => u.status === 'completed' || u.status === 'verified').length;
  const progressPercent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Units</p>
          <p className="text-2xl font-bold text-card-foreground">{totalUnits}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-success">{completedUnits}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-warning">
            {units.filter((u) => u.status === 'in_progress').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground mb-2">Progress</p>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</p>
        </div>
      </div>

      {/* Filters + Add Button */}
      <div className="content-panel p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by unit code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-border"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-muted border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="needs_verification">Needs Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] bg-muted border-border">
                <SelectValue placeholder="Unit Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                {mockUnitTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={crewFilter} onValueChange={setCrewFilter}>
              <SelectTrigger className="w-[150px] bg-muted border-border">
                <SelectValue placeholder="Crew" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Crews</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projectCrews.map((crew) => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {onAddUnit && (
              <Button onClick={onAddUnit} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Unit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="content-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Unit</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Geometry</TableHead>
              <TableHead className="text-muted-foreground font-medium">Length</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Assigned Crew</TableHead>
              <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => {
              const unitType = getUnitType(unit.unitTypeId);
              const status = statusConfig[unit.status];
              return (
                <TableRow
                  key={unit.id}
                  className="border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => onSelectUnit(unit)}
                >
                  <TableCell>
                    <div className="font-medium text-card-foreground">{unit.code}</div>
                    {unit.sequentialNumber && (
                      <div className="text-xs text-muted-foreground">Seq #{unit.sequentialNumber}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {unitType?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {unit.geometryType === 'Line' ? (
                        <Minus className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {unit.geometryType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {unit.length ? `${unit.length} ft` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${status.className}`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={unit.assignedCrewId || 'unassigned'}
                      onValueChange={(crewId) => {
                        if (crewId !== 'unassigned') {
                          handleAssignCrew(unit.id, crewId, { stopPropagation: () => {} } as React.MouseEvent);
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-[140px] bg-background border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <SelectValue>
                            {unit.assignedCrewId ? getCrewName(unit.assignedCrewId) : 'Unassigned'}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {projectCrews.map((crew) => (
                          <SelectItem key={crew.id} value={crew.id}>
                            {crew.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(unit.lastUpdated), 'MMM d, h:mm a')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredUnits.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No units found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitsListComponent;
