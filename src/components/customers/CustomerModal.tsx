import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Customer, CustomerContact } from '@/data/mockData';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Partial<Customer>) => void;
  customer?: Customer | null;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ open, onClose, onSave, customer }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'business' as 'business' | 'personal',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    isActive: true,
  });
  const [additionalContacts, setAdditionalContacts] = useState<CustomerContact[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        type: customer.type || 'business',
        contactName: customer.contactName,
        contactEmail: customer.contactEmail,
        contactPhone: customer.contactPhone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        notes: customer.notes,
        isActive: customer.isActive,
      });
      setAdditionalContacts(customer.additionalContacts || []);
    } else {
      setFormData({
        name: '',
        type: 'business',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        notes: '',
        isActive: true,
      });
      setAdditionalContacts([]);
    }
  }, [customer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      ...formData,
      additionalContacts: additionalContacts.length > 0 ? additionalContacts : undefined,
      id: customer?.id,
    });

    setIsSaving(false);
    onClose();
  };

  const addContact = () => {
    setAdditionalContacts([
      ...additionalContacts,
      {
        id: `contact-${Date.now()}`,
        name: '',
        email: '',
        phone: '',
        role: '',
        isPrimary: false,
      },
    ]);
  };

  const removeContact = (id: string) => {
    setAdditionalContacts(additionalContacts.filter((c) => c.id !== id));
  };

  const updateContact = (id: string, field: keyof CustomerContact, value: string | boolean) => {
    setAdditionalContacts(
      additionalContacts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const isNameRequired = formData.type === 'business';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Create Customer'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Customer Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'business' | 'personal') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business / Company</SelectItem>
                <SelectItem value="personal">Personal / Residential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company/Client Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {formData.type === 'business' ? 'Company Name *' : 'Client Name'}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={
                formData.type === 'business' ? 'Enter company name' : 'Enter client name (optional)'
              }
              required={isNameRequired}
            />
            {formData.type === 'personal' && (
              <p className="text-xs text-muted-foreground">
                For personal clients, leave blank to use primary contact name
              </p>
            )}
          </div>

          {/* Primary Contact */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3">Primary Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name {formData.type === 'personal' && '*'}</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Full name"
                  required={formData.type === 'personal'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="555-000-0000"
                />
              </div>
            </div>
          </div>

          {/* Additional Contacts */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Additional Contacts</h3>
              <Button type="button" variant="outline" size="sm" onClick={addContact}>
                <Plus className="w-4 h-4 mr-1" />
                Add Contact
              </Button>
            </div>

            {additionalContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No additional contacts added</p>
            ) : (
              <div className="space-y-4">
                {additionalContacts.map((contact, index) => (
                  <div key={contact.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Contact {index + 2}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={contact.role || ''}
                          onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
                          placeholder="e.g., Project Manager"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                          placeholder="555-000-0000"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3">Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="90210"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this customer..."
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active Customer</Label>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                (isNameRequired && !formData.name) ||
                (formData.type === 'personal' && !formData.contactName) ||
                isSaving
              }
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : customer ? (
                'Save Changes'
              ) : (
                'Create Customer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
