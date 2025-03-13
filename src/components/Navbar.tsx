
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
  Clock, // Changed from Timeline to Clock
  User, 
  Users, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-4 py-3 rounded-lg font-medium transition-all',
        'group relative overflow-hidden',
        active
          ? 'text-primary bg-primary/10'
          : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
      )}
    >
      <div className={cn(
        'mr-3 transition-all duration-300',
        active ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground/80'
      )}>
        {icon}
      </div>
      <span>{label}</span>
      {active && (
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
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/timeline', icon: <Clock size={20} />, label: 'Timeline' }, // Changed from Timeline to Clock
    { path: '/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { path: '/team', icon: <Users size={20} />, label: 'Team' },
    { path: '/reports', icon: <ClipboardList size={20} />, label: 'Reports' },
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

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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
                />
              ))}
            </div>
          </div>

          {/* Right side menu */}
          <div className="flex items-center">
            {/* Search */}
            <div className="relative mr-3">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 h-10 w-64 flex items-center bg-background border border-border rounded-md overflow-hidden animate-scale-in">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    className="h-full w-full px-3 bg-transparent focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="flex-shrink-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Help */}
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors mr-3">
              <HelpCircle size={20} />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors mr-3 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
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
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center">
                        <Settings size={16} className="mr-2" />
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={logout}
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
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
