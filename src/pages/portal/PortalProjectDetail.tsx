import React, { useMemo, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { usePortalAuth } from '@/contexts/PortalAuthContext';
import {
  mockProjects,
  mockUnits,
  mockUnitTypes,
  mockChangeOrders,
  mockExportRecords,
  mockUsers,
} from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  Circle,
  TrendingUp,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const PortalProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentCustomer } = usePortalAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const project = mockProjects.find((p) => p.id === id);
  const units = mockUnits.filter((u) => u.projectId === id);
  const changeOrders = mockChangeOrders.filter((co) => co.projectId === id);
  const exports = mockExportRecords.filter((e) => e.projectId === id);

  // Verify access
  if (!project || !currentCustomer || project.customer !== currentCustomer.name) {
    return <Navigate to="/portal/projects" replace />;
  }

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

  // Unit stats by type
  const unitsByType = useMemo(() => {
    const grouped: Record<string, { 
      type: typeof mockUnitTypes[0]; 
      total: number; 
      completed: number; 
      verified: number; 
      totalLength: number;
      completedLength: number;
    }> = {};

    units.forEach((unit) => {
      const unitType = mockUnitTypes.find((ut) => ut.id === unit.unitTypeId);
      if (!unitType) return;

      if (!grouped[unitType.id]) {
        grouped[unitType.id] = {
          type: unitType,
          total: 0,
          completed: 0,
          verified: 0,
          totalLength: 0,
          completedLength: 0,
        };
      }

      grouped[unitType.id].total += 1;
      grouped[unitType.id].totalLength += unit.length || 1;

      if (['completed', 'needs_verification', 'verified'].includes(unit.status)) {
        grouped[unitType.id].completed += 1;
        grouped[unitType.id].completedLength += unit.length || 1;
      }

      if (unit.status === 'verified') {
        grouped[unitType.id].verified += 1;
      }
    });

    return Object.values(grouped);
  }, [units]);

  // Unit status counts
  const unitStatusCounts = useMemo(() => {
    const counts = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      needs_verification: 0,
      verified: 0,
    };
    units.forEach((u) => {
      counts[u.status] += 1;
    });
    return counts;
  }, [units]);

  const progressPercent = project.totalFeet > 0
    ? Math.round((project.completedFeet / project.totalFeet) * 100)
    : 0;

  const verifiedPercent = units.length > 0
    ? Math.round((unitStatusCounts.verified / units.length) * 100)
    : 0;

  const getUser = (userId: string) => mockUsers.find((u) => u.id === userId);

  const getChangeStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'applied':
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Applied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExportTypeLabel = (type: string) => {
    switch (type) {
      case 'as_built_pdf':
        return 'As-Built PDF';
      case 'ce_upload':
        return 'CE Export';
      case 'unit_csv':
        return 'Unit CSV';
      default:
        return type;
    }
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${fileName}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/portal/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-muted-foreground">{project.code}</p>
            {project.description && (
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-2xl font-bold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {project.completedFeet.toLocaleString()} / {project.totalFeet.toLocaleString()} ft
              </p>
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
                <p className="text-2xl font-bold">{verifiedPercent}%</p>
                <p className="text-sm text-muted-foreground">Units Verified</p>
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
                <p className="text-2xl font-bold">{units.length}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{changeOrders.length}</p>
                <p className="text-sm text-muted-foreground">Change Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Status Breakdown */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Not Started: <strong>{unitStatusCounts.not_started}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-3 w-3 text-primary" />
              <span className="text-sm">In Progress: <strong>{unitStatusCounts.in_progress}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-warning" />
              <span className="text-sm">Completed: <strong>{unitStatusCounts.completed}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span className="text-sm">Needs Verification: <strong>{unitStatusCounts.needs_verification}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-secondary" />
              <span className="text-sm">Verified: <strong>{unitStatusCounts.verified}</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Units Summary</TabsTrigger>
          <TabsTrigger value="changes">Changes & Emergencies</TabsTrigger>
          <TabsTrigger value="documents">Documents & Exports</TabsTrigger>
        </TabsList>

        {/* Units Summary Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Units by Type</CardTitle>
            </CardHeader>
            <CardContent>
              {unitsByType.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No units in this project yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Type</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Verified</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unitsByType.map((item) => {
                      const percent = item.total > 0
                        ? Math.round((item.completed / item.total) * 100)
                        : 0;
                      const isLine = item.type.category === 'Line';
                      
                      return (
                        <TableRow key={item.type.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.type.name}</p>
                              <p className="text-xs text-muted-foreground">{item.type.code}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {isLine ? `${item.totalLength.toLocaleString()} ft` : item.total}
                          </TableCell>
                          <TableCell className="text-right">
                            {isLine ? `${item.completedLength.toLocaleString()} ft` : item.completed}
                          </TableCell>
                          <TableCell className="text-right">{item.verified}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Progress value={percent} className="w-16 h-2" />
                              <span className="text-sm w-10">{percent}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Changes Tab */}
        <TabsContent value="changes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {changeOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No change requests for this project</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reviewed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeOrders.map((co) => {
                      const reviewer = co.approvedBy ? getUser(co.approvedBy) : null;
                      return (
                        <TableRow key={co.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(co.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{co.code}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {co.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {co.description}
                          </TableCell>
                          <TableCell>{getChangeStatusBadge(co.status)}</TableCell>
                          <TableCell>{reviewer?.name || '—'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Emergency Jobs placeholder */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Emergency Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No emergency jobs for this project
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Exports</CardTitle>
            </CardHeader>
            <CardContent>
              {exports.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No documents available yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exports.map((exp) => {
                      const generatedBy = getUser(exp.generatedBy);
                      return (
                        <TableRow key={exp.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{exp.fileName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getExportTypeLabel(exp.type)}</Badge>
                          </TableCell>
                          <TableCell>{generatedBy?.name || '—'}</TableCell>
                          <TableCell>
                            {format(new Date(exp.createdAt), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(exp.fileName)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalProjectDetail;
