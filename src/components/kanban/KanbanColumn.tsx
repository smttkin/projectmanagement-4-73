
import React from 'react';
import KanbanTask from './KanbanTask';
import { KanbanTask as KanbanTaskType, KanbanStatus } from '@/types/kanban';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: KanbanStatus;
  tasks: KanbanTaskType[];
  onAddTask?: (status: KanbanStatus) => void;
  onTaskClick?: (task: KanbanTaskType) => void;
  onDrop?: (task: KanbanTaskType, newStatus: KanbanStatus) => void;
}

const statusColors = {
  'todo': 'bg-slate-100',
  'in-progress': 'bg-blue-100',
  'review': 'bg-amber-100',
  'done': 'bg-green-100'
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onAddTask,
  onTaskClick,
  onDrop
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && onDrop) {
      onDrop(task, status);
    }
  };
  
  const handleDragStart = (e: React.DragEvent, task: KanbanTaskType) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full rounded-md border border-border",
        statusColors[status]
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-2 border-b border-border bg-opacity-50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{statusLabels[status]}</h3>
          <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {tasks.map(task => (
          <KanbanTask 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick?.(task)}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
      
      <div className="p-2 mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-xs h-8"
          onClick={() => onAddTask?.(status)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default KanbanColumn;
