
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Calendar, ArrowRight } from 'lucide-react';
import { format, addDays, startOfMonth, getMonth, getYear, isSameDay, isBefore, isAfter } from 'date-fns';

export interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'in-progress' | 'not-started' | 'at-risk';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TimelineDisplayProps {
  items: TimelineItem[];
  startDate?: Date;
  endDate?: Date;
  viewMode?: 'week' | 'month' | 'quarter';
}

const statusConfig = {
  'completed': { 
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-600', 
    icon: CheckCircle, 
    textColor: 'text-white'
  },
  'in-progress': { 
    color: 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-600', 
    icon: Clock, 
    textColor: 'text-white'
  },
  'not-started': { 
    color: 'bg-gradient-to-r from-orange-400 to-amber-500 border-orange-500', 
    icon: Clock, 
    textColor: 'text-white'
  },
  'at-risk': { 
    color: 'bg-gradient-to-r from-red-500 to-rose-500 border-red-600', 
    icon: AlertCircle, 
    textColor: 'text-white'
  },
};

const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  items,
  startDate = new Date(),
  endDate = addDays(new Date(), 28),
  viewMode = 'month',
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Generate array of dates between startDate and endDate
  const generateDateRange = () => {
    const dates = [];
    let currentDate = startDate;
    
    while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  };
  
  const dateRange = generateDateRange();
  
  // Group dates by week
  const groupDatesByWeek = () => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    dateRange.forEach((date, index) => {
      currentWeek.push(date);
      
      // Start a new week on Sunday or at the end of the range
      if (date.getDay() === 0 || index === dateRange.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  };
  
  const weeks = groupDatesByWeek();
  
  // Calculate position and width for timeline items
  const getItemStyle = (item: TimelineItem) => {
    const firstDate = dateRange[0];
    const lastDate = dateRange[dateRange.length - 1];
    const totalDays = dateRange.length;
    
    // Ensure dates are within range
    const effectiveStartDate = isBefore(item.startDate, firstDate) ? firstDate : item.startDate;
    const effectiveEndDate = isAfter(item.endDate, lastDate) ? lastDate : item.endDate;
    
    // Calculate position percentages
    const startOffset = Math.max(0, Math.floor(
      ((effectiveStartDate.getTime() - firstDate.getTime()) / (86400000)) / totalDays * 100
    ));
    
    const endOffset = Math.min(100, Math.ceil(
      ((effectiveEndDate.getTime() - firstDate.getTime()) / (86400000) + 1) / totalDays * 100
    ));
    
    const width = endOffset - startOffset;
    
    return {
      left: `${startOffset}%`,
      width: `${width}%`,
    };
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Group dates that are in the same month
  const getMonthGroups = () => {
    const months: {start: number, end: number, month: string}[] = [];
    let currentMonth = getMonth(dateRange[0]);
    let currentYear = getYear(dateRange[0]);
    let startIndex = 0;
    
    dateRange.forEach((date, index) => {
      const month = getMonth(date);
      const year = getYear(date);
      
      if (month !== currentMonth || year !== currentYear) {
        months.push({
          start: startIndex,
          end: index - 1,
          month: format(dateRange[startIndex], 'MMMM yyyy')
        });
        
        currentMonth = month;
        currentYear = year;
        startIndex = index;
      }
      
      // Handle last month
      if (index === dateRange.length - 1) {
        months.push({
          start: startIndex,
          end: index,
          month: format(date, 'MMMM yyyy')
        });
      }
    });
    
    return months;
  };
  
  const monthGroups = getMonthGroups();

  const toggleItemExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };
  
  return (
    <div className="timeline-container relative overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Month headers */}
        <div className="flex border-b border-border h-10 bg-gradient-to-r from-background to-muted/20">
          {monthGroups.map((monthGroup, index) => {
            const width = ((monthGroup.end - monthGroup.start + 1) / dateRange.length) * 100;
            return (
              <div
                key={`month-${index}`}
                className="flex-shrink-0 px-2 py-1 font-medium flex items-center justify-center text-sm border-r border-border/30 last:border-r-0"
                style={{ width: `${width}%` }}
              >
                <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                {monthGroup.month}
              </div>
            );
          })}
        </div>
        
        {/* Days of the week */}
        <div className="flex border-b border-border sticky top-0 z-10">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex-1 flex">
              {week.map((day, dayIndex) => (
                <div 
                  key={`day-${weekIndex}-${dayIndex}`} 
                  className={cn(
                    "flex-1 text-center py-2 text-xs font-medium border-r border-border/30 last:border-r-0",
                    isToday(day) ? "bg-primary/10" : (day.getDay() === 0 || day.getDay() === 6) ? "bg-muted/30" : ""
                  )}
                >
                  <div className="mb-1 text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full transition-all",
                    isToday(day) ? "bg-primary text-white shadow-md" : "hover:bg-muted/60"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Timeline items */}
        <div className="relative pt-4 pb-4">
          {/* Background grid */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex">
            {weeks.map((week, weekIndex) => (
              <div key={`grid-week-${weekIndex}`} className="flex-1 flex">
                {week.map((day, dayIndex) => (
                  <div 
                    key={`grid-day-${weekIndex}-${dayIndex}`} 
                    className={cn(
                      "flex-1 border-r border-border/30 last:border-r-0",
                      isToday(day) ? "bg-primary/5" : 
                      (day.getDay() === 0 || day.getDay() === 6) ? "bg-muted/20" : ""
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Timeline bars */}
          <div className="space-y-3 relative z-10">
            {items.map((item) => {
              const style = getItemStyle(item);
              const StatusIcon = statusConfig[item.status].icon;
              const isExpanded = expandedItem === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <div key={item.id} className="relative">
                  <div 
                    className={cn(
                      "absolute top-0 h-10 rounded-md border shadow-md flex items-center px-3 transition-all duration-300 cursor-pointer",
                      statusConfig[item.status].color,
                      (isExpanded || isHovered) ? "h-12 -top-1 shadow-lg z-20" : ""
                    )} 
                    style={style}
                    onClick={() => toggleItemExpand(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-center justify-between w-full overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <StatusIcon size={16} className="shrink-0 animate-pulse" />
                        <span className="font-medium text-xs overflow-hidden text-ellipsis text-white">
                          {item.title}
                        </span>
                      </div>
                      
                      {item.assignee && (
                        <div className="h-6 w-6 rounded-full bg-white/80 overflow-hidden flex-shrink-0 ml-2 border border-white/90 hover:scale-110 transition-transform">
                          {item.assignee.avatar ? (
                            <img 
                              src={item.assignee.avatar} 
                              alt={item.assignee.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary text-white text-xs font-bold">
                              {item.assignee.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={cn("ml-1", isExpanded ? "rotate-180" : "")}>
                        <ChevronDown size={14} className="text-white/90" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded view */}
                  {isExpanded && (
                    <div 
                      className="absolute top-12 left-0 right-0 bg-card p-3 rounded-md border border-border shadow-lg z-20 animate-fade-in"
                      style={style}
                    >
                      <div className="text-sm font-medium mb-1">{item.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(item.startDate, 'MMM d')} 
                        <ArrowRight className="h-3 w-3 mx-1" /> 
                        {format(item.endDate, 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full flex items-center",
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'not-started' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          <StatusIcon size={10} className="mr-1" />
                          {item.status.replace('-', ' ')}
                        </span>
                        {item.assignee && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            Assigned to: 
                            <span className="ml-1 font-medium">
                              {item.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineDisplay;
