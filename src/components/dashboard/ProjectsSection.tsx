
import React, { useState, useEffect } from 'react';
import { FileCheck, FolderKanban, Users, Clock } from 'lucide-react';
import ProjectCard, { ProjectCardProps } from '../ProjectCard';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { workspaceService } from '@/services';
import { Workspace } from '@/types/workspace';

type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started' | 'at-risk';

interface ProjectsSectionProps {
  projects: ProjectCardProps[];
  onProjectDeleted?: (id: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects: propProjects, onProjectDeleted }) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const data = await workspaceService.getWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Helper function to get workspace for a project
  const getProjectWorkspace = (projectId: string) => {
    return workspaces.find(workspace => 
      workspace.projects.includes(projectId)
    );
  };

  // Handle project deletion
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    // Notify parent component about deletion
    if (onProjectDeleted) {
      onProjectDeleted(id);
      toast.success("Project deleted successfully");
    }
  };
  
  // Filter projects based on selected status
  const filteredProjects = statusFilter === 'all'
    ? propProjects // Use the prop directly to ensure latest state
    : propProjects.filter(project => project.status === statusFilter);

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-xl font-semibold mb-3 sm:mb-0">Projects Overview</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter('in-progress')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === 'in-progress' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === 'completed' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            Completed
          </button>
          <button 
            onClick={() => setStatusFilter('at-risk')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              statusFilter === 'at-risk' 
              ? 'bg-primary text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            At Risk
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.length > 0 ? (
            filteredProjects.slice(0, 4).map(project => {
              const projectWorkspace = getProjectWorkspace(project.id);
              
              return (
                <div key={project.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <ProjectCard 
                    {...project} 
                    onDelete={(e) => handleDeleteProject(project.id, e)}
                  />
                  {projectWorkspace && (
                    <div className="px-4 py-3 bg-muted/30 border-t border-border flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: projectWorkspace.color || '#4f46e5' }}
                        />
                        <span className="text-sm font-medium">{projectWorkspace.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{project.members.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 py-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                <FileCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No projects found</h3>
              <p className="text-muted-foreground max-w-md">
                No projects match your current filter. Try selecting a different status or create a new project within a workspace.
              </p>
            </div>
          )}
        </div>
        
        {filteredProjects.length > 4 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={handleViewAllProjects}>
              View All Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
