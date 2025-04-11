
import React from 'react';
import { Calendar, ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const TimelineSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleViewTimeline = () => {
    navigate('/timeline');
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <button 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center"
          onClick={handleViewTimeline}
        >
          View All
          <ChevronsRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-center py-6 text-center">
          <div className="flex flex-col items-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Timeline Overview</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
              View your project timeline and upcoming deadlines
            </p>
            <button
              className="mt-4 text-sm text-primary font-medium"
              onClick={handleViewTimeline}
            >
              Go to Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
