
import React from 'react';
import { Calendar, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Deadline {
  id: string;
  title: string;
  project: string;
  dueDate: Date;
}

interface DeadlinesSectionProps {
  deadlines: Deadline[];
}

const DeadlinesSection: React.FC<DeadlinesSectionProps> = ({ deadlines }) => {
  const navigate = useNavigate();

  const handleCalendarView = () => {
    navigate('/calendar');
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
          {deadlines.map(deadline => (
            <div 
              key={deadline.id} 
              className="p-3 border border-border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/project/${deadline.id}`)}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeadlinesSection;
