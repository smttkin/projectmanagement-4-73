
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Filter, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample event data
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  type: 'meeting' | 'deadline' | 'milestone' | 'task';
  assignees: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  status?: 'completed' | 'in-progress' | 'not-started';
  priority?: 'high' | 'medium' | 'low';
};

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Kickoff Meeting',
    date: parseISO('2023-11-15T09:00:00'),
    type: 'meeting',
    assignees: [
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
    ]
  },
  {
    id: '2',
    title: 'Design Review',
    date: parseISO('2023-11-18T14:00:00'),
    type: 'meeting',
    assignees: [
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=4' },
    ]
  },
  {
    id: '3',
    title: 'UI Mockups Deadline',
    date: parseISO('2023-11-22T17:00:00'),
    type: 'deadline',
    assignees: [
      { id: 'user4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=4' },
    ],
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Project Alpha Milestone',
    date: parseISO('2023-11-25T00:00:00'),
    type: 'milestone',
    assignees: [
      { id: 'user1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user5', name: 'Edward Norton', avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
    status: 'not-started'
  },
  {
    id: '5',
    title: 'Backend Integration',
    date: parseISO('2023-11-28T09:00:00'),
    endDate: parseISO('2023-11-30T17:00:00'),
    type: 'task',
    assignees: [
      { id: 'user2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user5', name: 'Edward Norton', avatar: 'https://i.pravatar.cc/150?img=5' },
    ],
    status: 'not-started',
    priority: 'medium'
  },
  {
    id: '6',
    title: 'Initial Documentation',
    date: parseISO('2023-11-10T09:00:00'),
    endDate: parseISO('2023-11-12T17:00:00'),
    type: 'task',
    assignees: [
      { id: 'user3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    status: 'completed',
    priority: 'low'
  },
];

// Type color schemes
const typeColors = {
  meeting: 'bg-purple-100 text-purple-800 border-purple-300',
  deadline: 'bg-red-100 text-red-800 border-red-300',
  milestone: 'bg-blue-100 text-blue-800 border-blue-300',
  task: 'bg-green-100 text-green-800 border-green-300',
};

// Status color schemes
const statusColors = {
  completed: 'bg-green-500',
  'in-progress': 'bg-primary',
  'not-started': 'bg-orange-400',
};

// Event component for the day view
const EventItem = ({ event }: { event: CalendarEvent }) => (
  <div className={cn(
    "px-2 py-1 rounded-md text-xs font-medium border mb-1 truncate hover:shadow-sm transition-shadow",
    typeColors[event.type]
  )}>
    <div className="flex items-center space-x-1">
      {event.priority === 'high' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>}
      <span className="truncate">{event.title}</span>
    </div>
  </div>
);

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  
  // Generate days for calendar view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return sampleEvents.filter(event => 
      isSameDay(event.date, day) &&
      (filterType ? event.type === filterType : true) &&
      (filterAssignee ? event.assignees.some(assignee => assignee.id === filterAssignee) : true)
    );
  };
  
  // Get all events for the selected month, filtered
  const filteredEvents = sampleEvents.filter(event => 
    isSameMonth(event.date, currentMonth) &&
    (filterType ? event.type === filterType : true) &&
    (filterAssignee ? event.assignees.some(assignee => assignee.id === filterAssignee) : true)
  );
  
  // Get events for the selected date
  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];
  
  // Get unique assignees from all events
  const allAssignees = Array.from(
    new Set(
      sampleEvents.flatMap(event => 
        event.assignees.map(assignee => JSON.stringify(assignee))
      )
    )
  ).map(str => JSON.parse(str));
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Project Calendar</h1>
              <p className="text-muted-foreground mt-1">
                View and manage project events and deadlines
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="font-normal">
                    {format(currentMonth, 'MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="month"
                    defaultMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              
              <Button className="ml-2" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Event
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-background/60 backdrop-blur-sm border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <Select value={filterType ?? "all"} onValueChange={(value) => setFilterType(value === "all" ? null : value)}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="deadline">Deadlines</SelectItem>
                  <SelectItem value="milestone">Milestones</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterAssignee ?? "all"} onValueChange={(value) => setFilterAssignee(value === "all" ? null : value)}>
                <SelectTrigger className="h-8 w-[170px]">
                  <SelectValue placeholder="Team Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {allAssignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id}>
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarImage src={assignee.avatar} alt={assignee.name} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {assignee.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {/* Day headers (only on md and up) */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="hidden md:flex justify-center items-center h-10 font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {monthDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-32 p-2 border rounded-lg transition-colors",
                    isToday(day) ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent/5",
                    isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                    !isSameMonth(day, currentMonth) ? "opacity-50" : ""
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  {/* Day header with date */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isToday(day) ? "text-primary" : ""
                    )}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Show day of week on mobile */}
                    <span className="md:hidden text-xs text-muted-foreground">
                      {format(day, 'EEE')}
                    </span>
                    
                    {/* Event counter */}
                    {dayEvents.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Day events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Selected date details */}
          {selectedDate && (
            <div className="bg-card border rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-accent/5 transition-colors">
                      <div className={cn(
                        "w-1 self-stretch rounded-full",
                        event.status ? statusColors[event.status] : "bg-gray-300"
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("px-2 py-0.5", typeColors[event.type])}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          
                          {event.priority && (
                            <Badge variant="outline" className={cn(
                              "px-2 py-0.5 text-xs",
                              event.priority === 'high' ? "border-red-300 text-red-600" :
                              event.priority === 'medium' ? "border-yellow-300 text-yellow-600" :
                              "border-green-300 text-green-600"
                            )}>
                              {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-base font-medium mt-1">{event.title}</h3>
                        
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <span>{format(event.date, 'h:mm a')}</span>
                          {event.endDate && (
                            <span> - {format(event.endDate, 'h:mm a')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {event.assignees.slice(0, 3).map((assignee) => (
                            <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={assignee.avatar} alt={assignee.name} />
                              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          
                          {event.assignees.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                              +{event.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex justify-center mb-2">
                    <Calendar className="h-10 w-10 opacity-20" />
                  </div>
                  <p>No events scheduled for this day</p>
                  <Button variant="link" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Create an event
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
