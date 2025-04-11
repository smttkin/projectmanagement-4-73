
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusCard from '../components/StatusCard';
import { 
  CheckCircle, 
  Clock, 
  FileCheck, 
  PlayCircle, 
  FolderKanban,
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ProgressSection from '../components/dashboard/ProgressSection';
import TeamSection from '../components/dashboard/TeamSection';
import DeadlinesSection from '../components/dashboard/DeadlinesSection';
import ActivitySection from '../components/dashboard/ActivitySection';
import { ProjectCardProps } from '@/components/ProjectCard';
import { workspaceService, projectService } from '@/services';
import { toast } from 'sonner';
import { Project, TeamMember } from '@/types/project';
import { Workspace } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data for upcoming deadlines
const upcomingDeadlines = [
  {
    id: '1',
    title: 'Finalize designs',
    project: 'Website Redesign',
    dueDate: new Date(2023, 8, 15),
  },
  {
    id: '2',
    title: 'User testing',
    project: 'Mobile App Development',
    dueDate: new Date(2023, 8, 20),
  },
  {
    id: '3',
    title: 'Content approval',
    project: 'Marketing Campaign',
    dueDate: new Date(2023, 8, 18),
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const projectsData = await projectService.getProjects();
        
        // Map Project[] to ProjectCardProps[]
        const projectCardProps = projectsData.map((project: Project) => ({
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
        
        // Fetch workspaces
        const workspacesData = await workspaceService.getWorkspaces();
        setWorkspaces(workspacesData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
  
  // Update statistics when projects change
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const atRiskProjects = projects.filter(p => p.status === 'at-risk').length;
  
  const avgProgressPercentage = projects.length > 0 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / totalProjects)
    : 0;

  // Handle project deletion
  const handleProjectDeleted = (id: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
  };
  
  const handleNavigateToWorkspaces = () => {
    navigate('/workspaces');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <DashboardHeader user={user} />
        
        {/* Workspaces Overview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workspaces</h2>
            <Button variant="ghost" size="sm" onClick={handleNavigateToWorkspaces}>
              View All
            </Button>
          </div>
          
          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {workspaces.slice(0, 4).map(workspace => (
                <div 
                  key={workspace.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="h-8 w-8 rounded-md flex items-center justify-center text-white"
                      style={{ backgroundColor: workspace.color || '#4f46e5' }}
                    >
                      <FolderKanban size={16} />
                    </div>
                    <h3 className="font-medium">{workspace.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{workspace.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {workspace.projects.length} project{workspace.projects.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
              <p className="text-muted-foreground mb-4">Create a workspace to organize your projects</p>
              <Button onClick={handleNavigateToWorkspaces}>
                Create Workspace
              </Button>
            </div>
          )}
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatusCard
            title="Total Projects"
            value={totalProjects}
            icon={FileCheck}
            color="blue"
            change={{ value: totalProjects > 0 ? totalProjects : 0, type: 'increase' }}
          />
          <StatusCard
            title="In Progress"
            value={inProgressProjects}
            icon={PlayCircle}
            color="orange"
            change={{ value: inProgressProjects, type: 'increase' }}
          />
          <StatusCard
            title="Completed"
            value={completedProjects}
            icon={CheckCircle}
            color="green"
            change={{ value: completedProjects, type: 'increase' }}
          />
          <StatusCard
            title="At Risk"
            value={atRiskProjects}
            icon={Clock}
            color="red"
            change={{ value: atRiskProjects, type: atRiskProjects > 0 ? 'increase' : 'neutral' }}
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section - Takes up 2/3 of the grid on large screens */}
          <div className="lg:col-span-2">
            <ProjectsSection projects={projects} onProjectDeleted={handleProjectDeleted} />
            <ProgressSection projects={projects} avgProgressPercentage={avgProgressPercentage} />
          </div>
          
          {/* Sidebar - Takes up 1/3 of the grid on large screens */}
          <div>
            <TeamSection projects={projects} />
            <DeadlinesSection deadlines={upcomingDeadlines} />
            <ActivitySection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
