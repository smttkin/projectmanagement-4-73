
import React from 'react';
import { ChevronsRight, Users } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectCardProps } from '../ProjectCard';

interface TeamSectionProps {
  projects: ProjectCardProps[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ projects }) => {
  const handleViewAllTeam = () => {
    toast.info("Viewing all team members");
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team</h2>
        <button 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center"
          onClick={handleViewAllTeam}
        >
          View All
          <ChevronsRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {projects.flatMap(p => p.members)
            .filter((member, index, self) => 
              index === self.findIndex(m => m.id === member.id)
            )
            .slice(0, 5)
            .map(member => (
              <div key={member.id} className="flex items-center">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {member.id === '1' ? 'Project Manager' : 'Team Member'}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
