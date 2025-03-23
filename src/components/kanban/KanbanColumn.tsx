
import React, { useState } from 'react';
import KanbanTask from './KanbanTask';
import { KanbanTask as KanbanTaskType, KanbanStatus, KanbanColumn as KanbanColumnType } from '@/types/kanban';
import { Plus, MoreHorizontal, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTaskType[];
  onAddTask?: (status: KanbanStatus) => void;
  onTaskClick?: (task: KanbanTaskType) => void;
  onDrop?: (task: KanbanTaskType, newStatus: KanbanStatus) => void;
  onUpdateColumn?: (columnId: string, updates: Partial<KanbanColumnType>) => void;
  onDeleteColumn?: (columnId: string) => void;
  onEditTask?: (task: KanbanTaskType) => void;
  onDeleteTask?: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column,
  tasks, 
  onAddTask,
  onTaskClick,
  onDrop,
  onUpdateColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && onDrop) {
      onDrop(task, column.status);
    }
  };
  
  const handleDragStart = (e: React.DragEvent, task: KanbanTaskType) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const handleTitleSave = () => {
    if (columnTitle.trim()) {
      onUpdateColumn?.(column.id, { title: columnTitle });
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setColumnTitle(column.title);
      setIsEditing(false);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full min-w-[280px] rounded-md border border-border",
        column.color
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-2 border-b border-border bg-opacity-50 flex items-center justify-between">
        {isEditing ? (
          <Input
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyDown}
            className="h-7 text-sm"
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between w-full">
            <h3 className="font-medium text-sm">{column.title}</h3>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded mr-1">
                {tasks.length}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="xs" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit Column
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {tasks.map(task => (
          <KanbanTask 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick?.(task)}
            onDragStart={handleDragStart}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
      
      <div className="p-2 mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-xs h-8"
          onClick={() => onAddTask?.(column.status)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Task
        </Button>
      </div>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the "{column.title}" column and move all tasks to another column. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => onDeleteColumn?.(column.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KanbanColumn;
