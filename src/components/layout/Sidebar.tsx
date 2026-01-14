import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, getRoleLabel, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Hammer,
  FileText,
  Settings,
  Map,
  Boxes,
  DollarSign,
  Zap,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
    roles: ['admin', 'pc', 'fm', 'foreman', 'crew', 'accounting'],
  },
  {
    label: 'Projects',
    icon: <FolderKanban className="w-5 h-5" />,
    path: '/projects',
    roles: ['admin', 'pc', 'fm', 'foreman'],
  },
  {
    label: 'Customers',
    icon: <Building2 className="w-5 h-5" />,
    path: '/customers',
    roles: ['admin', 'pc', 'fm'],
  },
  {
    label: 'Map',
    icon: <Map className="w-5 h-5" />,
    path: '/map',
    roles: ['admin', 'pc', 'fm', 'foreman'],
  },
  {
    label: 'Units',
    icon: <Boxes className="w-5 h-5" />,
    path: '/units',
    roles: ['admin', 'pc', 'fm', 'foreman'],
  },
  {
    label: 'Crews',
    icon: <Users className="w-5 h-5" />,
    path: '/crews',
    roles: ['admin', 'pc', 'fm'],
  },
  {
    label: 'Field',
    icon: <Hammer className="w-5 h-5" />,
    path: '/field',
    roles: ['foreman', 'crew'],
  },
  {
    label: 'Verification',
    icon: <ClipboardCheck className="w-5 h-5" />,
    path: '/verification',
    roles: ['admin', 'pc', 'fm'],
  },
  {
    label: 'Emergency Jobs',
    icon: <Zap className="w-5 h-5" />,
    path: '/emergency-jobs',
    roles: ['admin', 'pc', 'fm'],
  },
  {
    label: 'Change Orders',
    icon: <FileText className="w-5 h-5" />,
    path: '/change-orders',
    roles: ['admin', 'pc', 'fm', 'foreman', 'accounting'],
  },
  {
    label: 'Completion',
    icon: <DollarSign className="w-5 h-5" />,
    path: '/reports',
    roles: ['admin', 'pc', 'fm', 'accounting'],
  },
  {
    label: 'User Management',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin',
    roles: ['admin'],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border bg-card/50 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span
          className={cn(
            'text-xl font-bold text-foreground whitespace-nowrap transition-all duration-300',
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          )}
        >
          BerryTech
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredNavItems.map((item) => {
          const navLinkContent = (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'hover:bg-muted/80',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={cn(
                  'whitespace-nowrap transition-all duration-300',
                  collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{navLinkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return navLinkContent;
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/80',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* User info */}
      {user && (
        <div className="p-3 border-t border-sidebar-border bg-card/50">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div
              className={cn(
                'flex-1 min-w-0 transition-all duration-300',
                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              )}
            >
              <div className="text-sm font-medium text-foreground truncate">
                {user.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {getRoleLabel(user.role)}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
