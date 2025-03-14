
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProjectProgressProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ 
  progress, 
  showLabel = true, 
  size = 'md',
  className = '' 
}) => {
  // Ensure progress is within 0-100 range
  const validProgress = Math.max(0, Math.min(100, progress));
  
  // Determine color based on progress value
  const getProgressColor = (value: number) => {
    if (value >= 100) return 'bg-green-500';
    if (value >= 70) return 'bg-primary';
    if (value >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Determine height based on size
  const getProgressHeight = (size: 'sm' | 'md' | 'lg') => {
    switch(size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-6';
      default: return 'h-3';
    }
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex justify-between items-center text-sm">
          <span className="font-medium">Progress</span>
          <span className={`font-medium ${validProgress === 100 ? 'text-green-500' : ''}`}>
            {validProgress}%
          </span>
        </div>
      )}
      <Progress 
        value={validProgress} 
        className={`${getProgressHeight(size)} overflow-hidden`}
      />
      {size === 'lg' && validProgress > 5 && (
        <div 
          className="relative text-xs font-bold text-white"
          style={{ 
            marginTop: '-1.5rem',
            marginLeft: `${validProgress / 2}%`,
            transform: 'translateX(-50%)'
          }}
        >
          {validProgress}%
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;
