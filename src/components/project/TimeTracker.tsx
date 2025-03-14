
import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  hours: number;
  minutes: number;
  description: string;
  date: Date;
}

interface TimeTrackerProps {
  projectId: string;
  onTimeTracked?: () => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ 
  projectId,
  onTimeTracked 
}) => {
  const [timeTracking, setTimeTracking] = useState({
    hours: 0,
    minutes: 0,
    description: ''
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showEntries, setShowEntries] = useState(false);
  
  // Active timer state
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  // Load time entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem(`time-entries-${projectId}`);
    if (storedEntries) {
      try {
        // Convert stored strings back to Date objects
        const parsedEntries = JSON.parse(storedEntries, (key, value) => {
          if (key === 'date') return new Date(value);
          return value;
        });
        setTimeEntries(parsedEntries);
      } catch (error) {
        console.error('Error parsing time entries:', error);
      }
    }
    
    // Check if there's an active timer
    const activeTimer = localStorage.getItem(`active-timer-${projectId}`);
    if (activeTimer) {
      try {
        const { startTime, elapsedSeconds } = JSON.parse(activeTimer);
        const now = new Date().getTime();
        const elapsed = elapsedSeconds + Math.floor((now - startTime) / 1000);
        setTimerSeconds(elapsed);
        setIsTimerActive(true);
      } catch (error) {
        console.error('Error parsing active timer:', error);
      }
    }
  }, [projectId]);
  
  // Save time entries to localStorage whenever they change
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem(`time-entries-${projectId}`, JSON.stringify(timeEntries));
    }
  }, [timeEntries, projectId]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTimerSeconds(seconds => {
          const newSeconds = seconds + 1;
          // Update localStorage with current timer state
          localStorage.setItem(`active-timer-${projectId}`, JSON.stringify({
            startTime: new Date().getTime() - (newSeconds * 1000),
            elapsedSeconds: newSeconds
          }));
          return newSeconds;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      // Remove active timer from localStorage
      localStorage.removeItem(`active-timer-${projectId}`);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, projectId]);
  
  const handleTrackTime = () => {
    if (timeTracking.hours === 0 && timeTracking.minutes === 0) {
      toast.error("Please enter time");
      return;
    }
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      hours: timeTracking.hours,
      minutes: timeTracking.minutes,
      description: timeTracking.description,
      date: new Date()
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    
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
    
    if (onTimeTracked) {
      onTimeTracked();
    }
  };
  
  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    toast.success("Time entry deleted");
  };
  
  const handleToggleTimer = () => {
    if (isTimerActive) {
      // Stop timer and add entry
      const hours = Math.floor(timerSeconds / 3600);
      const minutes = Math.floor((timerSeconds % 3600) / 60);
      
      if (hours > 0 || minutes > 0) {
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          hours,
          minutes,
          description: "Timer session",
          date: new Date()
        };
        
        setTimeEntries([...timeEntries, newEntry]);
        
        toast.success("Timer stopped", {
          description: `Logged ${hours}h ${minutes}m to the project.`,
        });
        
        if (onTimeTracked) {
          onTimeTracked();
        }
      }
      
      setTimerSeconds(0);
      localStorage.removeItem(`active-timer-${projectId}`);
    }
    
    setIsTimerActive(!isTimerActive);
  };
  
  // Format timer display
  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // Calculate total time tracked
  const totalMinutes = timeEntries.reduce((total, entry) => {
    return total + (entry.hours * 60) + entry.minutes;
  }, 0);
  
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  return (
    <>
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
            <DialogDescription>
              Log time spent on this project.
            </DialogDescription>
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
      
      <div className="mt-3 space-y-3">
        <Button 
          className={`w-full ${isTimerActive ? 'bg-red-500 hover:bg-red-600' : ''}`}
          size="sm"
          onClick={handleToggleTimer}
        >
          {isTimerActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Stop Timer ({formatTimer(timerSeconds)})
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Timer
            </>
          )}
        </Button>
        
        {timeEntries.length > 0 && (
          <>
            <div className="flex justify-between text-xs">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs px-2 py-1 h-auto"
                onClick={() => setShowEntries(!showEntries)}
              >
                {showEntries ? 'Hide' : 'Show'} time logs
              </Button>
              <div className="text-muted-foreground">
                Total: {totalHours}h {remainingMinutes}m
              </div>
            </div>
            
            {showEntries && (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {timeEntries.sort((a, b) => b.date.getTime() - a.date.getTime()).map(entry => (
                  <div 
                    key={entry.id}
                    className="text-xs bg-muted/30 rounded-md p-2 relative group"
                  >
                    <div className="font-medium">
                      {entry.hours}h {entry.minutes}m
                      <span className="text-muted-foreground ml-2">
                        {format(entry.date, 'MMM d, yyyy')}
                      </span>
                    </div>
                    {entry.description && (
                      <div className="text-muted-foreground mt-1">
                        {entry.description}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDeleteEntry(entry.id, e)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TimeTracker;
