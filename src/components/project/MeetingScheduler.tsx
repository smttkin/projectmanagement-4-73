
import React, { useState, useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';
import { format, isFuture } from 'date-fns';
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  participants: string[];
}

interface MeetingSchedulerProps {
  projectId: string;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participants, setParticipants] = useState('');
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
    
    if (!isFuture(selectedDate)) {
      toast.error("Please select a future date");
      return;
    }
    
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingTitle,
      date: selectedDate,
      participants: participants.split(',').map(p => p.trim()).filter(p => p)
    };
    
    setMeetings([...meetings, newMeeting]);
    
    toast.success("Meeting scheduled", {
      description: `Meeting "${meetingTitle}" scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
    });
    
    // Reset form
    setSelectedDate(undefined);
    setMeetingTitle('');
    setParticipants('');
  };
  
  const handleDeleteMeeting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    toast.success("Meeting deleted");
  };
  
  // Filter meetings to show only upcoming ones
  const upcomingMeetings = meetings.filter(meeting => isFuture(meeting.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
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
              Schedule a new meeting for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="meetingTitle">Meeting Title</Label>
              <Input 
                id="meetingTitle"
                value={meetingTitle} 
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Weekly Status Update"
              />
            </div>
            <div>
              <Label htmlFor="participants">Participants (comma separated)</Label>
              <Input 
                id="participants"
                value={participants} 
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="John, Sarah, Mike"
              />
            </div>
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
      
      {upcomingMeetings.length > 0 && (
        <div className="mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2 py-1 h-auto"
            onClick={() => setShowMeetings(!showMeetings)}
          >
            {showMeetings ? 'Hide' : 'Show'} upcoming meetings ({upcomingMeetings.length})
          </Button>
          
          {showMeetings && (
            <div className="mt-2 space-y-2">
              {upcomingMeetings.map(meeting => (
                <div 
                  key={meeting.id}
                  className="text-xs bg-muted/30 rounded-md p-2 relative"
                >
                  <div className="font-medium">{meeting.title}</div>
                  <div className="text-muted-foreground">
                    {format(meeting.date, 'MMM d, yyyy')}
                  </div>
                  {meeting.participants.length > 0 && (
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {meeting.participants.join(', ')}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 absolute top-1 right-1"
                    onClick={(e) => handleDeleteMeeting(meeting.id, e)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                    >
                      <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MeetingScheduler;
