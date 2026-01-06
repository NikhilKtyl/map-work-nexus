import React from 'react';
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
import { MoreHorizontal, Pencil, Eye, Users, Plus } from 'lucide-react';
import { Crew, mockUsers } from '@/data/mockData';

interface CrewsListProps {
  crews: Crew[];
  onCreateCrew: () => void;
  onEditCrew: (crew: Crew) => void;
  onViewUnits: (crew: Crew) => void;
}

const CrewsList: React.FC<CrewsListProps> = ({
  crews,
  onCreateCrew,
  onEditCrew,
  onViewUnits,
}) => {
  const getForeman = (foremanId: string) => {
    return mockUsers.find((u) => u.id === foremanId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Crews</h2>
          <p className="text-sm text-muted-foreground">
            Manage internal teams and subcontractors
          </p>
        </div>
        <Button onClick={onCreateCrew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Crew
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crew Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Foreman</TableHead>
              <TableHead className="text-center">Members</TableHead>
              <TableHead className="text-center">Assigned Units</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No crews found. Create your first crew to get started.
                </TableCell>
              </TableRow>
            ) : (
              crews.map((crew) => {
                const foreman = getForeman(crew.foremanId);
                return (
                  <TableRow key={crew.id}>
                    <TableCell className="font-medium">{crew.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={crew.type === 'internal' ? 'default' : 'secondary'}
                      >
                        {crew.type === 'internal' ? 'Internal' : 'Subcontractor'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {foreman ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {foreman.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-sm">{foreman.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{crew.memberIds.length + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{crew.assignedUnitsCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={crew.isActive ? 'default' : 'secondary'}
                        className={crew.isActive ? 'bg-secondary text-secondary-foreground' : ''}
                      >
                        {crew.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditCrew(crew)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Crew
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewUnits(crew)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Assigned Units
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default CrewsList;
