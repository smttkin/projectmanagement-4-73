
import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import ProjectCard, { ProjectCardProps } from '../ProjectCard';

type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started' | 'at-risk';

interface ProjectsSectionProps {
  projects: ProjectCardProps[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Filter projects based on selected status
  const filteredProjects = statusFilter === 'all'
    ? projects
    : projects.filter(project => project.status === statusFilter);

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
  );
};

export default ProjectsSection;
