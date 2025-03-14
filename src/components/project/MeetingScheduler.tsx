
import React, { useState, useEffect } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  attendees?: string;
}

interface MeetingSchedulerProps {
  projectId: string;
  onMeetingScheduled?: () => void;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ 
  projectId,
  onMeetingScheduled 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetings, setShowMeetings] = useState(false);
  
  // Load meetings from localStorage on component mount
  useEffect(() => {
    const storedMeetings = localStorage.getItem(`meetings-${projectId}`);
    if (storedMeetings) {
      try {
        // Convert stored strings back to Date objects
        const parsedMeetings = JSON.parse(storedMeetings, (key, value) => {
          if (key === 'date') return new Date(value);
          return value;
        });
        setMeetings(parsedMeetings);
      } catch (error) {
        console.error('Error parsing meetings:', error);
      }
    }
  }, [projectId]);
  
  // Save meetings to localStorage whenever they change
  useEffect(() => {
    if (meetings.length > 0) {
      localStorage.setItem(`meetings-${projectId}`, JSON.stringify(meetings));
    }
  }, [meetings, projectId]);
  
  const handleScheduleMeeting = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!meetingTitle.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingTitle,
      date: selectedDate,
      attendees: meetingAttendees.trim() || undefined
    };
    
    setMeetings([...meetings, newMeeting]);
    
    toast.success("Meeting scheduled", {
      description: `${meetingTitle} scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
    });
    
    // Reset form
    setSelectedDate(undefined);
    setMeetingTitle('');
    setMeetingAttendees('');
    
    // Notify parent component
    if (onMeetingScheduled) {
      onMeetingScheduled();
    }
  };
  
  const handleDeleteMeeting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    toast.success("Meeting deleted");
  };
  
  // Sort meetings by date (most recent first)
  const sortedMeetings = [...meetings].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get upcoming meetings (today or in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingMeetings = sortedMeetings.filter(meeting => meeting.date >= today);
  
  return (
    <>
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
            <DialogDescription>
              Pick a date and provide meeting details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="meetingTitle">Meeting Title</Label>
              <Input 
                id="meetingTitle" 
                value={meetingTitle} 
                onChange={e => setMeetingTitle(e.target.value)}
                placeholder="Team Sync, Client Review, etc."
              />
            </div>
            <div className="grid gap-4">
              <Label>Meeting Date</Label>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="mx-auto border rounded-md"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div>
              <Label htmlFor="meetingAttendees">Attendees (optional)</Label>
              <Input 
                id="meetingAttendees" 
                value={meetingAttendees} 
                onChange={e => setMeetingAttendees(e.target.value)}
                placeholder="Team members, clients, etc."
              />
            </div>
          </div>
          <DialogClose asChild>
            <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      
      {meetings.length > 0 && (
        <div className="mt-3 space-y-3">
          <div className="flex justify-between text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2 py-1 h-auto"
              onClick={() => setShowMeetings(!showMeetings)}
            >
              {showMeetings ? 'Hide' : 'Show'} meetings ({upcomingMeetings.length} upcoming)
            </Button>
          </div>
          
          {showMeetings && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {sortedMeetings.map(meeting => {
                const isPast = meeting.date < today;
                
                return (
                  <div 
                    key={meeting.id}
                    className={`text-xs rounded-md p-2 relative group ${
                      isPast ? 'bg-muted/30' : 'bg-primary/10'
                    }`}
                  >
                    <div className="font-medium">
                      {meeting.title}
                      <span className={`ml-2 ${isPast ? 'text-muted-foreground' : 'text-primary'}`}>
                        {format(meeting.date, 'MMM d, yyyy')}
                        {isPast ? ' (past)' : ''}
                      </span>
                    </div>
                    {meeting.attendees && (
                      <div className="text-muted-foreground mt-1">
                        Attendees: {meeting.attendees}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDeleteMeeting(meeting.id, e)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MeetingScheduler;
