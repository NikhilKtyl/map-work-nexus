import React from 'react';
import { useAuth, getRoleLabel } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import ProjectsTable from '@/components/dashboard/ProjectsTable';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  Boxes,
  Users,
  TrendingUp,
  ArrowRight,
  Hammer,
  FileOutput,
  Clock,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Role-specific content
  const isManagement = user?.role === 'admin' || user?.role === 'pc' || user?.role === 'fm';
  const isField = user?.role === 'foreman' || user?.role === 'crew';
  const isAccounting = user?.role === 'accounting';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            {getRoleLabel(user?.role || 'admin')} • Here's what's happening today
          </p>
        </div>
        {isManagement && (
          <Button className="gradient-primary hover:opacity-90 transition-opacity">
            New Project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Stats Grid - Management View */}
      {isManagement && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Projects"
            value={12}
            icon={FolderKanban}
            variant="primary"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Units"
            value="2,450"
            icon={Boxes}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Crews"
            value={8}
            icon={Users}
            variant="warning"
          />
          <StatCard
            title="Completion Rate"
            value="94%"
            icon={TrendingUp}
            variant="default"
            trend={{ value: 3, isPositive: true }}
          />
        </div>
      )}

      {/* Stats Grid - Field View */}
      {isField && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="My Assigned Units"
            value={24}
            icon={Boxes}
            variant="primary"
          />
          <StatCard
            title="Completed Today"
            value={8}
            icon={Hammer}
            variant="success"
          />
          <StatCard
            title="Pending Review"
            value={3}
            icon={Clock}
            variant="warning"
          />
        </div>
      )}

      {/* Stats Grid - Accounting View */}
      {isAccounting && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Ready for CE Export"
            value={5}
            icon={FileOutput}
            variant="primary"
          />
          <StatCard
            title="As-Built Pending"
            value={3}
            icon={FolderKanban}
            variant="warning"
          />
          <StatCard
            title="Completed This Month"
            value={18}
            icon={TrendingUp}
            variant="success"
          />
        </div>
      )}

      {/* Projects Table - Management */}
      {isManagement && <ProjectsTable />}

      {/* Quick Actions - Field */}
      {isField && (
        <div className="content-panel p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 px-6 justify-start border-border text-card-foreground hover:bg-muted"
            >
              <Hammer className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Open Field View</div>
                <div className="text-sm text-muted-foreground">View and update assigned units</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-6 justify-start border-border text-card-foreground hover:bg-muted"
            >
              <Clock className="w-5 h-5 mr-3 text-warning" />
              <div className="text-left">
                <div className="font-medium">Submit Time Entry</div>
                <div className="text-sm text-muted-foreground">Log your hours for today</div>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Accounting Quick Actions */}
      {isAccounting && (
        <div className="content-panel p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Export Ready</h2>
          <div className="space-y-3">
            {['Downtown Fiber Expansion', 'Riverside FTTH Phase 2', 'Industrial Park Network'].map(
              (project, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <div className="font-medium text-card-foreground">{project}</div>
                    <div className="text-sm text-muted-foreground">Ready for CE export</div>
                  </div>
                  <Button size="sm" className="gradient-primary">
                    Export
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Recent Activity - All roles */}
      <div className="content-panel p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Unit #2451 marked complete', user: 'Tom Wilson', time: '10 min ago', type: 'success' },
            { action: 'New crew assigned to Riverside project', user: 'Sarah Miller', time: '1 hour ago', type: 'info' },
            { action: 'Change order submitted for review', user: 'Mike Davis', time: '2 hours ago', type: 'warning' },
            { action: 'Project milestone reached: 500 units', user: 'System', time: '3 hours ago', type: 'success' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'success'
                    ? 'bg-success'
                    : item.type === 'warning'
                    ? 'bg-warning'
                    : 'bg-primary'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-card-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.user} • {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
