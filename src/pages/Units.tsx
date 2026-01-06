import React, { useState } from 'react';
import { mockUnitTypes, UnitType } from '@/data/mockData';
import UnitTypesList from '@/components/units/UnitTypesList';
import UnitTypeModal from '@/components/units/UnitTypeModal';
import { useToast } from '@/hooks/use-toast';

const Units: React.FC = () => {
  const { toast } = useToast();
  const [unitTypes, setUnitTypes] = useState<UnitType[]>(mockUnitTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<UnitType | null>(null);

  const handleCreateType = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEditType = (type: UnitType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleSaveType = (data: Partial<UnitType>) => {
    if (editingType) {
      setUnitTypes((prev) =>
        prev.map((t) => (t.id === editingType.id ? { ...t, ...data } : t))
      );
      toast({ title: 'Unit type updated', description: `${data.name} has been updated.` });
    } else {
      const newType: UnitType = {
        id: String(Date.now()),
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        category: data.category || 'Line',
        customerId: data.customerId,
        defaultPrice: data.defaultPrice || 0,
        defaultSubRate: data.defaultSubRate || 0,
        requiresGps: data.requiresGps || false,
        requiresSequential: data.requiresSequential || false,
        requiresPhotos: data.requiresPhotos || false,
        minPhotoCount: data.minPhotoCount || 0,
        isActive: true,
      };
      setUnitTypes((prev) => [...prev, newType]);
      toast({ title: 'Unit type created', description: `${newType.name} has been created.` });
    }
  };

  const handleToggleActive = (id: string) => {
    setUnitTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    const type = unitTypes.find((t) => t.id === id);
    toast({
      title: type?.isActive ? 'Unit type deactivated' : 'Unit type activated',
      description: `${type?.name} is now ${type?.isActive ? 'inactive' : 'active'}.`,
    });
  };

  return (
    <>
      <UnitTypesList
        unitTypes={unitTypes}
        onCreateType={handleCreateType}
        onEditType={handleEditType}
        onToggleActive={handleToggleActive}
      />
      <UnitTypeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unitType={editingType}
        onSave={handleSaveType}
      />
    </>
  );
};

export default Units;
