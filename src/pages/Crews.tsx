import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wrench, ClipboardList } from 'lucide-react';
import { mockCrews, mockUnits, Crew } from '@/data/mockData';
import CrewsList from '@/components/crews/CrewsList';
import CrewModal from '@/components/crews/CrewModal';

const Crews: React.FC = () => {
  const [crews, setCrews] = useState(mockCrews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  const handleCreateCrew = () => {
    setSelectedCrew(null);
    setIsModalOpen(true);
  };

  const handleEditCrew = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsModalOpen(true);
  };

  const handleViewUnits = (crew: Crew) => {
    // In a real app, this would navigate to a filtered units view
    console.log('View units for crew:', crew.id);
  };

  const handleSaveCrew = (crewData: Partial<Crew>) => {
    if (crewData.id) {
      setCrews((prev) =>
        prev.map((c) => (c.id === crewData.id ? { ...c, ...crewData } as Crew : c))
      );
    } else {
      const newCrew: Crew = {
        id: `crew${Date.now()}`,
        name: crewData.name || '',
        type: crewData.type || 'internal',
        foremanId: crewData.foremanId || '',
        memberIds: crewData.memberIds || [],
        equipment: crewData.equipment || [],
        defaultWorkRegion: crewData.defaultWorkRegion || '',
        assignedUnitsCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCrews((prev) => [...prev, newCrew]);
    }
  };

  // Stats
  const totalCrews = crews.length;
  const internalCrews = crews.filter((c) => c.type === 'internal').length;
  const totalAssignedUnits = crews.reduce((sum, c) => sum + c.assignedUnitsCount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Crew Management</h1>
        <p className="text-muted-foreground">
          Manage internal teams and subcontractors for field work
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Crews
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCrews}</div>
            <p className="text-xs text-muted-foreground">
              {internalCrews} internal, {totalCrews - internalCrews} subcontractors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
            <Wrench className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crews.reduce((sum, c) => sum + c.memberIds.length + 1, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Including foremen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Units
            </CardTitle>
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignedUnits}</div>
            <p className="text-xs text-muted-foreground">Across all crews</p>
          </CardContent>
        </Card>
      </div>

      {/* Crews List */}
      <CrewsList
        crews={crews}
        onCreateCrew={handleCreateCrew}
        onEditCrew={handleEditCrew}
        onViewUnits={handleViewUnits}
      />

      {/* Create/Edit Modal */}
      <CrewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCrew}
        crew={selectedCrew}
      />
    </div>
  );
};

export default Crews;
