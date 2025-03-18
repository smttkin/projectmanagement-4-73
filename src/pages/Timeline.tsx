
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, ClipboardList, XCircle } from 'lucide-react';
import { format, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, startOfQuarter, endOfQuarter } from 'date-fns';
import Navbar from '@/components/Navbar';
import TimelineDisplay, { TimelineItem } from '@/components/TimelineDisplay';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Sample data for timeline items
const sampleTimelineItems: TimelineItem[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    startDate: new Date(2023, 10, 15),
    endDate: new Date(2023, 10, 25),
    status: 'in-progress',
    assignee: {
      id: 'user1',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '2',
    title: 'Frontend Development',
    startDate: new Date(2023, 10, 20),
    endDate: new Date(2023, 11, 5),
    status: 'not-started',
    assignee: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  },
  {
    id: '3',
    title: 'API Integration',
    startDate: new Date(2023, 10, 18),
    endDate: new Date(2023, 11, 2),
    status: 'at-risk',
    assignee: {
      id: 'user3',
      name: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  },
  {
    id: '4',
    title: 'Quality Assurance',
    startDate: new Date(2023, 11, 1),
    endDate: new Date(2023, 11, 10),
    status: 'not-started',
    assignee: {
      id: 'user4',
      name: 'Diana Prince',
      avatar: 'https://i.pravatar.cc/150?img=4'
    }
  },
  {
    id: '5',
    title: 'User Testing',
    startDate: new Date(2023, 11, 5),
    endDate: new Date(2023, 11, 15),
    status: 'not-started'
  },
  {
    id: '6',
    title: 'Documentation',
    startDate: new Date(2023, 10, 10),
    endDate: new Date(2023, 10, 20),
    status: 'completed',
    assignee: {
      id: 'user5',
      name: 'Edward Norton',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  }
];

// Team members for assignment
const teamMembers = [
  { id: 'user1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'user2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 'user3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'user4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 'user5', name: 'Edward Norton', avatar: 'https://i.pravatar.cc/150?img=5' },
];

const Timeline = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(
    // Try to load from localStorage first, otherwise use sample data
    (() => {
      try {
        const saved = localStorage.getItem('timeline-items');
        if (saved) {
          return JSON.parse(saved, (key, value) => {
            if (key === 'startDate' || key === 'endDate') {
              return new Date(value);
            }
            return value;
          });
        }
        return sampleTimelineItems;
      } catch (e) {
        console.error("Error loading timeline items:", e);
        return sampleTimelineItems;
      }
    })()
  );
  
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('month');
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'not-started',
    assigneeId: ''
  });
  
  // Save to localStorage whenever timelineItems changes
  React.useEffect(() => {
    localStorage.setItem('timeline-items', JSON.stringify(timelineItems));
  }, [timelineItems]);
  
  // Handle changing the date range based on view mode
  const handlePrevPeriod = () => {
    if (viewMode === 'week') {
      setDateRange({
        startDate: subDays(dateRange.startDate, 7),
        endDate: subDays(dateRange.endDate, 7)
      });
    } else if (viewMode === 'month') {
      const prevMonth = subMonths(dateRange.startDate, 1);
      setDateRange({
        startDate: startOfMonth(prevMonth),
        endDate: endOfMonth(prevMonth)
      });
    } else if (viewMode === 'quarter') {
      const prevQuarter = subMonths(dateRange.startDate, 3);
      setDateRange({
        startDate: startOfQuarter(prevQuarter),
        endDate: endOfQuarter(prevQuarter)
      });
    }
  };
  
  const handleNextPeriod = () => {
    if (viewMode === 'week') {
      setDateRange({
        startDate: addDays(dateRange.startDate, 7),
        endDate: addDays(dateRange.endDate, 7)
      });
    } else if (viewMode === 'month') {
      const nextMonth = addMonths(dateRange.startDate, 1);
      setDateRange({
        startDate: startOfMonth(nextMonth),
        endDate: endOfMonth(nextMonth)
      });
    } else if (viewMode === 'quarter') {
      const nextQuarter = addMonths(dateRange.startDate, 3);
      setDateRange({
        startDate: startOfQuarter(nextQuarter),
        endDate: endOfQuarter(nextQuarter)
      });
    }
  };
  
  // Change view mode
  const handleViewModeChange = (mode: 'week' | 'month' | 'quarter') => {
    setViewMode(mode);
    
    const currentDate = selectedDate || new Date();
    
    if (mode === 'week') {
      setDateRange({
        startDate: startOfWeek(currentDate),
        endDate: endOfWeek(currentDate)
      });
    } else if (mode === 'month') {
      setDateRange({
        startDate: startOfMonth(currentDate),
        endDate: endOfMonth(currentDate)
      });
    } else if (mode === 'quarter') {
      setDateRange({
        startDate: startOfQuarter(currentDate),
        endDate: endOfQuarter(currentDate)
      });
    }
  };
  
  // Handle creating a new event
  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error("Please enter an event title");
      return;
    }
    
    // Create new event with a unique ID
    const newEventItem: TimelineItem = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      status: newEvent.status as 'not-started' | 'in-progress' | 'completed' | 'at-risk',
      assignee: newEvent.assigneeId ? 
        teamMembers.find(member => member.id === newEvent.assigneeId) : 
        undefined
    };
    
    // Add the new event to the timeline
    setTimelineItems([...timelineItems, newEventItem]);
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'not-started',
      assigneeId: ''
    });
    
    setIsAddEventOpen(false);
    toast.success("Event added to timeline");
  };
  
  // Delete an event
  const handleDeleteEvent = (id: string) => {
    setTimelineItems(timelineItems.filter(item => item.id !== id));
    toast.success("Event removed from timeline");
  };
  
  // Filter timeline items based on selected status
  const filteredItems = filterStatus
    ? timelineItems.filter(item => item.status === filterStatus)
    : timelineItems;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Project Timeline</h1>
              <p className="text-muted-foreground mt-1">
                Visualize your project schedule and track progress
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="px-3">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.startDate, 'MMM dd')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        
                        if (viewMode === 'week') {
                          setDateRange({
                            startDate: startOfWeek(date),
                            endDate: endOfWeek(date)
                          });
                        } else if (viewMode === 'month') {
                          setDateRange({
                            startDate: startOfMonth(date),
                            endDate: endOfMonth(date)
                          });
                        } else if (viewMode === 'quarter') {
                          setDateRange({
                            startDate: startOfQuarter(date),
                            endDate: endOfQuarter(date)
                          });
                        }
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" onClick={handleNextPeriod}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              
              <Button size="sm" onClick={() => setIsAddEventOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </div>
          </div>
          
          {/* Filters and View controls */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-background/60 backdrop-blur-sm border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <Select value={filterStatus ?? "all"} onValueChange={(value) => setFilterStatus(value === "all" ? null : value)}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm font-medium">View:</span>
                <div className="flex items-center space-x-1">
                  {(["week", "month", "quarter"] as const).map((mode) => (
                    <Button 
                      key={mode}
                      variant={viewMode === mode ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => handleViewModeChange(mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Legend */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium">Status:</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Completed</Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">In Progress</Badge>
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">Not Started</Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">At Risk</Badge>
            </div>
          </div>
          
          {/* Timeline Display */}
          <div className="bg-card border rounded-lg p-1 overflow-hidden shadow-sm">
            <TimelineDisplay 
              items={filteredItems}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              viewMode={viewMode}
            />
          </div>
          
          {/* Selected date events */}
          {selectedDate && (
            <div className="bg-card border rounded-lg p-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Events on {format(selectedDate, 'MMM d, yyyy')}</h3>
              </div>
              
              <div className="space-y-3">
                {filteredItems.filter(item => 
                  selectedDate >= item.startDate && selectedDate <= item.endDate
                ).length > 0 ? (
                  filteredItems.filter(item => 
                    selectedDate >= item.startDate && selectedDate <= item.endDate
                  ).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn(
                            item.status === 'completed' ? "bg-green-100 text-green-800 border-green-300" :
                            item.status === 'in-progress' ? "bg-blue-100 text-blue-800 border-blue-300" :
                            item.status === 'at-risk' ? "bg-red-100 text-red-800 border-red-300" :
                            "bg-orange-100 text-orange-800 border-orange-300"
                          )}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {format(item.startDate, 'MMM d')} - {format(item.endDate, 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteEvent(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your project timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newEvent.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.startDate}
                      onSelect={(date) => date && setNewEvent({...newEvent, startDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newEvent.endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.endDate}
                      onSelect={(date) => date && setNewEvent({...newEvent, endDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select 
                id="status"
                value={newEvent.status}
                onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <select 
                id="assignee"
                value={newEvent.assigneeId}
                onChange={(e) => setNewEvent({...newEvent, assigneeId: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddEvent}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timeline;
