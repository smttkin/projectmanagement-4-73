
import React from 'react';
import { KanbanTask as KanbanTaskType } from '@/types/kanban';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanTaskProps {
  task: KanbanTaskType;
  onClick?: (task: KanbanTaskType) => void;
  onDragStart?: (e: React.DragEvent, task: KanbanTaskType) => void;
}

const priorityConfig = {
  high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'High' },
  medium: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Medium' },
  low: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Low' },
};

const KanbanTaskComponent: React.FC<KanbanTaskProps> = ({ 
  task, 
  onClick, 
  onDragStart 
}) => {
  return (
    <Card 
      className="mb-2 cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => onClick?.(task)}
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      <CardContent className="p-3">
        <h3 className="text-sm font-medium mb-1">{task.title}</h3>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
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
      </CardContent>
    </Card>
  );
};

export default KanbanTaskComponent;
