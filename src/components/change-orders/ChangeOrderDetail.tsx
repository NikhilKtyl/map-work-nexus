import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  X,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { ChangeOrder, mockProjects, mockUsers, mockUnits } from '@/data/mockData';
import { format } from 'date-fns';

interface ChangeOrderDetailProps {
  changeOrder: ChangeOrder | null;
  onClose: () => void;
  onApprove: (co: ChangeOrder) => void;
  onReject: (co: ChangeOrder) => void;
  onApply: (co: ChangeOrder) => void;
}

const statusConfig: Record<
  ChangeOrder['status'],
  { label: string; icon: React.ReactNode; color: string }
> = {
  open: { label: 'Open', icon: <Clock className="w-4 h-4" />, color: 'text-warning' },
  approved: {
    label: 'Approved',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-secondary',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-destructive',
  },
  applied: {
    label: 'Applied',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-secondary',
  },
};

const ChangeOrderDetail: React.FC<ChangeOrderDetailProps> = ({
  changeOrder,
  onClose,
  onApprove,
  onReject,
  onApply,
}) => {
  if (!changeOrder) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3" />
          <p>Select a change order to view</p>
        </div>
      </div>
    );
  }

  const project = mockProjects.find((p) => p.id === changeOrder.projectId);
  const requestedBy = mockUsers.find((u) => u.id === changeOrder.requestedBy);
  const approvedBy = changeOrder.approvedBy
    ? mockUsers.find((u) => u.id === changeOrder.approvedBy)
    : null;
  const impactedUnits = mockUnits.filter((u) =>
    changeOrder.impactedUnitIds.includes(u.id)
  );
  const status = statusConfig[changeOrder.status];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{changeOrder.code}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={changeOrder.type === 'major' ? 'destructive' : 'outline'}>
              {changeOrder.type === 'major' ? 'Major' : 'Simple'}
            </Badge>
            <Badge variant="secondary" className={`gap-1 ${status.color}`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project</span>
              <span className="font-medium">{project?.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Requested By</span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{requestedBy?.name}</span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Date</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{format(new Date(changeOrder.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            {approvedBy && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Approved By</span>
                <span>{approvedBy.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{changeOrder.description}</p>
            {changeOrder.reason && (
              <>
                <Separator className="my-3" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                  <p className="text-sm text-foreground">{changeOrder.reason}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Impacted Units */}
        {impactedUnits.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Impacted Units ({impactedUnits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {impactedUnits.map((unit) => (
                  <Badge key={unit.id} variant="outline">
                    {unit.code}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Major Change Notice */}
        {changeOrder.type === 'major' && changeOrder.status === 'approved' && (
          <Card className="border-warning">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Customer Approval Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Major changes require customer sign-off before being applied.
                    Design review may be needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Created on {format(new Date(changeOrder.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {changeOrder.status !== 'open' && (
                <div className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      changeOrder.status === 'rejected' ? 'bg-destructive' : 'bg-secondary'
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {changeOrder.status === 'rejected' ? 'Rejected' : 'Approved'} by{' '}
                    {approvedBy?.name}
                  </span>
                </div>
              )}
              {changeOrder.status === 'applied' && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Changes applied to project</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {changeOrder.status === 'open' && (
          <>
            <Button className="w-full" onClick={() => onApprove(changeOrder)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => onReject(changeOrder)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </>
        )}
        {changeOrder.status === 'approved' && (
          <Button className="w-full" onClick={() => onApply(changeOrder)}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChangeOrderDetail;
