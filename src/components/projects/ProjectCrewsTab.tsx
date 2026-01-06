import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCrews, mockUsers, mockUnits, Crew, Unit } from '@/data/mockData';
import { Users, MoreHorizontal, Plus, UserPlus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectCrewsTabProps {
  projectId: string;
  units: Unit[];
}

const ProjectCrewsTab: React.FC<ProjectCrewsTabProps> = ({ projectId, units }) => {
  const { toast } = useToast();
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  // Get crews that have units assigned in this project
  const projectCrews = mockCrews.filter((crew) => crew.isActive);

  // Get unassigned units for this project
  const projectUnits = units.filter((u) => {
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    return true;
  });

  const unassignedUnits = projectUnits.filter((u) => !u.assignedCrewId);
  const assignedUnits = projectUnits.filter((u) => u.assignedCrewId);

  const getForeman = (foremanId: string) => {
    return mockUsers.find((u) => u.id === foremanId);
  };

  const handleSelectUnit = (unitId: string, checked: boolean) => {
    if (checked) {
      setSelectedUnitIds((prev) => [...prev, unitId]);
    } else {
      setSelectedUnitIds((prev) => prev.filter((id) => id !== unitId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUnitIds(unassignedUnits.map((u) => u.id));
    } else {
      setSelectedUnitIds([]);
    }
  };

  const handleAssignToCrew = (crewId: string) => {
    if (selectedUnitIds.length === 0) {
      toast({
        title: 'No units selected',
        description: 'Please select units to assign.',
        variant: 'destructive',
      });
      return;
    }
    const crew = mockCrews.find((c) => c.id === crewId);
    toast({
      title: 'Units assigned',
      description: `${selectedUnitIds.length} units assigned to ${crew?.name}`,
    });
    setSelectedUnitIds([]);
  };

  const totalSelectedLength = unassignedUnits
    .filter((u) => selectedUnitIds.includes(u.id))
    .reduce((sum, u) => sum + (u.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Crew Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectCrews.map((crew) => {
          const crewUnitsCount = assignedUnits.filter((u) => u.assignedCrewId === crew.id).length;
          const foreman = getForeman(crew.foremanId);

          return (
            <div key={crew.id} className="content-panel p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">{crew.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {foreman?.name || 'No foreman'}
                    </p>
                  </div>
                </div>
                <Badge variant={crew.type === 'internal' ? 'default' : 'secondary'}>
                  {crew.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assigned Units</span>
                <span className="font-medium text-card-foreground">{crewUnitsCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Assignment Section */}
      <div className="content-panel">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">Unit Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Select units and assign them to crews
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="not_assigned">Not Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selection Summary Bar */}
        {selectedUnitIds.length > 0 && (
          <div className="p-3 bg-primary/10 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-primary">
                {selectedUnitIds.length} units selected
              </span>
              <span className="text-muted-foreground">
                Total: {totalSelectedLength.toLocaleString()} ft
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gradient-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign to Crew
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {projectCrews.map((crew) => (
                  <DropdownMenuItem
                    key={crew.id}
                    onClick={() => handleAssignToCrew(crew.id)}
                    className="text-foreground focus:bg-muted"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {crew.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Units Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    unassignedUnits.length > 0 &&
                    selectedUnitIds.length === unassignedUnits.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Unit ID</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Length</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Assigned Crew</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No units found
                </TableCell>
              </TableRow>
            ) : (
              projectUnits.map((unit) => {
                const assignedCrew = unit.assignedCrewId
                  ? mockCrews.find((c) => c.id === unit.assignedCrewId)
                  : null;
                const isSelected = selectedUnitIds.includes(unit.id);
                const isAssigned = !!unit.assignedCrewId;

                return (
                  <TableRow
                    key={unit.id}
                    className={`border-border hover:bg-muted/50 ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectUnit(unit.id, checked as boolean)
                        }
                        disabled={isAssigned}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">
                      {unit.code}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {unit.geometryType}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {unit.length ? `${unit.length} ft` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          unit.status === 'completed'
                            ? 'status-complete'
                            : unit.status === 'in_progress'
                            ? 'status-active'
                            : 'status-pending'
                        }
                      >
                        {unit.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assignedCrew ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-card-foreground">{assignedCrew.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!isAssigned && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            {projectCrews.map((crew) => (
                              <DropdownMenuItem
                                key={crew.id}
                                onClick={() => {
                                  toast({
                                    title: 'Unit assigned',
                                    description: `${unit.code} assigned to ${crew.name}`,
                                  });
                                }}
                                className="text-foreground focus:bg-muted"
                              >
                                Assign to {crew.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectCrewsTab;
