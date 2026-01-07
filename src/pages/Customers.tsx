import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Building2, Mail, Phone, MapPin, Eye, Home, X } from 'lucide-react';
import { mockCustomers, Customer, mockProjects } from '@/data/mockData';
import CustomerModal from '@/components/customers/CustomerModal';
import { useToast } from '@/hooks/use-toast';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'business' | 'personal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    customers.forEach((customer) => {
      if (customer.city) {
        locations.add(customer.city);
      }
    });
    return Array.from(locations).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType =
        typeFilter === 'all' || (customer.type || 'business') === typeFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && customer.isActive) ||
        (statusFilter === 'inactive' && !customer.isActive);

      // Location filter
      const matchesLocation =
        locationFilter === 'all' || customer.city === locationFilter;

      return matchesSearch && matchesType && matchesStatus && matchesLocation;
    });
  }, [customers, searchQuery, typeFilter, statusFilter, locationFilter]);

  const getProjectCount = (customerName: string) => {
    return mockProjects.filter((p) => p.customer === customerName).length;
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleSaveCustomer = (data: Partial<Customer>) => {
    if (data.id) {
      // Update existing
      setCustomers((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data } as Customer : c))
      );
      toast({
        title: 'Customer Updated',
        description: `${data.name || data.contactName} has been updated successfully.`,
      });
    } else {
      // Create new
      const newCustomer: Customer = {
        id: `cust${Date.now()}`,
        name: data.name || data.contactName || '',
        code: data.code || '',
        type: data.type || 'business',
        contactName: data.contactName || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        additionalContacts: data.additionalContacts,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        notes: data.notes || '',
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers((prev) => [...prev, newCustomer]);
      toast({
        title: 'Customer Created',
        description: `${newCustomer.name || newCustomer.contactName} has been added successfully.`,
      });
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    const projectCount = getProjectCount(customer.name);
    if (projectCount > 0) {
      toast({
        title: 'Cannot Delete Customer',
        description: `${customer.name} has ${projectCount} associated project(s). Remove or reassign projects first.`,
        variant: 'destructive',
      });
      return;
    }
    setDeleteCustomer(customer);
  };

  const confirmDelete = () => {
    if (deleteCustomer) {
      setCustomers((prev) => prev.filter((c) => c.id !== deleteCustomer.id));
      toast({
        title: 'Customer Deleted',
        description: `${deleteCustomer.name} has been removed.`,
      });
      setDeleteCustomer(null);
    }
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    typeFilter !== 'all' || statusFilter !== 'all' || locationFilter !== 'all' || searchQuery !== '';

  const activeCount = customers.filter((c) => c.isActive).length;
  const totalProjects = customers.reduce((acc, c) => acc + getProjectCount(c.name), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer accounts and contacts</p>
        </div>
        <Button onClick={handleCreateCustomer} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-4 h-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Table with inline filters */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="space-y-2">
                    <span>Company / Client</span>
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>
                  <div className="space-y-2">
                    <span>Location</span>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>
                  <div className="space-y-2">
                    <span>Status</span>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                      <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {(customer.type || 'business') === 'personal' ? (
                            <Home className="w-5 h-5 text-primary" />
                          ) : (
                            <Building2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name || customer.contactName}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {(customer.type || 'business') === 'business' ? 'Business' : 'Personal'}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{customer.contactName || '-'}</div>
                        {customer.contactEmail && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {customer.contactEmail}
                          </div>
                        )}
                        {customer.contactPhone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {customer.contactPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.city ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {customer.city}, {customer.state}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getProjectCount(customer.name)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? 'default' : 'outline'}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCustomer(customer);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <CustomerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCustomer?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
