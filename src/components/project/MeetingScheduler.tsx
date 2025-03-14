
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface MeetingSchedulerProps {
  projectId: string;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const handleScheduleMeeting = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    toast.success("Meeting scheduled", {
      description: `Meeting scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
    });
  };
  
  return (
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
  );
};

export default MeetingScheduler;
