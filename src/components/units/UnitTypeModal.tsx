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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UnitType, customers } from '@/data/mockData';
import { Loader2, Minus, MapPin } from 'lucide-react';

interface UnitTypeModalProps {
  open: boolean;
  onClose: () => void;
  unitType?: UnitType | null;
  onSave: (data: Partial<UnitType>) => void;
}

const UnitTypeModal: React.FC<UnitTypeModalProps> = ({ open, onClose, unitType, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Line' as 'Line' | 'Marker',
    customerId: '',
    defaultPrice: '',
    defaultSubRate: '',
    requiresGps: false,
    requiresSequential: false,
    requiresPhotos: false,
    minPhotoCount: '0',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (unitType) {
      setFormData({
        code: unitType.code,
        name: unitType.name,
        description: unitType.description,
        category: unitType.category,
        customerId: unitType.customerId || '',
        defaultPrice: unitType.defaultPrice.toString(),
        defaultSubRate: unitType.defaultSubRate.toString(),
        requiresGps: unitType.requiresGps,
        requiresSequential: unitType.requiresSequential,
        requiresPhotos: unitType.requiresPhotos,
        minPhotoCount: unitType.minPhotoCount.toString(),
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        category: 'Line',
        customerId: '',
        defaultPrice: '',
        defaultSubRate: '',
        requiresGps: false,
        requiresSequential: false,
        requiresPhotos: false,
        minPhotoCount: '0',
      });
    }
  }, [unitType, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      customerId: formData.customerId || undefined,
      defaultPrice: parseFloat(formData.defaultPrice) || 0,
      defaultSubRate: parseFloat(formData.defaultSubRate) || 0,
      requiresGps: formData.requiresGps,
      requiresSequential: formData.requiresSequential,
      requiresPhotos: formData.requiresPhotos,
      minPhotoCount: parseInt(formData.minPhotoCount) || 0,
      isActive: true,
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            {unitType ? 'Edit Unit Type' : 'Create Unit Type'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-card-foreground">Unit Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="bg-muted border-border"
                placeholder="e.g., BORE-FT"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as 'Line' | 'Marker' })}
              >
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Line">
                    <span className="flex items-center gap-2">
                      <Minus className="w-4 h-4" /> Line
                    </span>
                  </SelectItem>
                  <SelectItem value="Marker">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Marker
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-muted border-border"
              placeholder="e.g., Bore - per foot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-muted border-border min-h-[60px]"
              placeholder="Describe this unit type..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Customer (optional)</Label>
            <Select
              value={formData.customerId || "none"}
              onValueChange={(value) => setFormData({ ...formData, customerId: value === "none" ? "" : value })}
            >
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="All customers (global)" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="none">All customers (global)</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer} value={customer}>
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPrice" className="text-card-foreground">Default Price ($) *</Label>
              <Input
                id="defaultPrice"
                type="number"
                step="0.01"
                value={formData.defaultPrice}
                onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                className="bg-muted border-border"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSubRate" className="text-card-foreground">Default Sub Rate ($) *</Label>
              <Input
                id="defaultSubRate"
                type="number"
                step="0.01"
                value={formData.defaultSubRate}
                onChange={(e) => setFormData({ ...formData, defaultSubRate: e.target.value })}
                className="bg-muted border-border"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Documentation Requirements */}
          <div className="border-t border-border pt-4">
            <Label className="text-card-foreground font-medium mb-3 block">
              Documentation Requirements
            </Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Requires GPS</p>
                  <p className="text-xs text-muted-foreground">GPS coordinates must be captured</p>
                </div>
                <Switch
                  checked={formData.requiresGps}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresGps: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Requires Sequential Numbers</p>
                  <p className="text-xs text-muted-foreground">Auto-incrementing sequence tracking</p>
                </div>
                <Switch
                  checked={formData.requiresSequential}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresSequential: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Requires Photos</p>
                  <p className="text-xs text-muted-foreground">Photo documentation required</p>
                </div>
                <Switch
                  checked={formData.requiresPhotos}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresPhotos: checked })}
                />
              </div>

              {formData.requiresPhotos && (
                <div className="ml-4 space-y-2">
                  <Label htmlFor="minPhotoCount" className="text-card-foreground text-sm">
                    Minimum Photo Count
                  </Label>
                  <Input
                    id="minPhotoCount"
                    type="number"
                    min="1"
                    value={formData.minPhotoCount}
                    onChange={(e) => setFormData({ ...formData, minPhotoCount: e.target.value })}
                    className="bg-muted border-border w-24"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : unitType ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitTypeModal;
