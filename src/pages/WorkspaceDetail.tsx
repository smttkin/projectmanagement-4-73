
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase,
  Edit,
  MoreHorizontal,
  Trash2,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjectCard, { ProjectCardProps } from '@/components/ProjectCard';
import { workspaceService } from '@/services/workspaceService';
import { projectService } from '@/services/projectService';
import { toast } from 'sonner';
import { Workspace } from '@/types/workspace';
import { Project, TeamMember } from '@/types/project';
import AddProjectDialog from '@/components/workspace/AddProjectDialog';

const WorkspaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const fetchWorkspaceData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch workspace details
      const workspaceData = await workspaceService.getWorkspace(id);
      if (!workspaceData) {
        toast.error('Workspace not found');
        navigate('/workspaces');
        return;
      }
      
      setWorkspace(workspaceData);
      
      // Fetch workspace projects
      const projectsData = await workspaceService.getWorkspaceProjects(id);
      
      // Map projects to ProjectCardProps
      const projectCardProps: ProjectCardProps[] = projectsData.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        progress: project.progress,
        dueDate: project.dueDate,
        priority: project.priority,
        status: mapProjectStatus(project.status),
        members: project.teamMembers.map((member: TeamMember) => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar
        })),
        createdAt: project.createdAt,
        deadline: project.dueDate
      }));
      
      setProjects(projectCardProps);
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      toast.error('Failed to load workspace data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id, navigate]);

  // Helper function to map Project status to ProjectCardProps status
  const mapProjectStatus = (status: string): 'completed' | 'in-progress' | 'not-started' | 'at-risk' => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'active':
        return 'in-progress';
      case 'on-hold':
        return 'not-started';
      case 'cancelled':
        return 'at-risk';
      default:
        return 'not-started';
    }
  };

  const handleGoBack = () => {
    navigate('/workspaces');
  };
  
  const handleEditWorkspace = () => {
    navigate(`/workspace/${id}/edit`);
  };
  
  const handleDeleteWorkspace = async () => {
    if (!id) return;
    
    try {
      await workspaceService.deleteWorkspace(id);
      toast.success('Workspace deleted successfully');
      navigate('/workspaces');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Failed to delete workspace');
    }
  };
  
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!id) return;
    
    try {
      // Remove project from workspace
      await workspaceService.removeProjectFromWorkspace(id, projectId);
      
      // Update projects in state
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      
      toast.success('Project removed from workspace');
    } catch (error) {
      console.error('Error removing project from workspace:', error);
      toast.error('Failed to remove project from workspace');
    }
  };
  
  const handleProjectAdded = () => {
    // Refresh workspace data to show the new project
    fetchWorkspaceData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Workspace not found</h2>
          <Button onClick={handleGoBack}>Go back to Workspaces</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Workspace</h1>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm mb-8">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
            <div className="flex items-center">
              <div 
                className="h-12 w-12 rounded-lg flex items-center justify-center mr-4 text-white"
                style={{ backgroundColor: workspace.color || '#4f46e5' }}
              >
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{workspace.name}</h2>
                <p className="text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <AddProjectDialog 
                workspaceId={id || ''}
                onProjectAdded={handleProjectAdded}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditWorkspace}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500"
                    onClick={handleDeleteWorkspace}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-muted-foreground">{workspace.description}</p>
          </div>
        </div>
        
        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    {...project} 
                    onDelete={(e) => handleDeleteProject(project.id, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-lg border">
                <h3 className="text-lg font-medium mb-2">No projects in this workspace</h3>
                <p className="text-muted-foreground mb-6">Get started by adding your first project</p>
                <AddProjectDialog 
                  workspaceId={id || ''}
                  onProjectAdded={handleProjectAdded}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Team member added</p>
                    <p className="text-sm text-muted-foreground">John Doe was added to the workspace</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Project updated</p>
                    <p className="text-sm text-muted-foreground">Website Redesign progress updated to 75%</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Workspace Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Workspace Color</h4>
                  <div className="flex gap-2">
                    {['#4f46e5', '#0891b2', '#65a30d', '#d97706', '#dc2626'].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{ 
                          backgroundColor: color, 
                          borderColor: workspace.color === color ? 'white' : color
                        }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Access Control</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Access
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkspaceDetail;
