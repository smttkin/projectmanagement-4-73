
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProjectCard, { ProjectCardProps } from '../components/ProjectCard';
import StatusCard from '../components/StatusCard';
import { 
  ArrowUpRight, 
  Calendar, 
  CheckCircle, 
  ChevronsRight, 
  Clock, 
  FileCheck, 
  Plus, 
  PlayCircle, 
  Users
} from 'lucide-react';
import { format } from 'date-fns';

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

// Status filter types
type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started' | 'at-risk';

const Dashboard = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Filter projects based on selected status
  const filteredProjects = statusFilter === 'all'
    ? projectsData
    : projectsData.filter(project => project.status === statusFilter);
    
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Here's what's happening today.
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center shadow-subtle interactive">
              <Plus size={18} className="mr-1.5" />
              New Project
            </button>
          </div>
        </div>
        
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
                    filteredProjects.map(project => (
                      <ProjectCard key={project.id} {...project} />
                    ))
                  ) : (
                    <div className="md:col-span-2 py-8 flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                        <FileCheck className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-1">No projects found</h3>
                      <p className="text-muted-foreground max-w-md">
                        No projects match your current filter. Try selecting a different status or create a new project.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Overall Progress</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Average Completion</h4>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">{avgProgressPercentage}%</span>
                      <span className="text-xs text-green-600 font-medium ml-2 pb-1 flex items-center">
                        <ArrowUpRight size={12} className="mr-0.5" />
                        5%
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Team Members</h4>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">7</span>
                      <span className="text-xs text-green-600 font-medium ml-2 pb-1 flex items-center">
                        <ArrowUpRight size={12} className="mr-0.5" />
                        2
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Projects Due Soon</h4>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">3</span>
                      <span className="text-xs text-muted-foreground font-medium ml-2 pb-1">
                        this week
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Project Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted/70 ml-2.5"></div>
                    <div className="space-y-4">
                      {projectsData.map((project) => (
                        <div key={project.id} className="flex items-start">
                          <div className={`h-5 w-5 rounded-full shrink-0 mt-0.5 border-2 border-background ${
                            project.status === 'completed' 
                              ? 'bg-green-500' 
                              : project.status === 'in-progress' 
                                ? 'bg-primary' 
                                : project.status === 'at-risk'
                                  ? 'bg-red-500'
                                  : 'bg-orange-500'
                          }`}></div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h4 className="font-medium">{project.title}</h4>
                              <span className="text-xs text-muted-foreground ml-2">
                                Due {project.dueDate}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {project.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    project.progress === 100 
                                      ? 'bg-green-500' 
                                      : 'bg-primary'
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Takes up 1/3 of the grid on large screens */}
          <div>
            {/* Team Members */}
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold">Team</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center">
                  View All
                  <ChevronsRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {projectsData.flatMap(p => p.members)
                    .filter((member, index, self) => 
                      index === self.findIndex(m => m.id === member.id)
                    )
                    .slice(0, 5)
                    .map(member => (
                      <div key={member.id} className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Users size={20} className="text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {member.id === '1' ? 'Project Manager' : 'Team Member'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Calendar/Upcoming Deadlines */}
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center">
                  Calendar View
                  <Calendar size={16} className="ml-1" />
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {upcomingDeadlines.map(deadline => (
                    <div 
                      key={deadline.id} 
                      className="p-3 border border-border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{deadline.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Project: {deadline.project}
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md">
                          {format(deadline.dueDate, 'MMM d')}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {format(deadline.dueDate, "EEEE, MMMM d, yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Activity */}
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">Marketing Campaign</span> was marked as completed
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">Robert Johnson</span> was added to <span className="font-medium">System Integration</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">Website Redesign</span> deadline was extended
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Yesterday at 4:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">Customer Feedback Survey</span> was created
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Yesterday at 2:15 PM</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
