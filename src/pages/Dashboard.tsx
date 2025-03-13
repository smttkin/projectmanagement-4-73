import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusCard from '../components/StatusCard';
import { 
  CheckCircle, 
  Clock, 
  FileCheck, 
  PlayCircle, 
} from 'lucide-react';
import { ProjectCardProps } from '../components/ProjectCard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import ProgressSection from '../components/dashboard/ProgressSection';
import TeamSection from '../components/dashboard/TeamSection';
import DeadlinesSection from '../components/dashboard/DeadlinesSection';
import ActivitySection from '../components/dashboard/ActivitySection';

// Mock data for projects
const projectsData: ProjectCardProps[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding and improved UX.',
    progress: 65,
    dueDate: 'Sep 30',
    priority: 'high',
    status: 'in-progress',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
    ],
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile application for iOS and Android.',
    progress: 30,
    dueDate: 'Oct 15',
    priority: 'medium',
    status: 'in-progress',
    members: [
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '4', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Launch Q4 marketing campaign across social media channels.',
    progress: 100,
    dueDate: 'Aug 28',
    priority: 'medium',
    status: 'completed',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
      { id: '5', name: 'Robert Johnson', avatar: 'https://i.pravatar.cc/150?img=59' },
      { id: '6', name: 'Emily Clark', avatar: 'https://i.pravatar.cc/150?img=24' },
    ],
  },
  {
    id: '4',
    title: 'Product Launch',
    description: 'Coordinate and execute launch of new product line.',
    progress: 10,
    dueDate: 'Nov 5',
    priority: 'high',
    status: 'not-started',
    members: [
      { id: '1', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=68' },
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '4', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
  },
  {
    id: '5',
    title: 'Customer Feedback Survey',
    description: 'Design and distribute customer satisfaction survey.',
    progress: 90,
    dueDate: 'Sep 10',
    priority: 'low',
    status: 'in-progress',
    members: [
      { id: '3', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?img=47' },
    ],
  },
  {
    id: '6',
    title: 'System Integration',
    description: 'Integrate new CRM system with existing infrastructure.',
    progress: 45,
    dueDate: 'Oct 25',
    priority: 'high',
    status: 'at-risk',
    members: [
      { id: '2', name: 'Team Member', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '5', name: 'Robert Johnson', avatar: 'https://i.pravatar.cc/150?img=59' },
      { id: '7', name: 'Mark Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
  },
];

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
  
  // Calculate statistics
  const totalProjects = projectsData.length;
  const completedProjects = projectsData.filter(p => p.status === 'completed').length;
  const inProgressProjects = projectsData.filter(p => p.status === 'in-progress').length;
  const atRiskProjects = projectsData.filter(p => p.status === 'at-risk').length;
  
  const avgProgressPercentage = Math.round(
    projectsData.reduce((sum, project) => sum + project.progress, 0) / totalProjects
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <DashboardHeader user={user} />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatusCard
            title="Total Projects"
            value={totalProjects}
            icon={FileCheck}
            color="blue"
            change={{ value: 12, type: 'increase' }}
          />
          <StatusCard
            title="In Progress"
            value={inProgressProjects}
            icon={PlayCircle}
            color="orange"
            change={{ value: 5, type: 'increase' }}
          />
          <StatusCard
            title="Completed"
            value={completedProjects}
            icon={CheckCircle}
            color="green"
            change={{ value: 2, type: 'increase' }}
          />
          <StatusCard
            title="At Risk"
            value={atRiskProjects}
            icon={Clock}
            color="red"
            change={{ value: 1, type: 'decrease' }}
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section - Takes up 2/3 of the grid on large screens */}
          <div className="lg:col-span-2">
            <ProjectsSection projects={projectsData} />
            <ProgressSection projects={projectsData} avgProgressPercentage={avgProgressPercentage} />
          </div>
          
          {/* Sidebar - Takes up 1/3 of the grid on large screens */}
          <div>
            <TeamSection projects={projectsData} />
            <DeadlinesSection deadlines={upcomingDeadlines} />
            <ActivitySection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
