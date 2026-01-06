import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  mockChangeOrders,
  mockUsers,
  ChangeOrder,
} from '@/data/mockData';
import ChangeOrderModal from '@/components/change-orders/ChangeOrderModal';
import ChangeOrderDetail from '@/components/change-orders/ChangeOrderDetail';
import {
  Plus,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ProjectChangeOrdersTabProps {
  projectId: string;
}

const statusConfig: Record<
  ChangeOrder['status'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
  open: { label: 'Open', variant: 'secondary', icon: Clock },
  approved: { label: 'Approved', variant: 'default', icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  applied: { label: 'Applied', variant: 'outline', icon: CheckCircle },
};

const ProjectChangeOrdersTab: React.FC<ProjectChangeOrdersTabProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(
    mockChangeOrders.filter((co) => co.projectId === projectId)
  );
  const [selectedCO, setSelectedCO] = useState<ChangeOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getUser = (userId: string) => mockUsers.find((u) => u.id === userId);

  const filteredCOs = changeOrders.filter((co) => {
    if (activeTab === 'all') return true;
    return co.status === activeTab;
  });

  const stats = {
    total: changeOrders.length,
    open: changeOrders.filter((co) => co.status === 'open').length,
    approved: changeOrders.filter((co) => co.status === 'approved').length,
    major: changeOrders.filter((co) => co.type === 'major').length,
  };

  const handleCreateNew = () => {
    setSelectedCO(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<ChangeOrder>) => {
    if (data.id) {
      setChangeOrders((prev) =>
        prev.map((co) => (co.id === data.id ? { ...co, ...data } : co))
      );
    } else {
      const newCO: ChangeOrder = {
        id: `co${Date.now()}`,
        code: `CO-${new Date().getFullYear()}-${String(changeOrders.length + 1).padStart(3, '0')}`,
        projectId,
        type: data.type || 'simple',
        changeCategory: data.changeCategory,
        description: data.description || '',
        reason: data.reason,
        status: 'open',
        requestedBy: '1',
        impactedUnitIds: data.impactedUnitIds || [],
        attachments: [],
        createdAt: new Date().toISOString(),
      };
      setChangeOrders((prev) => [...prev, newCO]);
    }
    setIsModalOpen(false);
  };

  const handleApprove = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) =>
        c.id === co.id
          ? { ...c, status: 'approved', approvedBy: '1', approvedAt: new Date().toISOString() }
          : c
      )
    );
    toast({ title: 'Change order approved' });
    setSelectedCO(null);
  };

  const handleReject = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) => (c.id === co.id ? { ...c, status: 'rejected' } : c))
    );
    toast({ title: 'Change order rejected' });
    setSelectedCO(null);
  };

  const handleApply = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) =>
        c.id === co.id ? { ...c, status: 'applied', appliedAt: new Date().toISOString() } : c
      )
    );
    toast({ title: 'Change order applied' });
    setSelectedCO(null);
  };

  return (
    <div className="flex gap-0">
      <div className={`flex-1 space-y-4 transition-all ${selectedCO ? 'mr-0' : ''}`}>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="content-panel p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
          </div>
          <div className="content-panel p-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-2xl font-bold text-warning">{stats.open}</p>
          </div>
          <div className="content-panel p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-success">{stats.approved}</p>
          </div>
          <div className="content-panel p-4">
            <p className="text-sm text-muted-foreground">Major</p>
            <p className="text-2xl font-bold text-destructive">{stats.major}</p>
          </div>
        </div>

        {/* Tabs and Table */}
        <div className="content-panel">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleCreateNew} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Change Order
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Code</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Requested By</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCOs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No change orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCOs.map((co) => {
                  const user = getUser(co.requestedBy);
                  const status = statusConfig[co.status];
                  const StatusIcon = status.icon;

                  return (
                    <TableRow
                      key={co.id}
                      className={`border-border hover:bg-muted/50 cursor-pointer ${
                        selectedCO?.id === co.id ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => setSelectedCO(co)}
                    >
                      <TableCell className="font-medium text-card-foreground">
                        {co.code}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={co.type === 'major' ? 'destructive' : 'secondary'}
                        >
                          {co.type === 'major' ? (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          ) : null}
                          {co.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-card-foreground max-w-[200px] truncate">
                        {co.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {user?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(co.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCO(co);
                              }}
                              className="text-foreground focus:bg-muted"
                            >
                              View Details
                            </DropdownMenuItem>
                            {co.status === 'open' && (
                              <>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(co);
                                  }}
                                  className="text-success focus:bg-muted"
                                >
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(co);
                                  }}
                                  className="text-destructive focus:bg-muted"
                                >
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
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

      {/* Detail Panel */}
      {selectedCO && (
        <ChangeOrderDetail
          changeOrder={selectedCO}
          onClose={() => setSelectedCO(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onApply={handleApply}
        />
      )}

      {/* Modal */}
      <ChangeOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        changeOrder={selectedCO}
      />
    </div>
  );
};

export default ProjectChangeOrdersTab;
