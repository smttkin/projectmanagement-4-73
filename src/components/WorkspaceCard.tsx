
import React from 'react';
import { 
  Briefcase,
  MoreHorizontal,
  FolderKanban
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface WorkspaceCardProps {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  color?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  className?: string;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  id,
  name,
  description,
  projectCount,
  color = '#4f46e5',
  icon,
  onClick,
  onDelete,
  className
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate directly to the workspace detail page
      navigate(`/workspace/${id}`);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/workspace/${id}/edit`);
  };
  
  return (
    <div 
      className={cn("bg-card border border-border rounded-xl shadow-subtle hover:shadow-card transition-all duration-300 overflow-hidden interactive cursor-pointer", className)}
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center mr-3 text-white"
              style={{ backgroundColor: color }}
            >
              {icon || <Briefcase size={18} />}
            </div>
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{projectCount} project{projectCount !== 1 ? 's' : ''}</p>
            </div>
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
                Edit Workspace
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={onDelete}
                >
                  Delete Workspace
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">{description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <FolderKanban size={16} className="mr-2" />
          <span>Browse projects</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
