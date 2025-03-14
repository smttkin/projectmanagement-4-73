
import React from 'react';
import { Calendar, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface Deadline {
  id: string;
  title: string;
  project: string;
  dueDate: Date;
  progress?: number; // Add progress property
}

interface DeadlinesSectionProps {
  deadlines: Deadline[];
}

const DeadlinesSection: React.FC<DeadlinesSectionProps> = ({ deadlines }) => {
  const navigate = useNavigate();

  const handleCalendarView = () => {
    navigate('/calendar');
  };

  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
        <button 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center"
          onClick={handleCalendarView}
        >
          Calendar View
          <Calendar size={16} className="ml-1" />
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {deadlines.length > 0 ? (
            deadlines.map(deadline => (
              <div 
                key={deadline.id} 
                className="p-3 border border-border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => handleProjectClick(deadline.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{deadline.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Project: {deadline.project}
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md">
                    {format(deadline.dueDate, 'MMM d')}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {format(deadline.dueDate, "EEEE, MMMM d, yyyy")}
                </div>
                {/* Add progress bar if progress is available */}
                {deadline.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={deadline.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      {deadline.progress}% complete
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No upcoming deadlines
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlinesSection;
