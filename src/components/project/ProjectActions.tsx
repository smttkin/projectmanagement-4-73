
import React, { useState, useEffect } from 'react';
import MeetingScheduler from './MeetingScheduler';
import TaskCreator from './TaskCreator';
import TimeTracker from './TimeTracker';
import { useProgressCalculation } from '@/hooks/useProgressCalculation';
import ProjectProgress from '../ProjectProgress';
import { calculateTaskProgress } from '@/utils/statusUtils';

interface ProjectActionsProps {
  projectId: string;
  onProgressUpdate?: (newProgress: number) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ 
  projectId, 
  onProgressUpdate 
}) => {
  // Initialize progress calculation with localStorage persistence
  const { progress, setProgress, incrementProgress } = useProgressCalculation({
    initialValue: 0,
    min: 0,
    max: 100,
    persistKey: `project-progress-${projectId}`,
    onChange: (newValue) => {
      if (onProgressUpdate) {
        onProgressUpdate(newValue);
      }
    }
  });

  // Track component activity for weighted progress calculation
  const [activityData, setActivityData] = useState({
    meetings: 0,
    tasks: { total: 0, completed: 0 },
    timeEntries: 0
  });

  // Load activity data from localStorage
  useEffect(() => {
    // Load meetings
    try {
      const meetingsData = localStorage.getItem(`meetings-${projectId}`);
      const meetings = meetingsData ? JSON.parse(meetingsData).length : 0;
      
      // Load tasks
      const tasksData = localStorage.getItem(`tasks-${projectId}`);
      const tasks = tasksData ? JSON.parse(tasksData) : [];
      const completedTasks = tasks.filter((t: any) => t.completed).length;
      
      // Load time entries
      const timeData = localStorage.getItem(`time-entries-${projectId}`);
      const timeEntries = timeData ? JSON.parse(timeData).length : 0;
      
      setActivityData({
        meetings,
        tasks: { total: tasks.length, completed: completedTasks },
        timeEntries
      });
      
      // Calculate initial progress based on activity data
      calculateOverallProgress({
        meetings,
        tasks: { total: tasks.length, completed: completedTasks },
        timeEntries
      });
    } catch (error) {
      console.error('Error loading activity data:', error);
    }
  }, [projectId]);

  // Calculate overall project progress based on various factors
  const calculateOverallProgress = (data: typeof activityData) => {
    // Only calculate if there's actual activity
    if (data.meetings === 0 && data.tasks.total === 0 && data.timeEntries === 0) {
      return;
    }
    
    // Calculate task completion percentage
    const taskProgress = calculateTaskProgress(data.tasks.total, data.tasks.completed);
    
    // Create weighted factors for progress calculation
    const factors = [
      // Tasks have the highest weight in progress
      { value: taskProgress, weight: 5 },
      // Meetings contribute to progress
      { value: Math.min(data.meetings * 10, 100), weight: 2 },
      // Time tracking contributes to progress
      { value: Math.min(data.timeEntries * 10, 100), weight: 3 }
    ];
    
    // Calculate weighted average progress
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedSum = factors.reduce((sum, factor) => {
      return sum + (factor.value * factor.weight);
    }, 0);
    
    const calculatedProgress = Math.round(weightedSum / totalWeight);
    
    // Update progress state
    setProgress(calculatedProgress);
  };

  // Handler for meeting scheduled
  const handleMeetingScheduled = () => {
    const newData = {
      ...activityData,
      meetings: activityData.meetings + 1
    };
    setActivityData(newData);
    calculateOverallProgress(newData);
  };

  // Handler for task created/updated
  const handleTasksUpdated = (totalTasks: number, completedTasks: number) => {
    const newData = {
      ...activityData,
      tasks: { total: totalTasks, completed: completedTasks }
    };
    setActivityData(newData);
    calculateOverallProgress(newData);
  };

  // Handler for time tracked
  const handleTimeTracked = () => {
    const newData = {
      ...activityData,
      timeEntries: activityData.timeEntries + 1
    };
    setActivityData(newData);
    calculateOverallProgress(newData);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
          <ProjectProgress progress={progress} showLabel={true} size="md" />
        </div>
        
        <div className="space-y-2">
          <MeetingScheduler 
            projectId={projectId} 
            onMeetingScheduled={handleMeetingScheduled} 
          />
          <TaskCreator 
            projectId={projectId} 
            onTasksUpdated={handleTasksUpdated}
          />
          <TimeTracker 
            projectId={projectId} 
            onTimeTracked={handleTimeTracked}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
