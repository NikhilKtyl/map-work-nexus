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
import { X } from 'lucide-react';
import { Crew, mockUsers } from '@/data/mockData';

interface CrewModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (crew: Partial<Crew>) => void;
  crew?: Crew | null;
}

const CrewModal: React.FC<CrewModalProps> = ({ open, onClose, onSave, crew }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'internal' as 'internal' | 'subcontractor',
    foremanId: '',
    memberIds: [] as string[],
    equipment: [] as string[],
    defaultWorkRegion: '',
  });
  const [equipmentInput, setEquipmentInput] = useState('');

  const foremen = mockUsers.filter((u) => u.role === 'foreman' && u.status === 'active');
  const crewMembers = mockUsers.filter((u) => u.role === 'crew' && u.status === 'active');

  useEffect(() => {
    if (crew) {
      setFormData({
        name: crew.name,
        type: crew.type,
        foremanId: crew.foremanId,
        memberIds: crew.memberIds,
        equipment: crew.equipment,
        defaultWorkRegion: crew.defaultWorkRegion,
      });
    } else {
      setFormData({
        name: '',
        type: 'internal',
        foremanId: '',
        memberIds: [],
        equipment: [],
        defaultWorkRegion: '',
      });
    }
  }, [crew, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: crew?.id,
      isActive: true,
    });
    onClose();
  };

  const addEquipment = () => {
    if (equipmentInput.trim() && !formData.equipment.includes(equipmentInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, equipmentInput.trim()],
      }));
      setEquipmentInput('');
    }
  };

  const removeEquipment = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((e) => e !== item),
    }));
  };

  const toggleMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter((id) => id !== memberId)
        : [...prev.memberIds, memberId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{crew ? 'Edit Crew' : 'Create Crew'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Crew Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter crew name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'internal' | 'subcontractor') =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="subcontractor">Subcontractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foreman">Foreman *</Label>
            <Select
              value={formData.foremanId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, foremanId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select foreman" />
              </SelectTrigger>
              <SelectContent>
                {foremen.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Crew Members</Label>
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-muted/30 min-h-[60px]">
              {crewMembers.length === 0 ? (
                <span className="text-sm text-muted-foreground">No crew members available</span>
              ) : (
                crewMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant={formData.memberIds.includes(member.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleMember(member.id)}
                  >
                    {member.name}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Equipment / Trucks</Label>
            <div className="flex gap-2">
              <Input
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="Add equipment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEquipment();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addEquipment}>
                Add
              </Button>
            </div>
            {formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.equipment.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeEquipment(item)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Default Work Region</Label>
            <Textarea
              id="region"
              value={formData.defaultWorkRegion}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, defaultWorkRegion: e.target.value }))
              }
              placeholder="Describe the default work region or area"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.foremanId}>
              {crew ? 'Save Changes' : 'Create Crew'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrewModal;
