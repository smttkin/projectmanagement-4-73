
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  user: UserData | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleNavigateToWorkspaces = () => {
    navigate('/workspaces');
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
        <Button onClick={handleNavigateToWorkspaces} className="shadow-subtle interactive">
          <Plus size={18} className="mr-1.5" />
          New Workspace
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
