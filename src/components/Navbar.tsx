
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  ClipboardList, 
  HelpCircle, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Search, 
  Settings, 
  Clock, 
  User, 
  Users, 
  X,
  BellOff,
  CircleSlash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import HelpPopover from './HelpPopover';
import NotificationsPopover from './NotificationsPopover';
import SearchModal from './SearchModal';
import { toast } from 'sonner';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, disabled }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      toast.info(`${label} feature is currently disabled`);
    }
  };

  return (
    <Link
      to={disabled ? '#' : to}
      onClick={handleClick}
      className={cn(
        'flex items-center px-4 py-3 rounded-lg font-medium transition-all',
        'group relative overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed',
        active && !disabled
          ? 'text-primary bg-primary/10'
          : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
      )}
    >
      <div className={cn(
        'mr-3 transition-all duration-300',
        active && !disabled ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground/80'
      )}>
        {icon}
      </div>
      <span>{label}</span>
      {disabled && (
        <CircleSlash className="h-4 w-4 ml-2 text-muted-foreground" />
      )}
      {active && !disabled && (
        <span className="absolute inset-0 bg-primary/5 animate-pulse-subtle pointer-events-none" />
      )}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', disabled: false },
    { path: '/timeline', icon: <Clock size={20} />, label: 'Timeline', disabled: false },
    { path: '/calendar', icon: <Calendar size={20} />, label: 'Calendar', disabled: true },
    { path: '/team', icon: <Users size={20} />, label: 'Team', disabled: false },
    { path: '/reports', icon: <ClipboardList size={20} />, label: 'Reports', disabled: true },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Handle navigation to profile page
  const handleNavigateToProfile = () => {
    setIsProfileMenuOpen(false);
  };

  // Handle navigation to settings page
  const handleNavigateToSettings = () => {
    setIsProfileMenuOpen(false);
  };

  const handleSearchClick = () => {
    toast.info("Search functionality is currently disabled");
  };

  const handleNotificationsClick = () => {
    toast.info("Notifications are currently disabled");
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold">ProjectFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.path}
                  disabled={item.disabled}
                />
              ))}
            </div>
          </div>

          {/* Right side menu */}
          <div className="flex items-center">
            {/* Search - Disabled */}
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-md text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <Search size={20} />
            </button>

            {/* Help */}
            <HelpPopover />

            {/* Notifications - Disabled */}
            <button
              onClick={handleNotificationsClick}
              className="p-2 rounded-md text-muted-foreground opacity-50 cursor-not-allowed ml-2"
            >
              <BellOff size={20} />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center ml-3 focus:outline-none"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-primary" />
                  )}
                </div>
                <div className="hidden md:flex md:flex-col md:items-start md:ml-2">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
                <ChevronDown size={16} className="ml-1 md:ml-2 text-muted-foreground" />
              </button>

              {/* Dropdown menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-elevated border border-border overflow-hidden animate-fade-in z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={handleNavigateToProfile}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={handleNavigateToSettings}
                    >
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-4 p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.disabled ? '#' : item.path}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    toast.info(`${item.label} feature is currently disabled`);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  `block px-3 py-2 rounded-md text-base font-medium flex items-center`,
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  location.pathname === item.path && !item.disabled
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                {item.disabled && (
                  <CircleSlash className="h-4 w-4 ml-2 text-muted-foreground" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
