import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Camera,
  Hash,
  FileText,
  X,
  Map,
  AlertCircle,
} from 'lucide-react';
import { Unit, mockUnitTypes, mockProjects, mockCrews } from '@/data/mockData';
import { format } from 'date-fns';

interface VerificationPanelProps {
  unit: Unit | null;
  onClose: () => void;
  onApprove: (unitId: string) => void;
  onReject: (unitId: string, comment: string) => void;
}

const VerificationPanel: React.FC<VerificationPanelProps> = ({
  unit,
  onClose,
  onApprove,
  onReject,
}) => {
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!unit) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3" />
          <p>Select a unit to review</p>
        </div>
      </div>
    );
  }

  const unitType = mockUnitTypes.find((ut) => ut.id === unit.unitTypeId);
  const project = mockProjects.find((p) => p.id === unit.projectId);
  const crew = mockCrews.find((c) => c.id === unit.assignedCrewId);

  const handleReject = () => {
    if (rejectComment.trim()) {
      onReject(unit.id, rejectComment);
      setRejectComment('');
      setShowRejectForm(false);
    }
  };

  const docChecks = {
    gps: unitType?.requiresGps ? unit.gpsReadings.length > 0 : null,
    photos: unitType?.requiresPhotos ? unit.photos.length >= (unitType?.minPhotoCount || 0) : null,
    sequential: unitType?.requiresSequential ? !!unit.sequentialNumber : null,
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
              <span className="text-muted-foreground">Crew</span>
              <span className="font-medium">{crew?.name || '—'}</span>
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
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">
                {unit.completedDate
                  ? format(new Date(unit.completedDate), 'MMM d, yyyy')
                  : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Map Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Map className="w-4 h-4" />
              Location Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Map preview placeholder</p>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Review */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Documentation Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {docChecks.gps !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">GPS Coordinates</span>
                </div>
                {docChecks.gps ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Captured
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Missing
                  </Badge>
                )}
              </div>
            )}

            {docChecks.photos !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Photos ({unit.photos.length}/{unitType?.minPhotoCount})
                  </span>
                </div>
                {docChecks.photos ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Incomplete
                  </Badge>
                )}
              </div>
            )}

            {docChecks.sequential !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Sequential Number</span>
                </div>
                {docChecks.sequential ? (
                  <Badge variant="secondary" className="gap-1">
                    #{unit.sequentialNumber}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Missing
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos */}
        {unit.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {unit.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {unit.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Field Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{unit.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Reject Form */}
        {showRejectForm && (
          <Card className="border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive">Rejection Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Explain why this unit is being rejected..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  disabled={!rejectComment.trim()}
                  className="flex-1"
                >
                  Confirm Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      {!showRejectForm && (
        <div className="p-4 border-t border-border space-y-2">
          <Button className="w-full" onClick={() => onApprove(unit.id)}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve & Verify
          </Button>
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setShowRejectForm(true)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject & Send Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationPanel;
