import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSubsAuth } from '@/contexts/SubsAuthContext';
import { mockProjects, mockUnits, mockUnitTypes } from '@/data/mockData';
import { mockSubAssignments, mockSubDailyLogs, SubDailyEntry } from '@/data/subsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Package,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Camera,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const SubsProjectUnits: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { subCompany } = useSubsAuth();
  const [activeTab, setActiveTab] = useState('units');
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [productionEntries, setProductionEntries] = useState<Record<string, { qty: number; notes: string }>>({});

  const project = mockProjects.find((p) => p.id === id);
  const assignment = mockSubAssignments.find(
    (a) => a.projectId === id && a.subCompanyId === subCompany?.id
  );

  // Verify access
  if (!project || !subCompany || !assignment) {
    return <Navigate to="/subs/dashboard" replace />;
  }

  // Get assigned units
  const assignedUnits = mockUnits.filter((u) => assignment.unitIds.includes(u.id));

  // Get daily logs for this project
  const dailyLogs = mockSubDailyLogs.filter(
    (log) => log.subCompanyId === subCompany.id && log.projectId === id
  );

  const getUnitType = (unitTypeId: string) => mockUnitTypes.find((ut) => ut.id === unitTypeId);

  const getUnitStatusBadge = (status: string, isReported: boolean) => {
    if (isReported) {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Reported</Badge>;
    }
    switch (status) {
      case 'not_started':
        return <Badge variant="outline">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Completed</Badge>;
      case 'verified':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Approved</Badge>;
      case 'needs_verification':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isUnitReported = (unitId: string) => {
    return dailyLogs.some((log) =>
      log.entries.some((e) => e.unitId === unitId) && log.status !== 'rejected'
    );
  };

  const getReportedQty = (unitId: string) => {
    let total = 0;
    dailyLogs.forEach((log) => {
      if (log.status !== 'rejected') {
        log.entries.forEach((e) => {
          if (e.unitId === unitId) {
            total += e.completedQty;
          }
        });
      }
    });
    return total;
  };

  const handleToggleUnit = (unitId: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const handleOpenProductionModal = () => {
    if (selectedUnits.length === 0) {
      toast({
        title: 'No units selected',
        description: 'Please select at least one unit to report production.',
        variant: 'destructive',
      });
      return;
    }
    // Initialize entries
    const entries: Record<string, { qty: number; notes: string }> = {};
    selectedUnits.forEach((unitId) => {
      const unit = assignedUnits.find((u) => u.id === unitId);
      entries[unitId] = { qty: unit?.length || 1, notes: '' };
    });
    setProductionEntries(entries);
    setShowProductionModal(true);
  };

  const handleSubmitProduction = () => {
    toast({
      title: 'Production Submitted',
      description: `${selectedUnits.length} unit(s) reported for today. Pending office review.`,
    });
    setShowProductionModal(false);
    setSelectedUnits([]);
    setProductionEntries({});
  };

  const unreportedUnits = assignedUnits.filter((u) => !isUnitReported(u.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/subs/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/subs/projects/${id}/docs`}>
            <Button variant="outline" size="sm">
              <FileText className="mr-1 h-4 w-4" />
              Documents
            </Button>
          </Link>
          <Link to={`/subs/projects/${id}/summary`}>
            <Button variant="outline" size="sm">
              <DollarSign className="mr-1 h-4 w-4" />
              Summary
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignedUnits.length}</p>
                <p className="text-sm text-muted-foreground">Units Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assignedUnits.filter((u) => isUnitReported(u.id)).length}
                </p>
                <p className="text-sm text-muted-foreground">Reported</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dailyLogs.filter((l) => l.status === 'submitted').length}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="units">Unit List</TabsTrigger>
          <TabsTrigger value="logs">Daily Logs</TabsTrigger>
        </TabsList>

        {/* Units Tab */}
        <TabsContent value="units" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assigned Units</CardTitle>
              {unreportedUnits.length > 0 && (
                <Button onClick={handleOpenProductionModal} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-1 h-4 w-4" />
                  Report Production ({selectedUnits.length})
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Unit ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Planned</TableHead>
                    <TableHead className="text-right">Reported</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedUnits.map((unit) => {
                    const unitType = getUnitType(unit.unitTypeId);
                    const reported = isUnitReported(unit.id);
                    const reportedQty = getReportedQty(unit.id);
                    
                    return (
                      <TableRow key={unit.id}>
                        <TableCell>
                          {!reported && (
                            <Checkbox
                              checked={selectedUnits.includes(unit.id)}
                              onCheckedChange={() => handleToggleUnit(unit.id)}
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-mono">{unit.code}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{unitType?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{unitType?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {unit.length ? `${unit.length} ft` : '1 ea'}
                        </TableCell>
                        <TableCell className="text-right">
                          {reportedQty > 0 ? (
                            unit.length ? `${reportedQty} ft` : `${reportedQty} ea`
                          ) : '—'}
                        </TableCell>
                        <TableCell>{getUnitStatusBadge(unit.status, reported)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No submissions yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{format(new Date(log.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{log.entries.length} unit(s)</TableCell>
                        <TableCell>
                          {log.submittedAt
                            ? format(new Date(log.submittedAt), 'MMM d, h:mm a')
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {log.status === 'submitted' && (
                            <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
                          )}
                          {log.status === 'approved' && (
                            <Badge className="bg-secondary/10 text-secondary border-secondary/20">Approved</Badge>
                          )}
                          {log.status === 'rejected' && (
                            <Badge variant="destructive">Rejected</Badge>
                          )}
                          {log.status === 'draft' && (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Production Entry Modal */}
      <Dialog open={showProductionModal} onOpenChange={setShowProductionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Daily Production</DialogTitle>
            <DialogDescription>
              Enter completed quantities for {selectedUnits.length} selected unit(s). 
              Date: {format(new Date(), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedUnits.map((unitId) => {
              const unit = assignedUnits.find((u) => u.id === unitId);
              const unitType = unit ? getUnitType(unit.unitTypeId) : null;
              const entry = productionEntries[unitId] || { qty: 0, notes: '' };
              
              return (
                <div key={unitId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{unit?.code}</p>
                      <p className="text-sm text-muted-foreground">{unitType?.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Planned: {unit?.length ? `${unit.length} ft` : '1 ea'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Completed Qty</Label>
                      <Input
                        type="number"
                        value={entry.qty}
                        onChange={(e) =>
                          setProductionEntries((prev) => ({
                            ...prev,
                            [unitId]: { ...prev[unitId], qty: Number(e.target.value) },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" className="w-full">
                        <Camera className="mr-1 h-4 w-4" />
                        Add Photo
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="Any notes about this work..."
                      value={entry.notes}
                      onChange={(e) =>
                        setProductionEntries((prev) => ({
                          ...prev,
                          [unitId]: { ...prev[unitId], notes: e.target.value },
                        }))
                      }
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProduction} className="bg-orange-500 hover:bg-orange-600">
              <Send className="mr-1 h-4 w-4" />
              Submit Production
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubsProjectUnits;
