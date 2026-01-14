import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { usePortalAuth } from '@/contexts/PortalAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, FolderOpen, LogOut, User, ChevronDown } from 'lucide-react';

const PortalLayout: React.FC = () => {
  const { user, currentCustomer, availableCustomers, isAuthenticated, logout, switchCustomer } =
    usePortalAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/portal/projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo & Customer Selector */}
          <div className="flex items-center gap-6">
            <Link to="/portal/projects" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Customer Portal</span>
            </Link>

            {availableCustomers.length > 1 && (
              <Select value={currentCustomer?.id || ''} onValueChange={switchCustomer}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {availableCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {availableCustomers.length === 1 && currentCustomer && (
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{currentCustomer.name}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
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

export default PortalLayout;
