import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project, mockCustomers, mockUsers, mockProjects } from '@/data/mockData';
import { Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  onSave: (project: Partial<Project>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, project, onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    customerId: '',
    customer: '',
    description: '',
    status: 'planning' as Project['status'],
    startDate: '',
    endDate: '',
    parentProjectId: '',
    assignedPc: '',
    assignedFm: '',
    defaultForeman: '',
    budget: '',
    totalUnits: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const activeCustomers = mockCustomers.filter((c) => c.isActive);
  const pcs = mockUsers.filter((u) => u.role === 'pc');
  const fms = mockUsers.filter((u) => u.role === 'fm');
  const foremen = mockUsers.filter((u) => u.role === 'foreman');

  useEffect(() => {
    if (project) {
      // Find customer ID from name
      const customer = mockCustomers.find((c) => c.name === project.customer);
      setFormData({
        name: project.name,
        code: project.code,
        customerId: customer?.id || '',
        customer: project.customer,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate || '',
        parentProjectId: project.parentProjectId || '',
        assignedPc: project.assignedPc || '',
        assignedFm: project.assignedFm || '',
        defaultForeman: project.defaultForeman || '',
        budget: project.budget?.toString() || '',
        totalUnits: project.totalUnits.toString(),
      });
    } else {
      setFormData({
        name: '',
        code: '',
        customerId: '',
        customer: '',
        description: '',
        status: 'planning',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        parentProjectId: '',
        assignedPc: '',
        assignedFm: '',
        defaultForeman: '',
        budget: '',
        totalUnits: '100',
      });
    }
  }, [project, open]);

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customer: customer?.name || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      name: formData.name,
      code: formData.code,
      customer: formData.customer,
      description: formData.description,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      parentProjectId: formData.parentProjectId || undefined,
      assignedPc: formData.assignedPc || undefined,
      assignedFm: formData.assignedFm || undefined,
      defaultForeman: formData.defaultForeman || undefined,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      totalUnits: parseInt(formData.totalUnits) || 100,
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {project ? 'Edit Project' : 'Create Project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted border-border text-card-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-card-foreground">Project Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="bg-muted border-border text-card-foreground"
                placeholder="e.g., PRJ-2024-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-card-foreground">Customer *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerChange}
                >
                  <SelectTrigger className="bg-muted border-border text-card-foreground flex-1">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {activeCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id} className="text-card-foreground">
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">[{customer.code}]</span>
                          {customer.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/customers')}
                  title="Add new customer"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-card-foreground">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
              >
                <SelectTrigger className="bg-muted border-border text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="planning" className="text-card-foreground">Planning</SelectItem>
                  <SelectItem value="in_progress" className="text-card-foreground">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-card-foreground">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-muted border-border text-card-foreground min-h-[80px]"
              placeholder="Project description and notes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-card-foreground">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-muted border-border text-card-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-card-foreground">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-muted border-border text-card-foreground"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Assigned Roles</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground text-xs">Project Coordinator</Label>
                <Select
                  value={formData.assignedPc || "none"}
                  onValueChange={(value) => setFormData({ ...formData, assignedPc: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-muted border-border text-card-foreground">
                    <SelectValue placeholder="Select PC" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="none" className="text-muted-foreground">None</SelectItem>
                    {pcs.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-card-foreground">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground text-xs">Field Manager</Label>
                <Select
                  value={formData.assignedFm || "none"}
                  onValueChange={(value) => setFormData({ ...formData, assignedFm: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-muted border-border text-card-foreground">
                    <SelectValue placeholder="Select FM" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="none" className="text-muted-foreground">None</SelectItem>
                    {fms.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-card-foreground">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground text-xs">Default Foreman</Label>
                <Select
                  value={formData.defaultForeman || "none"}
                  onValueChange={(value) => setFormData({ ...formData, defaultForeman: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-muted border-border text-card-foreground">
                    <SelectValue placeholder="Select Foreman" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="none" className="text-muted-foreground">None</SelectItem>
                    {foremen.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-card-foreground">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-card-foreground">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-muted border-border text-card-foreground"
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalUnits" className="text-card-foreground">Total Units</Label>
              <Input
                id="totalUnits"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                className="bg-muted border-border text-card-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Parent Project (optional)</Label>
            <Select
              value={formData.parentProjectId || "none"}
              onValueChange={(value) => setFormData({ ...formData, parentProjectId: value === "none" ? "" : value })}
            >
              <SelectTrigger className="bg-muted border-border text-card-foreground">
                <SelectValue placeholder="No parent project" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="none" className="text-muted-foreground">None</SelectItem>
                {mockProjects
                  .filter((p) => p.id !== project?.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-card-foreground">
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border text-card-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : project ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
