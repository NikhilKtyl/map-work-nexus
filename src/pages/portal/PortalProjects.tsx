import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortalAuth } from '@/contexts/PortalAuthContext';
import { mockProjects, mockUnits, mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';

const PortalProjects: React.FC = () => {
  const { currentCustomer } = usePortalAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get projects for current customer
  const customerProjects = useMemo(() => {
    if (!currentCustomer) return [];
    return mockProjects.filter((p) => p.customer === currentCustomer.name);
  }, [currentCustomer]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return customerProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customerProjects, searchQuery, statusFilter]);

  // Sort: In Progress → Planning → Completed
  const sortedProjects = useMemo(() => {
    const statusOrder = { in_progress: 0, planning: 1, completed: 2 };
    return [...filteredProjects].sort((a, b) => {
      const orderDiff = statusOrder[a.status] - statusOrder[b.status];
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });
  }, [filteredProjects]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      case 'planning':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Planning</Badge>;
      case 'completed':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProjectStats = (projectId: string) => {
    const units = mockUnits.filter((u) => u.projectId === projectId);
    const verifiedUnits = units.filter((u) => u.status === 'verified').length;
    const completedUnits = units.filter((u) => ['completed', 'verified', 'needs_verification'].includes(u.status)).length;
    return {
      total: units.length,
      verified: verifiedUnits,
      completed: completedUnits,
      percentVerified: units.length > 0 ? Math.round((verifiedUnits / units.length) * 100) : 0,
    };
  };

  const getPM = (userId?: string) => {
    if (!userId) return null;
    return mockUsers.find((u) => u.id === userId);
  };

  // Summary stats
  const stats = useMemo(() => {
    const inProgress = customerProjects.filter((p) => p.status === 'in_progress').length;
    const completed = customerProjects.filter((p) => p.status === 'completed').length;
    const totalFeet = customerProjects.reduce((sum, p) => sum + p.totalFeet, 0);
    const completedFeet = customerProjects.reduce((sum, p) => sum + p.completedFeet, 0);
    return { total: customerProjects.length, inProgress, completed, totalFeet, completedFeet };
  }, [customerProjects]);

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No customer selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <p className="text-muted-foreground">
          View status and progress for {currentCustomer.name} projects
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.completedFeet.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{stats.totalFeet.toLocaleString()} ft
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">Total Footage</p>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Cards */}
      {sortedProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => {
            const unitStats = getProjectStats(project.id);
            const pm = getPM(project.assignedPc);
            const progressPercent = project.totalFeet > 0
              ? Math.round((project.completedFeet / project.totalFeet) * 100)
              : 0;

            return (
              <Link key={project.id} to={`/portal/projects/${project.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{project.code}</p>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {project.completedFeet.toLocaleString()} / {project.totalFeet.toLocaleString()} ft
                        </span>
                        <span>{unitStats.percentVerified}% verified</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Updated {format(new Date(project.lastUpdated), 'MMM d')}</span>
                      </div>
                      {pm && (
                        <span className="text-muted-foreground truncate max-w-[100px]">
                          PM: {pm.name.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* View link */}
                    <div className="flex items-center justify-end text-sm text-primary">
                      <span>View details</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalProjects;
