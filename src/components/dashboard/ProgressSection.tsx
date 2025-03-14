
import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { ProjectCardProps } from '../ProjectCard';
import ProjectProgress from '../ProjectProgress';

interface ProgressSectionProps {
  projects: ProjectCardProps[];
  avgProgressPercentage: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ projects, avgProgressPercentage }) => {
  // Calculate projects with high progress (>70%)
  const highProgressProjects = projects.filter(p => p.progress > 70).length;
  
  // Calculate projects due this week (simplified logic)
  const projectsDueSoon = 3; // This would ideally be calculated from actual due dates
  
  return (
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
            <h4 className="text-sm font-medium text-muted-foreground mb-1">High Progress</h4>
            <div className="flex items-end">
              <span className="text-3xl font-bold">{highProgressProjects}</span>
              <span className="text-xs text-green-600 font-medium ml-2 pb-1 flex items-center">
                <Check size={12} className="mr-0.5" />
                Projects
              </span>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Projects Due Soon</h4>
            <div className="flex items-end">
              <span className="text-3xl font-bold">{projectsDueSoon}</span>
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
              {projects.map((project) => (
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
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{project.title}</h4>
                      <span className="text-xs text-muted-foreground ml-2">
                        Due {project.dueDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description}
                    </p>
                    <div className="mt-2">
                      <ProjectProgress progress={project.progress} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
