
import React from 'react';
import MeetingScheduler from './MeetingScheduler';
import TaskCreator from './TaskCreator';
import TimeTracker from './TimeTracker';
import { useProgressCalculation } from '@/hooks/useProgressCalculation';

interface ProjectActionsProps {
  projectId: string;
  onProgressUpdate?: (newProgress: number) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ 
  projectId, 
  onProgressUpdate 
}) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="p-5">
        <div className="space-y-2">
          <MeetingScheduler projectId={projectId} />
          <TaskCreator 
            projectId={projectId} 
            onTaskCreated={() => onProgressUpdate && onProgressUpdate(5)}
          />
          <TimeTracker 
            projectId={projectId} 
            onTimeTracked={() => onProgressUpdate && onProgressUpdate(3)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
