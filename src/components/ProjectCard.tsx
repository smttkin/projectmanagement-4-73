
import React from 'react';
import { 
  AlertCircle, 
  Check, 
  Clock, 
  MoreHorizontal, 
  PlayCircle, 
  Trash2,
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'completed' | 'in-progress' | 'not-started' | 'at-risk';
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const statusConfig = {
  'completed': { icon: Check, label: 'Completed', color: 'text-green-500 bg-green-50' },
  'in-progress': { icon: PlayCircle, label: 'In Progress', color: 'text-primary bg-primary/10' },
  'not-started': { icon: Clock, label: 'Not Started', color: 'text-orange-500 bg-orange-50' },
  'at-risk': { icon: AlertCircle, label: 'At Risk', color: 'text-red-500 bg-red-50' },
};

const priorityConfig = {
  'low': { color: 'bg-green-100 text-green-800' },
  'medium': { color: 'bg-yellow-100 text-yellow-800' },
  'high': { color: 'bg-red-100 text-red-800' },
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  progress,
  dueDate,
  priority,
  status,
  members,
  onClick,
  onDelete
}) => {
  const navigate = useNavigate();
  const StatusIcon = statusConfig[status].icon;
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate directly to the project detail page
      navigate(`/project/${id}`);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/project/${id}/edit`);
  };
  
  return (
    <div 
      className="bg-card border border-border rounded-xl shadow-subtle hover:shadow-card transition-all duration-300 overflow-hidden interactive cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold line-clamp-1 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                Edit Project
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={onDelete}
                >
                  Delete Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progress === 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className={cn(
              "text-xs px-2 py-1 rounded-md font-medium",
              statusConfig[status].color
            )}>
              <div className="flex items-center">
                <StatusIcon size={12} className="mr-1" />
                <span>{statusConfig[status].label}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={cn(
              "text-xs px-2 py-1 rounded-md font-medium",
              priorityConfig[priority].color
            )}>
              <span className="capitalize">{priority} Priority</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-muted/30 border-t border-border flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {members.slice(0, 3).map((member) => (
              <div 
                key={member.id} 
                className="h-6 w-6 rounded-full ring-2 ring-background overflow-hidden bg-primary/10"
              >
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                )}
              </div>
            ))}
            {members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground ring-2 ring-background">
                +{members.length - 3}
              </div>
            )}
          </div>
          {members.length > 0 && (
            <span className="text-xs text-muted-foreground">{members.length} member{members.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Due {dueDate}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
