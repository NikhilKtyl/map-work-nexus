import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Unit, UnitType, mockUnitTypes, Project } from '@/data/mockData';
import { Loader2, Minus, MapPin, Navigation, Hash, Camera } from 'lucide-react';

interface UnitCreationModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  geometryType: 'Line' | 'Marker';
  calculatedLength?: number;
  onSave: (data: Partial<Unit>) => void;
}

const UnitCreationModal: React.FC<UnitCreationModalProps> = ({
  open,
  onClose,
  project,
  geometryType,
  calculatedLength = 0,
  onSave,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [subRate, setSubRate] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter unit types by geometry category
  const availableTypes = mockUnitTypes.filter(
    (type) => type.category === geometryType && type.isActive
  );

  const selectedType = mockUnitTypes.find((t) => t.id === selectedTypeId);

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
    const type = mockUnitTypes.find((t) => t.id === typeId);
    if (type) {
      setPrice(type.defaultPrice.toString());
      setSubRate(type.defaultSubRate.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      projectId: project.id,
      unitTypeId: selectedTypeId,
      geometryType,
      length: geometryType === 'Line' ? calculatedLength : undefined,
      price: parseFloat(price) || 0,
      subRate: parseFloat(subRate) || 0,
      notes,
      status: 'not_started',
      coordinates: [],
      photos: [],
      gpsReadings: [],
    });

    setIsSaving(false);
    setSelectedTypeId('');
    setPrice('');
    setSubRate('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            Create Unit from Geometry
            <Badge variant="outline" className="ml-2">
              {geometryType === 'Line' ? (
                <Minus className="w-3 h-3 mr-1" />
              ) : (
                <MapPin className="w-3 h-3 mr-1" />
              )}
              {geometryType}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-populated fields */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Project</span>
              <span className="text-card-foreground font-medium">{project.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-card-foreground font-medium">{project.customer}</span>
            </div>
            {geometryType === 'Line' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Calculated Length</span>
                <span className="text-card-foreground font-medium">{calculatedLength} ft</span>
              </div>
            )}
          </div>

          {/* Unit Type Selection */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Unit Type *</Label>
            <Select value={selectedTypeId} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.code} - {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requirements Display */}
          {selectedType && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Documentation Requirements
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedType.requiresGps && (
                  <Badge variant="outline" className="text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    GPS Required
                  </Badge>
                )}
                {selectedType.requiresSequential && (
                  <Badge variant="outline" className="text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    Sequential Numbers
                  </Badge>
                )}
                {selectedType.requiresPhotos && (
                  <Badge variant="outline" className="text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    {selectedType.minPhotoCount}+ Photos
                  </Badge>
                )}
                {!selectedType.requiresGps && !selectedType.requiresSequential && !selectedType.requiresPhotos && (
                  <span className="text-xs text-muted-foreground">No special requirements</span>
                )}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-card-foreground">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-muted border-border"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subRate" className="text-card-foreground">Sub Rate ($)</Label>
              <Input
                id="subRate"
                type="number"
                step="0.01"
                value={subRate}
                onChange={(e) => setSubRate(e.target.value)}
                className="bg-muted border-border"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-card-foreground">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-muted border-border min-h-[60px]"
              placeholder="Add notes or labels..."
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary"
              disabled={!selectedTypeId || isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Unit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCreationModal;
