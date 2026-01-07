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
import { Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
import { ChangeOrder, mockProjects, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';

interface ChangeOrdersListProps {
  changeOrders: ChangeOrder[];
  onCreateNew: () => void;
  onViewDetail: (co: ChangeOrder) => void;
  onApprove: (co: ChangeOrder) => void;
  onReject: (co: ChangeOrder) => void;
}

const statusConfig: Record<ChangeOrder['status'], { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  open: { label: 'Open', variant: 'default' },
  approved: { label: 'Approved', variant: 'secondary' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  applied: { label: 'Applied', variant: 'secondary' },
};

const ChangeOrdersList: React.FC<ChangeOrdersListProps> = ({
  changeOrders,
  onCreateNew,
  onViewDetail,
  onApprove,
  onReject,
}) => {
  const getProject = (projectId: string) => mockProjects.find((p) => p.id === projectId);
  const getUser = (userId: string) => mockUsers.find((u) => u.id === userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Change Orders</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage change requests
          </p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Change Order
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changeOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No change orders found.
                </TableCell>
              </TableRow>
            ) : (
              changeOrders.map((co) => {
                const project = getProject(co.projectId);
                const requestedBy = getUser(co.requestedBy);
                const status = statusConfig[co.status];

                return (
                  <TableRow key={co.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{co.code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {project?.name || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={co.type === 'major' ? 'destructive' : 'outline'}
                      >
                        {co.type === 'major' ? 'Major' : 'Simple'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {co.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {requestedBy?.name || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(co.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onViewDetail(co)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {co.status === 'open' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-600"
                              onClick={() => onApprove(co)}
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onReject(co)}
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
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

export default ChangeOrdersList;
