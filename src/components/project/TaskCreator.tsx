
import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";

interface TaskCreatorProps {
  projectId: string;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ projectId }) => {
  const [newTask, setNewTask] = useState('');
  
  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    toast.success("Task added", {
      description: `New task "${newTask}" has been added to the project.`,
    });
    setNewTask('');
  };
  
  return (
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
  );
};

export default TaskCreator;
