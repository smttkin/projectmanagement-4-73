
import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  totalTasks: number;
  completedTasks: number;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask,
  totalTasks,
  completedTasks 
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      taskFilter === 'all' || 
      (taskFilter === 'active' && !task.completed) || 
      (taskFilter === 'completed' && task.completed);
      
    const matchesSearch = task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <div className="mt-3 space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-xs">
          {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
        </div>
        <div className="flex gap-1">
          <Button 
            variant={taskFilter === 'all' ? 'default' : 'ghost'} 
            size="sm" 
            className="text-xs h-6 px-2"
            onClick={() => setTaskFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={taskFilter === 'active' ? 'default' : 'ghost'} 
            size="sm" 
            className="text-xs h-6 px-2"
            onClick={() => setTaskFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={taskFilter === 'completed' ? 'default' : 'ghost'} 
            size="sm" 
            className="text-xs h-6 px-2"
            onClick={() => setTaskFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>
      
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-7 text-xs"
      />
      
      <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`flex items-start p-2 rounded-md hover:bg-muted cursor-pointer group ${
                task.completed ? 'bg-muted/50' : ''
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              <div className="mt-0.5 mr-2">
                {task.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-xs text-center text-muted-foreground py-3">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
