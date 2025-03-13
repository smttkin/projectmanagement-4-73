
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
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
  'completed': { color: 'bg-green-500 border-green-600', icon: CheckCircle, textColor: 'text-green-800' },
  'in-progress': { color: 'bg-primary border-primary/70', icon: Clock, textColor: 'text-primary-foreground' },
  'not-started': { color: 'bg-orange-400 border-orange-500', icon: Clock, textColor: 'text-orange-800' },
  'at-risk': { color: 'bg-red-500 border-red-600', icon: AlertCircle, textColor: 'text-red-800' },
};

const TimelineDisplay: React.FC<TimelineDisplayProps> = ({
  items,
  startDate = new Date(),
  endDate = addDays(new Date(), 28),
  viewMode = 'month',
}) => {
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
  
  return (
    <div className="timeline-container relative overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Month headers */}
        <div className="flex border-b border-border h-10">
          {monthGroups.map((monthGroup, index) => {
            const width = ((monthGroup.end - monthGroup.start + 1) / dateRange.length) * 100;
            return (
              <div
                key={`month-${index}`}
                className="flex-shrink-0 px-2 py-1 font-medium flex items-center justify-center text-sm bg-muted/30"
                style={{ width: `${width}%` }}
              >
                {monthGroup.month}
              </div>
            );
          })}
        </div>
        
        {/* Days of the week */}
        <div className="flex border-b border-border">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex-1 flex">
              {week.map((day, dayIndex) => (
                <div 
                  key={`day-${weekIndex}-${dayIndex}`} 
                  className={cn(
                    "flex-1 text-center py-2 text-xs font-medium border-r border-border last:border-r-0",
                    isToday(day) ? "bg-primary/10" : (day.getDay() === 0 || day.getDay() === 6) ? "bg-muted/30" : ""
                  )}
                >
                  <div className="mb-1 text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full",
                    isToday(day) ? "bg-primary text-white" : ""
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Timeline items */}
        <div className="relative pt-8 pb-4">
          {/* Background grid */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex">
            {weeks.map((week, weekIndex) => (
              <div key={`grid-week-${weekIndex}`} className="flex-1 flex">
                {week.map((day, dayIndex) => (
                  <div 
                    key={`grid-day-${weekIndex}-${dayIndex}`} 
                    className={cn(
                      "flex-1 border-r border-border/60 last:border-r-0",
                      isToday(day) ? "bg-primary/5" : 
                      (day.getDay() === 0 || day.getDay() === 6) ? "bg-muted/20" : ""
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Timeline bars */}
          <div className="space-y-5 relative z-10">
            {items.map((item) => {
              const style = getItemStyle(item);
              const StatusIcon = statusConfig[item.status].icon;
              
              return (
                <div key={item.id} className="relative h-10">
                  <div 
                    className={cn(
                      "absolute top-0 h-full rounded-md border shadow-sm flex items-center px-3 transition-all",
                      statusConfig[item.status].color
                    )} 
                    style={style}
                  >
                    <div className="flex items-center justify-between w-full overflow-hidden whitespace-nowrap">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <StatusIcon size={14} className="shrink-0" />
                        <span className="font-medium text-xs overflow-hidden text-ellipsis">
                          {item.title}
                        </span>
                      </div>
                      
                      {item.assignee && (
                        <div className="h-6 w-6 rounded-full bg-white/80 overflow-hidden flex-shrink-0 ml-2 border border-white/90">
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
                    </div>
                  </div>
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
