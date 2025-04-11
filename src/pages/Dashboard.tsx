import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import TeamSection from '../components/dashboard/TeamSection';
import TimelineSection from '../components/dashboard/TimelineSection';
import { projectService } from '@/services';
import { ProjectCardProps } from '../ProjectCard';
import { toast } from 'sonner';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  completionPercentage: number;
  inProgressProjects: number;
  atRiskProjects: number;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    completionPercentage: 0,
    inProgressProjects: 0,
    atRiskProjects: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setIsLoading(true);
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
  
        const totalProjects = projectsData.length;
        const completedProjects = projectsData.filter(p => p.status === 'completed').length;
        
        // Convert to number before division to fix type error
        const completionPercentage = totalProjects > 0 
          ? Math.round((completedProjects / totalProjects) * 100) 
          : 0;
        
        setStats({
          totalProjects,
          completedProjects,
          completionPercentage,
          inProgressProjects: projectsData.filter(p => p.status === 'in-progress').length,
          atRiskProjects: projectsData.filter(p => p.status === 'at-risk').length
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectsData();
  }, []);

  const handleProjectDeleted = (id: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6 space-x-2">
          <LayoutDashboard className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Loading...' : 'All projects in the system'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedProjects}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Loading...' : 'Projects marked as complete'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Loading...' : 'Percentage of projects completed'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk Projects</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.atRiskProjects}</div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Loading...' : 'Projects needing attention'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ProjectsSection projects={projects} onProjectDeleted={handleProjectDeleted} />
          </div>
          <div>
            <TeamSection projects={projects} />
            <TimelineSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
