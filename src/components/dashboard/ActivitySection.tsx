
import React from 'react';
import { CheckCircle, Users, Clock, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const ActivitySection: React.FC = () => {
  const handleViewAllActivity = () => {
    toast.info("Viewing all activity");
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-medium">Marketing Campaign</span> was marked as completed
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-medium">Robert Johnson</span> was added to <span className="font-medium">System Integration</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-medium">Website Redesign</span> deadline was extended
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Yesterday at 4:30 PM</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-medium">Customer Feedback Survey</span> was created
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Yesterday at 2:15 PM</p>
            </div>
          </div>
        </div>
        
        <button 
          className="w-full mt-4 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
          onClick={handleViewAllActivity}
        >
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivitySection;
