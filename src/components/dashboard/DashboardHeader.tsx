
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserData } from '@/types/user';

interface DashboardHeaderProps {
  user: UserData | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const handleNewProject = () => {
    toast.success("Creating new project", {
      description: "This feature is coming soon!",
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleNewProject} className="shadow-subtle interactive">
          <Plus size={18} className="mr-1.5" />
          New Project
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
