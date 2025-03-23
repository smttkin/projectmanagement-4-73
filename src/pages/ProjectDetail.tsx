
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Save, 
  Trash2, 
  Users,
  Plus,
  X,
  Kanban
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectCardProps } from '@/components/ProjectCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import KanbanBoard from '@/components/kanban/KanbanBoard';

// Importing mock data to find the project
import { projectsData } from '@/data/projects';

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface ProjectDetailProps {
  edit?: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ edit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(edit);
  const [project, setProject] = useState<ProjectCardProps | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newTask, setNewTask] = useState('');
  const [timeTracking, setTimeTracking] = useState({
    hours: 0,
    minutes: 0,
    description: ''
  });
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Team Member'
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const foundProject = projectsData.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
      setFormData({
        title: foundProject.title,
        description: foundProject.description,
        status: foundProject.status,
        priority: foundProject.priority,
        dueDate: foundProject.dueDate,
      });
      setTeamMembers(foundProject.members);
    } else {
      toast.error("Project not found");
      navigate('/dashboard');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    toast.success("Project updated successfully", {
      description: "All changes have been saved.",
    });
    setIsEditing(false);
    
    // Update the local state to reflect changes
    if (project) {
      setProject({
        ...project,
        title: formData.title,
        description: formData.description,
        status: formData.status as any,
        priority: formData.priority as any,
        dueDate: formData.dueDate,
        members: teamMembers
      });
    }
  };

  const handleDelete = () => {
    toast.success("Project deleted", {
      description: "The project has been removed.",
    });
    navigate('/dashboard');
  };

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
    
    setTeamMembers(prev => [...prev, memberToAdd]);
    setNewMember({ name: '', role: 'Team Member' });
    toast.success("Team member added");
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    toast.success("Team member removed");
  };

  const handleScheduleMeeting = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    toast.success("Meeting scheduled", {
      description: `Meeting scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
    });
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    toast.success("Task added", {
      description: `New task "${newTask}" has been added to the project.`,
    });
    setNewTask('');
  };

  const handleTrackTime = () => {
    if (timeTracking.hours === 0 && timeTracking.minutes === 0) {
      toast.error("Please enter time");
      return;
    }
    
    let timeDescription = '';
    if (timeTracking.hours > 0) {
      timeDescription += `${timeTracking.hours} hour${timeTracking.hours > 1 ? 's' : ''}`;
    }
    if (timeTracking.minutes > 0) {
      if (timeDescription) timeDescription += ' and ';
      timeDescription += `${timeTracking.minutes} minute${timeTracking.minutes > 1 ? 's' : ''}`;
    }
    
    toast.success("Time tracked", {
      description: `${timeDescription} tracked for this project.`,
    });
    
    setTimeTracking({
      hours: 0,
      minutes: 0,
      description: ''
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            {isEditing ? (
              <div className="flex-1 mr-4">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-2xl font-bold mb-2"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold">{project.title}</h1>
            )}
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} variant="success">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kanban">
              <Kanban className="h-4 w-4 mr-2" />
              Kanban Board
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
                  <div className="p-5 border-b border-border">
                    <h2 className="text-xl font-semibold">Project Details</h2>
                  </div>
                  
                  <div className="p-5">
                    {isEditing ? (
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="min-h-[120px] mb-4"
                      />
                    ) : (
                      <p className="text-muted-foreground mb-6">{project.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                        {isEditing ? (
                          <Select 
                            value={formData.status} 
                            onValueChange={(value) => handleSelectChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="at-risk">At Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full ${
                              project.status === 'completed' ? 'bg-green-500' :
                              project.status === 'in-progress' ? 'bg-blue-500' :
                              project.status === 'not-started' ? 'bg-orange-500' :
                              'bg-red-500'
                            } mr-2`}></div>
                            <span className="capitalize">{project.status.replace('-', ' ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
                        {isEditing ? (
                          <Select 
                            value={formData.priority} 
                            onValueChange={(value) => handleSelectChange('priority', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="capitalize">{project.priority}</span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            placeholder="e.g. Sep 30"
                          />
                        ) : (
                          <span>{project.dueDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden mb-6">
                  <div className="p-5 border-b border-border">
                    <h2 className="text-xl font-semibold">Progress</h2>
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-2 flex justify-between items-center">
                      <span className="text-sm font-medium">{project.progress}% Complete</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
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
                      {teamMembers.map(member => (
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
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
                  <div className="p-5 border-b border-border">
                    <h2 className="text-xl font-semibold">Quick Actions</h2>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full justify-start" variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Schedule a Meeting</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="mx-auto"
                            />
                          </div>
                          <DialogClose asChild>
                            <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => setActiveTab("kanban")}
                      >
                        <Kanban className="mr-2 h-4 w-4" />
                        Manage Tasks
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full justify-start" variant="outline">
                            <Clock className="mr-2 h-4 w-4" />
                            Track Time
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Track Time</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="hours">Hours</Label>
                                <Input 
                                  id="hours"
                                  type="number" 
                                  min="0"
                                  value={timeTracking.hours} 
                                  onChange={(e) => setTimeTracking({...timeTracking, hours: parseInt(e.target.value) || 0})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="minutes">Minutes</Label>
                                <Input 
                                  id="minutes"
                                  type="number" 
                                  min="0"
                                  max="59"
                                  value={timeTracking.minutes} 
                                  onChange={(e) => setTimeTracking({...timeTracking, minutes: parseInt(e.target.value) || 0})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="timeDescription">Description (optional)</Label>
                              <Input 
                                id="timeDescription"
                                value={timeTracking.description} 
                                onChange={(e) => setTimeTracking({...timeTracking, description: e.target.value})}
                                placeholder="What were you working on?"
                              />
                            </div>
                          </div>
                          <DialogClose asChild>
                            <Button onClick={handleTrackTime}>Log Time</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="kanban">
            <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden p-5">
              <KanbanBoard projectId={id || ''} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectDetail;
