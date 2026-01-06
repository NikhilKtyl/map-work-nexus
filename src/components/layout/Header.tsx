import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleLabel } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="h-16 bg-surface border-b border-border-dark flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      {/* Environment indicator */}
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
          Production
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-surface-foreground/70 hover:text-surface-foreground hover:bg-sidebar-accent"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 text-surface-foreground hover:bg-sidebar-accent h-auto py-2 px-3"
            >
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-medium">
                {user?.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-surface-foreground/60">
                  {user && getRoleLabel(user.role)}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-surface-foreground/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-surface border-border-dark">
            <DropdownMenuLabel className="text-surface-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border-dark" />
            <DropdownMenuItem className="text-surface-foreground/80 focus:bg-sidebar-accent focus:text-surface-foreground">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-surface-foreground/80 focus:bg-sidebar-accent focus:text-surface-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-dark" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
