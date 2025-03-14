
import React from 'react';
import MeetingScheduler from './MeetingScheduler';
import TaskCreator from './TaskCreator';
import TimeTracker from './TimeTracker';

interface ProjectActionsProps {
  projectId: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId }) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="p-5">
        <div className="space-y-2">
          <MeetingScheduler projectId={projectId} />
          <TaskCreator projectId={projectId} />
          <TimeTracker projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
