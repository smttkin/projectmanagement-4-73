
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Calendar, 
  Clock, 
  FileText, 
  BarChart3,
  Database
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import SearchModal from './SearchModal';
import NotificationsPopover from './NotificationsPopover';
import HelpPopover from './HelpPopover';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center mr-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span className="hidden font-bold sm:inline-block">Taskflow</span>
        </Link>
        
        {isAuthenticated && (
          <nav className="flex-1 flex items-center space-x-1 md:space-x-2">
            <Button
              variant={isActive('/dashboard') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/dashboard" className="flex items-center text-sm">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/team') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/team" className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Team</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/calendar') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/calendar" className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Calendar</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/timeline') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/timeline" className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Timeline</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/reports') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/reports" className="flex items-center text-sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Reports</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/database-schema') ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/database-schema" className="flex items-center text-sm">
                <Database className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">DB Schema</span>
              </Link>
            </Button>
          </nav>
        )}
        
        <div className="flex items-center ml-auto space-x-2">
          {isAuthenticated ? (
            <>
              <SearchModal />
              <NotificationsPopover />
              <HelpPopover />
              <ModeToggle />
              
              <Link to="/settings">
                <Button 
                  variant={isActive('/settings') ? "secondary" : "ghost"} 
                  size="icon"
                  className="h-9 w-9"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/profile">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <ModeToggle />
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
