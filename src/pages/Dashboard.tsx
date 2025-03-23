
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusCard from '../components/StatusCard';
import { 
  CheckCircle, 
  Clock, 
  FileCheck, 
  PlayCircle, 
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ProgressSection from '../components/dashboard/ProgressSection';
import TeamSection from '../components/dashboard/TeamSection';
import DeadlinesSection from '../components/dashboard/DeadlinesSection';
import ActivitySection from '../components/dashboard/ActivitySection';
import { projectService } from '@/services';
import { ProjectCardProps } from '@/components/ProjectCard';
import { projectToCardProps } from '@/utils/projectMappers';

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
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        if (data && data.length > 0) {
          setProjects(data.map(projectToCardProps));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Update statistics when projects change
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const atRiskProjects = projects.filter(p => p.status === 'at-risk').length;
  
  const avgProgressPercentage = projects.length > 0 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / totalProjects)
    : 0;

  // Handle project addition
  const handleProjectAdded = (newProject: ProjectCardProps) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };

  // Handle project deletion
  const handleProjectDeleted = (id: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <DashboardHeader user={user} onProjectAdded={handleProjectAdded} />
        
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
