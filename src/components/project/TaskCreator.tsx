
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";

interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskCreatorProps {
  projectId: string;
  onTaskCreated?: () => void;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ 
  projectId,
  onTaskCreated 
}) => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(`tasks-${projectId}`);
    if (storedTasks) {
      try {
        // Convert stored strings back to Date objects
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
          if (key === 'createdAt') return new Date(value);
          return value;
        });
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks:', error);
      }
    }
  }, [projectId]);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks-${projectId}`, JSON.stringify(tasks));
    }
  }, [tasks, projectId]);
  
  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    
    const task: Task = {
      id: Date.now().toString(),
      description: newTask,
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    
    toast.success("Task added", {
      description: `New task "${newTask}" has been added to the project.`,
    });
    
    if (onTaskCreated) {
      onTaskCreated();
    }
  };
  
  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };
  
  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };
  
  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      taskFilter === 'all' || 
      (taskFilter === 'active' && !task.completed) || 
      (taskFilter === 'completed' && task.completed);
      
    const matchesSearch = task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Calculate task completion stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="taskName">Task Description</Label>
            <Textarea 
              id="taskName"
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Describe the task..."
              className="h-24"
            />
          </div>
          <DialogClose asChild>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      
      {tasks.length > 0 && (
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
                  onClick={() => handleToggleTask(task.id)}
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
                    onClick={(e) => handleDeleteTask(task.id, e)}
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
      )}
    </>
  );
};

export default TaskCreator;
