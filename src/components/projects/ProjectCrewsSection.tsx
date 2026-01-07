import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCrews, mockUsers, Crew, Unit } from '@/data/mockData';
import { Users, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectCrewsSectionProps {
  projectId: string;
  units: Unit[];
}

const ProjectCrewsSection: React.FC<ProjectCrewsSectionProps> = ({ projectId, units }) => {
  const { toast } = useToast();
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [selectedCrewToAdd, setSelectedCrewToAdd] = useState<string>('');

  // Get crews assigned to this project
  const projectCrews = mockCrews.filter(
    (crew) => crew.isActive && crew.projectIds.includes(projectId)
  );

  // Get available crews not yet assigned to this project
  const availableCrews = mockCrews.filter(
    (crew) => crew.isActive && !crew.projectIds.includes(projectId)
  );

  const assignedUnits = units.filter((u) => u.assignedCrewId);

  const getForeman = (foremanId: string) => {
    return mockUsers.find((u) => u.id === foremanId);
  };

  const handleAddCrewToProject = () => {
    if (!selectedCrewToAdd) return;
    const crew = mockCrews.find((c) => c.id === selectedCrewToAdd);
    if (crew) {
      crew.projectIds.push(projectId);
      toast({
        title: 'Crew added',
        description: `${crew.name} has been added to this project`,
      });
    }
    setSelectedCrewToAdd('');
    setShowAddCrewModal(false);
  };

  const handleRemoveCrewFromProject = (crewId: string) => {
    const crew = mockCrews.find((c) => c.id === crewId);
    if (crew) {
      const crewUnitsInProject = units.filter((u) => u.assignedCrewId === crewId);
      if (crewUnitsInProject.length > 0) {
        toast({
          title: 'Cannot remove crew',
          description: `${crew.name} has ${crewUnitsInProject.length} assigned units. Reassign them first.`,
          variant: 'destructive',
        });
        return;
      }
      crew.projectIds = crew.projectIds.filter((id) => id !== projectId);
      toast({
        title: 'Crew removed',
        description: `${crew.name} has been removed from this project`,
      });
    }
  };

  return (
    <div className="content-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-card-foreground">Project Crews</h3>
          <p className="text-sm text-muted-foreground">
            {projectCrews.length} crews assigned to this project
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddCrewModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Crew
        </Button>
      </div>

      {projectCrews.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h4 className="font-medium text-card-foreground mb-1">No crews assigned</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add crews to this project to start assigning units
          </p>
          <Button variant="outline" onClick={() => setShowAddCrewModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Crew
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectCrews.map((crew) => {
            const crewUnitsCount = assignedUnits.filter((u) => u.assignedCrewId === crew.id).length;
            const foreman = getForeman(crew.foremanId);

            return (
              <div key={crew.id} className="p-4 bg-muted/50 rounded-lg border border-border">
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
                  <div className="flex items-center gap-2">
                    <Badge variant={crew.type === 'internal' ? 'default' : 'secondary'}>
                      {crew.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveCrewFromProject(crew.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Units</span>
                  <span className="font-medium text-card-foreground">{crewUnitsCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Crew Modal */}
      <Dialog open={showAddCrewModal} onOpenChange={setShowAddCrewModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Crew to Project</DialogTitle>
            <DialogDescription>
              Select a crew to add to this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {availableCrews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                All active crews are already assigned to this project
              </p>
            ) : (
              <Select value={selectedCrewToAdd} onValueChange={setSelectedCrewToAdd}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a crew..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCrews.map((crew) => {
                    const foreman = getForeman(crew.foremanId);
                    return (
                      <SelectItem key={crew.id} value={crew.id}>
                        <div className="flex items-center gap-2">
                          <span>{crew.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({crew.type} • {foreman?.name || 'No foreman'})
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCrewModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCrewToProject}
              disabled={!selectedCrewToAdd || availableCrews.length === 0}
            >
              Add Crew
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectCrewsSection;
