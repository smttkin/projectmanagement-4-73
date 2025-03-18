
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
import { useTaskList } from '../../hooks/useTaskList';
import TaskList from './TaskList';

interface TaskCreatorProps {
  projectId: string;
  onTaskCreated?: () => void;
  onTasksUpdated?: (totalTasks: number, completedTasks: number) => void;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ 
  projectId,
  onTaskCreated,
  onTasksUpdated
}) => {
  const [newTask, setNewTask] = useState('');
  const { tasks, addTask, toggleTask, deleteTask, totalTasks, completedTasks } = useTaskList(projectId, onTasksUpdated);
  
  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    
    addTask(newTask);
    setNewTask('');
    
    toast.success("Task added", {
      description: `New task "${newTask}" has been added to the project.`,
    });
    
    if (onTaskCreated) {
      onTaskCreated();
    }
  };
  
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
        <TaskList 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          onDeleteTask={deleteTask}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />
      )}
    </>
  );
};

export default TaskCreator;
