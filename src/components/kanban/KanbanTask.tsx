
import React, { useState } from 'react';
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

interface KanbanTaskProps {
  task: KanbanTaskType;
  onClick?: (task: KanbanTaskType) => void;
  onDragStart?: (e: React.DragEvent, task: KanbanTaskType) => void;
  onEdit?: (task: KanbanTaskType) => void;
  onDelete?: (taskId: string) => void;
}

const priorityConfig = {
  high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'High' },
  medium: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Medium' },
  low: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Low' },
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
      className="mb-2 cursor-pointer hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      <CardContent className="p-3 relative">
        {/* Task dropdown menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
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
          className="text-sm font-medium mb-1 pr-6"
          onClick={() => onClick?.(task)}
        >
          {task.title}
        </h3>
        
        {/* Task description */}
        {task.description && (
          <p 
            className="text-xs text-muted-foreground mb-2 line-clamp-2"
            onClick={() => onClick?.(task)}
          >
            {task.description}
          </p>
        )}
        
        {/* Task metadata */}
        <div className="flex items-center justify-between text-xs mt-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs", priorityConfig[task.priority].color)}
          >
            {priorityConfig[task.priority].label}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{task.dueDate}</span>
            </div>
          )}
        </div>
        
        {/* Task activity indicators */}
        <div className="flex items-center justify-start gap-3 mt-2 text-xs text-muted-foreground">
          {commentCount > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{commentCount}</span>
            </div>
          )}
          
          {attachmentCount > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>{attachmentCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanTaskComponent;
