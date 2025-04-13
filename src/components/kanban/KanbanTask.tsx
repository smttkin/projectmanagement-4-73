
import React from 'react';
import { KanbanTask as KanbanTaskType } from '@/types/kanban';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KanbanTaskProps {
  task: KanbanTaskType;
  onClick?: (task: KanbanTaskType) => void;
  onDragStart?: (e: React.DragEvent, task: KanbanTaskType) => void;
  onEdit?: (task: KanbanTaskType) => void;
  onDelete?: (taskId: string) => void;
}

// Theme-reactive priority configurations
const priorityConfig = {
  high: { 
    color: 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800', 
    label: 'High' 
  },
  medium: { 
    color: 'bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800', 
    label: 'Medium' 
  },
  low: { 
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800', 
    label: 'Low' 
  },
};

const KanbanTaskComponent: React.FC<KanbanTaskProps> = ({ 
  task, 
  onClick, 
  onDragStart,
  onEdit,
  onDelete
}) => {
  const commentCount = task.comments?.length || 0;
  const attachmentCount = task.attachments?.length || 0;
  
  return (
    <Card 
      className="mb-1 cursor-pointer hover:shadow-sm transition-shadow border-border dark:border-border/60 bg-card hover:bg-card/80 dark:hover:bg-card/90"
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      <CardContent className="p-2 relative">
        {/* Task dropdown menu */}
        <div className="absolute top-1 right-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => onDelete?.(task.id)}
              >
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      
        {/* Task title */}
        <h3 
          className="text-xs font-medium mb-0.5 pr-5 text-foreground line-clamp-1"
          onClick={() => onClick?.(task)}
        >
          {task.title}
        </h3>
        
        {/* Task description */}
        {task.description && (
          <p 
            className="text-[10px] text-muted-foreground mb-1 line-clamp-1"
            onClick={() => onClick?.(task)}
          >
            {task.description}
          </p>
        )}
        
        {/* Task metadata */}
        <div className="flex items-center justify-between text-[10px] mt-1">
          <Badge 
            variant="outline" 
            className={cn("text-[10px] px-1 py-0", priorityConfig[task.priority].color)}
          >
            {priorityConfig[task.priority].label}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-2 w-2 mr-0.5" />
              <span className="text-[10px]">{task.dueDate}</span>
            </div>
          )}
        </div>
        
        {/* Task activity indicators */}
        {(commentCount > 0 || attachmentCount > 0) && (
          <div className="flex items-center justify-start gap-2 mt-1 text-[10px] text-muted-foreground">
            {commentCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <MessageSquare className="h-2 w-2 mr-0.5" />
                    <span>{commentCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {commentCount} comment{commentCount !== 1 ? 's' : ''}
                </TooltipContent>
              </Tooltip>
            )}
            
            {attachmentCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Paperclip className="h-2 w-2 mr-0.5" />
                    <span>{attachmentCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {attachmentCount} attachment{attachmentCount !== 1 ? 's' : ''}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanTaskComponent;
