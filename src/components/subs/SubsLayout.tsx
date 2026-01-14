import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useSubsAuth } from '@/contexts/SubsAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HardHat, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';

const SubsLayout: React.FC = () => {
  const { user, subCompany, isAuthenticated, logout } = useSubsAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/subs/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/subs/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo & Company */}
          <div className="flex items-center gap-6">
            <Link to="/subs/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <HardHat className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Subcontractor Portal</span>
            </Link>

            {subCompany && (
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
                <HardHat className="h-4 w-4 text-muted-foreground" />
                <span>{subCompany.name}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
                  <User className="h-4 w-4 text-orange-500" />
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground capitalize">
                    {user?.role}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SubsLayout;
