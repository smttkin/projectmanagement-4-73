
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { projectsData } from '../../data/projects';
import { ProjectCardProps } from '../ProjectCard';

interface DashboardHeaderProps {
  user: UserData | null;
  onProjectAdded?: (project: ProjectCardProps) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onProjectAdded }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState<"low" | "medium" | "high">("medium");

  const handleNewProject = () => {
    setIsDialogOpen(true);
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      return;
    }

    // Generate a unique ID
    const newProjectId = Date.now().toString();
    
    // Create new project
    const newProject: ProjectCardProps = {
      id: newProjectId,
      title: projectName,
      description: projectDescription || "No description provided",
      progress: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      priority: projectPriority,
      status: 'not-started',
      members: [
        { id: user?.id || '1', name: user?.name || 'Admin User', avatar: user?.avatar || 'https://i.pravatar.cc/150?img=68' },
      ],
    };
    
    // Add to projects data in the local state of this component
    projectsData.unshift(newProject);
    
    // Notify parent component
    if (onProjectAdded) {
      onProjectAdded(newProject);
    }

    // Close the dialog and reset form
    setIsDialogOpen(false);
    setProjectName("");
    setProjectDescription("");
    setProjectPriority("medium");
    
    // Navigate to the new project
    navigate(`/project/${newProjectId}`);
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
                placeholder="Enter project name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe your project"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select 
                value={projectPriority} 
                onValueChange={(value) => setProjectPriority(value as "low" | "medium" | "high")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardHeader;
