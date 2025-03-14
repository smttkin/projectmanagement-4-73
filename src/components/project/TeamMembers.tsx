
import React, { useState } from 'react';
import { Plus, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface TeamMembersProps {
  members: Member[];
  onMembersChanged: (members: Member[]) => void;
  isEditing: boolean;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ 
  members, 
  onMembersChanged,
  isEditing 
}) => {
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Team Member'
  });

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      toast.error("Please enter a member name");
      return;
    }
    
    const newId = `member-${Date.now()}`;
    const memberToAdd: Member = {
      id: newId,
      name: newMember.name,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    onMembersChanged([...members, memberToAdd]);
    setNewMember({ name: '', role: 'Team Member' });
    toast.success("Team member added");
  };

  const handleRemoveMember = (memberId: string) => {
    onMembersChanged(members.filter(member => member.id !== memberId));
    toast.success("Team member removed");
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team Members</h2>
        {isEditing && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div>
                  <Label htmlFor="memberName">Member Name</Label>
                  <Input 
                    id="memberName"
                    value={newMember.name} 
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter member name"
                  />
                </div>
                <div>
                  <Label htmlFor="memberRole">Role</Label>
                  <Select 
                    value={newMember.role} 
                    onValueChange={(value) => setNewMember({...newMember, role: value})}
                  >
                    <SelectTrigger id="memberRole">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Team Member">Team Member</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogClose asChild>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="p-5">
        <ul className="space-y-3">
          {members.length > 0 ? (
            members.map(member => (
              <li key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-muted mr-3 overflow-hidden flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span>{member.name}</span>
                </div>
                {isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </li>
            ))
          ) : (
            <li className="text-center py-2 text-muted-foreground">
              No team members yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TeamMembers;
