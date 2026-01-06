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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';
import { ChangeOrder, mockProjects, mockUnits } from '@/data/mockData';

interface ChangeOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ChangeOrder>) => void;
  changeOrder?: ChangeOrder | null;
}

const changeTypes = [
  { value: 'location_change', label: 'Change Location' },
  { value: 'type_change', label: 'Change Unit Type' },
  { value: 'add_units', label: 'Add Units' },
  { value: 'remove_units', label: 'Remove Units' },
  { value: 'quantity_adjust', label: 'Quantity Adjustment' },
  { value: 'other', label: 'Other' },
];

const ChangeOrderModal: React.FC<ChangeOrderModalProps> = ({
  open,
  onClose,
  onSave,
  changeOrder,
}) => {
  const [formData, setFormData] = useState({
    projectId: '',
    type: 'simple' as 'simple' | 'major',
    changeCategory: '',
    description: '',
    reason: '',
    impactedUnitIds: [] as string[],
    attachments: [] as string[],
  });

  useEffect(() => {
    if (changeOrder) {
      setFormData({
        projectId: changeOrder.projectId,
        type: changeOrder.type,
        changeCategory: changeOrder.changeCategory || '',
        description: changeOrder.description,
        reason: changeOrder.reason || '',
        impactedUnitIds: changeOrder.impactedUnitIds,
        attachments: changeOrder.attachments,
      });
    } else {
      setFormData({
        projectId: '',
        type: 'simple',
        changeCategory: '',
        description: '',
        reason: '',
        impactedUnitIds: [],
        attachments: [],
      });
    }
  }, [changeOrder, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: changeOrder?.id,
      status: 'open',
    });
    onClose();
  };

  const projectUnits = mockUnits.filter((u) => u.projectId === formData.projectId);

  const toggleUnit = (unitId: string) => {
    setFormData((prev) => ({
      ...prev,
      impactedUnitIds: prev.impactedUnitIds.includes(unitId)
        ? prev.impactedUnitIds.filter((id) => id !== unitId)
        : [...prev.impactedUnitIds, unitId],
    }));
  };

  // Auto-classify as major if certain conditions
  const isMajor =
    formData.changeCategory === 'add_units' ||
    formData.changeCategory === 'remove_units' ||
    formData.impactedUnitIds.length > 3;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {changeOrder ? 'Edit Change Order' : 'Create Change Request'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, projectId: value, impactedUnitIds: [] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changeCategory">Change Type *</Label>
            <Select
              value={formData.changeCategory}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, changeCategory: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select change type" />
              </SelectTrigger>
              <SelectContent>
                {changeTypes.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Classification</Label>
              <Badge variant={isMajor ? 'destructive' : 'outline'}>
                {isMajor ? 'Major Change' : 'Simple Change'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isMajor
                ? 'Major changes require customer approval and design review.'
                : 'Simple changes can be approved quickly by FM/PC.'}
            </p>
          </div>

          {formData.projectId && projectUnits.length > 0 && (
            <div className="space-y-2">
              <Label>Impacted Units</Label>
              <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-muted/30 max-h-32 overflow-y-auto">
                {projectUnits.map((unit) => (
                  <Badge
                    key={unit.id}
                    variant={
                      formData.impactedUnitIds.includes(unit.id) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => toggleUnit(unit.id)}
                  >
                    {unit.code}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe the change in detail..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Why is this change needed?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Photos, documents, sketches
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.projectId || !formData.description || !formData.changeCategory}
            >
              {changeOrder ? 'Save Changes' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeOrderModal;
