import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, getRoleLabel, UserRole } from '@/contexts/AuthContext';
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
} from 'lucide-react';

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
    label: 'Change Orders',
    icon: <FileText className="w-5 h-5" />,
    path: '/change-orders',
    roles: ['admin', 'pc', 'fm', 'accounting'],
  },
  {
    label: 'Reports',
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

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border bg-white">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">BerryTech</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {user && (
        <div className="p-4 border-t border-sidebar-border bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
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
