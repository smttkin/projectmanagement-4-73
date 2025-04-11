
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, FolderKanban, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import WorkspaceCard, { WorkspaceCardProps } from '@/components/WorkspaceCard';
import { workspaceService } from '@/services/workspaceService';
import { toast } from 'sonner';
import { Workspace } from '@/types/workspace';

const WorkspacesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [workspaces, setWorkspaces] = useState<WorkspaceCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const data = await workspaceService.getWorkspaces();
        
        // Map workspaces to WorkspaceCardProps
        const workspaceCardProps: WorkspaceCardProps[] = data.map(workspace => ({
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          projectCount: workspace.projects.length,
          color: workspace.color
        }));
        
        setWorkspaces(workspaceCardProps);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        toast.error('Failed to load workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = () => {
    navigate('/workspace/new');
  };

  const handleDeleteWorkspace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Filter out the deleted workspace
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
    toast.success("Workspace deleted successfully");
    
    // In a real app, you would also call the API to delete the workspace
    // workspaceService.deleteWorkspace(id);
  };

  // Filter and sort workspaces
  const filteredWorkspaces = workspaces
    .filter(workspace => {
      // Apply search filter
      return workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             workspace.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          return b.id.localeCompare(a.id); // Using ID as proxy for creation date
        case 'oldest':
          return a.id.localeCompare(b.id);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'projects':
          return b.projectCount - a.projectCount;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <Button onClick={handleCreateWorkspace}>
            <Plus className="h-4 w-4 mr-2" />
            New Workspace
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="projects">Most Projects</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredWorkspaces.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-3"
              }>
                {filteredWorkspaces.map(workspace => (
                  <WorkspaceCard 
                    key={workspace.id} 
                    {...workspace} 
                    onDelete={(e) => handleDeleteWorkspace(workspace.id, e)}
                    className={viewMode === 'list' ? 'flex gap-4 p-4' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">No workspaces found</h3>
                <p className="text-muted-foreground">Try changing your search criteria or create a new workspace</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacesPage;
