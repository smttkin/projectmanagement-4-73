
// Status types used throughout the application
export type ProjectStatus = 'not-started' | 'in-progress' | 'completed' | 'at-risk' | 'on-hold';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Maps status types to their visual representation
export const getStatusConfig = (status: ProjectStatus): StatusConfig => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200'
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200'
      };
    case 'at-risk':
      return {
        label: 'At Risk',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200'
      };
    case 'on-hold':
      return {
        label: 'On Hold',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-200'
      };
    case 'not-started':
    default:
      return {
        label: 'Not Started',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200'
      };
  }
};

// Get appropriate color based on progress percentage
export const getProgressColorClass = (progress: number): string => {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 70) return 'bg-primary';
  if (progress >= 30) return 'bg-amber-500';
  return 'bg-red-500';
};

// Determine status based on progress and due date
export const determineProjectStatus = (
  progress: number, 
  dueDate: Date | string,
  isOnHold?: boolean
): ProjectStatus => {
  if (isOnHold) return 'on-hold';
  
  if (progress >= 100) return 'completed';
  
  // Convert string date to Date object if needed
  const dueDateObj = typeof dueDate === 'string' 
    ? new Date(dueDate) 
    : dueDate;
  
  const today = new Date();
  const timeDiff = dueDateObj.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // If date is in the past and progress < 100%, it's at risk
  if (daysRemaining < 0 && progress < 100) {
    return 'at-risk';
  }
  
  // If less than 3 days remaining but progress is below 80%, it's at risk
  if (daysRemaining <= 3 && progress < 80) {
    return 'at-risk';
  }
  
  if (progress === 0) return 'not-started';
  
  return 'in-progress';
};

// Calculate total percentage based on tasks
export const calculateTaskProgress = (totalTasks: number, completedTasks: number): number => {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

// Aggregated progress calculation
export const calculateAggregatedProgress = (
  taskProgress: number, 
  meetingsCount: number, 
  timeEntriesCount: number,
  weights = { tasks: 5, meetings: 2, timeEntries: 3 }
): number => {
  // Create weighted factors for progress calculation
  const factors = [
    // Tasks have the highest weight in progress
    { value: taskProgress, weight: weights.tasks },
    // Meetings contribute to progress (max 100%)
    { value: Math.min(meetingsCount * 10, 100), weight: weights.meetings },
    // Time tracking contributes to progress (max 100%)
    { value: Math.min(timeEntriesCount * 10, 100), weight: weights.timeEntries }
  ];
  
  // Calculate weighted average progress
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = factors.reduce((sum, factor) => {
    return sum + (factor.value * factor.weight);
  }, 0);
  
  return Math.round(weightedSum / totalWeight);
};

export default {
  getStatusConfig,
  getProgressColorClass,
  determineProjectStatus,
  calculateTaskProgress,
  calculateAggregatedProgress
};
