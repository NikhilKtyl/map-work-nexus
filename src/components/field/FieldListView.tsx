import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Unit, mockUnitTypes, mockProjects, UnitStatus } from '@/data/mockData';

interface FieldListViewProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  selectedUnitId?: string;
}

const statusConfig: Record<UnitStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  not_started: { label: 'Not Started', variant: 'outline' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  needs_verification: { label: 'Needs Verification', variant: 'destructive' },
  verified: { label: 'Verified', variant: 'secondary' },
};

const FieldListView: React.FC<FieldListViewProps> = ({ units, onSelectUnit, selectedUnitId }) => {
  const getUnitType = (unitTypeId: string) => mockUnitTypes.find((ut) => ut.id === unitTypeId);
  const getProject = (projectId: string) => mockProjects.find((p) => p.id === projectId);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit ID</TableHead>
            <TableHead>Unit Type</TableHead>
            <TableHead>Project</TableHead>
            <TableHead className="text-right">Length</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No units assigned to you.
              </TableCell>
            </TableRow>
          ) : (
            units.map((unit) => {
              const unitType = getUnitType(unit.unitTypeId);
              const project = getProject(unit.projectId);
              const status = statusConfig[unit.status];

              return (
                <TableRow
                  key={unit.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedUnitId === unit.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => onSelectUnit(unit)}
                >
                  <TableCell className="font-medium">{unit.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {unit.geometryType}
                      </Badge>
                      {unitType?.name || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project?.name || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {unit.length ? `${unit.length} ft` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FieldListView;
