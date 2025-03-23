
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
  
  // Enhanced theme-reactive column styles with user color preservation
  const getColumnStyles = () => {
    // Base styles common to all columns
    const baseClasses = "flex flex-col h-full min-w-[280px] rounded-md border";
    
    // If column has a custom color class, use it but ensure text is visible
    if (column.color) {
      // These color classes map to light-mode colors, we'll add dark mode handling
      const colorMap = {
        'bg-slate-100': 'dark:bg-slate-800 dark:text-white',
        'bg-blue-100': 'dark:bg-blue-900 dark:text-white',
        'bg-green-100': 'dark:bg-green-900 dark:text-white',
        'bg-amber-100': 'dark:bg-amber-900 dark:text-white',
        'bg-red-100': 'dark:bg-red-900 dark:text-white',
        'bg-purple-100': 'dark:bg-purple-900 dark:text-white',
        'bg-pink-100': 'dark:bg-pink-900 dark:text-white',
      };
      
      // Find the matching dark mode class or use a default
      const darkModeClass = (Object.entries(colorMap).find(([key]) => 
        column.color.includes(key))?.[1]) || 'dark:bg-slate-800 dark:text-white';
      
      return cn(baseClasses, column.color, darkModeClass);
    }
    
    // Apply theme-reactive styles based on column status
    switch (column.status) {
      case 'todo':
        return cn(
          baseClasses,
          "bg-card border-border dark:bg-card/80 dark:border-slate-700/50 dark:text-foreground"
        );
      case 'in-progress':
        return cn(
          baseClasses,
          "bg-card border-primary/30 dark:bg-slate-800/60 dark:border-primary/40 dark:text-foreground"
        );
      case 'in-review':
        return cn(
          baseClasses,
          "bg-card border-orange-500/30 dark:bg-amber-950/20 dark:border-orange-400/30 dark:text-foreground"
        );
      case 'done':
        return cn(
          baseClasses,
          "bg-card border-green-500/30 dark:bg-green-950/20 dark:border-green-400/30 dark:text-foreground"
        );
      case 'blocked':
        return cn(
          baseClasses,
          "bg-card border-destructive/30 dark:bg-red-950/20 dark:border-red-400/30 dark:text-foreground"
        );
      default:
        return cn(
          baseClasses,
          "bg-card border-border dark:bg-card/80 dark:border-slate-700/50 dark:text-foreground"
        );
    }
  };
  
  // Get header style based on column status
  const getHeaderStyles = () => {
    const baseClasses = "p-2 border-b bg-opacity-50 flex items-center justify-between";
    
    if (column.color) {
      // Extract color family name for consistent theming
      const colorFamily = column.color.split('-')[1]; // e.g., "slate", "blue", etc.
      return cn(baseClasses, `border-${colorFamily}-200 dark:border-${colorFamily}-800`);
    }
    
    switch (column.status) {
      case 'todo':
        return cn(baseClasses, "border-border dark:border-slate-700/50");
      case 'in-progress':
        return cn(baseClasses, "border-primary/30 dark:border-primary/30");
      case 'in-review':
        return cn(baseClasses, "border-orange-500/30 dark:border-orange-400/30");
      case 'done':
        return cn(baseClasses, "border-green-500/30 dark:border-green-400/30");
      case 'blocked':
        return cn(baseClasses, "border-destructive/30 dark:border-red-400/30");
      default:
        return cn(baseClasses, "border-border dark:border-slate-700/50");
    }
  };
  
  // Get task count badge style
  const getTaskCountBadgeStyle = () => {
    // Default style that works in both light and dark modes
    return "text-xs text-foreground bg-background/70 dark:bg-background/30 px-1.5 py-0.5 rounded mr-1";
  };
  
  // Get add task button style
  const getAddTaskButtonStyle = () => {
    return "w-full justify-start text-xs h-8 hover:bg-primary/10 dark:hover:bg-primary/10 text-foreground dark:text-foreground";
  };
  
  return (
    <div 
      className={getColumnStyles()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={getHeaderStyles()}>
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
            <h3 className="font-medium text-sm text-foreground dark:text-foreground">{column.title}</h3>
            <div className="flex items-center">
              <span className={getTaskCountBadgeStyle()}>
                {tasks.length}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
      
      <div className="flex-1 p-2 overflow-y-auto h-full">
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
          className={getAddTaskButtonStyle()}
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
              onClick={() => {
                onDeleteColumn?.(column.id);
                setShowDeleteAlert(false);
              }}
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
