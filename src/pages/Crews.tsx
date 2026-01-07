import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Wrench, ClipboardList, Search } from 'lucide-react';
import { mockCrews, Crew } from '@/data/mockData';
import CrewsList from '@/components/crews/CrewsList';
import CrewModal from '@/components/crews/CrewModal';

const Crews: React.FC = () => {
  const [crews, setCrews] = useState(mockCrews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [crewNameFilter, setCrewNameFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleCreateCrew = () => {
    setSelectedCrew(null);
    setIsModalOpen(true);
  };

  const handleEditCrew = (crew: Crew) => {
    setSelectedCrew(crew);
    setIsModalOpen(true);
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
        projectIds: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCrews((prev) => [...prev, newCrew]);
    }
  };

  // Filtered crews
  const filteredCrews = useMemo(() => {
    return crews.filter((crew) => {
      const matchesType = typeFilter === 'all' || crew.type === typeFilter;
      const matchesName = crewNameFilter === 'all' || crew.id === crewNameFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && crew.isActive) ||
        (statusFilter === 'inactive' && !crew.isActive);
      return matchesType && matchesName && matchesStatus;
    });
  }, [crews, typeFilter, crewNameFilter, statusFilter]);

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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 min-w-[200px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Select value={crewNameFilter} onValueChange={setCrewNameFilter}>
            <SelectTrigger>
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Crew Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crews</SelectItem>
              {crews.map((crew) => (
                <SelectItem key={crew.id} value={crew.id}>
                  {crew.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Crews List */}
      <CrewsList
        crews={filteredCrews}
        onCreateCrew={handleCreateCrew}
        onEditCrew={handleEditCrew}
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
