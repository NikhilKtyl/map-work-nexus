import React, { useState } from 'react';
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
import { mockUsers, ManagedUser } from '@/data/mockData';
import { getRoleLabel } from '@/contexts/AuthContext';
import UserModal from '@/components/admin/UserModal';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  UserX,
  UserCheck,
  KeyRound,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getRoleLabel(user.role).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<ManagedUser>) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u))
      );
      toast({ title: 'User updated', description: `${userData.name} has been updated.` });
    } else {
      const newUser: ManagedUser = {
        id: String(Date.now()),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'crew',
        phone: userData.phone,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        projectAccess: userData.projectAccess || 'all',
      };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: 'User created', description: `${newUser.name} has been added.` });
    }
  };

  const handleToggleStatus = (user: ManagedUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    toast({
      title: newStatus === 'active' ? 'User activated' : 'User deactivated',
      description: `${user.name} is now ${newStatus}.`,
    });
  };

  const handleResetPassword = (user: ManagedUser) => {
    toast({
      title: 'Password reset link sent',
      description: `A reset link has been sent to ${user.email}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage internal users and their role assignments
          </p>
        </div>
        <Button className="gradient-primary" onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Search and filters */}
      <div className="content-panel p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-border text-card-foreground"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="content-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Created</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-card-foreground">
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === 'active'
                        ? 'status-active'
                        : 'bg-muted text-muted-foreground border border-border'
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditUser(user)}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleStatus(user)}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleResetPassword(user)}
                      title="Reset Password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No users found matching your search.
          </div>
        )}
      </div>

      <UserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Admin;
