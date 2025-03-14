
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ProjectActionsProps {
  projectId: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newTask, setNewTask] = useState('');
  const [timeTracking, setTimeTracking] = useState({
    hours: 0,
    minutes: 0,
    description: ''
  });

  const handleScheduleMeeting = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    toast.success("Meeting scheduled", {
      description: `Meeting scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
    });
  };

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

  const handleTrackTime = () => {
    if (timeTracking.hours === 0 && timeTracking.minutes === 0) {
      toast.error("Please enter time");
      return;
    }
    
    let timeDescription = '';
    if (timeTracking.hours > 0) {
      timeDescription += `${timeTracking.hours} hour${timeTracking.hours > 1 ? 's' : ''}`;
    }
    if (timeTracking.minutes > 0) {
      if (timeDescription) timeDescription += ' and ';
      timeDescription += `${timeTracking.minutes} minute${timeTracking.minutes > 1 ? 's' : ''}`;
    }
    
    toast.success("Time tracked", {
      description: `${timeDescription} tracked for this project.`,
    });
    
    setTimeTracking({
      hours: 0,
      minutes: 0,
      description: ''
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
      </div>
      
      <div className="p-5">
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Meeting</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto"
                />
              </div>
              <DialogClose asChild>
                <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Track Time
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Track Time</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours">Hours</Label>
                    <Input 
                      id="hours"
                      type="number" 
                      min="0"
                      value={timeTracking.hours} 
                      onChange={(e) => setTimeTracking({...timeTracking, hours: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input 
                      id="minutes"
                      type="number" 
                      min="0"
                      max="59"
                      value={timeTracking.minutes} 
                      onChange={(e) => setTimeTracking({...timeTracking, minutes: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timeDescription">Description (optional)</Label>
                  <Input 
                    id="timeDescription"
                    value={timeTracking.description} 
                    onChange={(e) => setTimeTracking({...timeTracking, description: e.target.value})}
                    placeholder="What were you working on?"
                  />
                </div>
              </div>
              <DialogClose asChild>
                <Button onClick={handleTrackTime}>Log Time</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
