
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  File, 
  Users, 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  Clock, 
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'team' | 'report' | 'page';
  icon: React.ReactNode;
  link: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock search results
const mockResults: SearchResult[] = [
  { 
    id: '1', 
    title: 'Website Redesign Project', 
    type: 'project', 
    icon: <File size={16} />, 
    link: '/dashboard'
  },
  { 
    id: '2', 
    title: 'Mobile App Development', 
    type: 'project', 
    icon: <File size={16} />, 
    link: '/dashboard'
  },
  { 
    id: '3', 
    title: 'Marketing Team', 
    type: 'team', 
    icon: <Users size={16} />, 
    link: '/team'
  },
  { 
    id: '4', 
    title: 'Engineering Team', 
    type: 'team', 
    icon: <Users size={16} />, 
    link: '/team'
  },
  { 
    id: '5', 
    title: 'Q2 Performance Report', 
    type: 'report', 
    icon: <ClipboardList size={16} />, 
    link: '/reports'
  },
  { 
    id: '6', 
    title: 'Dashboard', 
    type: 'page', 
    icon: <LayoutDashboard size={16} />, 
    link: '/dashboard'
  },
  { 
    id: '7', 
    title: 'Timeline', 
    type: 'page', 
    icon: <Clock size={16} />, 
    link: '/timeline'
  },
  { 
    id: '8', 
    title: 'Calendar', 
    type: 'page', 
    icon: <Calendar size={16} />, 
    link: '/calendar'
  },
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        
        // Filter results based on search query
        const filtered = mockResults.filter(
          item => item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Simulate API delay
        setTimeout(() => {
          setResults(filtered);
          setIsSearching(false);
        }, 300);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for projects, team members, reports..."
            className="w-full border-0 border-b rounded-none h-14 pl-12 text-base focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleClose}
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Searching...</div>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={result.link}
                  className="flex items-center p-3 hover:bg-accent rounded-md transition-colors"
                  onClick={handleClose}
                >
                  <div className="h-8 w-8 flex items-center justify-center bg-accent/50 rounded-md mr-3">
                    {result.icon}
                  </div>
                  <div>
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">No results found</div>
              <div className="text-xs text-muted-foreground mt-1">
                Try searching with different keywords
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-sm text-muted-foreground mb-2">Quick Links</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: 'Dashboard', icon: <LayoutDashboard size={16} />, link: '/dashboard' },
                  { title: 'Timeline', icon: <Clock size={16} />, link: '/timeline' },
                  { title: 'Calendar', icon: <Calendar size={16} />, link: '/calendar' },
                  { title: 'Team', icon: <Users size={16} />, link: '/team' },
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-center p-2 hover:bg-accent rounded-md transition-colors"
                    onClick={handleClose}
                  >
                    <div className="mr-2">{item.icon}</div>
                    <div className="text-sm">{item.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
