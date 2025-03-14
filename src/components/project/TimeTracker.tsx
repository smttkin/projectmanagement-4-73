
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";

interface TimeTrackerProps {
  projectId: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ projectId }) => {
  const [timeTracking, setTimeTracking] = useState({
    hours: 0,
    minutes: 0,
    description: ''
  });
  
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
  );
};

export default TimeTracker;
