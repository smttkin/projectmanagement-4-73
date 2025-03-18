
import React from 'react';
import { Clock, Play, Square, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useTimeTracking } from '../../hooks/useTimeTracking';

interface TimeTrackerProps {
  projectId: string;
  onTimeEntryAdded?: () => void;
  onTimeEntriesUpdated?: (timeEntriesCount: number) => void;
  onTimeTracked?: () => void; // Added this prop to fix the TypeScript error
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  projectId,
  onTimeEntryAdded,
  onTimeEntriesUpdated,
  onTimeTracked
}) => {
  const {
    timeEntries,
    isTracking,
    elapsedTime,
    startTracking,
    stopTracking,
    deleteTimeEntry
  } = useTimeTracking(projectId, onTimeEntriesUpdated);

  const handleStartTracking = () => {
    startTracking();
    toast.success("Time tracking started");
  };

  const handleStopTracking = () => {
    stopTracking();
    toast.success("Time entry saved");
    if (onTimeEntryAdded) {
      onTimeEntryAdded();
    }
    if (onTimeTracked) {
      onTimeTracked();
    }
  };

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <div className="space-y-3">
      <Button
        className="w-full justify-start"
        variant="outline"
        onClick={isTracking ? handleStopTracking : handleStartTracking}
      >
        {isTracking ? (
          <>
            <Square className="mr-2 h-4 w-4 text-red-500" />
            Stop Tracking ({formatTime(elapsedTime)})
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4 text-primary" />
            Start Time Tracking
          </>
        )}
      </Button>
      
      {timeEntries.length > 0 && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Time entries</h4>
            <span className="text-xs text-muted-foreground">
              {timeEntries.length} {timeEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          
          <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
            {timeEntries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">
                    {formatDistanceToNow(entry.startTime, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium">
                    {formatTime(Math.round((entry.endTime.getTime() - entry.startTime.getTime()) / 1000))}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => deleteTimeEntry(entry.id)}
                  >
                    <Trash className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
