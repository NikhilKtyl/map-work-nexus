import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MapPin, Camera, Hash, AlertCircle, CheckCircle } from 'lucide-react';
import { Unit, mockUnitTypes, mockProjects, mockCrews, UnitStatus } from '@/data/mockData';
import { format } from 'date-fns';

interface VerificationQueueProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  selectedUnitId?: string;
}

const VerificationQueue: React.FC<VerificationQueueProps> = ({
  units,
  onSelectUnit,
  selectedUnitId,
}) => {
  const getUnitType = (unitTypeId: string) => mockUnitTypes.find((ut) => ut.id === unitTypeId);
  const getProject = (projectId: string) => mockProjects.find((p) => p.id === projectId);
  const getCrew = (crewId?: string) => mockCrews.find((c) => c.id === crewId);

  const getDocStatus = (unit: Unit, unitType: ReturnType<typeof getUnitType>) => {
    const checks = {
      gps: unitType?.requiresGps ? unit.gpsReadings.length > 0 : null,
      photos: unitType?.requiresPhotos ? unit.photos.length >= (unitType?.minPhotoCount || 0) : null,
      sequential: unitType?.requiresSequential ? !!unit.sequentialNumber : null,
    };
    return checks;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Unit ID</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Documentation</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No units awaiting verification.
              </TableCell>
            </TableRow>
          ) : (
            units.map((unit) => {
              const unitType = getUnitType(unit.unitTypeId);
              const project = getProject(unit.projectId);
              const crew = getCrew(unit.assignedCrewId);
              const docStatus = getDocStatus(unit, unitType);
              const allDocsComplete = Object.values(docStatus).every((v) => v === null || v === true);

              return (
                <TableRow
                  key={unit.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedUnitId === unit.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => onSelectUnit(unit)}
                >
                  <TableCell>
                    <Checkbox checked={selectedUnitId === unit.id} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{unit.code}</span>
                      <p className="text-xs text-muted-foreground">{unitType?.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project?.name || '—'}
                  </TableCell>
                  <TableCell>
                    {crew ? (
                      <Badge variant="outline">{crew.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {unit.completedDate
                      ? format(new Date(unit.completedDate), 'MMM d, yyyy')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {docStatus.gps !== null && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            docStatus.gps ? 'text-secondary' : 'text-destructive'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          {docStatus.gps ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        </div>
                      )}
                      {docStatus.photos !== null && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            docStatus.photos ? 'text-secondary' : 'text-destructive'
                          }`}
                        >
                          <Camera className="w-3 h-3" />
                          {docStatus.photos ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        </div>
                      )}
                      {docStatus.sequential !== null && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            docStatus.sequential ? 'text-secondary' : 'text-destructive'
                          }`}
                        >
                          <Hash className="w-3 h-3" />
                          {docStatus.sequential ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        </div>
                      )}
                      {allDocsComplete && (
                        <Badge variant="secondary" className="text-xs">Complete</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={unit.status === 'needs_verification' ? 'destructive' : 'default'}
                    >
                      {unit.status === 'needs_verification' ? 'Needs Review' : 'Completed'}
                    </Badge>
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

export default VerificationQueue;
