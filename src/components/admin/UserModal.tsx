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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ManagedUser, mockProjects } from '@/data/mockData';
import { getRoleLabel, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: ManagedUser | null;
  onSave: (user: Partial<ManagedUser>) => void;
}

const roles: UserRole[] = ['admin', 'pc', 'fm', 'foreman', 'crew', 'accounting'];

const UserModal: React.FC<UserModalProps> = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'crew' as UserRole,
    phone: '',
    projectAccess: 'all' as 'all' | string[],
  });
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isAllProjects, setIsAllProjects] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        projectAccess: user.projectAccess,
      });
      setIsAllProjects(user.projectAccess === 'all');
      setSelectedProjects(user.projectAccess === 'all' ? [] : user.projectAccess);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'crew',
        phone: '',
        projectAccess: 'all',
      });
      setIsAllProjects(true);
      setSelectedProjects([]);
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onSave({
      ...formData,
      projectAccess: isAllProjects ? 'all' : selectedProjects,
    });
    
    setIsSaving(false);
    onClose();
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {user ? 'Edit User' : 'Create User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-muted border-border text-card-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-muted border-border text-card-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-card-foreground">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger className="bg-muted border-border text-card-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {roles.map((role) => (
                  <SelectItem key={role} value={role} className="text-card-foreground">
                    {getRoleLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-muted border-border text-card-foreground"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-card-foreground">Project Access</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="all-projects"
                checked={isAllProjects}
                onCheckedChange={(checked) => setIsAllProjects(!!checked)}
              />
              <Label htmlFor="all-projects" className="text-sm text-muted-foreground cursor-pointer">
                Access to all projects
              </Label>
            </div>

            {!isAllProjects && (
              <div className="space-y-2 max-h-32 overflow-y-auto p-2 bg-muted rounded-lg">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                    <Label
                      htmlFor={`project-${project.id}`}
                      className="text-sm text-card-foreground cursor-pointer"
                    >
                      {project.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border text-card-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
