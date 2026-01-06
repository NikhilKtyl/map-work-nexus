import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Unit, UnitType, UnitStatus, mockUnitTypes, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';
import {
  X,
  Pencil,
  MapPin,
  Minus,
  Navigation,
  Hash,
  Camera,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface UnitDetailPanelProps {
  unit: Unit;
  onClose: () => void;
  onEdit: () => void;
}

const statusConfig: Record<UnitStatus, { label: string; className: string; icon: React.ReactNode }> = {
  not_started: { label: 'Not Started', className: 'bg-muted text-muted-foreground', icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: 'In Progress', className: 'status-pending', icon: <AlertCircle className="w-3 h-3" /> },
  completed: { label: 'Completed', className: 'status-active', icon: <CheckCircle className="w-3 h-3" /> },
  needs_verification: { label: 'Needs Verification', className: 'bg-secondary/10 text-secondary border-secondary/20', icon: <FileCheck className="w-3 h-3" /> },
  verified: { label: 'Verified', className: 'status-complete', icon: <CheckCircle className="w-3 h-3" /> },
};

const statusTimeline: UnitStatus[] = ['not_started', 'in_progress', 'completed', 'needs_verification', 'verified'];

const UnitDetailPanel: React.FC<UnitDetailPanelProps> = ({ unit, onClose, onEdit }) => {
  const unitType = mockUnitTypes.find((t) => t.id === unit.unitTypeId);
  const assignedCrew = mockUsers.find((u) => u.id === unit.assignedCrewId);
  const status = statusConfig[unit.status];

  const currentStatusIndex = statusTimeline.indexOf(unit.status);
  const progressPercent = ((currentStatusIndex + 1) / statusTimeline.length) * 100;

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">{unit.code}</h3>
          <p className="text-sm text-muted-foreground">{unitType?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${status.className} flex items-center gap-1`}>
              {status.icon}
              {status.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {unit.geometryType === 'Line' ? (
                <Minus className="w-3 h-3 mr-1" />
              ) : (
                <MapPin className="w-3 h-3 mr-1" />
              )}
              {unit.geometryType}
            </Badge>
          </div>

          {/* Status Timeline */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">
              Status Timeline
            </Label>
            <Progress value={progressPercent} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created</span>
              <span>Verified</span>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide block">
              Unit Details
            </Label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Unit ID</p>
                <p className="text-sm font-medium text-card-foreground">{unit.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium text-card-foreground">{unitType?.code}</p>
              </div>
              {unit.length && (
                <div>
                  <p className="text-xs text-muted-foreground">Length</p>
                  <p className="text-sm font-medium text-card-foreground">{unit.length} ft</p>
                </div>
              )}
              {unit.sequentialNumber && (
                <div>
                  <p className="text-xs text-muted-foreground">Sequential #</p>
                  <p className="text-sm font-medium text-card-foreground">#{unit.sequentialNumber}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">
              Pricing
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Price</span>
                </div>
                <p className="text-lg font-bold text-card-foreground">
                  ${unit.price.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sub Rate</span>
                </div>
                <p className="text-lg font-bold text-card-foreground">
                  ${unit.subRate.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          {unitType && (
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">
                Requirements
              </Label>
              <div className="space-y-2">
                <div className={`flex items-center gap-2 p-2 rounded ${unitType.requiresGps ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm">GPS Coordinates</span>
                  {unitType.requiresGps && <Badge variant="outline" className="ml-auto text-xs">Required</Badge>}
                </div>
                <div className={`flex items-center gap-2 p-2 rounded ${unitType.requiresSequential ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">Sequential Numbers</span>
                  {unitType.requiresSequential && <Badge variant="outline" className="ml-auto text-xs">Required</Badge>}
                </div>
                <div className={`flex items-center gap-2 p-2 rounded ${unitType.requiresPhotos ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Photos ({unit.photos.length}/{unitType.minPhotoCount} min)</span>
                  {unitType.requiresPhotos && <Badge variant="outline" className="ml-auto text-xs">Required</Badge>}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Assignment */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-3 block">
              Assignment
            </Label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">
                    {assignedCrew?.name || 'Unassigned'}
                  </p>
                  {unit.assignedDate && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Assigned {format(new Date(unit.assignedDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {unit.notes && (
            <>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                  Notes
                </Label>
                <p className="text-sm text-card-foreground">{unit.notes}</p>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Created</span>
              <span>{format(new Date(unit.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>{format(new Date(unit.lastUpdated), 'MMM d, yyyy h:mm a')}</span>
            </div>
            {unit.completedDate && (
              <div className="flex justify-between">
                <span>Completed</span>
                <span>{format(new Date(unit.completedDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            {unit.verifiedDate && (
              <div className="flex justify-between">
                <span>Verified</span>
                <span>{format(new Date(unit.verifiedDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

// Helper Label component
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <label className={className}>{children}</label>
);

export default UnitDetailPanel;
