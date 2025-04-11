import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Settings, 
  Users, 
  FolderKanban,
  MoreHorizontal,
  Trash2,
  Edit,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProjectCard from '@/components/ProjectCard';
import { workspaceService, projectService, workspaceProjectService } from '@/services';
import { Workspace } from '@/types/workspace';
import { Project } from '@/types/project';
import { toast } from 'sonner';
import AddProjectDialog from '@/components/workspace/AddProjectDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const workspaceData = await workspaceService.getWorkspace(id);
        
        if (!workspaceData) {
          toast.error('Workspace not found');
          navigate('/workspaces');
          return;
        }
        
        setWorkspace(workspaceData);
        
        // Fetch projects for this workspace
        const projectsData = await workspaceService.getWorkspaceProjects(id);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching workspace:', error);
        toast.error('Failed to load workspace data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkspaceData();
  }, [id, navigate]);
  
  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };
  
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await projectService.deleteProject(projectId);
      
      // Also remove from workspace
      if (workspace) {
        await workspaceProjectService.removeProjectFromWorkspace(workspace.id, projectId);
      }
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  const handleDeleteWorkspace = async () => {
    if (!workspace) return;
    
    try {
      await workspaceService.deleteWorkspace(workspace.id);
      toast.success('Workspace deleted successfully');
      navigate('/workspaces');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Failed to delete workspace');
    }
  };
  
  const handleEditWorkspace = () => {
    if (!workspace) return;
    navigate(`/workspace/${workspace.id}/edit`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading workspace...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!workspace) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Workspace Not Found</h2>
              <p className="text-muted-foreground mb-4">The workspace you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => navigate('/workspaces')}>
                Go to Workspaces
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center mr-4 text-white"
              style={{ backgroundColor: workspace.color || '#4f46e5' }}
            >
              <Briefcase size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
              <p className="text-muted-foreground">{workspace.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AddProjectDialog workspace={workspace} onProjectAdded={handleProjectAdded} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditWorkspace}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Workspace
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="projects" className="flex items-center">
              <FolderKanban className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.name}
                    description={project.description || ''}
                    progress={project.progress || 0}
                    dueDate={new Date(project.dueDate).toLocaleDateString()}
                    priority={project.priority || 'medium'}
                    status={project.status || 'not-started'}
                    members={project.members || []}
                    onDelete={(e) => handleDeleteProject(project.id, e)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    This workspace doesn't have any projects yet. Create your first project to get started.
                  </p>
                  <AddProjectDialog workspace={workspace} onProjectAdded={handleProjectAdded} />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Team Management</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Manage team members and their access to this workspace.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Team Members
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Workspace Settings</h2>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Delete this workspace</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete a workspace, there is no going back. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete Workspace
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-semibold"> {workspace.name} </span> 
              workspace and all associated projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkspace}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkspaceDetail;
