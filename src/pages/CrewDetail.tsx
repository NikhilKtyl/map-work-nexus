import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Users,
  Wrench,
  MapPin,
  Calendar,
  ClipboardList,
  FolderOpen,
  Pencil,
} from 'lucide-react';
import { mockCrews, mockUsers, mockProjects, mockUnits } from '@/data/mockData';

const CrewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const crew = mockCrews.find((c) => c.id === id);

  if (!crew) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Crew not found</h2>
          <p className="text-muted-foreground mt-2">
            The crew you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => navigate('/crews')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Crews
          </Button>
        </div>
      </div>
    );
  }

  const foreman = mockUsers.find((u) => u.id === crew.foremanId);
  const members = crew.memberIds.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean);
  const assignedProjects = crew.projectIds
    .map((id) => mockProjects.find((p) => p.id === id))
    .filter(Boolean);
  const assignedUnits = mockUnits.filter((u) => u.assignedCrewId === crew.id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/crews')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{crew.name}</h1>
              <Badge variant={crew.type === 'internal' ? 'default' : 'secondary'}>
                {crew.type === 'internal' ? 'Internal' : 'Subcontractor'}
              </Badge>
              <Badge
                variant={crew.isActive ? 'default' : 'secondary'}
                className={crew.isActive ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''}
              >
                {crew.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{crew.defaultWorkRegion}</p>
          </div>
        </div>
        <Button onClick={() => navigate('/crews')}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Crew
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Size
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length + 1}</div>
            <p className="text-xs text-muted-foreground">Including foreman</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipment
            </CardTitle>
            <Wrench className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crew.equipment.length}</div>
            <p className="text-xs text-muted-foreground">Items assigned</p>
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
            <div className="text-2xl font-bold">{crew.assignedUnitsCount}</div>
            <p className="text-xs text-muted-foreground">Work units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crew.projectIds.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crew Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crew Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Crew Type</p>
                <p className="font-medium">
                  {crew.type === 'internal' ? 'Internal Team' : 'Subcontractor'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{crew.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Default Region</p>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{crew.defaultWorkRegion}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(crew.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foreman & Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Foreman */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foreman</p>
              {foreman ? (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {foreman.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-medium">{foreman.name}</p>
                    <p className="text-sm text-muted-foreground">{foreman.email}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Foreman
                  </Badge>
                </div>
              ) : (
                <p className="text-muted-foreground">No foreman assigned</p>
              )}
            </div>

            {/* Members */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Crew Members ({members.length})
              </p>
              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((member) =>
                    member ? (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-medium">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No additional members</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigned Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          {crew.equipment.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {crew.equipment.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1.5">
                  <Wrench className="w-3 h-3 mr-2" />
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No equipment assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Assigned Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigned Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedProjects.length > 0 ? (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedProjects.map((project) =>
                    project ? (
                      <TableRow
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.code}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.status === 'completed'
                                ? 'default'
                                : project.status === 'in_progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {project.status === 'in_progress'
                              ? 'In Progress'
                              : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {project.totalUnits > 0
                            ? Math.round((project.unitsCompleted / project.totalUnits) * 100)
                            : 0}
                          %
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No projects assigned to this crew</p>
          )}
        </CardContent>
      </Card>

      {/* Assigned Units */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Assigned Units</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedUnits.length > 0 ? (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Footage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedUnits.slice(0, 5).map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{unit.unitTypeId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            unit.status === 'completed'
                              ? 'default'
                              : unit.status === 'in_progress'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {unit.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{unit.length || 0} ft</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No units currently assigned to this crew</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrewDetail;
