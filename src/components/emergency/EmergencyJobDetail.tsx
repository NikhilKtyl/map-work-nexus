import React, { useState } from 'react';
import { EmergencyJob } from '@/data/emergencyData';
import { mockCustomers, mockProjects, mockUnitTypes, mockUsers } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  MapPin,
  Camera,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightCircle,
  Plus,
  User,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface EmergencyJobDetailProps {
  job: EmergencyJob;
  onClose: () => void;
  onUpdate: (job: EmergencyJob) => void;
}

const EmergencyJobDetail: React.FC<EmergencyJobDetailProps> = ({ job, onClose, onUpdate }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(job.projectId || '');
  const [createNewProject, setCreateNewProject] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const customer = mockCustomers.find((c) => c.id === job.customerId);
  const linkedProject = job.projectId ? mockProjects.find((p) => p.id === job.projectId) : null;
  const createdBy = mockUsers.find((u) => u.id === job.createdBy);
  const reviewedBy = job.reviewedBy ? mockUsers.find((u) => u.id === job.reviewedBy) : null;

  // Get customer's projects
  const customerProjects = mockProjects.filter((p) => p.customer === customer?.name);

  const getSeverityBadge = (severity: EmergencyJob['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: EmergencyJob['status']) => {
    switch (status) {
      case 'pending_review':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'converted':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUnitType = (unitTypeId: string) => mockUnitTypes.find((ut) => ut.id === unitTypeId);

  const handleApprove = () => {
    if (!selectedProjectId && !createNewProject) {
      toast({
        title: 'Project Required',
        description: 'Please select an existing project or create a new one.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const updatedJob: EmergencyJob = {
        ...job,
        status: 'approved',
        projectId: selectedProjectId || undefined,
        reviewedBy: '1', // Current user
        reviewedAt: new Date().toISOString(),
        reviewNotes: reviewNotes || 'Approved',
      };
      
      onUpdate(updatedJob);
      toast({
        title: 'Emergency Job Approved',
        description: `${job.code} has been approved and linked to project.`,
      });
      setIsProcessing(false);
    }, 500);
  };

  const handleConvert = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const updatedJob: EmergencyJob = {
        ...job,
        status: 'converted',
        convertedProjectId: selectedProjectId || job.projectId,
        convertedUnitIds: job.requestedUnits.map((_, i) => `converted-${job.id}-${i}`),
        reviewedBy: job.reviewedBy || '1',
        reviewedAt: job.reviewedAt || new Date().toISOString(),
        reviewNotes: reviewNotes || job.reviewNotes || 'Converted to units',
      };
      
      onUpdate(updatedJob);
      toast({
        title: 'Units Created',
        description: `${job.requestedUnits.length} unit(s) have been created from this emergency job.`,
      });
      setIsProcessing(false);
    }, 500);
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const updatedJob: EmergencyJob = {
        ...job,
        status: 'rejected',
        reviewedBy: '1',
        reviewedAt: new Date().toISOString(),
        reviewNotes,
      };
      
      onUpdate(updatedJob);
      toast({
        title: 'Emergency Job Rejected',
        description: `${job.code} has been rejected.`,
      });
      setIsProcessing(false);
    }, 500);
  };

  const isPending = job.status === 'pending_review';
  const isApproved = job.status === 'approved';
  const canConvert = isApproved && !job.convertedUnitIds?.length;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{job.code}</span>
            {getSeverityBadge(job.severity)}
            {getStatusBadge(job.status)}
          </DialogTitle>
          <DialogDescription>{job.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{customer?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span>{job.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sync Status</span>
                  <Badge variant="outline" className={job.syncState === 'synced' ? 'bg-secondary/10' : 'bg-warning/10'}>
                    {job.syncState}
                  </Badge>
                </div>
                {linkedProject && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Linked Project</span>
                    <span className="font-medium">{linkedProject.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created by</span>
                  <span className="font-medium">{createdBy?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(job.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
                {reviewedBy && (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Reviewed by</span>
                      <span className="font-medium">{reviewedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Reviewed</span>
                      <span>{format(new Date(job.reviewedAt!), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Units Requested */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Requested Units</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.requestedUnits.map((unit) => {
                    const unitType = getUnitType(unit.unitTypeId);
                    return (
                      <TableRow key={unit.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{unitType?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{unitType?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {unitType?.category === 'Line'
                            ? `${unit.quantity} ft`
                            : `${unit.quantity} ea`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{unit.notes || '—'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Documentation */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  GPS Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono">
                  {job.gpsLocation.lat.toFixed(6)}, {job.gpsLocation.lng.toFixed(6)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Sequential Numbers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.sequentialNumbers?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {job.sequentialNumbers.map((seq) => (
                      <Badge key={seq} variant="outline">{seq}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Photos */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({job.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {job.photos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {job.photos.map((photo, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No photos attached</p>
              )}
            </CardContent>
          </Card>

          {/* Review Notes (if already reviewed) */}
          {job.reviewNotes && !isPending && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Review Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{job.reviewNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Decision Panel (for pending jobs) */}
          {isPending && (
            <Card className="border-warning/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Decision Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Link to Project</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select existing project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customerProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Or create a new project for this emergency work
                  </p>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add review notes (required for rejection)..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Convert Panel (for approved jobs) */}
          {canConvert && (
            <Card className="border-primary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ArrowRightCircle className="h-4 w-4 text-primary" />
                  Convert to Units
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This job has been approved. Convert it to create {job.requestedUnits.length} unit(s) 
                  in the linked project.
                </p>
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Add any conversion notes..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isPending && (
            <>
              <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button variant="outline" onClick={onClose}>
                <Clock className="mr-1 h-4 w-4" />
                Defer
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          {canConvert && (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={handleConvert} disabled={isProcessing}>
                <Plus className="mr-1 h-4 w-4" />
                Convert & Create Units
              </Button>
            </>
          )}
          {!isPending && !canConvert && (
            <Button variant="outline" onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyJobDetail;
