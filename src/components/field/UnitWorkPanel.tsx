import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Camera,
  MapPin,
  Hash,
  Clock,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Unit, UnitStatus, mockUnitTypes, mockProjects } from '@/data/mockData';

interface UnitWorkPanelProps {
  unit: Unit | null;
  onClose: () => void;
  onUpdateUnit: (unitId: string, updates: Partial<Unit>) => void;
}

const statusOptions: { value: UnitStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const UnitWorkPanel: React.FC<UnitWorkPanelProps> = ({ unit, onClose, onUpdateUnit }) => {
  const [notes, setNotes] = useState(unit?.notes || '');
  const [sequentialNumber, setSequentialNumber] = useState(unit?.sequentialNumber?.toString() || '');
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [requirements, setRequirements] = useState({
    gps: false,
    sequential: false,
    photos: false,
  });

  if (!unit) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Select a unit to view details</p>
        </div>
      </div>
    );
  }

  const unitType = mockUnitTypes.find((ut) => ut.id === unit.unitTypeId);
  const project = mockProjects.find((p) => p.id === unit.projectId);

  const handleStartWork = () => {
    setIsWorking(true);
    setWorkStartTime(new Date());
    onUpdateUnit(unit.id, { status: 'in_progress' });
  };

  const handleEndWork = () => {
    if (workStartTime) {
      const minutes = Math.round((new Date().getTime() - workStartTime.getTime()) / 60000);
      setTotalTime((prev) => prev + minutes);
    }
    setIsWorking(false);
    setWorkStartTime(null);
  };

  const handleMarkComplete = () => {
    onUpdateUnit(unit.id, {
      status: 'completed',
      notes,
      sequentialNumber: sequentialNumber ? parseInt(sequentialNumber) : undefined,
      completedDate: new Date().toISOString(),
    });
  };

  const handleCaptureGPS = () => {
    // Mock GPS capture
    setRequirements((prev) => ({ ...prev, gps: true }));
    console.log('GPS captured');
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    setRequirements((prev) => ({ ...prev, photos: true }));
    console.log('Photo uploaded');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{unit.code}</h3>
          <p className="text-sm text-muted-foreground">{unitType?.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Unit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project</span>
              <span className="font-medium">{project?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline">{unit.geometryType}</Badge>
            </div>
            {unit.length && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Length</span>
                <span className="font-medium">{unit.length} ft</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">${unit.price.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Checklist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unitType?.requiresGps && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={requirements.gps} disabled />
                  <Label className="text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    GPS Capture
                  </Label>
                </div>
                <Button size="sm" variant="outline" onClick={handleCaptureGPS}>
                  Capture
                </Button>
              </div>
            )}

            {unitType?.requiresSequential && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!sequentialNumber} disabled />
                  <Label className="text-sm flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    Sequential #
                  </Label>
                </div>
                <Input
                  className="w-24 h-8"
                  value={sequentialNumber}
                  onChange={(e) => {
                    setSequentialNumber(e.target.value);
                    setRequirements((prev) => ({ ...prev, sequential: !!e.target.value }));
                  }}
                  placeholder="#"
                />
              </div>
            )}

            {unitType?.requiresPhotos && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={requirements.photos} disabled />
                  <Label className="text-sm flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    Photos ({unitType.minPhotoCount} min)
                  </Label>
                </div>
                <Button size="sm" variant="outline" onClick={handlePhotoUpload}>
                  Upload
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Time</span>
              <span className="text-lg font-semibold">{formatTime(totalTime)}</span>
            </div>
            <div className="flex gap-2">
              {!isWorking ? (
                <Button className="flex-1" onClick={handleStartWork}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Work
                </Button>
              ) : (
                <Button className="flex-1" variant="destructive" onClick={handleEndWork}>
                  <Square className="w-4 h-4 mr-2" />
                  End Work
                </Button>
              )}
            </div>
            {isWorking && workStartTime && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Started at {workStartTime.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this unit..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          className="w-full"
          onClick={handleMarkComplete}
          disabled={unit.status === 'completed' || unit.status === 'verified'}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark Complete
        </Button>
      </div>
    </div>
  );
};

export default UnitWorkPanel;
