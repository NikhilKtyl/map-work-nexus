import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { mockUnits, mockProjects, mockCrews, Unit } from '@/data/mockData';
import { toast } from 'sonner';
import VerificationQueue from '@/components/verification/VerificationQueue';
import VerificationPanel from '@/components/verification/VerificationPanel';

const Verification: React.FC = () => {
  const [units, setUnits] = useState(mockUnits);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [crewFilter, setCrewFilter] = useState<string>('all');
  const [docFilter, setDocFilter] = useState<string>('all');

  // Filter units awaiting verification
  const pendingUnits = units.filter((u) => {
    if (u.status !== 'completed' && u.status !== 'needs_verification') return false;
    if (projectFilter !== 'all' && u.projectId !== projectFilter) return false;
    if (crewFilter !== 'all' && u.assignedCrewId !== crewFilter) return false;
    return true;
  });

  const handleApprove = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, status: 'verified' as const, verifiedDate: new Date().toISOString() }
          : u
      )
    );
    setSelectedUnit(null);
    toast.success('Unit verified successfully');
  };

  const handleReject = (unitId: string, comment: string) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status: 'needs_verification' as const,
              notes: `REJECTED: ${comment}\n\n${u.notes}`,
            }
          : u
      )
    );
    setSelectedUnit(null);
    toast.error('Unit rejected and sent back to crew');
  };

  // Stats
  const stats = {
    pending: pendingUnits.length,
    needsReview: pendingUnits.filter((u) => u.status === 'needs_verification').length,
    verified: units.filter((u) => u.status === 'verified').length,
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Verification Queue</h1>
              <p className="text-muted-foreground">
                Review and verify completed units
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.needsReview}</p>
                  <p className="text-xs text-muted-foreground">Needs Attention</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{stats.verified}</p>
                  <p className="text-xs text-muted-foreground">Verified Today</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Project</Label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Crew</Label>
              <Select value={crewFilter} onValueChange={setCrewFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crews</SelectItem>
                  {mockCrews.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Documentation</Label>
              <Select value={docFilter} onValueChange={setDocFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="missing">Missing Docs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="flex-1 p-6 overflow-auto">
          <VerificationQueue
            units={pendingUnits}
            onSelectUnit={setSelectedUnit}
            selectedUnitId={selectedUnit?.id}
          />
        </div>
      </div>

      {/* Right Panel */}
      {selectedUnit && (
        <div className="w-96">
          <VerificationPanel
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}
    </div>
  );
};

export default Verification;
