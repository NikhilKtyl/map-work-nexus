import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubsAuth } from '@/contexts/SubsAuthContext';
import { mockProjects, mockUnits, mockUnitTypes, mockCustomers } from '@/data/mockData';
import { mockSubAssignments, mockSubDailyLogs } from '@/data/subsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FolderOpen,
  Search,
  Calendar,
  ClipboardCheck,
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { format, differenceInDays, startOfDay } from 'date-fns';

const SubsDashboard: React.FC = () => {
  const { subCompany } = useSubsAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Get assignments for this sub company
  const assignments = useMemo(() => {
    if (!subCompany) return [];
    return mockSubAssignments.filter(
      (a) => a.subCompanyId === subCompany.id && a.status === 'active'
    );
  }, [subCompany]);

  // Get unique projects from assignments
  const assignedProjects = useMemo(() => {
    const projectIds = [...new Set(assignments.map((a) => a.projectId))];
    return mockProjects.filter((p) => projectIds.includes(p.id));
  }, [assignments]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return assignedProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = projectFilter === 'all' || project.id === projectFilter;
      return matchesSearch && matchesFilter;
    });
  }, [assignedProjects, searchQuery, projectFilter]);

  // Get stats for a project
  const getProjectStats = (projectId: string) => {
    if (!subCompany) return { assigned: 0, completed: 0, pending: 0, dailyLogs: 0 };
    
    const assignment = assignments.find((a) => a.projectId === projectId);
    const assignedUnitIds = assignment?.unitIds || [];
    const assignedUnits = mockUnits.filter((u) => assignedUnitIds.includes(u.id));
    
    const completedUnits = assignedUnits.filter((u) =>
      ['completed', 'verified', 'needs_verification'].includes(u.status)
    ).length;

    const dailyLogs = mockSubDailyLogs.filter(
      (log) => log.subCompanyId === subCompany.id && log.projectId === projectId
    );
    
    const pendingLogs = dailyLogs.filter((log) => log.status === 'submitted').length;

    return {
      assigned: assignedUnits.length,
      completed: completedUnits,
      pending: pendingLogs,
      dailyLogs: dailyLogs.length,
    };
  };

  const getCustomer = (customerName: string) => {
    return mockCustomers.find((c) => c.name === customerName);
  };

  const getAssignmentDateRange = (projectId: string) => {
    const assignment = assignments.find((a) => a.projectId === projectId);
    if (!assignment) return null;
    return {
      start: assignment.startDate,
      end: assignment.endDate,
    };
  };

  // Summary stats
  const totalStats = useMemo(() => {
    if (!subCompany) return { projects: 0, assigned: 0, completed: 0, pending: 0 };
    
    let assigned = 0;
    let completed = 0;
    let pending = 0;

    assignments.forEach((a) => {
      const units = mockUnits.filter((u) => a.unitIds.includes(u.id));
      assigned += units.length;
      completed += units.filter((u) =>
        ['completed', 'verified', 'needs_verification'].includes(u.status)
      ).length;
    });

    pending = mockSubDailyLogs.filter(
      (log) => log.subCompanyId === subCompany.id && log.status === 'submitted'
    ).length;

    return {
      projects: assignedProjects.length,
      assigned,
      completed,
      pending,
    };
  }, [subCompany, assignments, assignedProjects]);

  if (!subCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No company data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Assignments Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage your assigned projects and units
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <FolderOpen className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStats.projects}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStats.assigned}</p>
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
                <p className="text-2xl font-bold">{totalStats.completed}</p>
                <p className="text-sm text-muted-foreground">Units Completed</p>
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
                <p className="text-2xl font-bold">{totalStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {assignedProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Project Cards */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No assigned projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.id);
            const customer = getCustomer(project.customer);
            const dateRange = getAssignmentDateRange(project.id);
            const progressPercent = stats.assigned > 0
              ? Math.round((stats.completed / stats.assigned) * 100)
              : 0;

            return (
              <Card key={project.id} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.code}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer */}
                  {customer && (
                    <p className="text-sm text-muted-foreground">
                      Customer: <span className="font-medium text-foreground">{customer.name}</span>
                    </p>
                  )}

                  {/* Date Range */}
                  {dateRange && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(dateRange.start), 'MMM d')}
                        {dateRange.end && ` - ${format(new Date(dateRange.end), 'MMM d, yyyy')}`}
                      </span>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Units Progress</span>
                      <span className="font-medium">{stats.completed}/{stats.assigned}</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      <span>{stats.dailyLogs} daily logs</span>
                    </div>
                    {stats.pending > 0 && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        {stats.pending} pending
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link to={`/subs/projects/${project.id}/units`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                        <Package className="mr-1 h-4 w-4" />
                        Units
                      </Button>
                    </Link>
                    <Link to={`/subs/projects/${project.id}/summary`}>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubsDashboard;
