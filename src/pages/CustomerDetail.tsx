import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  FolderOpen,
  Users,
  FileText,
  Home,
} from 'lucide-react';
import { mockCustomers, mockProjects, Customer } from '@/data/mockData';
import CustomerModal from '@/components/customers/CustomerModal';
import { useToast } from '@/hooks/use-toast';

const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | undefined>(
    mockCustomers.find((c) => c.id === id)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Customer not found</h2>
          <Button variant="outline" onClick={() => navigate('/customers')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const customerProjects = mockProjects.filter((p) => p.customer === customer.name);

  const handleSaveCustomer = (data: Partial<Customer>) => {
    setCustomer((prev) => (prev ? { ...prev, ...data } as Customer : prev));
    toast({
      title: 'Customer Updated',
      description: `${data.name} has been updated successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'planning':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {customer.type === 'personal' ? (
                <Home className="w-6 h-6 text-primary" />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
                <Badge variant={customer.type === 'business' ? 'default' : 'secondary'}>
                  {customer.type === 'business' ? 'Business' : 'Personal'}
                </Badge>
                <Badge variant={customer.isActive ? 'default' : 'outline'}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-muted-foreground">Customer Code: {customer.code}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Pencil className="w-4 h-4" />
          Edit Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {1 + (customer.additionalContacts?.length || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customerProjects.filter((p) => p.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member Since
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(customer.createdAt).getFullYear()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="space-y-6">
          {/* Primary Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{customer.contactName || 'Not specified'}</span>
              </div>
              {customer.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${customer.contactEmail}`} className="text-primary hover:underline">
                    {customer.contactEmail}
                  </a>
                </div>
              )}
              {customer.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${customer.contactPhone}`} className="text-primary hover:underline">
                    {customer.contactPhone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Contacts */}
          {customer.additionalContacts && customer.additionalContacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.additionalContacts.map((contact) => (
                  <div key={contact.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{contact.name}</span>
                      {contact.role && (
                        <Badge variant="outline" className="text-xs">
                          {contact.role}
                        </Badge>
                      )}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${contact.email}`} className="hover:text-primary">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.address || customer.city ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    {customer.address && <div>{customer.address}</div>}
                    <div>
                      {[customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">No address specified</span>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Projects List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects ({customerProjects.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {customerProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects associated with this customer
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerProjects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-muted-foreground">{project.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${(project.unitsCompleted / project.totalUnits) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round((project.unitsCompleted / project.totalUnits) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{project.startDate}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <CustomerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={customer}
      />
    </div>
  );
};

export default CustomerDetail;
