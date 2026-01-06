import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { mockProjects, Project, customers } from '@/data/mockData';
import ProjectModal from '@/components/projects/ProjectModal';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles: Record<Project['status'], string> = {
  planning: 'status-pending',
  in_progress: 'status-active',
  completed: 'status-complete',
};

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCustomer = customerFilter === 'all' || project.customer === customerFilter;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...p, ...projectData, lastUpdated: new Date().toISOString() }
            : p
        )
      );
      toast({ title: 'Project updated', description: `${projectData.name} has been updated.` });
    } else {
      const newProject: Project = {
        id: String(Date.now()),
        name: projectData.name || '',
        code: projectData.code || '',
        customer: projectData.customer || '',
        description: projectData.description || '',
        status: projectData.status || 'planning',
        startDate: projectData.startDate || new Date().toISOString().split('T')[0],
        endDate: projectData.endDate,
        assignedPc: projectData.assignedPc,
        assignedFm: projectData.assignedFm,
        defaultForeman: projectData.defaultForeman,
        budget: projectData.budget,
        unitsCompleted: 0,
        totalUnits: projectData.totalUnits || 100,
        totalFeet: 0,
        completedFeet: 0,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProjects((prev) => [...prev, newProject]);
      toast({ title: 'Project created', description: `${newProject.name} has been created.` });
    }
  };

  const handleRowClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all fiber installation projects
          </p>
        </div>
        <Button className="gradient-primary" onClick={handleCreateProject}>
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <div className="content-panel p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-border text-card-foreground"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-muted border-border text-card-foreground">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-card-foreground">All Status</SelectItem>
                <SelectItem value="planning" className="text-card-foreground">Planning</SelectItem>
                <SelectItem value="in_progress" className="text-card-foreground">In Progress</SelectItem>
                <SelectItem value="completed" className="text-card-foreground">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[180px] bg-muted border-border text-card-foreground">
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-card-foreground">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer} value={customer} className="text-card-foreground">
                    {customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="content-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Project</TableHead>
              <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Dates</TableHead>
              <TableHead className="text-muted-foreground font-medium">Progress</TableHead>
              <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => {
              const progress = project.totalUnits > 0
                ? Math.round((project.unitsCompleted / project.totalUnits) * 100)
                : 0;
              
              return (
                <TableRow
                  key={project.id}
                  className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(project)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-card-foreground">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.code}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.customer}</TableCell>
                  <TableCell>
                    <Badge className={`${statusStyles[project.status]} text-xs font-medium capitalize`}>
                      {statusLabels[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(project.startDate), 'MMM d, yyyy')}
                      {project.endDate && (
                        <>
                          <span className="mx-1">–</span>
                          {format(new Date(project.endDate), 'MMM d, yyyy')}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-12">
                        {progress}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {project.unitsCompleted} / {project.totalUnits} units
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(project.lastUpdated), 'MMM d, h:mm a')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No projects found matching your filters.
          </div>
        )}
      </div>

      <ProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default Projects;
