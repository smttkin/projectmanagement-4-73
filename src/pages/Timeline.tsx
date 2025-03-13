
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
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

const Timeline = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(sampleTimelineItems);
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('month');
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Handle changing the date range
  const handlePrevPeriod = () => {
    const { startDate, endDate } = dateRange;
    const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    setDateRange({
      startDate: subDays(startDate, days),
      endDate: subDays(endDate, days)
    });
  };
  
  const handleNextPeriod = () => {
    const { startDate, endDate } = dateRange;
    const days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    setDateRange({
      startDate: addDays(startDate, days),
      endDate: addDays(endDate, days)
    });
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
                        setDateRange({
                          startDate: startOfMonth(date),
                          endDate: endOfMonth(date)
                        });
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
                      onClick={() => setViewMode(mode)}
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
        </div>
      </main>
    </div>
  );
};

export default Timeline;
