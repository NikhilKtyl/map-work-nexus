import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  ArrowRight,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { ChangeOrder, mockProjects, mockUsers, mockUnits } from '@/data/mockData';
import { format } from 'date-fns';

interface ChangeOrderViewModalProps {
  open: boolean;
  onClose: () => void;
  changeOrder: ChangeOrder | null;
  onApprove: (co: ChangeOrder) => void;
  onReject: (co: ChangeOrder) => void;
  onApply: (co: ChangeOrder) => void;
}

const statusConfig: Record<
  ChangeOrder['status'],
  { label: string; icon: React.ReactNode; color: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  open: { label: 'Open', icon: <Clock className="w-4 h-4" />, color: 'text-warning', badgeVariant: 'secondary' },
  approved: { label: 'Approved', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-success', badgeVariant: 'default' },
  rejected: { label: 'Rejected', icon: <XCircle className="w-4 h-4" />, color: 'text-destructive', badgeVariant: 'destructive' },
  applied: { label: 'Applied', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-primary', badgeVariant: 'outline' },
};

const ChangeOrderViewModal: React.FC<ChangeOrderViewModalProps> = ({
  open,
  onClose,
  changeOrder,
  onApprove,
  onReject,
  onApply,
}) => {
  if (!changeOrder) return null;

  const project = mockProjects.find((p) => p.id === changeOrder.projectId);
  const requestedBy = mockUsers.find((u) => u.id === changeOrder.requestedBy);
  const approvedBy = changeOrder.approvedBy
    ? mockUsers.find((u) => u.id === changeOrder.approvedBy)
    : null;
  const impactedUnits = mockUnits.filter((u) =>
    changeOrder.impactedUnitIds.includes(u.id)
  );
  const status = statusConfig[changeOrder.status];

  const handleApprove = () => {
    onApprove(changeOrder);
    onClose();
  };

  const handleReject = () => {
    onReject(changeOrder);
    onClose();
  };

  const handleApply = () => {
    onApply(changeOrder);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground text-xl">{changeOrder.code}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={changeOrder.type === 'major' ? 'destructive' : 'outline'}>
                  {changeOrder.type === 'major' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {changeOrder.type === 'major' ? 'Major' : 'Simple'}
                </Badge>
                <Badge variant={status.badgeVariant} className={`gap-1 ${status.color}`}>
                  {status.icon}
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-medium text-card-foreground">{project?.name || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium text-card-foreground capitalize">
                  {changeOrder.changeCategory?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Requested By
                </p>
                <p className="font-medium text-card-foreground">{requestedBy?.name || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date Created
                </p>
                <p className="font-medium text-card-foreground">
                  {format(new Date(changeOrder.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              {approvedBy && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Approved By</p>
                  <p className="font-medium text-card-foreground">{approvedBy.name}</p>
                </div>
              )}
              {changeOrder.approvedAt && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Approved At</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(changeOrder.approvedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Description</h4>
              <p className="text-sm text-foreground">{changeOrder.description}</p>
            </div>

            {/* Reason */}
            {changeOrder.reason && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">Reason</h4>
                <p className="text-sm text-foreground">{changeOrder.reason}</p>
              </div>
            )}

            {/* Impacted Units */}
            {impactedUnits.length > 0 && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">
                  Impacted Units ({impactedUnits.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {impactedUnits.map((unit) => (
                    <Badge key={unit.id} variant="outline">
                      {unit.code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Major Change Notice */}
            {changeOrder.type === 'major' && changeOrder.status === 'approved' && (
              <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Customer Approval Required</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Major changes require customer sign-off before being applied. Design review may be needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History Timeline */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">History</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Created on {format(new Date(changeOrder.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                {changeOrder.status !== 'open' && (
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        changeOrder.status === 'rejected' ? 'bg-destructive' : 'bg-success'
                      }`}
                    />
                    <span className="text-muted-foreground">
                      {changeOrder.status === 'rejected' ? 'Rejected' : 'Approved'} by {approvedBy?.name}
                    </span>
                  </div>
                )}
                {changeOrder.status === 'applied' && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Changes applied to project</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          {changeOrder.status === 'open' && (
            <>
              <Button className="flex-1" onClick={handleApprove}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {changeOrder.status === 'approved' && (
            <Button className="flex-1" onClick={handleApply}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeOrderViewModal;
