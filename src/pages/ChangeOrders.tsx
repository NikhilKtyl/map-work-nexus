import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { mockChangeOrders, mockProjects, ChangeOrder } from '@/data/mockData';
import { toast } from 'sonner';
import ChangeOrdersList from '@/components/change-orders/ChangeOrdersList';
import ChangeOrderModal from '@/components/change-orders/ChangeOrderModal';
import ChangeOrderDetail from '@/components/change-orders/ChangeOrderDetail';

const ChangeOrders: React.FC = () => {
  const [changeOrders, setChangeOrders] = useState(mockChangeOrders);
  const [selectedCO, setSelectedCO] = useState<ChangeOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter change orders
  const filteredCOs = changeOrders.filter((co) => {
    if (projectFilter !== 'all' && co.projectId !== projectFilter) return false;
    if (typeFilter !== 'all' && co.type !== typeFilter) return false;
    if (activeTab === 'open' && co.status !== 'open') return false;
    if (activeTab === 'approved' && co.status !== 'approved' && co.status !== 'applied') return false;
    if (activeTab === 'rejected' && co.status !== 'rejected') return false;
    return true;
  });

  const handleCreateNew = () => {
    setSelectedCO(null);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<ChangeOrder>) => {
    if (data.id) {
      setChangeOrders((prev) =>
        prev.map((co) => (co.id === data.id ? { ...co, ...data } as ChangeOrder : co))
      );
    } else {
      const newCO: ChangeOrder = {
        id: `co${Date.now()}`,
        code: `CO-${Date.now().toString().slice(-4)}`,
        projectId: data.projectId || '',
        type: data.type || 'simple',
        changeCategory: data.changeCategory,
        description: data.description || '',
        reason: data.reason,
        status: 'open',
        requestedBy: '4', // Mock current user
        impactedUnitIds: data.impactedUnitIds || [],
        attachments: data.attachments || [],
        createdAt: new Date().toISOString(),
      };
      setChangeOrders((prev) => [newCO, ...prev]);
      toast.success('Change order created');
    }
  };

  const handleApprove = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) =>
        c.id === co.id
          ? { ...c, status: 'approved' as const, approvedBy: '2', approvedAt: new Date().toISOString() }
          : c
      )
    );
    setSelectedCO(null);
    toast.success('Change order approved');
  };

  const handleReject = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) =>
        c.id === co.id
          ? { ...c, status: 'rejected' as const, approvedBy: '2', approvedAt: new Date().toISOString() }
          : c
      )
    );
    setSelectedCO(null);
    toast.error('Change order rejected');
  };

  const handleApply = (co: ChangeOrder) => {
    setChangeOrders((prev) =>
      prev.map((c) =>
        c.id === co.id
          ? { ...c, status: 'applied' as const, appliedAt: new Date().toISOString() }
          : c
      )
    );
    setSelectedCO(null);
    toast.success('Changes applied to project');
  };

  // Stats
  const stats = {
    open: changeOrders.filter((co) => co.status === 'open').length,
    approved: changeOrders.filter((co) => co.status === 'approved' || co.status === 'applied').length,
    rejected: changeOrders.filter((co) => co.status === 'rejected').length,
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Change Orders</h1>
              <p className="text-muted-foreground">
                Manage change requests for projects
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{stats.open}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Project</Label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList>
              <TabsTrigger value="all">All ({changeOrders.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="flex-1 p-6 pt-4 overflow-auto">
            <ChangeOrdersList
              changeOrders={filteredCOs}
              onCreateNew={handleCreateNew}
              onViewDetail={setSelectedCO}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel */}
      {selectedCO && (
        <div className="w-96">
          <ChangeOrderDetail
            changeOrder={selectedCO}
            onClose={() => setSelectedCO(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onApply={handleApply}
          />
        </div>
      )}

      {/* Modal */}
      <ChangeOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ChangeOrders;
