import React from 'react';
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
import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  customer: string;
  status: 'active' | 'pending' | 'complete';
  progress: number;
  lastUpdated: string;
  unitsCompleted: number;
  totalUnits: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Downtown Fiber Expansion',
    customer: 'Metro Telecom',
    status: 'active',
    progress: 68,
    lastUpdated: '2 hours ago',
    unitsCompleted: 340,
    totalUnits: 500,
  },
  {
    id: '2',
    name: 'Riverside FTTH Phase 2',
    customer: 'CityConnect ISP',
    status: 'active',
    progress: 45,
    lastUpdated: '5 hours ago',
    unitsCompleted: 225,
    totalUnits: 500,
  },
  {
    id: '3',
    name: 'Industrial Park Network',
    customer: 'TechZone Solutions',
    status: 'pending',
    progress: 12,
    lastUpdated: '1 day ago',
    unitsCompleted: 24,
    totalUnits: 200,
  },
  {
    id: '4',
    name: 'Suburban Fiber Ring',
    customer: 'HomeNet Services',
    status: 'active',
    progress: 89,
    lastUpdated: '30 min ago',
    unitsCompleted: 445,
    totalUnits: 500,
  },
  {
    id: '5',
    name: 'Business District Upgrade',
    customer: 'EnterpriseCom',
    status: 'complete',
    progress: 100,
    lastUpdated: '3 days ago',
    unitsCompleted: 150,
    totalUnits: 150,
  },
];

const statusStyles = {
  active: 'status-active',
  pending: 'status-pending',
  complete: 'status-complete',
};

const ProjectsTable: React.FC = () => {
  return (
    <div className="content-panel overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Active Projects</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Overview of all ongoing fiber installation projects
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-card-foreground">
            View All
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Project</TableHead>
            <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Progress</TableHead>
            <TableHead className="text-muted-foreground font-medium">Units</TableHead>
            <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockProjects.map((project) => (
            <TableRow
              key={project.id}
              className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <TableCell className="font-medium text-card-foreground">
                {project.name}
              </TableCell>
              <TableCell className="text-muted-foreground">{project.customer}</TableCell>
              <TableCell>
                <Badge className={`${statusStyles[project.status]} text-xs font-medium capitalize`}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 min-w-[120px]">
                  <Progress value={project.progress} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground w-10">
                    {project.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.unitsCompleted}/{project.totalUnits}
              </TableCell>
              <TableCell className="text-muted-foreground">{project.lastUpdated}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="View Project"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
