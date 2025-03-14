
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

export default {
  getStatusConfig,
  getProgressColorClass
};
